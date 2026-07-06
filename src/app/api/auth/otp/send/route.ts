import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Correo electrónico no válido." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Generate 6-digit OTP code (e.g. 849203)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Check if user exists under ccmfalla schema
        const existingUser = await prisma.usuario.findUnique({
            where: { correo: normalizedEmail },
        });

        if (existingUser) {
            await prisma.usuario.update({
                where: { correo: normalizedEmail },
                data: {
                    codigoVerificacion: code,
                    fechaExpiracionCodigo: expiration,
                    intentosVerificacion: 0,
                },
            });
        } else {
            // Create user as Traveler (idrolusuario = 3)
            await prisma.usuario.create({
                data: {
                    correo: normalizedEmail,
                    idrolusuario: 3,
                    codigoVerificacion: code,
                    fechaExpiracionCodigo: expiration,
                    intentosVerificacion: 0,
                    estadoVerificacion: "pendiente",
                },
            });
        }

        // Print code on server console so it can be monitored in Dokploy logs
        console.log(`[AUTH OTP CODE] Verification code for ${email} is: ${code}`);

        // Return code in debug property for easy manual UX verification
        return NextResponse.json({
            success: true,
            message: "Código enviado. Revisa tu buzón (o la consola de logs).",
            debugCode: code, // Shared for quick front-end validation & local testing
        });
    } catch (error: any) {
        console.error("Error sending OTP:", error);
        return NextResponse.json(
            { error: "Error interno al enviar el código de verificación." },
            { status: 500 }
        );
    }
}
