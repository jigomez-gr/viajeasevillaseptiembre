import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("auth_session");

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json({ loggedIn: false });
        }

        const sessionPayload = JSON.parse(sessionCookie.value);
        const { idusuario, correo } = sessionPayload;

        const user = await prisma.usuario.findUnique({
            where: { idusuario },
            include: {
                rol: true,
            },
        });

        if (!user) {
            return NextResponse.json({ loggedIn: false });
        }

        // Find reservation (Reserva) corresponding to this traveler by email
        const reserva = await prisma.reserva.findFirst({
            where: {
                email: user.correo ?? "",
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Get matching payment transactions
        const pagos = await prisma.pagosUsuario.findMany({
            where: {
                idusuario: user.idusuario,
            },
            orderBy: {
                fechaPago: "desc",
            },
        });

        const totalPaid = pagos.reduce((acc: number, curr: any) => acc + (curr.cantidadAbonada ?? 0), 0);

        return NextResponse.json({
            loggedIn: true,
            user: {
                idusuario: user.idusuario,
                correo: user.correo,
                nombre: user.nombre,
                apellido: user.apellido,
                movil: user.movil,
                estadoVerificacion: user.estadoVerificacion,
            },
            reserva,
            pagos,
            totalPaid,
        });
    } catch (error) {
        console.error("Error at reservations/me API:", error);
        return NextResponse.json(
            { error: "Error al consultar la sesión del usuario." },
            { status: 500 }
        );
    }
}
