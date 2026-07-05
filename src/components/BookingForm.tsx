"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Users, Home, MessageSquare, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface BookingFormProps {
    initialAvailablePlazas: number;
}

export default function BookingForm({ initialAvailablePlazas }: BookingFormProps) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [numeroPlazas, setNumeroPlazas] = useState(1);
    const [tipoHabitacion, setTipoHabitacion] = useState<"doble" | "individual">("doble");
    const [comentarios, setComentarios] = useState("");
    const [condiciones, setCondiciones] = useState(false);
    const [privacidad, setPrivacidad] = useState(false);

    const [availablePlazas, setAvailablePlazas] = useState(initialAvailablePlazas);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync available plazas from API on mount
    useEffect(() => {
        async function fetchReservas() {
            try {
                const res = await fetch("/api/reservas");
                if (res.ok) {
                    const data = await res.json();
                    setAvailablePlazas(data.availablePlazas);
                }
            } catch (err) {
                console.error("Error al consultar plazas:", err);
            }
        }
        fetchReservas();
    }, []);

    // Price parameters
    const PRECIO_BASE = 1630;
    const SUPLEMENTO_INDIVIDUAL = 260;
    const unitPrice = tipoHabitacion === "individual" ? (PRECIO_BASE + SUPLEMENTO_INDIVIDUAL) : PRECIO_BASE;
    const totalPrice = numeroPlazas * unitPrice;

    // Maximum plazas selection is minimum of availablePlazas and 14
    const maxPlazasSelectable = Math.min(availablePlazas, 14);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!nombre.trim() || !email.trim() || !telefono.trim()) {
            setError("Por favor, rellene todos los campos de contacto obligatorios.");
            return;
        }

        if (numeroPlazas > availablePlazas) {
            setError(`Lo sentimos, solo quedan ${availablePlazas} plaza(s) disponible(s).`);
            return;
        }

        if (!condiciones || !privacidad) {
            setError("Debe aceptar las condiciones de inscripción y la política de privacidad.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    email,
                    telefono,
                    numeroPlazas,
                    tipoHabitacion,
                    comentarios,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error inesperado al procesar la reserva.");
            }

            if (data.url) {
                // Redirect to Stripe Checkout page
                window.location.href = data.url;
            } else {
                throw new Error("No se recibió la URL de redirección.");
            }
        } catch (err: any) {
            console.error("Booking error:", err);
            setError(err.message || "Error de red. Inténtelo de nuevo más tarde.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Decorative Gold Border Badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9C168]/15 rounded-bl-full pointer-events-none" />

            <div className="mb-8">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] mb-2">
                    Boletín de Reserva
                </h3>
                <p className="text-sm text-[#1C1C1C]/70">
                    Complete el formulario para calcular el importe y continuar con el pago seguro de su plaza.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-[#800020]/10 border border-[#800020]/30 rounded-lg text-sm text-[#800020] font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nombre y Apellidos */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Nombre y Apellidos *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                <User className="h-4 w-4" />
                            </span>
                            <input
                                required
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. María García López"
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Dirección de Correo Electrónico *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                <Mail className="h-4 w-4" />
                            </span>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ej. maria@correo.com"
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Teléfono de Contacto *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                <Phone className="h-4 w-4" />
                            </span>
                            <input
                                required
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Ej. +34 600 000 000"
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Número de Plazas */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Número de Plazas *
                        </label>
                        <div className="relative font-sans">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                <Users className="h-4 w-4" />
                            </span>
                            <select
                                value={numeroPlazas}
                                onChange={(e) => setNumeroPlazas(parseInt(e.target.value, 10))}
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition appearance-none"
                            >
                                {availablePlazas === 0 ? (
                                    <option value={0}>No hay plazas disponibles (Completo)</option>
                                ) : (
                                    Array.from({ length: maxPlazasSelectable }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n} plaza{n > 1 ? "s" : ""}
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Tipo de Habitación */}
                    <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Modalidad de Habitación *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition ${tipoHabitacion === "doble" ? "bg-[#800020]/5 border-[#800020]" : "bg-white border-stone-300"}`}>
                                <input
                                    type="radio"
                                    name="tipoHabitacion"
                                    value="doble"
                                    checked={tipoHabitacion === "doble"}
                                    onChange={() => setTipoHabitacion("doble")}
                                    className="mt-1 text-[#800020] focus:ring-[#800020]"
                                />
                                <span className="ml-3">
                                    <span className="block text-sm font-semibold text-[#1C1C1C]">Habitación Doble Estándar</span>
                                    <span className="block text-xs text-[#1C1C1C]/60 mt-1">
                                        Incluido en el precio base. Para compartir con un acompañante en el viaje.
                                    </span>
                                    <span className="block text-sm font-semibold text-[#800020] mt-2">1.630 € / por persona</span>
                                </span>
                            </label>

                            <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition ${tipoHabitacion === "individual" ? "bg-[#800020]/5 border-[#800020]" : "bg-white border-stone-300"}`}>
                                <input
                                    type="radio"
                                    name="tipoHabitacion"
                                    value="individual"
                                    checked={tipoHabitacion === "individual"}
                                    onChange={() => setTipoHabitacion("individual")}
                                    className="mt-1 text-[#800020] focus:ring-[#800020]"
                                />
                                <span className="ml-3">
                                    <span className="block text-sm font-semibold text-[#1C1C1C]">Habitación Doble de Uso Individual</span>
                                    <span className="block text-xs text-[#1C1C1C]/60 mt-1">
                                        Incluye suplemento individual de +260 €.
                                    </span>
                                    <span className="block text-sm font-semibold text-[#800020] mt-2">1.890 € / por persona</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                            Comentarios o Necesidades Especiales
                        </label>
                        <div className="relative">
                            <span className="absolute top-3 left-0 pl-3 text-[#C5A059]">
                                <MessageSquare className="h-4 w-4" />
                            </span>
                            <textarea
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                placeholder="Indique aquí alergias, preferencias alimenticias o necesidades de accesibilidad."
                                rows={3}
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Dynamic Pricing Box */}
                <div className="bg-[#800020]/5 border border-[#800020]/20 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <span className="block text-xs text-[#1C1C1C]/60 uppercase tracking-widest font-semibold">
                            Importe Estimado
                        </span>
                        <span className="block text-[10px] text-[#1C1C1C]/50 italic">
                            {numeroPlazas} plaza{numeroPlazas > 1 ? "s" : ""} x {unitPrice} € / pers (IVA inc.)
                        </span>
                    </div>
                    <div className="text-center sm:text-right">
                        <span className="font-serif text-3xl font-extrabold text-[#800020]">
                            {totalPrice.toLocaleString("es-ES")} €
                        </span>
                        <span className="block text-xs text-[#2E5A44] font-semibold mt-0.5">
                            ✓ Todo Incluido (según programa)
                        </span>
                    </div>
                </div>

                {/* Legal Agreements */}
                <div className="space-y-3">
                    <label className="relative flex items-start cursor-pointer select-none">
                        <div className="flex items-center h-5">
                            <input
                                required
                                type="checkbox"
                                checked={condiciones}
                                onChange={(e) => setCondiciones(e.target.checked)}
                                className="focus:ring-[#800020] h-4 w-4 text-[#800020] border-stone-300 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-xs leading-5 text-[#1C1C1C]/75 cursor-pointer">
                            He leído y acepto las <span className="text-[#800520] hover:underline font-semibold">Condiciones de Inscripción</span>, la política de cancelación y la confirmación de disponibilidad a partir de 12 personas. *
                        </div>
                    </label>

                    <label className="relative flex items-start cursor-pointer select-none">
                        <div className="flex items-center h-5">
                            <input
                                required
                                type="checkbox"
                                checked={privacidad}
                                onChange={(e) => setPrivacidad(e.target.checked)}
                                className="focus:ring-[#800020] h-4 w-4 text-[#800020] border-stone-300 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-xs leading-5 text-[#1C1C1C]/75 cursor-pointer">
                            Doy mi consentimiento para el tratamiento de mis datos personales de acuerdo con la <span className="text-[#800520] hover:underline font-semibold">Política de Privacidad</span>. *
                        </div>
                    </label>
                </div>

                {/* Capacity Info Display */}
                <div className="text-center sm:text-left text-xs text-[#1C1C1C]/60 flex items-center justify-center sm:justify-start space-x-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${availablePlazas > 2 ? "bg-green-600 animate-pulse" : "bg-red-500 animate-pulse"}`} />
                    <span>
                        {availablePlazas === 0
                            ? "Plazas agotadas para este itinerario. Contacte por correo para lista de espera."
                            : `Disponibles: ${availablePlazas} plaza(s) en grupo exclusivo de máx. 14 personas.`
                        }
                    </span>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading || availablePlazas === 0}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-[#800020] hover:bg-[#800020]/95 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Procesando Reserva...
                        </>
                    ) : (
                        <>
                            Proceder al Pago Seguro
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>

                {/* Secure connection pledge */}
                <p className="text-center text-[10px] text-[#1C1C1C]/45 flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A44] inline shrink-0" />
                    <span>Pasarela cifrada de Stripe. No almacenamos datos de su tarjeta.</span>
                </p>
            </form>
        </div>
    );
}
