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

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Email sending simulation helper
function simulateEmails(reserva: any) {
    const roomLabel = reserva.tipoHabitacion === "individual"
        ? "Habitación Doble para uso Individual (con suplemento)"
        : "Habitación Doble Estándar";

    console.log(`
============================================================
[SIMULACIÓN DE EMAIL] - CONFIRMACIÓN DE RESERVA Y PAGO
============================================================
Destinatario: ${reserva.email}
Asunto: Confirmación de pago y reserva - Sevilla, Ciudad de la Música
Cuerpo:
Estimado/a ${reserva.nombre},

Hemos recibido correctamente el pago de su reserva para el viaje 'Sevilla, Ciudad de la Música' que tendrá lugar del 31 de agosto al 5 de septiembre de 2026.

Detalles de la Reserva:
- ID de Reserva: ${reserva.id}
- Teléfono: ${reserva.telefono}
- Plazas reservadas: ${reserva.numeroPlazas}
- Régimen de alojamiento: ${roomLabel}
- Importe Total Pagado: ${reserva.importeTotal} € (IVA incluido)
- Comentarios: ${reserva.comentarios || "Ninguno"}

Nos pondremos en contacto con usted para ultimar los detalles organizativos del viaje.
¡Gracias por confiar en el Ciclo de conciertos Manuel de Falla!

============================================================
`);

    console.log(`
============================================================
[SIMULACIÓN DE EMAIL] - NOTIFICACIÓN PARA ORGANIZACIÓN
============================================================
Destinatario: jose_manuel_hdezblanco@hotmail.com
Asunto: ¡NUEVA RESERVA INFORMADA! - Sevilla, Ciudad de la Música
Cuerpo:
Hola José Manuel,

Se ha confirmado el pago de una nueva reserva para el viaje cultural a Sevilla.

Detalles del Cliente:
- Nombre: ${reserva.nombre}
- Email: ${reserva.email}
- Teléfono: ${reserva.telefono}
- Plazas: ${reserva.numeroPlazas}
- Alojamiento: ${roomLabel}
- Importe: ${reserva.importeTotal} €
- Comentarios: ${reserva.comentarios || "Ninguno"}

ID de Transacción Stripe (Checkout Session): ${reserva.stripeSessionId}
ID de Pago (Payment Intent): ${reserva.stripePaymentIntentId || "N/A"}
============================================================
`);
}

export async function POST(request: Request) {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig || !endpointSecret) {
        // If webhook signing secret is not configured, we allow manual trigger in development
        if (process.env.NODE_ENV !== "production") {
            try {
                const bodyObj = JSON.parse(rawBody);
                if (bodyObj.action === "simulate_success" && bodyObj.reservaId) {
                    const reserva = await prisma.reserva.findUnique({
                        where: { id: bodyObj.reservaId },
                    });

                    if (!reserva) {
                        return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
                    }

                    const updatedReserva = await prisma.reserva.update({
                        where: { id: bodyObj.reservaId },
                        data: {
                            estado: "pagada",
                            stripePaymentIntentId: "simulated_intent_" + Date.now(),
                        },
                    });

                    simulateEmails(updatedReserva);
                    return NextResponse.json({ status: "success", info: "Simulated success manually" });
                }
            } catch (err: any) {
                return NextResponse.json({ error: "Failed to parse simulation req" }, { status: 400 });
            }
        }

        return NextResponse.json(
            { error: "Stripe signature or secret missing." },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        if (!stripe) {
            throw new Error("Stripe secret key is not configured.");
        }
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error de Firma: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const reservaId = session.metadata?.reservaId;
                const paymentIntentId = typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.toString() || null;

                if (!reservaId) {
                    console.warn("Stripe Checkout Session sin reservaId en metadata.");
                    break;
                }

                const reserva = await prisma.reserva.findUnique({
                    where: { id: reservaId },
                });

                if (!reserva) {
                    console.error(`Reserva ${reservaId} no encontrada en el webhook.`);
                    break;
                }

                if (reserva.estado === "pagada") {
                    console.log(`La reserva ${reservaId} ya estaba marcada como PAGADA.`);
                    break;
                }

                const updated = await prisma.reserva.update({
                    where: { id: reservaId },
                    data: {
                        estado: "pagada",
                        stripePaymentIntentId: paymentIntentId,
                    },
                });

                console.log(`Reserva ${reservaId} marcada satisfactoriamente como PAGADA.`);
                simulateEmails(updated);
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                const reservaId = session.metadata?.reservaId;

                if (reservaId) {
                    const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
                    if (reserva && reserva.estado === "pendiente_pago") {
                        await prisma.reserva.update({
                            where: { id: reservaId },
                            data: { estado: "cancelada" },
                        });
                        console.log(`Reserva ${reservaId} expirada y marcada como CANCELADA.`);
                    }
                }
                break;
            }

            default:
                console.log(`Evento de webhook no manejado: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Error al procesar el evento de webhook:", error);
        return NextResponse.json(
            { error: "Error en el webhook handler: " + error.message },
            { status: 500 }
        );
    }
}
