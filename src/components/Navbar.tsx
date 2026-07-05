"use client";

import { useState, useEffect } from "react";
import { Menu, X, Music } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "Inicio", href: "#viaje" },
        { label: "Itinerario", href: "#itinerario" },
        { label: "Vídeos", href: "#videos" },
        { label: "Qué Incluye", href: "#incluye" },
        { label: "Plazas y Precios", href: "#precios" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C5A059]/15 shadow-sm font-sans">
            {/* Desktop Centered Header Layout */}
            <div className="hidden md:flex flex-col items-center pt-5 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo Block */}
                <a href="#" className="flex items-center space-x-3 mb-4 group select-none">
                    {/* 3 vertical red bars */}
                    <div className="flex items-end space-x-1.5 h-10">
                        <div className="w-[4px] bg-[#800020] h-6 rounded-sm group-hover:scale-y-110 transition duration-300"></div>
                        <div className="w-[4px] bg-[#800020] h-9 rounded-sm group-hover:scale-y-105 transition duration-300"></div>
                        <div className="w-[4px] bg-[#800020] h-7 rounded-sm group-hover:scale-y-115 transition duration-300"></div>
                    </div>
                    {/* Text side */}
                    <div className="flex flex-col text-left leading-tight">
                        <div className="flex items-center space-x-1.5 text-[10px] tracking-widest text-[#C5A059] uppercase font-semibold">
                            <span>CICLO</span>
                            <span className="text-stone-300">|</span>
                            <span>DE CONCIERTOS</span>
                        </div>
                        <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#800020] tracking-wide uppercase font-editorial">
                            Manuel de Falla
                        </h2>
                    </div>
                </a>

                {/* Submenu links with vertical pipes */}
                <nav className="flex items-center justify-center space-x-5 text-[10px] font-bold uppercase tracking-widest text-stone-600">
                    {menuItems.map((item, idx) => (
                        <span key={item.label} className="flex items-center space-x-5">
                            {idx > 0 && <span className="text-[#C5A059]/40 select-none font-light">|</span>}
                            <a
                                href={item.href}
                                className="hover:text-[#800020] transition duration-200"
                            >
                                {item.label}
                            </a>
                        </span>
                    ))}
                    <span className="text-[#C5A059]/40 select-none font-light">|</span>
                    <a
                        href="#reserva"
                        className="text-[#800020] font-extrabold hover:underline transition duration-200"
                    >
                        Reservar Plaza
                    </a>
                </nav>
            </div>

            {/* Mobile Header Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between md:hidden">
                {/* Logo side */}
                <a href="#" className="flex items-center space-x-2.5">
                    <div className="flex items-end space-x-1 h-7">
                        <div className="w-[3px] bg-[#800020] h-4 rounded-sm"></div>
                        <div className="w-[3px] bg-[#800020] h-7 rounded-sm"></div>
                        <div className="w-[3px] bg-[#800020] h-5 rounded-sm"></div>
                    </div>
                    <div className="flex flex-col text-left leading-none">
                        <span className="text-[7.5px] tracking-wider text-[#C5A059] uppercase font-semibold">CICLO DE CONCIERTOS</span>
                        <span className="font-serif text-sm font-bold text-[#800020] uppercase">Manuel de Falla</span>
                    </div>
                </a>
                {/* Toggle button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-[#1C1C1C] hover:text-[#800020] focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-[#C5A059]/15 py-4 px-6 absolute top-full left-0 right-0 shadow-lg animate-slideDown">
                    <nav className="flex flex-col space-y-4 font-semibold text-xs uppercase tracking-widest text-stone-600">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#800020] py-1 transition"
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href="#reserva"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-2.5 border border-transparent rounded text-xs font-bold uppercase tracking-widest text-white bg-[#800020] hover:bg-[#800020]/90 transition"
                        >
                            Reservar Plaza
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
