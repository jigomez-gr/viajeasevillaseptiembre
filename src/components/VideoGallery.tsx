"use client";

import { useState } from "react";
import { Play, Calendar, Film, ArrowRight, ShieldCheck, Compass, Sparkles, MapPin } from "lucide-react";

interface VideoGalleryProps {
    videosExist: {
        "itinerario-1": boolean;
        "itinerario-2": boolean;
        "itinerario-3": boolean;
        "itinerario-4": boolean;
        "itinerario-5": boolean;
        resumen: boolean;
    };
}

interface VideoDetail {
    title: string;
    description: string;
    filePath: string;
    duration?: string;
    subtitle?: string;
}

interface DayItem {
    id: number;
    title: string;
    category: string;
    description: string;
    date: string;
    image: string;
    videos: VideoDetail[];
}

const DAYS_DATA: DayItem[] = [
    {
        id: 1,
        title: "Origen y Llegada a Sevilla",
        category: "ALTA VELOCIDAD IRYO",
        description: "Trayecto premium y llegada a la histórica estación de Santa Justa.",
        date: "31 Ago 2026",
        image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Estación de Sevilla Santa Justa",
                description: "Llegada del tren de alta velocidad Iryo a la estación sevillana.",
                filePath: "/videos_itinerario/dia0/estaciones_santa_justa.mp4"
            }
        ]
    },
    {
        id: 2,
        title: "Triana y Tradición del XVI",
        category: "BARRIO DE ALFAREROS Y RECITAL",
        description: "Mercado de Triana, Parroquia de Santa Ana y concierto en CasaLa.",
        date: "01 Sep 2026",
        image: "https://images.unsplash.com/photo-1608408420657-374e6f823f61?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Recital íntimo en CasaLa Teatro",
                description: "La intimidad acústica idónea en este singular espacio escénico en el corazón del mercado.",
                filePath: "/videos_itinerario/dia1/casala_teatro.mp4"
            },
            {
                title: "Centro de Cerámica de Triana",
                description: "Visita al museo dedicado a salvaguardar y divulgar el arte de la alfarería trianera.",
                filePath: "/videos_itinerario/dia1/centro_ceramica_triana.mp4"
            },
            {
                title: "Mercado de Triana",
                description: "Recorrido sensorial por el histórico mercado erigido sobre las ruinas del Castillo de San Jorge.",
                filePath: "/videos_itinerario/dia1/mercado_triana.mp4"
            },
            {
                title: "Real Parroquia de Santa Ana",
                description: "Historia del templo mudéjar fundado por el rey Alfonso X en el siglo XIII.",
                filePath: "/videos_itinerario/dia1/parroquia_santa_ana.mp4"
            },
            {
                title: "Recital Lírico: Silva de Sirenas",
                description: "Dezid como puede ser - Pieza interpretada por Cristina Bayón y Mariluz Martínez.",
                filePath: "/videos_itinerario/dia1/silva_de_sirenas.mp4"
            }
        ]
    },
    {
        id: 3,
        title: "Real Alcázar y Concierto de Cámara",
        category: "PALACIOS MUDÉJARES Y WAGNER",
        description: "Salones imperiales, yeserías andalusíes y orquesta barroca.",
        date: "02 Sep 2026",
        image: "https://images.unsplash.com/photo-1598091469032-47528e578c79?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Visita Monumental al Real Alcázar",
                description: "Vistas espectaculares y detalles ornamentales del conjunto mudéjar activo más antiguo.",
                filePath: "/videos_itinerario/dia2/real_alcazar.mp4"
            },
            {
                title: "The Bayreuther Festspielhaus: Orchester",
                description: "Videoguide of the Richard Wagner Bayreuther Festspielhaus.",
                filePath: "/videos_itinerario/dia2/hero_nuevo_final.mp4"
            }
        ]
    },
    {
        id: 4,
        title: "Museo de Bellas Artes y Salvando el Oro",
        category: "BARROCO SEVILLANO Y LECTURAS",
        description: "Cinco siglos de la boda real, pinacoteca nacional y el Divino Salvador.",
        date: "03 Sep 2026",
        image: "https://images.unsplash.com/photo-1582555762489-7f480adbb3e8?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Conmemoración del V Centenario",
                description: "Charla e introducción histórica a la boda entre el Emperador Carlos V y la Emperatriz Isabel en 1526.",
                filePath: "/videos_itinerario/dia3/boda_imperial_500.mp4"
            },
            {
                title: "Museo de Bellas Artes de Sevilla",
                description: "Recorrido por los claustros y las deslumbrantes visiones pictóricas barrocas de España.",
                filePath: "/videos_itinerario/dia3/bellas_artes.mp4"
            },
            {
                title: "Iglesia Colegial del Divino Salvador",
                description: "La segunda mayor basílica de la urbe hispalense, joya del arte manierista barroco.",
                filePath: "/videos_itinerario/dia3/divino_salvador.mp4"
            }
        ]
    },
    {
        id: 5,
        title: "Catedral, Giralda y Casa de Salinas",
        category: "SACRO IMPERIAL Y LÍRICA",
        description: "Gótico majestuoso, patios patricios de Salinas y música de Álex Pernas.",
        date: "04 Sep 2026",
        image: "https://images.unsplash.com/photo-1563297122-be16c3cb1b0e?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Palacio Casa de Salinas",
                description: "Recorrido por el patio principal de columnas de mármol y mosaicos romanos del palacio privado.",
                filePath: "/videos_itinerario/dia4/casa_salinas.mp4"
            },
            {
                title: "Catedral de Sevilla y Ascenso a la Giralda",
                description: "Vistas aéreas espectaculares de Sevilla tras ascender las rampas de la célebre torre campanario.",
                filePath: "/videos_itinerario/dia4/catedral_giralda.mp4"
            },
            {
                title: "Jardines y Laberintos del Real Alcázar",
                description: "Los famosos setos de arrayanes, fuentes y pabellón imperial de los jardines reales.",
                filePath: "/videos_itinerario/dia4/jardines_alcazar.mp4"
            },
            {
                title: "Toccata Arpeggiata - Álex Pernas",
                description: "Interpretación acústica con guitarra barroca de la célebre pieza de Giovanni Girolamo Kapsberger.",
                filePath: "/videos_itinerario/dia4/toccata_arpeggiata.mp4"
            },
            {
                title: "Recital Lírico: Mariví Blasco & Javier Somoza",
                description: "Parlami pur sincero de Francesco Carulli, interpretado con guitarra y soprano en directo.",
                filePath: "/videos_itinerario/dia4/marivi_blasco_javier_somoza.mp4"
            }
        ]
    },
    {
        id: 6,
        title: "Archivo de Indias y Despedida",
        category: "DOCUMENTOS HISTÓRICOS Y CLAUSURA",
        description: "Cuentas del Nuevo Mundo, Nao Victoria y cena de gala.",
        date: "05 Sep 2026",
        image: "https://images.unsplash.com/photo-1570155316334-0fe92348574a?q=80&w=800&auto=format&fit=crop",
        videos: [
            {
                title: "Archivo General de Indias",
                description: "Exploración del emblemático edificio renacentista que atesora mapas y manuscritos históricos de América.",
                filePath: "/videos_itinerario/dia5/archivo_indias.mp4"
            },
            {
                title: "Réplica Monumental Nao Victoria",
                description: "Espacio expositivo flotante dedicado a la mayor aventura marítima de la historia.",
                filePath: "/videos_itinerario/dia5/nao_victoria.mp4"
            },
            {
                title: "Cena de Clausura en Abades Triana",
                description: "Despedida gastronómica del grupo junto a las majestuosas vistas del río Guadalquivir iluminado.",
                filePath: "/videos_itinerario/dia5/abades_triana.mp4"
            }
        ]
    }
];

