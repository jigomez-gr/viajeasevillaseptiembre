"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Users, Home, MapPin, Mail, Phone } from "lucide-react";
import { Suspense, useEffect } from "react";

function ExitoContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const isSimulated = searchParams.get("simulated") === "true";
    const amount = searchParams.get("amount");
    const reservaId = searchParams.get("reserva_id");

    useEffect(() => {
        const isStripeTestSession = sessionId?.startsWith("cs_test_") || false;
        if ((isSimulated || isStripeTestSession) && reservaId) {
            // Trigger the simulated webhook execution
            fetch("/api/stripe/webhook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-simulate-secret": "1"
                },
                body: JSON.stringify({
                    action: "simulate_success",
                    reservaId,
                    amount,
                    sessionId
                })
            }).catch(err => console.error("Error triggering simulation webhook:", err));
        }
    }, [isSimulated, sessionId, reservaId, amount]);

    return (
        <main className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl border border-[#E9C168]/20 overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="h-2 bg-gradient-to-r from-[#800020] via-[#C5A059] to-[#2E5A44]" />

                <div className="p-8 sm:p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#2E5A44]/10 text-[#2E5A44] mb-6">
                        <CheckCircle className="w-12 h-12" />
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#800020] mb-4">
                        ¡Reserva Confirmada!
                    </h1>

                    <p className="text-[#1C1C1C]/80 text-lg mb-8 max-w-md mx-auto">
                        Hemos recibido correctamente tu pago. Tu plaza para vivir Sevilla a través de su historia musical está asegurada.
                    </p>

                    {/* Details Section */}
                    <div className="bg-[#FAF9F6] border border-[#C5A059]/20 rounded-lg p-6 text-left mb-8 space-y-4">
                        <h3 className="font-serif text-xl text-[#800020] border-b border-[#C5A059]/20 pb-2 font-semibold">
                            Resumen de tu Viaje
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#1C1C1C]/90">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span><strong>Fechas:</strong> 31 ago — 5 sep 2026</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span><strong>Alojamiento:</strong> Hotel Eurostars Guadalquivir 4*</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span><strong>Organiza:</strong> Conciertos Manuel de Falla</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span><strong>Transporte:</strong> Tren IRYO Clase Infinita</span>
                            </div>
                        </div>

                        {sessionId && (
                            <div className="pt-2 border-t border-[#C5A059]/10 text-xs text-stone-500">
                                <p className="truncate"><strong>ID de Pago:</strong> {sessionId}</p>
                                {isSimulated && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#C5A059]/10 text-[#800020] font-semibold rounded text-[10px]">
                                        Simulación de Checkout Local
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-[#800020]/5 border border-[#800020]/20 rounded-lg p-5 mb-8 text-sm text-[#1C1C1C]/80 space-y-2">
                        <p className="font-semibold text-[#800020]">
                            ¿Qué ocurre ahora?
                        </p>
                        <p>
                            1. Hemos enviado un correo detallado de confirmación a tu dirección de email.
                        </p>
                        <p>
                            2. El organizador ha recibido la notificación y se pondrá en contacto contigo en breve para coordinar traslados y preferencias de viaje.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="border-t border-stone-200 pt-6 mb-8 text-xs text-[#1C1C1C]/70">
                        <p className="mb-2">¿Tienes alguna pregunta urgente? Contáctanos:</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="mailto:jose_manuel_hdezblanco@hotmail.com" className="flex items-center text-[#800020] hover:text-[#C5A059]/80 transition">
                                <Mail className="w-3.5 h-3.5 mr-1" /> jose_manuel_hdezblanco@hotmail.com
                            </a>
                            <a href="tel:660957863" className="flex items-center text-[#800020] hover:text-[#C5A059]/80 transition">
                                <Phone className="w-3.5 h-3.5 mr-1" /> +34 660 957 863
                            </a>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#800020] hover:bg-[#800020]/90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020]"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Volver a la Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function ExitoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-serif text-[#800020] text-xl">
                Cargando detalles de reserva...
            </div>
        }>
            <ExitoContent />
        </Suspense>
    );
}
