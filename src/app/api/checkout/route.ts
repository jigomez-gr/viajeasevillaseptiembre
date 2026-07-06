import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-ignore
        apiVersion: "2023-10-16",
    })
    : null;

const MAX_PLAZAS = 14;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { reservaId, amount, nombre, email, telefono, numeroPlazas, tipoHabitacion, comentarios } = body;

        let targetReservaId = reservaId;
        let checkoutAmount = parseFloat(amount);

        // If targetReservaId is not provided, this is the legacy direct checkout flow:
        // We first create the reservation, then check out for the FULL amount.
        if (!targetReservaId) {
            // Server-side validation
            if (!nombre || !email || !telefono || !numeroPlazas || !tipoHabitacion) {
                return NextResponse.json(
                    { error: "Todos los campos obligatorios deben estar completos." },
                    { status: 400 }
                );
            }

            const plazasCount = parseInt(numeroPlazas, 10);
            if (isNaN(plazasCount) || plazasCount < 1) {
                return NextResponse.json(
                    { error: "El número de plazas debe ser mayor o igual a 1." },
                    { status: 400 }
                );
            }

            if (tipoHabitacion !== "doble" && tipoHabitacion !== "individual") {
                return NextResponse.json(
                    { error: "Tipo de habitación no válido. Debe ser 'doble' o 'individual'." },
                    { status: 400 }
                );
            }

            // Check availability (sum of 'pagada' reservations)
            const paidReservations = await prisma.reserva.findMany({
                where: { estado: "pagada" },
            });

            const totalPaidPlazas = paidReservations.reduce((acc: number, curr: { numeroPlazas: number }) => acc + curr.numeroPlazas, 0);
            const availablePlazas = MAX_PLAZAS - totalPaidPlazas;

            if (plazasCount > availablePlazas) {
                return NextResponse.json(
                    { error: `Lo sentimos, no hay suficientes plazas disponibles. Plazas libres: ${availablePlazas}.` },
                    { status: 400 }
                );
            }

            // Price calculation
            const precioBase = 1630;
            const suplementoIndividual = 260;
            const precioConSuplemento = precioBase + suplementoIndividual;
            const unitPrice = tipoHabitacion === "individual" ? precioConSuplemento : precioBase;
            const totalAmount = plazasCount * unitPrice;

            // Verify or create User registration
            let user = await prisma.usuario.findUnique({
                where: { correo: email },
            });

            if (!user) {
                await prisma.usuario.create({
                    data: {
                        correo: email,
                        nombre,
                        movil: telefono,
                        idrolusuario: 3,
                        estadoVerificacion: "verificado",
                    },
                });
            }

            // Create reservation in DB
            const newReserva = await prisma.reserva.create({
                data: {
                    nombre,
                    email,
                    telefono,
                    numeroPlazas: plazasCount,
                    tipoHabitacion,
                    importeTotal: totalAmount,
                    estado: "pendiente_pago",
                    comentarios: comentarios || "",
                },
            });

            targetReservaId = newReserva.id;
            checkoutAmount = totalAmount;
        }

        // Load targeted reservation
        const reserva = await prisma.reserva.findUnique({
            where: { id: targetReservaId },
        });

        if (!reserva) {
            return NextResponse.json(
                { error: "No se encontró la reserva indicada." },
                { status: 404 }
            );
        }

        if (isNaN(checkoutAmount) || checkoutAmount <= 0) {
            return NextResponse.json(
                { error: "La cantidad a pagar debe ser mayor que 0 €." },
                { status: 400 }
            );
        }

        // Enforce maximum checkout amount based on remaining balance
        const dbPayments = await prisma.pagosUsuario.findMany({
            where: {
                usuario: {
                    correo: reserva.email,
                },
            },
        });
        const totalPaid = dbPayments.reduce((acc: number, curr: any) => acc + (curr.cantidadAbonada ?? 0), 0);
        const remainingBalance = Math.max(0, reserva.importeTotal - totalPaid);

        if (checkoutAmount > remainingBalance + 0.01) {
            return NextResponse.json(
                { error: `La cantidad solicitada (${checkoutAmount} €) supera el saldo pendiente (${remainingBalance} €).` },
                { status: 400 }
            );
        }

        // Resolve correct origin respecting reverse proxies (e.g. Dokploy/Docker)
        const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
        const proto = request.headers.get("x-forwarded-proto") || "http";
        const origin = `${proto}://${host}`;

        // Check if Stripe key is configured. If not, simulate redirect url for testing.
        if (!stripe) {
            console.warn("STRIPE_SECRET_KEY not set. Operating in checkout simulation mode.");

            // Update booking with mockup session ID
            const mockSessionId = `mock_session_partial_${Date.now()}`;
            await prisma.reserva.update({
                where: { id: reserva.id },
                data: { stripeSessionId: mockSessionId },
            });

            const successUrl = `${origin}/reserva/exito?session_id=${mockSessionId}&simulated=true&amount=${checkoutAmount}&reserva_id=${reserva.id}`;
            return NextResponse.json({ url: successUrl });
        }

        // Create Stripe Checkout Session
        const description = `Pago parcial para Viaje Sevilla, Ciudad de la Música. Reserva ID: ${reserva.id}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Pago Plazo Viaje Sevilla - Ref: ${reserva.id.slice(0, 8)}`,
                            description: description,
                        },
                        unit_amount: Math.round(checkoutAmount * 100), // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/reserva/exito?session_id={CHECKOUT_SESSION_ID}&amount=${checkoutAmount}&reserva_id=${reserva.id}`,
            cancel_url: `${origin}/reserva/cancelada?reserva_id=${reserva.id}`,
            metadata: {
                reservaId: reserva.id,
                amount: checkoutAmount.toString(),
            },
        });

        // Update reservation with Stripe Checkout Session ID
        await prisma.reserva.update({
            where: { id: reserva.id },
            data: { stripeSessionId: session.id },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Error at checkout session creation:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al procesar el pago: " + error.message },
            { status: 500 }
        );
    }
}