export default function VideoGallery({ videosExist }: VideoGalleryProps) {
    const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
    const [playingVideoPath, setPlayingVideoPath] = useState<string | null>(null);
    const [galleryMediaTypes, setGalleryMediaTypes] = useState<{ [key: string]: "completo" | "resumen" }>({});

    const activeDay = DAYS_DATA.find(d => d.id === selectedDayId);

    const handlePlayVideo = (filePath: string) => {
        setPlayingVideoPath(filePath);
    };

    return (
        <div className="space-y-12">
            {/* GRID OF DAY SELECTOR CARDS - Style mimicking ccmfalla.com interpreter list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {DAYS_DATA.map((day) => {
                    const isSelected = selectedDayId === day.id;
                    return (
                        <div
                            key={day.id}
                            onClick={() => {
                                setSelectedDayId(isSelected ? null : day.id);
                                setPlayingVideoPath(null);
                            }}
                            className={`relative aspect-[4/3] md:aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-md border focus:outline-none transition-all duration-300 ${isSelected
                                ? "border-[#800020] ring-4 ring-[#800020]/15"
                                : "border-[#C5A059]/25 hover:border-[#800020]/50"
                                }`}
                        >
                            {/* Card Background Image */}
                            <img
                                src={day.image}
                                alt={day.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* ccmfalla.com Interpreter Mask Overlay */}
                            <div className="absolute inset-0 bg-black/45 group-hover:bg-[#800020]/65 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                                {/* Title */}
                                <h5 className="text-[17px] sm:text-[19px] font-bold text-white tracking-wide leading-snug drop-shadow-sm">
                                    {day.title}
                                </h5>

                                {/* Subtitle / Category Label: Montserrat gold uppercase style */}
                                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E9C168] mt-1.5 uppercase select-none">
                                    {day.category}
                                </span>

                                {/* Italic serif description/details count */}
                                <p className="text-[12px] sm:text-[13px] italic text-[#FAF9F6]/95 mt-2 font-serif font-light max-w-[280px]">
                                    {day.videos.length} {day.videos.length === 1 ? "vídeo disponible" : "vídeos disponibles"}
                                </p>

                                {/* Date */}
                                <span className="text-[10px] text-stone-300 font-sans tracking-wide mt-2.5 opacity-85 select-none">
                                    {day.date}
                                </span>

                                {/* Rounded Circle Play Action Indicator */}
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="w-9 h-9 rounded-full border border-white/50 flex flex-col items-center justify-center bg-black/10 group-hover:bg-[#800020]/90 group-hover:scale-110 shadow-md transition-all duration-300">
                                        <svg className={`w-3.5 h-3.5 fill-current text-white transition duration-300 ${isSelected ? 'rotate-90' : 'translate-x-[0.5px]'}`} viewBox="0 0 24 24">
                                            {isSelected ? (
                                                <path d="M19 13H5v-2h14v2z" />
                                            ) : (
                                                <path d="M8 5v14l11-7z" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* EXPANDED DAY VIDEOS CONTAINER (Collapsible Accordion layout under the selector row) */}
            {activeDay && (
                <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#800020]/5 animate-fadeIn space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#C5A059]/20 pb-4">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">
                                Auditorio Digital • Día {activeDay.id} ({activeDay.date})
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] mt-1">
                                {activeDay.title}
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedDayId(null);
                                setPlayingVideoPath(null);
                            }}
                            className="text-xs font-semibold text-[#800020] hover:text-[#C5A059] transition uppercase tracking-wider mt-3 sm:mt-0"
                        >
                            Cerrar galería del día
                        </button>
                    </div>

                    {/* Videos Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {activeDay.videos.map((vid, idx) => {
                            const isPlaying = playingVideoPath === vid.filePath;
                            const videoKey = `${activeDay.id}-${idx}`;
                            const mediaType = galleryMediaTypes[videoKey] || "completo";
                            const videoSrc = mediaType === "resumen" ? vid.filePath.replace(".mp4", "_resumen.mp4") : vid.filePath;

                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                                >
                                    {/* Dual Player Toggle Switch */}
                                    <div className="flex border-b border-stone-100 bg-[#FAF9F6] text-xs">
                                        <button
                                            onClick={() => setGalleryMediaTypes(prev => ({ ...prev, [videoKey]: "completo" }))}
                                            className={`flex-1 py-2 text-center font-bold tracking-wider uppercase transition ${mediaType === "completo" ? "bg-[#800020] text-white" : "text-stone-600 hover:bg-[#800020]/10"
                                                }`}
                                        >
                                            ▶ Vídeo Completo
                                        </button>
                                        <button
                                            onClick={() => setGalleryMediaTypes(prev => ({ ...prev, [videoKey]: "resumen" }))}
                                            className={`flex-1 py-2 text-center font-bold tracking-wider uppercase transition ${mediaType === "resumen" ? "bg-[#800020] text-white" : "text-stone-600 hover:bg-[#800020]/10"
                                                }`}
                                        >
                                            ⏱ Resumen Corto
                                        </button>
                                    </div>

                                    {/* Video Player Display */}
                                    <div className="relative aspect-video bg-[#1C1C1C] flex items-center justify-center border-b border-stone-100">
                                        {isPlaying ? (
                                            <video
                                                key={videoSrc}
                                                src={videoSrc}
                                                controls
                                                autoPlay
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => handlePlayVideo(vid.filePath)}
                                                className="relative w-full h-full cursor-pointer group"
                                            >
                                                {/* Mini Overlay Cover with Day Photo */}
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-[#800020]/25 transition duration-300" />
                                                <img
                                                    src={activeDay.image}
                                                    alt={vid.title}
                                                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.9] transition"
                                                />

                                                {/* Centered Play Button */}
                                                <button
                                                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#800020]/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all border border-[#E9C168]"
                                                    aria-label={`Reproducir ${vid.title}`}
                                                >
                                                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                                                </button>

                                                {/* Play Call to Action Label */}
                                                <div className="absolute bottom-3 left-3 bg-stone-950/80 px-2 py-0.5 rounded text-[10px] text-white border border-white/10 uppercase tracking-widest font-bold">
                                                    Reproducir {mediaType === "resumen" ? "Resumen" : "Fragmento"}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video metadata */}
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-serif text-base sm:text-lg font-bold text-[#800020] mb-2">
                                                {vid.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-[#1C1C1C]/75 leading-relaxed">
                                                {vid.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
