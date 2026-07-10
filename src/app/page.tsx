import fs from "fs";
import path from "path";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import VideoGallery from "@/components/VideoGallery";
import BookingForm from "@/components/BookingForm";
import HeroMedia from "@/components/HeroMedia";

export const dynamic = "force-dynamic";
import {
  Calendar, MapPin, Shield, Compass, FileText, CheckCircle2,
  HelpCircle, Mail, Phone, Clock, Award, Users, Music
} from "lucide-react";

// Server-side helper to check if mp4 videos exist in /public/videos
function checkVideosExist() {
  const publicVideosDir = path.join(process.cwd(), "public", "videos");
  return {
    "itinerario-1": fs.existsSync(path.join(publicVideosDir, "itinerario-1.mp4")),
    "itinerario-2": fs.existsSync(path.join(publicVideosDir, "itinerario-2.mp4")),
    "itinerario-3": fs.existsSync(path.join(publicVideosDir, "itinerario-3.mp4")),
    "itinerario-4": fs.existsSync(path.join(publicVideosDir, "itinerario-4.mp4")),
    "itinerario-5": fs.existsSync(path.join(publicVideosDir, "itinerario-5.mp4")),
    resumen: fs.existsSync(path.join(publicVideosDir, "resumen.mp4")),
  };
}

