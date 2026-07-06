import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_PLAZAS = 14;

export async function GET() {
    try {
        const paidReservations = await prisma.reserva.findMany({
            where: {
                estado: "pagada",
            },
        });

        const totalPaidPlazas = paidReservations.reduce((acc: number, curr: { numeroPlazas: number }) => acc + curr.numeroPlazas, 0);
        const availablePlazas = Math.max(0, MAX_PLAZAS - totalPaidPlazas);

        return NextResponse.json({
            maxPlazas: MAX_PLAZAS,
            totalPaidPlazas,
            availablePlazas,
        });
    } catch (error: any) {
        console.error("Error at reservations query API:", error);
        return NextResponse.json(
            { error: "Error al consultar las plazas disponibles." },
            { status: 500 }
        );
    }
}

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
        const precioBase = 1630;
        const suplementoIndividual = 260;
        const precioConSuplemento = precioBase + suplementoIndividual;
        const unitPrice = tipoHabitacion === "individual" ? precioConSuplemento : precioBase;
        const totalAmount = plazasCount * unitPrice;

        const normalizedEmail = email.trim().toLowerCase();

        // Verify or create User registration
        let user = await prisma.usuario.findUnique({
            where: { correo: normalizedEmail },
        });

        if (!user) {
            user = await prisma.usuario.create({
                data: {
                    correo: normalizedEmail,
                    nombre,
                    movil: telefono,
                    idrolusuario: 3,
                    estadoVerificacion: "verificado", // Automatic verification because they filled the form
                },
            });
        } else {
            // Update name and phone
            user = await prisma.usuario.update({
                where: { correo: normalizedEmail },
                data: {
                    nombre,
                    movil: telefono,
                },
            });
        }

        // Create reservation in DB with 'pendiente_pago' state
        const reserva = await prisma.reserva.create({
            data: {
                nombre,
                email: normalizedEmail,
                telefono,
                numeroPlazas: plazasCount,
                tipoHabitacion,
                importeTotal: totalAmount,
                estado: "pendiente_pago",
                comentarios: comentarios || "",
            },
        });

        return NextResponse.json({
            success: true,
            reservaId: reserva.id,
            reserva,
        });
    } catch (error: any) {
        console.error("Error creating reservation:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al registrarse: " + error.message },
            { status: 500 }
        );
    }
}
