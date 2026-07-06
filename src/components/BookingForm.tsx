"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Users, Home, MessageSquare, ShieldCheck, ArrowRight, Loader2, KeyRound, LogOut, CheckCircle, CreditCard, RefreshCw } from "lucide-react";

interface BookingFormProps {
    initialAvailablePlazas: number;
}

interface UserSession {
    loggedIn: boolean;
    user?: {
        idusuario: number;
        correo: string;
        nombre?: string;
        apellido?: string;
        movil?: string;
        estadoVerificacion?: string;
    };
    reserva?: {
        id: string;
        nombre: string;
        email: string;
        telefono: string;
        numeroPlazas: number;
        tipoHabitacion: string;
        importeTotal: number;
        estado: string;
        stripeSessionId?: string;
        comentarios?: string;
    };
    pagos?: {
        idpago: number;
        codigoViaje?: string;
        fechaSalida?: string;
        descripcionViaje?: string;
        cantidadAbonada?: number;
        procesado?: string;
        fechaPago?: string;
    }[];
    totalPaid?: number;
}

export default function BookingForm({ initialAvailablePlazas }: BookingFormProps) {
    // Auth Session State
    const [session, setSession] = useState<UserSession | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);

    // OTP Verification Fields
    const [authEmail, setAuthEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
    const [debugCode, setDebugCode] = useState<string | null>(null);

    // Initial Registration Fields
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [numeroPlazas, setNumeroPlazas] = useState(1);
    const [tipoHabitacion, setTipoHabitacion] = useState<"doble" | "individual">("doble");
    const [comentarios, setComentarios] = useState("");
    const [condiciones, setCondiciones] = useState(false);
    const [privacidad, setPrivacidad] = useState(false);

    // Installment Payment States
    const [paymentOption, setPaymentOption] = useState<"primer" | "segundo" | "completo" | "personalizado">("primer");
    const [customAmount, setCustomAmount] = useState("500");
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const [availablePlazas, setAvailablePlazas] = useState(initialAvailablePlazas);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper: fetch active traveler session
    const loadSession = async () => {
        try {
            const res = await fetch("/api/reservas/me");
            if (res.ok) {
                const data = await res.json();
                setSession(data);
                if (data.loggedIn && data.user) {
                    setAuthEmail(data.user.correo);
                    if (data.reserva) {
                        setNombre(data.reserva.nombre);
                        setTelefono(data.reserva.telefono);
                        setNumeroPlazas(data.reserva.numeroPlazas);
                        setTipoHabitacion(data.reserva.tipoHabitacion);
                        setComentarios(data.reserva.comentarios || "");
                    } else {
                        setNombre(data.user.nombre || "");
                        setTelefono(data.user.movil || "");
                    }
                }
            }
        } catch (err) {
            console.error("Error al cargar la sesión:", err);
        } finally {
            setSessionLoading(false);
        }
    };

    // Load session and available plazas on mount
    useEffect(() => {
        async function fetchPlazas() {
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
        fetchPlazas();
        loadSession();
    }, []);

    // Price parameters
    const PRECIO_BASE = 1630;
    const SUPLEMENTO_INDIVIDUAL = 260;
    const unitPrice = tipoHabitacion === "individual" ? (PRECIO_BASE + SUPLEMENTO_INDIVIDUAL) : PRECIO_BASE;
    const totalPrice = numeroPlazas * unitPrice;

    // Remaining payment calculation
    const remainingBalance = session?.reserva
        ? Math.max(0, session.reserva.importeTotal - (session.totalPaid ?? 0))
        : 0;

    // Maximum plazas selection is minimum of availablePlazas and 14
    const maxPlazasSelectable = Math.min(availablePlazas, 14);

    // Step 1: Send OTP code email
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setOtpSuccessMsg(null);
        setDebugCode(null);

        if (!authEmail.trim() || !authEmail.includes("@")) {
            setError("Por favor, introduce una dirección de correo válida.");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al enviar el código.");

            setOtpSent(true);
            setOtpSuccessMsg(data.message);
            if (data.debugCode) {
                setDebugCode(data.debugCode);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    // Step 2: Verify OTP code
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setOtpSuccessMsg(null);

        if (!otpCode.trim() || otpCode.length < 5) {
            setError("Por favor, introduce el código de verificación.");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail, code: otpCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Código incorrecto o expirado.");

            // Logged in! Refresh session.
            setOtpSent(false);
            setOtpCode("");
            await loadSession();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        setError(null);
        try {
            const res = await fetch("/api/auth/session", { method: "DELETE" });
            if (res.ok) {
                setSession(null);
                setAuthEmail("");
                setOtpSent(false);
                setNombre("");
                setTelefono("");
                setNumeroPlazas(1);
                setTipoHabitacion("doble");
                setComentarios("");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Step 3: Register/Sign up (create Reserva without immediate payment)
    const handleSignUpTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre.trim() || !telefono.trim()) {
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

        setFormLoading(true);
        try {
            const response = await fetch("/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    email: authEmail,
                    telefono,
                    numeroPlazas,
                    tipoHabitacion,
                    comentarios,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error al guardar la reserva.");
            }

            // Sync session
            await loadSession();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Step 4: Pay installment (Checkout checkout session creation)
    const handlePayInstallment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!session?.reserva) return;

        let payAmount = 0;
        if (paymentOption === "primer") {
            payAmount = Math.min(500, remainingBalance);
        } else if (paymentOption === "segundo") {
            payAmount = Math.min(500, remainingBalance);
        } else if (paymentOption === "completo") {
            payAmount = remainingBalance;
        } else {
            const parsed = parseFloat(customAmount);
            if (isNaN(parsed) || parsed < 50) {
                setError("La cantidad personalizada debe ser de al menos 50 €.");
                return;
            }
            if (parsed > remainingBalance) {
                setError(`La cantidad elegida supera el saldo restante de ${remainingBalance} €.`);
                return;
            }
            payAmount = parsed;
        }

        setCheckoutLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservaId: session.reserva.id,
                    amount: payAmount,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al procesar el pago.");

            if (data.url) {
                // Redirect to stripe checkout portal
                window.location.href = data.url;
            } else {
                throw new Error("No se pudo obtener la URL de pago.");
            }
        } catch (err: any) {
            setError(err.message);
            setCheckoutLoading(false);
        }
    };

    // Loading State Screen
    if (sessionLoading) {
        return (
            <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl p-8 sm:p-12 shadow-2xl flex flex-col justify-center items-center gap-4 text-center min-h-[300px]">
                <Loader2 className="w-10 h-10 animate-spin text-[#800020]" />
                <p className="text-sm font-medium text-[#1C1C1C]/70">Verificando sesión de viajero...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Decorative Gold Badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9C168]/15 rounded-bl-full pointer-events-none" />

            {/* ERROR ALERT DISPLAY */}
            {error && (
                <div className="mb-6 p-4 bg-[#800020]/10 border border-[#800020]/30 rounded-lg text-sm text-[#800020] font-medium transition-all duration-200">
                    {error}
                </div>
            )}

            {/* SUCCESS MSGS */}
            {otpSuccessMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                    {otpSuccessMsg}
                </div>
            )}

            {/* SCREEN 1: OTP AUTHENTICATION */}
            {!session?.loggedIn ? (
                <div className="space-y-6">
                    <div className="mb-6">
                        <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                            Acceso y Registro
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] mb-2">
                            Área de Inscripción Colectiva
                        </h3>
                        <p className="text-sm text-[#1C1C1C]/70">
                            Introduce tu correo electrónico para identificarte o darte de alta. Te enviaremos un código temporal de verificación de un solo uso.
                        </p>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                                    Tu dirección de correo electrónico *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                        <Mail className="h-4.5 w-4.5" />
                                    </span>
                                    <input
                                        required
                                        type="email"
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        placeholder="Ej. mi-correo@dominio.com"
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-md shadow-md text-white bg-[#800020] hover:bg-[#800020]/95 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                {otpLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando Código...
                                    </>
                                ) : (
                                    <>
                                        Solicitar Código de Acceso
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                                        Código de Verificación (6 dígitos) *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="text-xs text-[#800020] hover:underline flex items-center gap-1 font-medium"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Reenviar
                                    </button>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C5A059]">
                                        <KeyRound className="h-4.5 w-4.5" />
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="Código de 6 números"
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition text-center tracking-widest font-mono font-bold text-lg"
                                    />
                                </div>
                                {debugCode && (
                                    <div className="mt-1 p-2 bg-[#FAF9F6] border border-[#C5A059]/40 rounded text-center text-xs text-[#C5A059] font-mono">
                                        <span>Modo Demo - Código autogenerado: </span>
                                        <strong className="text-[#800020] select-all cursor-pointer font-bold">{debugCode}</strong>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-md shadow-md text-white bg-[#800020] hover:bg-[#800020]/95 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                {otpLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Confirmar Código y Entrar
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            ) : !session.reserva ? (
                /* SCREEN 2: SIGN UP / APUNTARSE AL VIAJE (No active Reservation) */
                <div className="space-y-6">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                                Sesión Iniciada: {session.user?.correo}
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] mb-2">
                                Apuntarse al Viaje
                            </h3>
                            <p className="text-sm text-[#1C1C1C]/70">
                                Reserva tu plaza en el grupo exclusivo (mínimo 12 personas, máximo 14). Puedes apuntarte ahora sin abonar nada inicialmente.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-1.5 border border-stone-300 rounded text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 transition"
                        >
                            <LogOut className="w-3.5 h-3.5 mr-1" />
                            Salir
                        </button>
                    </div>

                    <form onSubmit={handleSignUpTrip} className="space-y-6">
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

                            {/* Teléfono de contacto */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                                    Teléfono / Móvil de Contacto *
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
                                    Modalidad de Alojamiento *
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
                                                Compartida con acompañante.
                                            </span>
                                            <span className="block text-sm font-semibold text-[#800020] mt-2">1.630 € / pers</span>
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
                                            <span className="block text-sm font-semibold text-[#1C1C1C]">Habitación Doble Uso Individual</span>
                                            <span className="block text-xs text-[#1C1C1C]/60 mt-1">
                                                Suplemento individual de +260 € incluido.
                                            </span>
                                            <span className="block text-sm font-semibold text-[#800020] mt-2">1.890 € / pers</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Comentarios */}
                            <div className="space-y-2 sm:col-span-2">
                                <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                                    Comentarios o Necesidades Especiales
                                </label>
                                <textarea
                                    value={comentarios}
                                    onChange={(e) => setComentarios(e.target.value)}
                                    placeholder="Indique requerimientos alimenticios, problemas médicos o notas adicionales."
                                    rows={3}
                                    className="block w-full px-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Estimated Price */}
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
                            </div>
                        </div>

                        {/* Agreements */}
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
                                    Doy mi consentimiento para el tratamiento de mis datos de acuerdo con la <span className="text-[#800520] hover:underline font-semibold">Política de Privacidad</span>. *
                                </div>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={formLoading || availablePlazas === 0}
                            className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-[#800020] hover:bg-[#800020]/95 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        >
                            {formLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Registrando Plaza...
                                </>
                            ) : (
                                <>
                                    Apuntarse al Viaje
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                /* SCREEN 3: TRAVELER DASHBOARD (Active Reservation Found) */
                <div className="space-y-8">
                    <div className="flex justify-between items-start gap-4 flex-wrap border-b border-[#C5A059]/25 pb-6">
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                                Panel del Viajero
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                                Hola, {session.reserva.nombre}
                            </h3>
                            <p className="text-xs text-[#1C1C1C]/60 mt-1">
                                Correo: {session.reserva.email} | Teléfono: {session.reserva.telefono}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-1.5 border border-stone-300 rounded text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 transition"
                        >
                            <LogOut className="w-3.5 h-3.5 mr-1" />
                            Salir
                        </button>
                    </div>

                    {/* Booking Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 border border-[#C5A059]/20 rounded-lg">
                            <span className="block text-xs text-[#1C1C1C]/60 uppercase tracking-widest mb-1">Tu Reserva</span>
                            <span className="block font-serif text-xl font-bold text-[#800020]">
                                {session.reserva.numeroPlazas} plaza{session.reserva.numeroPlazas > 1 ? "s" : ""}
                            </span>
                            <span className="block text-[10px] text-[#1C1C1C]/50 mt-1 uppercase italic">
                                Habitación {session.reserva.tipoHabitacion}
                            </span>
                        </div>

                        <div className="bg-white p-4 border border-[#C5A059]/20 rounded-lg">
                            <span className="block text-xs text-[#1C1C1C]/60 uppercase tracking-widest mb-1">Total Abonado</span>
                            <span className="block font-serif text-xl font-bold text-[#2E5A44]">
                                {(session.totalPaid ?? 0).toLocaleString("es-ES")} €
                            </span>
                            <span className="block text-[10px] text-[#1C1C1C]/50 mt-1 uppercase italic">
                                de {session.reserva.importeTotal.toLocaleString("es-ES")} € totales
                            </span>
                        </div>

                        <div className="bg-white p-4 border border-[#C5A059]/20 rounded-lg">
                            <span className="block text-xs text-[#1C1C1C]/60 uppercase tracking-widest mb-1">Saldo Pendiente</span>
                            <span className={`block font-serif text-xl font-bold ${remainingBalance > 0 ? "text-[#800020]" : "text-green-700"}`}>
                                {remainingBalance.toLocaleString("es-ES")} €
                            </span>
                            <span className="block text-[10px] text-[#1C1C1C]/50 mt-1 uppercase italic">
                                {remainingBalance === 0 ? "✓ Totalmente Pagado" : "Pendiente de abono"}
                            </span>
                        </div>
                    </div>

                    {/* Installments checkout form */}
                    {remainingBalance > 0 ? (
                        <form onSubmit={handlePayInstallment} className="bg-white border border-[#C5A059]/30 rounded-lg p-6 space-y-6">
                            <h4 className="font-serif text-lg font-bold text-[#800020] border-b border-stone-100 pb-3 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#C5A059]" />
                                Realizar Pago de Plazo
                            </h4>

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-[#1C1C1C]/90">
                                    Selecciona el importe del plazo a abonar:
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {remainingBalance >= 500 && (
                                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${paymentOption === "primer" ? "bg-[#800020]/5 border-[#800020]" : "bg-stone-50 border-stone-200"}`}>
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="primer"
                                                checked={paymentOption === "primer"}
                                                onChange={() => setPaymentOption("primer")}
                                                className="text-[#800020] focus:ring-[#800020]"
                                            />
                                            <span className="ml-3 text-sm font-semibold text-[#1C1C1C]">
                                                Pago Fraccionado (500 €)
                                            </span>
                                        </label>
                                    )}

                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${paymentOption === "completo" ? "bg-[#800020]/5 border-[#800020]" : "bg-stone-50 border-stone-200"}`}>
                                        <input
                                            type="radio"
                                            name="paymentOption"
                                            value="completo"
                                            checked={paymentOption === "completo"}
                                            onChange={() => setPaymentOption("completo")}
                                            className="text-[#800020] focus:ring-[#800020]"
                                        />
                                        <span className="ml-3 text-sm font-semibold text-[#1C1C1C]">
                                            Liquidar Total Restante ({remainingBalance.toLocaleString("es-ES")} €)
                                        </span>
                                    </label>

                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${paymentOption === "personalizado" ? "bg-[#800020]/5 border-[#800020]" : "bg-stone-50 border-stone-200"}`}>
                                        <input
                                            type="radio"
                                            name="paymentOption"
                                            value="personalizado"
                                            checked={paymentOption === "personalizado"}
                                            onChange={() => setPaymentOption("personalizado")}
                                            className="text-[#800020] focus:ring-[#800020]"
                                        />
                                        <span className="ml-3 text-sm font-semibold text-[#1C1C1C]">
                                            Cantidad Personalizada
                                        </span>
                                    </label>
                                </div>

                                {paymentOption === "personalizado" && (
                                    <div className="space-y-2 mt-4">
                                        <label className="block text-xs font-semibold text-[#1C1C1C]/70">
                                            Ingresa el importe (mínimo 50 €):
                                        </label>
                                        <div className="relative max-w-[200px]">
                                            <input
                                                type="number"
                                                min={50}
                                                max={remainingBalance}
                                                value={customAmount}
                                                onChange={(e) => setCustomAmount(e.target.value)}
                                                className="block w-full pr-12 pl-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent font-medium"
                                            />
                                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1C1C1C]/65 text-sm pointer-events-none">
                                                €
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={checkoutLoading}
                                className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-md shadow-md text-white bg-[#800020] hover:bg-[#800020]/95 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                {checkoutLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Iniciando Checkout Seguro...
                                    </>
                                ) : (
                                    <>
                                        Proceder al Pago del Plazo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-2">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                            <h4 className="font-serif text-lg font-bold text-green-800">¡Tu viaje está completamente pagado!</h4>
                            <p className="text-sm text-green-700 max-w-lg mx-auto">
                                Hemos recibido el abono íntegro de tus plazas. Nos pondremos en contacto contigo próximamente para ultimar los preparativos del viaje.
                            </p>
                        </div>
                    )}

                    {/* Payment Transactions History table logs */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-[#800020] mb-4">
                            Historial de Pagos Registrados
                        </h4>
                        {session.pagos && session.pagos.length > 0 ? (
                            <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white">
                                <table className="min-w-full divide-y divide-stone-200 text-left text-sm text-[#1C1C1C]">
                                    <thead className="bg-[#FAF9F6] text-[#1C1C1C]/65 text-xs font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Fecha y Hora</th>
                                            <th className="px-4 py-3">Concepto</th>
                                            <th className="px-4 py-3 text-right">Cantidad</th>
                                            <th className="px-4 py-3 text-center">Estado (n8n)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 font-sans">
                                        {session.pagos.map((pago) => (
                                            <tr key={pago.idpago} className="hover:bg-stone-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-[#1C1C1C]/65">
                                                    {pago.fechaPago ? new Date(pago.fechaPago).toLocaleString("es-ES") : "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {pago.descripcionViaje || "Pago fraccionado"}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-[#2E5A44] whitespace-nowrap">
                                                    {(pago.cantidadAbonada ?? 0).toLocaleString("es-ES")} €
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap text-xs">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${pago.procesado === "S" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                                        {pago.procesado === "S" ? "Procesado" : "Pendiente"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-[#1C1C1C]/50 italic">
                                No se ha registrado ningún pago en la base de datos de auditoría todavía.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