export default async function Home() {
  const videosExist = checkVideosExist();

  // Database queries for occupancy limits
  let remainingPlazas = 14;
  let totalPaidPlazas = 0;
  try {
    const paidReservations = await prisma.reserva.findMany({
      where: {
        estado: "pagada",
      },
    });
    totalPaidPlazas = paidReservations.reduce((acc: number, curr: { numeroPlazas: number }) => acc + curr.numeroPlazas, 0);
    remainingPlazas = Math.max(0, 14 - totalPaidPlazas);
  } catch (err) {
    console.error("Database query failed inside Home:", err);
  }

  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen selection:bg-[#800020] selection:text-white">
      {/* 1. Header Fijo */}
      <Navbar />

      {/* 2. Hero Section Editorial con Vídeo de Fondo Enmarcado */}
      <section className="relative bg-[#FAF9F6] pt-28 sm:pt-32 pb-10 sm:pb-12 border-b border-[#C5A059]/15 flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#800020_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10 w-full">
          <div className="inline-flex items-center space-x-1.5 text-[8px] sm:text-[9px] tracking-widest text-[#C5A059] uppercase font-bold mb-3">
            <span>Ciclo de conciertos Manuel de Falla</span>
            <span className="text-[#C5A059]/40">•</span>
            <span>Presentación Oficial</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#800020] uppercase leading-[1.1] mb-3 select-none">
            SEVILLA, <span className="text-stone-800 block text-2xl sm:text-4xl md:text-5xl mt-1">Ciudad de la Música</span>
          </h1>

          <p className="font-serif text-xs sm:text-base md:text-lg text-stone-500 max-w-2xl mb-4 sm:mb-5 italic tracking-wide leading-relaxed">
            Viaje alrededor de la boda de Carlos V con Isabel de Portugal (31 de Agosto — 5 de Septiembre de 2026)
          </p>

          {/* Framed Media Block mimicking ccmfalla.com Paintings */}
          <div className="max-w-6xl w-full bg-white p-3.5 sm:p-5 rounded-lg border border-[#C5A059]/25 shadow-xl shadow-[#800020]/5 mb-6 hover:shadow-2xl transition duration-500">
            <HeroMedia />
            {/* Caption in the ccmfalla.com Painting Style */}
            <div className="mt-4 text-center space-y-1 select-none border-t border-[#C5A059]/10 pt-4">
              <p className="font-serif italic font-bold text-[#800020] text-sm sm:text-base">
                "500 Años del Real Enlace"
              </p>
              <p className="tracking-widest uppercase text-[9px] sm:text-[10px] text-stone-500 font-semibold">
                Cortometraje Conmemorativo • Dirección Artística del Ciclo de Conciertos
              </p>
              <p className="text-[9px] text-stone-400">
                Copyright © Ciclo de Conciertos Manuel de Falla. Todos los derechos reservados.
              </p>
            </div>
          </div>

          {/* Call to Actions in Editorial Style */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mt-6">
            <a
              href="#reserva"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-xs font-bold uppercase tracking-widest rounded-md text-white bg-[#800020] hover:bg-[#800020]/95 shadow-md shadow-[#800020]/15 hover:scale-102 transition duration-200"
            >
              Reservar plaza
            </a>
            <a
              href="/docs/programa-sevilla-ciudad-musica.pdf"
              download="programa-sevilla-ciudad-musica.pdf"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-md text-[#800020] hover:text-white bg-white hover:bg-[#800020] shadow-sm hover:scale-102 transition duration-250"
            >
              <FileText className="w-4 h-4 mr-2" />
              Descargar programa PDF
            </a>
          </div>
        </div>

        {/* Scroll indicator - refined */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-stone-400 text-[10px] tracking-widest uppercase flex flex-col items-center gap-1.5 animate-bounce select-none">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 3. Bloque de Confianza / Resumen Rápido */}
      <section id="viaje" className="py-16 bg-white border-y border-[#C5A059]/25 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {/* Card 1 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#C5A059]/20 text-center hover:shadow-md transition">
              <span className="block text-2xl font-serif font-black text-[#800020] mb-1">6 Días</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">5 Noches</span>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#C5A059]/20 text-center hover:shadow-md transition">
              <span className="block text-xl font-serif font-bold text-[#800020] mb-2 leading-none">Eurostars</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">Hotel 4* Premium</span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#C5A059]/20 text-center hover:shadow-md transition">
              <span className="block text-2xl font-serif font-black text-[#800020] mb-1">IRYO</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">Clase Infinita</span>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#C5A059]/20 text-center hover:shadow-md transition">
              <span className="block text-2xl font-serif font-black text-[#800020] mb-1">Exclusivo</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">Recitales y Guía</span>
            </div>

            {/* Card 5 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#C5A059]/20 text-center hover:shadow-md transition">
              <span className="block text-2xl font-serif font-black text-[#800020] mb-1">14 Plazas</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">Máximo de Grupo</span>
            </div>

            {/* Card 6 */}
            <div className="bg-[#FAF9F6] p-5 rounded-lg border border-[#c5a059]/25 text-center hover:shadow-md transition">
              <span className="block text-2xl font-serif font-black text-[#2E5A44] mb-1">1.630 €</span>
              <span className="block text-xs uppercase tracking-widest text-[#1C1C1C]/60 font-semibold">Todo incluido *</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Introducción Emocional */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-mt-24">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-3">
          Sevilla, Ciudad de la Música
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020] mb-8">
          Sevilla, Ciudad de la Música
        </h2>

        <div className="space-y-6 text-base sm:text-lg text-[#1C1C1C]/80 leading-relaxed text-justify sm:text-center">
          <p>
            Si hay una ciudad relacionada con la música, ésa es Sevilla: La polifonía renacentista convirtió a Sevilla en un importante centro musical del siglo XVI. Son decenas las óperas ambientadas en esta ciudad. Su barrio de Triana está considerado una de las cunas del flamenco, y la Alameda de Hércules el punto neurálgico de este arte en las primeras décadas del siglo XX.
          </p>
          <p>
            Y fue aquí, en Sevilla, donde Manuel de Falla (hijo adoptivo de la ciudad) fundó la Orquesta Bética de Cámara en 1923, con la que estrenó, en versión de concierto, su magistral El Retablo de Maese Pedro en el ya desaparecido Teatro San Fernando. Todo esto y mucho más, hizo que Sevilla fuera nombrada Ciudad de la Música por la UNESCO (2006).
          </p>
        </div>

        <blockquote className="mt-12 p-8 border border-[#E9C168] bg-[#E9C168]/5 rounded-xl text-left relative overflow-hidden">
          <span className="absolute -top-10 -left-6 font-serif text-[180px] text-[#E9C168]/15 leading-none select-none">“</span>
          <p className="font-serif italic text-lg sm:text-xl text-[#800020] relative z-10">
            En ningún sitio suenan mejor los aplausos que en Sevilla, una de las ciudades más musicales que conozco.
          </p>
          <cite className="block text-xs uppercase tracking-wider text-[#C5A059] font-bold mt-4 font-sans not-italic">
            — Daniel Barenboim, Director de Orquesta
          </cite>
        </blockquote>
      </section>

      {/* 5. El Eje Histórico del Viaje */}
      <section className="py-24 bg-white border-y border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text description */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block">
                V Centenario Imperial
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#800020]">
                El Enlace Imperial y la Sevilla del Siglo XVI
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#1C1C1C]/75 leading-relaxed">
                <p>
                  En marzo de 1526, Sevilla fue escenario de uno de los acontecimientos políticos y dinásticos más significativos de la Edad Moderna: la boda del Emperador Carlos V con su prima Isabel de Portugal.
                </p>
                <p>
                  Celebrado en el Salón de Embajadores de los Reales Alcázares de Sevilla, este enlace no solo estrechaba lazos de sangre con dispensa papal, sino que conllevaba un importante trasfondo político y económico.
                </p>
                <p>
                  Nuestro itinerario recorre esa Sevilla del siglo XVI, hilando la arquitectura mudéjar con recitales que reviven los cancioneros renacentistas.
                </p>
              </div>
            </div>

            {/* Visual aspect */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-[#C5A059]/30">
              <img
                src="/imagenes/salon_emajadores.jpg"
                alt="Salón de Embajadores en el Real Alcázar de Sevilla"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700"
              />
              {/* Dark red gradient cover at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/95 via-black/20 to-transparent pointer-events-none" />

              {/* Rounded crown overlay style */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-white">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-[#E9C168] bg-[#800020]/60 flex items-center justify-center text-[#E9C168] shadow-md">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l2.5 5.5L20 8.5l-4.5 4 1.5 6-5-3-5 3 1.5-6-4.5-4 5.5-1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">Salón de Embajadores</h4>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-[#E9C168] uppercase font-semibold font-sans mt-0.5">
                    Patio de las Doncellas, Reales Alcázares de Sevilla
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Itinerario Día por Día */}
      <section id="itinerario" className="py-24 bg-[#FAF9F6] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Programa Oficial
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              El Itinerario Musical Detallado
            </h2>
            <p className="text-sm text-[#1C1C1C]/60 mt-3 max-w-xl mx-auto">
              Descubra la planificación meticulosa del viaje, con horarios reales y accesos exclusivos.
            </p>
          </div>

          <ItineraryTimeline videosExist={videosExist} />
        </div>
      </section>

      {/* 7. Experiencias Destacadas */}
      <section className="py-24 bg-white border-y border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Privilegios del Viaje
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#800020]">
              Experiencias Culturales Exclusivas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Block 1 */}
            <div className="text-center p-6 border border-stone-100 rounded-lg hover:border-[#C5A059]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#800020]/10 flex items-center justify-center rounded-full text-[#800020] mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#800020] mb-2">La Sevilla del XVI</h4>
              <p className="text-xs sm:text-sm text-[#1C1C1C]/70 leading-relaxed">
                Descubra la herencia comercial del Archivo de Indias, la azulejería de Triana o el encanto de la Casa de Salinas.
              </p>
            </div>

            {/* Block 2 */}
            <div className="text-center p-6 border border-stone-100 rounded-lg hover:border-[#C5A059]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#800020]/10 flex items-center justify-center rounded-full text-[#800020] mx-auto mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#800020] mb-2">Espacios Singulares</h4>
              <p className="text-xs sm:text-sm text-[#1C1C1C]/70 leading-relaxed">
                Música en directo en el minúsculo CasaLa Teatro de 28 butacas y recital lírico nocturno bajo las estrellas en los Reales Alcázares.
              </p>
            </div>

            {/* Block 3 */}
            <div className="text-center p-6 border border-stone-100 rounded-lg hover:border-[#C5A059]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#800020]/10 flex items-center justify-center rounded-full text-[#800020] mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#800020] mb-2">Gourmet Seleccionado</h4>
              <p className="text-xs sm:text-sm text-[#1C1C1C]/70 leading-relaxed">
                Platos de autor andaluces en Montalván, un taller alfarero del s. XVIII, baños árabes del s. XII y vistas panorámicas espectaculares en Abades Triana.
              </p>
            </div>

            {/* Block 4 */}
            <div className="text-center p-6 border border-stone-100 rounded-lg hover:border-[#C5A059]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#800020]/10 flex items-center justify-center rounded-full text-[#800020] mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#800020] mb-2">Grupo Selecto de 14</h4>
              <p className="text-xs sm:text-sm text-[#1C1C1C]/70 leading-relaxed">
                Una experiencia sumamente íntima y cuidada con acompañamiento experto desde Madrid para asegurar máxima atención al detalle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Galería / Atmósfera Visual */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Atmósfera del Viaje
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#800020]">
              Galería Editorial de Sevilla
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 font-sans">
            {/* Día 1 */}
            <a href="#dia-1" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia1.jpg" alt="Día 1" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 1</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Origen y Llegada a Sevilla</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver itinerario del trayecto &rarr;</p>
              </div>
            </a>

            {/* Día 2 */}
            <a href="#dia-2" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia2.jpg" alt="Día 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 2</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Triana y Tradición del XVI</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver recital y alfarería &rarr;</p>
              </div>
            </a>

            {/* Día 3 */}
            <a href="#dia-3" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia3.jpg" alt="Día 3" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 3</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Reales Alcázares y Wagner</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver concierto privado &rarr;</p>
              </div>
            </a>

            {/* Día 4 */}
            <a href="#dia-4" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia4.jpg" alt="Día 4" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 4</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Barroco y Siglo de Oro</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver Bellas Artes y Salvador &rarr;</p>
              </div>
            </a>

            {/* Día 5 */}
            <a href="#dia-5" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia5.jpg" alt="Día 5" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 5</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Catedral, Giralda y Salinas</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver visita monumental &rarr;</p>
              </div>
            </a>

            {/* Día 6 */}
            <a href="#dia-6" className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl group border border-[#C5A059]/20 block shadow-sm hover:shadow-md transition">
              <img src="/imagenes/dia6.jpg" alt="Día 6" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#800020]/85 group-hover:via-[#800020]/25 group-hover:to-transparent transition duration-350 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E9C168] uppercase mb-1">Día 6</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">Archivo de Indias y Clausura</h4>
                <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">Ver despedida y cena &rarr;</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Sección de Vídeos del itinerario */}
      <section id="videos" className="py-24 bg-white border-y border-[#C5A059]/20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Auditorio Virtual
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              Vídeos del Itinerario
            </h2>
            <p className="text-sm text-[#1C1C1C]/60 mt-3 max-w-xl mx-auto">
              Previsualice artísticamente los diferentes hitos y conciertos que articulan el programa de nuestro viaje.
            </p>
          </div>

          <VideoGallery videosExist={videosExist} />
        </div>
      </section>

      {/* 10. Precio y Plazas */}
      <section id="precios" className="py-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white border border-[#C5A059]/30 rounded-xl p-8 sm:p-12 shadow-xl">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
            Inscripción y Coste
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#800020] mb-6">
            Tarifas y Disponibilidad
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-stone-100 mb-8 font-sans">
            <div>
              <span className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Precio por Persona</span>
              <span className="font-serif text-4xl sm:text-5xl font-black text-[#800020]">1.630 €</span>
              <span className="block text-xs text-stone-400 mt-1">IVA incluido (en habitación doble estándar)</span>
              <span className="block text-[11px] text-stone-400 font-mono">(Base de 1.347 € + 21% IVA)</span>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-stone-150 pt-6 sm:pt-0 sm:pl-8">
              <span className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Suplemento Habitación Individual</span>
              <span className="font-serif text-4xl sm:text-5xl font-black text-[#C5A059]">+260 €</span>
              <span className="block text-xs text-stone-400 mt-1">Sujeto a disponibilidad del Hotel Eurostars 4*</span>
            </div>
          </div>

          <div className="space-y-4 max-w-xl mx-auto text-sm text-[#1C1C1C]/85">
            <div className="flex justify-between items-center sm:px-12">
              <span className="font-semibold text-left">Participantes mínimos requeridos:</span>
              <span className="font-bold text-[#800020]">12 personas</span>
            </div>
            <div className="flex justify-between items-center sm:px-12">
              <span className="font-semibold text-left">Capacidad límite máxima permitida:</span>
              <span className="font-bold text-[#800020]">14 personas</span>
            </div>
            <div className="flex justify-between items-center sm:px-12">
              <span className="font-semibold text-left">Fecha límite de inscripción y pago:</span>
              <span className="font-bold text-[#800020] uppercase">Viernes, 24 de julio de 2026</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 text-xs text-stone-500">
            <p className="italic">
              * Nota: Reserva sujeta a disponibilidad de plazas físicas. El trayecto se confirmará en firme una vez alcanzado el cupo mínimo de 12 personas.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Qué Incluye / Qué No Incluye */}
      <section id="incluye" className="py-24 bg-white border-y border-[#C5A059]/20 scroll-mt-24 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Transparencia y Condiciones
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#800020]">
              Detalle de Coberturas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Column 1 - Qué incluye */}
            <div className="bg-[#FAF9F6] p-8 rounded-xl border border-[#2E5A44]/15">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2E5A44] border-b border-stone-200 pb-3 mb-6 flex items-center">
                ✓ El precio incluye
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#1C1C1C]/80">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Billete tren IRYO Madrid-Sevilla-Madrid en <strong>Clase Infinita</strong> (alta velocidad).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Traslados exclusivos en Sevilla agrupados entre hotel y estación de Santa Justa.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>5 noches de estancia en <strong>Hotel Eurostars Guadalquivir 4*</strong> en régimen de alojamiento y desayuno buffet.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Entradas y visitas guiadas autorizadas a todos los monumentos descritos en el itinerario.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Entradas preferentes para la Gala Wagner en el Teatro de la Maestranza y recitales en Triana/Jardines.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>5 almuerzos incluidos en restaurantes singulares de Sevilla (bebidas y menú cerrado).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Guía acompañante experto durante todo el trayecto desde Madrid Atocha.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span>Servicio de taxis y/o autobuses para trayectos internos estipulados de viaje.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mr-3 mt-0.5" />
                  <span><strong>Seguro médico completo</strong> de asistencia en viaje y cobertura de cancelación.</span>
                </li>
              </ul>
            </div>

            {/* Column 2 - Qué no incluye */}
            <div className="bg-[#FAF9F6] p-8 rounded-xl border border-[#800020]/15">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#800020] border-b border-stone-200 pb-3 mb-6 flex items-center">
                ✗ El precio no incluye
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#1C1C1C]/80">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-[#800020]/10 rounded-full text-[#800020] font-bold text-center flex items-center justify-center shrink-0 mr-3 mt-0.5 text-xs">-</span>
                  <span><strong>Cenas</strong> de todos los días (tiempo a libre disposición de los participantes).</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-[#800020]/10 rounded-full text-[#800020] font-bold text-center flex items-center justify-center shrink-0 mr-3 mt-0.5 text-xs">-</span>
                  <span>Extras de hotel maletería, llamadas, minibar o en el tren AVE/IRYO.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-[#800020]/10 rounded-full text-[#800020] font-bold text-center flex items-center justify-center shrink-0 mr-3 mt-0.5 text-xs">-</span>
                  <span>Cualquier entrada o servicio no debidamente listado en las inclusiones del programa oficial.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 12. Formulario de Reserva */}
      <section id="reserva" className="py-24 bg-[#FAF9F6] scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
              Solicitud de Admisión
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              Inscribirse en el Itinerario
            </h2>
            <p className="text-xs sm:text-sm text-[#1C1C1C]/65 mt-3">
              Actualmente disponemos de <strong className="text-[#800020]">{remainingPlazas} plaza(s) libres</strong> de un cupo de 14.
            </p>
          </div>

          <BookingForm initialAvailablePlazas={remainingPlazas} />
        </div>
      </section>

      {/* 13. Datos Directos de Contacto */}
      <section className="py-24 bg-white border-t border-[#C5A059]/25 text-center font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
            Atención Especializada
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#800020] mb-4">
            ¿Tiene alguna consulta antes de reservar?
          </h2>
          <p className="text-xs sm:text-sm text-[#1C1C1C]/70 max-w-xl mx-auto mb-10">
            Póngase en contacto directamente con la secretaría organizadora del Ciclo de Conciertos Manuel de Falla. Estaremos encantados de resolver sus preguntas sobre el viaje cultural.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm sm:text-base font-semibold">

            <a
              href="mailto:jose_manuel_hdezblanco@hotmail.com"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-[#800020]/20 rounded-md text-[#800020] bg-[#800020]/5 hover:bg-[#800020]/10 transition shadow-sm"
            >
              <Mail className="w-5 h-5 mr-2 text-[#800020]" />
              jose_manuel_hdezblanco@hotmail.com
            </a>

            <a
              href="tel:660957863"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-[#2E5A44]/20 rounded-md text-[#2E5A44] bg-[#2E5A44]/5 hover:bg-[#2E5A44]/10 transition shadow-sm"
            >
              <Phone className="w-5 h-5 mr-2 text-[#2E5A44]" />
              +34 660 957 863
            </a>

          </div>
        </div>
      </section>

      {/* 14. Footer Elegante */}
      <footer className="bg-[#1C1C1C] text-white py-12 font-sans border-t-2 border-[#C5A059]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 border-b border-white/10">

            {/* Left brand column */}
            <div className="text-center md:text-left">
              <h3 className="font-serif text-lg font-bold text-[#E9C168]">
                Sevilla, Ciudad de la Música
              </h3>
              <p className="text-xs text-white/50 mt-1 max-w-sm">
                Organizado en exclusividad por el Ciclo de conciertos Manuel de Falla. Rumbos e ilusiones de 1526 bajo los acordes del s. XVI.
              </p>
            </div>

            {/* Right actions links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <a
                href="/docs/programa-sevilla-ciudad-musica.pdf"
                download="programa-sevilla-ciudad-musica.pdf"
                className="px-4 py-2 border border-white/20 hover:border-[#E9C168] rounded text-white/80 hover:text-[#E9C168] transition"
              >
                Descargar programa PDF
              </a>
              <a
                href="#reserva"
                className="px-4 py-2 bg-[#800020] hover:bg-[#800020]/90 border border-transparent rounded text-white transition"
              >
                Inscribirse al viaje
              </a>
            </div>

          </div>

          {/* Bottom rights info */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>
              © {new Date().getFullYear()} Ciclo de conciertos Manuel de Falla. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <span className="hover:text-white transition cursor-pointer">Inscripción</span>
              <span className="hover:text-white transition cursor-pointer">Privacidad y Cookies</span>
              <span className="hover:text-white transition cursor-pointer">Términos Generales</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
