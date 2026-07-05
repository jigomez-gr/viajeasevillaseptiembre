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
