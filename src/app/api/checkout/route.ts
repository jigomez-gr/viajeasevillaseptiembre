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
        const { nombre, email, telefono, numeroPlazas, tipoHabitacion, comentarios } = body;

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
            where: {
                estado: "pagada",
            },
        });

        const totalPaidPlazas = paidReservations.reduce((acc: number, curr: { numeroPlazas: number }) => acc + curr.numeroPlazas, 0);
        const availablePlazas = MAX_PLAZAS - totalPaidPlazas;

        if (plazasCount > availablePlazas) {
            return NextResponse.json(
                {
                    error: `Lo sentimos, no hay suficientes plazas disponibles. Plazas libres: ${availablePlazas}.`
                },
                { status: 400 }
            );
        }

        // Price calculation
        // Habitación doble estándar: 1630 € por persona
        // Habitación individual: 1630 € + 260 € (suplemento) = 1890 € por persona
        const precioBase = 1630;
        const suplementoIndividual = 260;
        const precioConSuplemento = precioBase + suplementoIndividual;

        const unitPrice = tipoHabitacion === "individual" ? precioConSuplemento : precioBase;
        const totalAmount = plazasCount * unitPrice;

        // Create reservation in DB with 'pendiente_pago' state
        const reserva = await prisma.reserva.create({
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

        // Check if Stripe key is configured. If not, simulate redirect url for testing.
        if (!stripe) {
            console.warn("STRIPE_SECRET_KEY not set. Operating in simulation mode.");

            // Update booking with mockup session ID
            const mockSessionId = `mock_session_${reserva.id}`;
            await prisma.reserva.update({
                where: { id: reserva.id },
                data: { stripeSessionId: mockSessionId },
            });

            const successUrl = `${new URL(request.url).origin}/reserva/exito?session_id=${mockSessionId}&simulated=true`;
            return NextResponse.json({ url: successUrl });
        }

        // Create Stripe Checkout Session
        const origin = new URL(request.url).origin;

        const roomLabel = tipoHabitacion === "individual" ? "Habitación Doble uso Individual" : "Habitación Doble Estándar";
        const description = `Viaje Sevilla, Ciudad de la Música (31 Ago - 5 Sep 2026). Reserva de ${plazasCount} plaza(s) en ${roomLabel}.`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Viaje Cultural Sevilla - ${roomLabel}`,
                            description: description,
                        },
                        unit_amount: unitPrice * 100, // Stripe expects amount in cents
                    },
                    quantity: plazasCount,
                },
            ],
            mode: "payment",
            success_url: `${origin}/reserva/exito?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/reserva/cancelada?reserva_id=${reserva.id}`,
            metadata: {
                reservaId: reserva.id,
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
            { error: "Error interno del servidor al procesar la reserva: " + error.message },
            { status: 500 }
        );
    }
}
