"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail, Phone } from "lucide-react";
import { Suspense } from "react";

function CancelContent() {
    const searchParams = useSearchParams();
    const reservaId = searchParams.get("reserva_id");

    return (
        <main className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-[#800020]/20 overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="h-2 bg-[#800020]" />

                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#800020]/10 text-[#800020] mb-6">
                        <AlertCircle className="w-10 h-10" />
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] mb-3">
                        Reserva Cancelada
                    </h1>

                    <p className="text-[#1C1C1C]/80 text-sm mb-6">
                        El proceso de pago ha sido interrumpido y no se ha realizado ningún cargo en tu tarjeta. Si deseas revisar los datos del viaje o reintentar la solicitud, puedes hacerlo en cualquier momento.
                    </p>

                    {reservaId && (
                        <div className="bg-[#FAF9F6]/50 border border-stone-200 rounded p-3 mb-6 text-xs text-stone-500">
                            ID de Intento de Reserva: <span className="font-mono text-stone-700">{reservaId}</span>
                        </div>
                    )}

                    <div className="flex flex-col space-y-3 mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800020] hover:bg-[#800020]/90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a la Home e Intentar de Nuevo
                        </Link>
                    </div>

                    {/* Contact Details */}
                    <div className="border-t border-stone-150 pt-5 text-[11px] text-[#1C1C1C]/70">
                        <p className="mb-2">¿Tienes algún problema con el pago? Contáctanos:</p>
                        <div className="flex flex-col items-center space-y-1">
                            <a href="mailto:jose_manuel_hdezblanco@hotmail.com" className="flex items-center text-[#800020] hover:text-[#C5A059]/80 transition">
                                <Mail className="w-3 h-3 mr-1" /> jose_manuel_hdezblanco@hotmail.com
                            </a>
                            <a href="tel:660957863" className="flex items-center text-[#800020] hover:text-[#C5A059]/80 transition">
                                <Phone className="w-3 h-3 mr-1" /> +34 660 957 863
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CancelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-serif text-[#800020] text-xl">
                Cargando cancelación...
            </div>
        }>
            <CancelContent />
        </Suspense>
    );
}
