import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: "Correo y código obligatorios." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await prisma.usuario.findUnique({
            where: { correo: normalizedEmail },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuario no registrado." },
                { status: 404 }
            );
        }

        // Check if verification limit has been exceeded
        const limitAttempts = user.intentosVerificacion ?? 0;
        if (limitAttempts >= 5) {
            return NextResponse.json(
                { error: "Número máximo de intentos excedido. Solicita un nuevo código." },
                { status: 429 }
            );
        }

        // Check expiration
        const codeExpired = user.fechaExpiracionCodigo
            ? new Date() > new Date(user.fechaExpiracionCodigo)
            : true;

        if (codeExpired || user.codigoVerificacion !== code) {
            // Increment verification attempts
            await prisma.usuario.update({
                where: { correo: normalizedEmail },
                data: {
                    intentosVerificacion: limitAttempts + 1,
                },
            });
            return NextResponse.json(
                { error: "Código incorrecto o expirado." },
                { status: 401 }
            );
        }

        // Update user: verified!
        const updatedUser = await prisma.usuario.update({
            where: { correo: normalizedEmail },
            data: {
                estadoVerificacion: "verificado",
                codigoVerificacion: null,
                fechaExpiracionCodigo: null,
                intentosVerificacion: 0,
            },
        });

        // Set response session cookie (Next.js 16 App Router)
        const sessionPayload = {
            idusuario: updatedUser.idusuario,
            correo: updatedUser.correo,
            nombre: updatedUser.nombre || "",
            apellido: updatedUser.apellido || "",
            movil: updatedUser.movil || "",
        };

        const cookieStore = await cookies();
        cookieStore.set("auth_session", JSON.stringify(sessionPayload), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: sessionPayload,
        });
    } catch (error: any) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { error: "Error interno al verificar el código." },
            { status: 500 }
        );
    }
}
