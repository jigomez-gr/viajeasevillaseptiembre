"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Mail } from "lucide-react";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        // Auto-show a notification badge after 4 seconds
        const timer = setTimeout(() => {
            setShowBadge(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setShowBadge(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Bubble Button */}
            <button
                onClick={toggleChat}
                className="w-14 h-14 rounded-full bg-[#800020] hover:bg-[#800020]/90 text-white flex items-center justify-center shadow-2xl relative hover:scale-105 active:scale-95 transition-all duration-300 border border-[#E9C168]/45 cursor-pointer"
                aria-label="Abrir chat de asistencia"
            >
                {isOpen ? (
                    <X className="w-6 h-6 animate-fadeIn" />
                ) : (
                    <MessageSquare className="w-6 h-6 animate-fadeIn" />
                )}

                {/* Notification Badge */}
                {showBadge && !isOpen && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E9C168] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E9C168] text-[9px] text-[#800020] font-black items-center justify-center">1</span>
                    </span>
                )}
            </button>

            {/* Chat Box Popover */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[320px] max-w-[calc(90vw-24px)] bg-[#FAF9F6] border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
                    {/* Header */}
                    <div className="bg-[#800020] p-4 text-white flex items-center justify-between border-b border-[#C5A059]/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#800020] font-serif font-bold text-sm border border-[#E9C168]">
                                MF
                            </div>
                            <div>
                                <h4 className="font-serif text-sm font-bold tracking-wide">Asistente de Viajes</h4>
                                <p className="text-[9px] text-[#E9C168] uppercase tracking-wider font-semibold">Ciclo Manuel de Falla</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3 bg-[#FAF9F6]">
                        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm text-xs text-[#1C1C1C]/95 leading-relaxed">
                            <p className="font-serif italic font-bold text-[#800020] mb-1">¡Buenas tardes!</p>
                            <p className="mb-2">
                                Le damos la bienvenida al portal del viaje exclusivo <strong>Sevilla, Ciudad de la Música</strong>.
                            </p>
                            <p className="text-stone-600">
                                Para facilitarle asistencia directa o responder cualquier duda, puede solicitar continuar esta conversación en nuestros canales personales de:
                            </p>
                        </div>
                    </div>

                    {/* Msg welcome note footer */}
                    <div className="p-4 pt-1 bg-white border-t border-stone-100 flex flex-col gap-2">
                        {/* WhatsApp Button */}
                        <a
                            href="https://wa.me/34600000000?text=Hola,%20solicito%20información%20sobre%20el%20viaje%20a%20Sevilla%20del%20Ciclo%20Manuel%20de%20Falla."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-150 active:scale-98 shadow-sm cursor-pointer"
                        >
                            {/* WhatsApp SVG Icon */}
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.722-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.794.002-2.617-1.015-5.078-2.862-6.93C16.37 2.03 13.914 1.011 11.998 1.01c-5.41 0-9.813 4.4-9.815 9.801-.001 1.57.425 3.1.1.208 4.544l-.454.722-1.185 4.329 4.432-1.161.7.414z" />
                            </svg>
                            Continuar en WhatsApp
                        </a>

                        {/* Telegram Button */}
                        <a
                            href="https://t.me/ccmfalla"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0088cc] hover:bg-[#0077b3] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-150 active:scale-98 shadow-sm cursor-pointer"
                        >
                            {/* Telegram SVG Icon */}
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.75 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.2z" />
                            </svg>
                            Continuar en Telegram
                        </a>

                        {/* Email Button */}
                        <a
                            href="mailto:viajes@ccmfalla.com?subject=Consulta%20Viaje%20Sevilla:%20Ciudad%20de%20la%20M%C3%BAsica"
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FAF8F5] hover:bg-[#800020]/5 text-[#800020] text-[11px] font-bold uppercase tracking-wider rounded-lg border border-[#C5A059]/40 transition-all duration-150 active:scale-98 shadow-sm cursor-pointer"
                        >
                            <Mail className="w-4 h-4" />
                            Continuar por Email
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
