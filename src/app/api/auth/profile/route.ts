import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("auth_session");

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json(
                { error: "No autorizado. Sesión no encontrada." },
                { status: 401 }
            );
        }

        const sessionPayload = JSON.parse(sessionCookie.value);
        const { idusuario } = sessionPayload;

        const body = await req.json();
        const { nombre, apellido, movil, telegramUsername, telegramId } = body;

        // Update database user
        const updatedUser = await prisma.usuario.update({
            where: { idusuario },
            data: {
                nombre: nombre !== undefined ? (nombre || null) : undefined,
                apellido: apellido !== undefined ? (apellido || null) : undefined,
                movil: movil !== undefined ? (movil || null) : undefined,
                telegramUsername: telegramUsername !== undefined ? (telegramUsername || null) : undefined,
                telegramId: telegramId !== undefined ? (telegramId || null) : undefined,
            },
        });

        // Update cookie payload to sync session
        const newPayload = {
            idusuario: updatedUser.idusuario,
            correo: updatedUser.correo,
            nombre: updatedUser.nombre || "",
            apellido: updatedUser.apellido || "",
            movil: updatedUser.movil || "",
        };

        cookieStore.set("auth_session", JSON.stringify(newPayload), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: newPayload,
        });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Error al actualizar el perfil: " + error.message },
            { status: 500 }
        );
    }
}
