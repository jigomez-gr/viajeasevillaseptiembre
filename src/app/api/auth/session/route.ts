import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("auth_session");

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json({ loggedIn: false });
        }

        const user = JSON.parse(sessionCookie.value);
        return NextResponse.json({
            loggedIn: true,
            user,
        });
    } catch (error) {
        console.error("Session fetch failed:", error);
        return NextResponse.json({ loggedIn: false });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("auth_session");

        return NextResponse.json({
            success: true,
            message: "Sesión cerrada correctamente.",
        });
    } catch (error) {
        console.error("Session delete failed:", error);
        return NextResponse.json(
            { error: "Error al cerrar sesión." },
            { status: 500 }
        );
    }
}
