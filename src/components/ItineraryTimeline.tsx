"use client";

import { useState, useEffect } from "react";
import { Music, MapPin, Calendar, Clock, Utensils, CheckCircle } from "lucide-react";

interface TimelineDay {
    id: number;
    date: string;
    dayName: string;
    title: string;
    desc: string;
    events: {
        time?: string;
        title: string;
        description: string;
        type: "visit" | "concert" | "meal" | "transport";
        venue?: string;
    }[];
}

const ITIN_DATA: TimelineDay[] = [
    {
        id: 1,
        date: "31 Ago",
        dayName: "Lunes, 31 de agosto de 2026",
        title: "Encuentro y llegada a Sevilla",
        desc: "Comienzo de nuestra travesía cultural desde Madrid hacia la capital hispalense",
        events: [
            {
                time: "18:15 h",
                title: "Punto de encuentro en Madrid",
                description: "Estación Puerta de Atocha en Madrid, encuentro con el guía acompañante",
                type: "transport",
                venue: "Estación de Puerta de Atocha, Madrid",
            },
            {
                time: "19:05 h",
                title: "Salida en tren IRYO (Clase Infinita)",
                description: "Viaje de alta velocidad. Disfrute del confort de clase Infinita hasta el sur de España.",
                type: "transport",
            },
            {
                time: "21:44 h",
                title: "Llegada a Sevilla y traslado",
                description: "Arribo a la Estación de Santa Justa. Traslado al hotel Eurostars Guadalquivir.",
                type: "visit",
                venue: "Sevilla (Estación Santa Justa / Hotel)",
            },
            {
                title: "Alojamiento en Eurostars Guadalquivir 4*",
                description: "Estancia confortable durante las cinco noches del viaje con servicio de desayuno buffet incluido.",
                type: "meal",
                venue: "Hotel Eurostars Guadalquivir 4*",
            },
        ],
    },
    {
        id: 2,
        date: "1 Sep",
        dayName: "Martes, 1 de septiembre de 2026",
        title: "Paseo por Triana y recital semi-privado.",
        desc: "Visita exhaustiva del popular barrio, célebre por el toreo, el flamenco y la cerámica (además de su río). Concierto exclusivo de música española del s. XVI",
        events: [
            {
                time: "09:30 h",
                title: "Descubrimiento de Triana y Parroquia de Santa Ana",
                description: "Visita guiada a la Real Parroquia de Santa Ana (estilo gótico-mudéjar, mandada construir por Alfonso X el Sabio) y paseo por sus callejas llenas de historia.",
                type: "visit",
                venue: "Real Parroquia de Santa Ana, Triana",
            },
            {
                time: "11:30 h",
                title: "Centro de Cerámica de Triana",
                description: "Conoceremos el Centro de Cerámica de Triana, un bello museo convertido en el máximo representante de lo que fue la Triana alfarera de épocas pasadas.",
                type: "visit",
                venue: "Centro de Cerámica de Triana",
            },
            {
                time: "13:30 h",
                title: "Almuerzo en Restaurante Montalván",
                description: "Almuerzo en el Restaurante Montalván, una antigua fábrica de cerámica situado en pleno barrio.",
                type: "meal",
                venue: "Restaurante Montalván, Triana",
            },
            {
                time: "20:00 h",
                title: "Regreso a Triana / CasaLa Teatro",
                description: "Paseo nocturno hacia el Mercado de Triana que alberga una joya cultural: el diminuto CasaLa Teatro de tan solo 28 butacas.",
                type: "visit",
                venue: "Mercado de Triana",
            },
            {
                time: "20:30 h",
                title: "Recital: 'El Legado de Carlos V'",
                description: "Gran concierto a cargo del dúo Silva de Sirenas (Cristina Bayón, soprano; Mª Luz Martínez Pérez, laúd renacentista). Un repertorio exquisito centrado en la música cortesana renacentista del siglo XVI.",
                type: "concert",
                venue: "CasaLa Teatro (Exclusivo para el grupo)",
            },
        ],
    },
    {
        id: 3,
        date: "2 Sep",
        dayName: "Miércoles, 2 de septiembre de 2026",
        title: "La Boda Real en el Alcázar y Gala Wagner nocturna",
        desc: "Visita al majestuoso palacio real de Sevilla con foco en el enlace imperial de 1526, seguido de una velada de ópera en el Maestranza.",
        events: [
            {
                time: "10:30 h",
                title: "Visita Histórica al Real Alcázar",
                description: "Visita monumental detenida centrada en el Salón de Embajadores, donde tuvo lugar la legendaria boda de Carlos V con Isabel de Portugal, recorriendo sus palacios y patios ornamentados.",
                type: "visit",
                venue: "Reales Alcázares de Sevilla",
            },
            {
                time: "14:00 h",
                title: "Almuerzo en la Bodega del S. XVIII",
                description: "Almuerzo de cocina tradicional andaluza en un antiguo lagar de Triana con marcado sabor árabe y alfarero.",
                type: "meal",
                venue: "Bodega del S. XVIII, Triana",
            },
            {
                time: "19:15 h",
                title: "Acomodación en el Teatro de la Maestranza",
                description: "Paseo a pie hasta el coliseo de la ópera sevillano a orillas del Guadalquivir.",
                type: "transport",
                venue: "Teatro de la Maestranza",
            },
            {
                time: "20:00 h",
                title: "Concierto: 'Gala Wagner' (Festival de Bayreuth)",
                description: "Asistencia preferente a la Gala Wagner con un programa dedicado a la tetralogía 'El Anillo del Nibelungo'. A cargo de la Orquesta del Festival de Bayreuth dirigida por Pablo Heras-Casado. Solistas: Catherine Foster (Brünnhilde), Klaus Florian Vogt (Siegmund/Siegfried) y Nicholas Brownlee (Wotan).",
                type: "concert",
                venue: "Teatro de la Maestranza",
            },
        ],
    },
    {
        id: 4,
        date: "3 Sep",
        dayName: "Jueves, 3 de septiembre de 2026",
        title: "Bellas Artes, Divino Salvador y Visita Teatralizada nocturna",
        desc: "Inmersión plástica y barroca por la mañana, y una dramatización viva del romance imperial dentro del Alcázar de noche.",
        events: [
            {
                time: "09:30 h",
                title: "Museo de Bellas Artes",
                description: "Visita a uno de los museos de pintura más relevantes de España, antiguo convento de la Merced Calzada, albergando cumbres del barroco como Murillo o Valdés Leal.",
                type: "visit",
                venue: "Museo de Bellas Artes de Sevilla",
            },
            {
                time: "12:15 h",
                title: "Iglesia Colegial del Divino Salvador",
                description: "Recorrido por este monumental templo barroco, construido sobre restos de la mezquita mayor omeya del siglo IX.",
                type: "visit",
                venue: "Iglesia del Salvador",
            },
            {
                time: "13:30 h",
                title: "Almuerzo en Restaurante La Quinta",
                description: "Almuerzo en una señorial casa-palacio sevillana de principios del siglo XX, disfrutando de cocina de autor andaluza.",
                type: "meal",
                venue: "Restaurante La Quinta",
            },
            {
                time: "20:30 h",
                title: "Traslado al Real Alcázar",
                description: "Paseo de acceso nocturno para vivir el palacio iluminado en la más absoluta intimidad.",
                type: "transport",
            },
            {
                time: "21:00 h",
                title: "Teatro Nocturno: Visita Teatralizada de la Boda de Carlos V",
                description: "Representación teatralizada exclusiva en las dependencias imperiales del Alcázar, reviviendo el encuentro y boda de Carlos V e Isabel de Portugal. Con guion original del dramaturgo Alfonso Zurro a cargo de la compañía Teatro Clásico de Sevilla.",
                type: "concert",
                venue: "Real Alcázar de Sevilla",
            },
        ],
    },
    {
        id: 5,
        date: "4 Sep",
        dayName: "Viernes, 4 de septiembre de 2026",
        title: "Esplendor de Salinas, Catedral y Romance Imperial",
        desc: "Visita a palacios del renacimiento, la catedral gótica más grande del mundo y un recital lírico en los jardines del Alcázar.",
        events: [
            {
                time: "10:00 h",
                title: "Visita a la Casa de Salinas",
                description: "Descubrimiento de esta joya renacentista del siglo XVI, residencia privada dotada de patios con arquerías, azulejería única y columnas de mármol de Carrara.",
                type: "visit",
                venue: "Casa de Salinas",
            },
            {
                time: "11:00 h",
                title: "Catedral de Sevilla e Hito de la Giralda",
                description: "Recorrido exhaustivo por la monumental catedral de Sevilla. La subida a la Giralda a través de sus 34 rampas históricas es voluntaria y proporciona vistas aéreas inolvidables.",
                type: "visit",
                venue: "Catedral de Sevilla",
            },
            {
                time: "13:30 h",
                title: "Almuerzo en Restaurante San Marco",
                description: "Almuerzo en el singular establecimiento enclavado de forma única dentro de las bóvedas de unos baños árabes del siglo XII excelentemente conservados.",
                type: "meal",
                venue: "Restaurante San Marco (Santa Cruz)",
            },
            {
                time: "21:45 h",
                title: "Traslado a los Jardines imperiales",
                description: "Acceso nocturno especial a los Jardines de los Reales Alcázares de Sevilla.",
                type: "transport",
            },
            {
                time: "22:30 h",
                title: "Recital Lírico: 'Un Romance Imperial'",
                description: "Concierto bajo las estrellas por la aclamada soprano Mariví Blasco y el guitarrista barroco Álex Pernas. Programa temático dividido en: I. Lo Divino y lo Solemne; II. El Amor y la Tradición de la Tierra; III. La Fiesta y el Alborozo. Evocando la boda real de 1526.",
                type: "concert",
                venue: "Jardines de los Reales Alcázares",
            },
        ],
    },
    {
        id: 6,
        date: "5 Sep",
        dayName: "Sábado, 5 de septiembre de 2026",
        title: "El Puerto de América y Retorno a Madrid",
        desc: "Detalle del comercio indiano en el Archivo de Indias, almuerzo con vistas panorámicas al río Guadalquivir y regreso en tren.",
        events: [
            {
                time: "10:15 h",
                title: "El Archivo General de Indias",
                description: "Visita al edificio renacentista diseñado por Juan de Herrera que custodia la crónica escrita del Descubrimiento y comercio español con el Nuevo Mundo.",
                type: "visit",
                venue: "Archivo de Indias",
            },
            {
                time: "11:30 h",
                title: "Centro de Visitantes y Réplica de la Nao Victoria",
                description: "Descubrimiento de la historia de la primera vuelta al mundo capitaneada por Magallanes y Elcano, subiendo a bordo de la réplica histórica de la Nao Victoria a orillas del Guadalquivir.",
                type: "visit",
                venue: "Muelle de las Delicias (Río Guadalquivir)",
            },
            {
                time: "13:30 h",
                title: "Almuerzo de Clausura en Abades Triana",
                description: "Almuerzo de despedida en este galardonado restaurante acristalado sobre las aguas del río, con vistas inigualables a la Torre del Oro y el perfil histórico sevillano.",
                type: "meal",
                venue: "Restaurante Abades Triana",
            },
            {
                time: "15:30 h",
                title: "Tiempo libre y compras",
                description: "Tarde dedicada a paseos personales, recuerdos o descanso previo a la salida.",
                type: "visit",
            },
            {
                time: "19:30 h",
                title: "Traslado a la Estación Santa Justa",
                description: "Salida del hotel hacia la estación para tomar la correspondencia de alta velocidad.",
                type: "transport",
            },
            {
                time: "20:28 h",
                title: "Tren de retorno IRYO a Madrid",
                description: "Regreso a Madrid de nuevo en clase Infinita. Llegada programada a las 23:12 h a Madrid Puerta de Atocha y fin de servicios.",
                type: "transport",
                venue: "Tren IRYO / Madrid Atocha",
            },
        ],
    },
];

interface ItineraryTimelineProps {
    videosExist: {
        "itinerario-1": boolean;
        "itinerario-2": boolean;
        "itinerario-3": boolean;
        "itinerario-4": boolean;
        "itinerario-5": boolean;
        resumen: boolean;
    };
}

const DAY_THUMBNAILS: { [key: number]: { src: string; caption: string } } = {
    1: {
        src: "https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=800&auto=format&fit=crop",
        caption: "Estación de Atocha Madrid - Salida en Tren IRYO"
    },
    2: {
        src: "https://images.unsplash.com/photo-1608408420657-374e6f823f61?q=80&w=800&auto=format&fit=crop",
        caption: "Puente de Isabel II (Triana) y Orillas del Río Guadalquivir"
    },
    3: {
        src: "https://images.unsplash.com/photo-1598091469032-47528e578c79?q=80&w=800&auto=format&fit=crop",
        caption: "Salón de Embajadores del Real Alcázar e Interiores Mudéjares"
    },
    4: {
        src: "https://images.unsplash.com/photo-1582555762489-7f480adbb3e8?q=80&w=800&auto=format&fit=crop",
        caption: "Pinturas Barrocas y Claustro del Museo de Bellas Artes"
    },
    5: {
        src: "https://images.unsplash.com/photo-1563297122-be16c3cb1b0e?q=80&w=800&auto=format&fit=crop",
        caption: "La Giralda sobresaliendo en el perfil de la Catedral de Sevilla"
    },
    6: {
        src: "https://images.unsplash.com/photo-1570155316334-0fe92348574a?q=80&w=800&auto=format&fit=crop",
        caption: "Torre del Oro y réplica de la Nao Victoria en el Muelle de las Delicias"
    }
};

const DAY_OVERLAY_DETAILS: { [key: number]: { title: string; category: string; description: string; date: string } } = {
    1: {
        title: "Origen y Salida desde Madrid",
        category: "TRAYECTO DE ALTA VELOCIDAD",
        description: "Salida en Tren IRYO con destino Sevilla",
        date: "31 Ago 2026"
    },
    2: {
        title: "Tríptico de Canciones Sevillanas",
        category: "RECITAL DE VIOLONCHELO Y PIANO",
        description: "Ciclo Wagner & Falla: Obras selectas de cámara",
        date: "01 Sep 2026"
    },
    3: {
        title: "Evocación en los Reales Alcázares",
        category: "CONCIERTO DE CÁMARA PRIVADO",
        description: "Recital Lírico: Delicias mudéjares e hispanas",
        date: "02 Sep 2026"
    },
    4: {
        title: "Paseo del Siglo de Oro",
        category: "VISITA CULTURAL Y NOCTURNA",
        description: "Museo de Bellas Artes, Divino Salvador y leyendas",
        date: "03 Sep 2026"
    },
    5: {
        title: "Grandeza Gótica y Órgano Sacro",
        category: "MÚSICA SACRA E HISTORIA",
        description: "Visita a la Catedral, Giralda y Palacio de Salinas",
        date: "04 Sep 2026"
    },
    6: {
        title: "El Guadalquivir y la Nao Victoria",
        category: "CLAUSURA CINEMATOGRÁFICA",
        description: "Muelle de las Delicias y el Sueño de Magallanes",
        date: "05 Sep 2026"
    }
};

const ITINERARY_VIDEOS: { [key: number]: { title: string; filePath: string }[] } = {
    1: [
        { title: "Estación Santa Justa", filePath: "/videos_itinerario/dia0/estaciones_santa_justa.mp4" }
    ],
    2: [
        { title: "CasaLa Teatro", filePath: "/videos_itinerario/dia1/casala_teatro.mp4" },
        { title: "Centro Cerámica", filePath: "/videos_itinerario/dia1/centro_ceramica_triana.mp4" },
        { title: "Mercado Triana", filePath: "/videos_itinerario/dia1/mercado_triana.mp4" },
        { title: "Parroquia Santa Ana", filePath: "/videos_itinerario/dia1/parroquia_santa_ana.mp4" },
        { title: "Silva de Sirenas", filePath: "/videos_itinerario/dia1/silva_de_sirenas.mp4" }
    ],
    3: [
        { title: "Heras-Casado Mendelssohn", filePath: "/videos_itinerario/dia2/heras_casado_mendelssohn.mp4" },
        { title: "Real Alcázar", filePath: "/videos_itinerario/dia2/real_alcazar.mp4" }
    ],
    4: [
        { title: "Bellas Artes", filePath: "/videos_itinerario/dia3/bellas_artes.mp4" },
        { title: "Boda Imperial", filePath: "/videos_itinerario/dia3/boda_imperial_500.mp4" },
        { title: "Divino Salvador", filePath: "/videos_itinerario/dia3/divino_salvador.mp4" }
    ],
    5: [
        { title: "Casa Salinas", filePath: "/videos_itinerario/dia4/casa_salinas.mp4" },
        { title: "Catedral y Giralda", filePath: "/videos_itinerario/dia4/catedral_giralda.mp4" },
        { title: "Jardines Alcázar", filePath: "/videos_itinerario/dia4/jardines_alcazar.mp4" },
        { title: "Mariví Blasco & Somoza", filePath: "/videos_itinerario/dia4/marivi_blasco_javier_somoza.mp4" },
        { title: "Toccata Arpeggiata", filePath: "/videos_itinerario/dia4/toccata_arpeggiata.mp4" }
    ],
    6: [
        { title: "Abades Triana", filePath: "/videos_itinerario/dia5/abades_triana.mp4" },
        { title: "Archivo de Indias", filePath: "/videos_itinerario/dia5/archivo_indias.mp4" },
        { title: "Nao Victoria", filePath: "/videos_itinerario/dia5/nao_victoria.mp4" }
    ]
};


export default function ItineraryTimeline({ videosExist }: ItineraryTimelineProps) {
    const [activeVideoIndexes, setActiveVideoIndexes] = useState<{ [key: number]: number }>({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    });
    const [timelineMediaTypes, setTimelineMediaTypes] = useState<{ [key: number]: "completo" | "resumen" }>({
        1: "completo", 2: "completo", 3: "completo", 4: "completo", 5: "completo", 6: "completo"
    });

    const [activeDay, setActiveDay] = useState(1);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith("#dia-")) {
                const dayNum = parseInt(hash.replace("#dia-", ""), 10);
                if (dayNum >= 1 && dayNum <= 6) {
                    setActiveDay(dayNum);
                    setTimeout(() => {
                        const el = document.getElementById("itinerario");
                        if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }, 80);
                }
            }
        };

        handleHashChange();

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);
    const [selectedModes, setSelectedModes] = useState<{ [key: number]: "summary" | "video" }>({
        1: "summary",
        2: "summary",
        3: "summary",
        4: "summary",
        5: "summary",
        6: "summary"
    });

    const currentMode = selectedModes[activeDay] || "summary";

    const setMode = (dayId: number, mode: "summary" | "video") => {
        setSelectedModes(prev => ({ ...prev, [dayId]: mode }));
    };

    const getVideoKey = (dayId: number): keyof ItineraryTimelineProps["videosExist"] => {
        if (dayId === 6) return "resumen";
        return `itinerario-${dayId}` as any;
    };

    const getVideoPath = (dayId: number): string => {
        if (dayId === 6) return "/videos/resumen.mp4";
        return `/videos/itinerario-${dayId}.mp4`;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Mobile Day Selector (Horizontal Scroll) */}
            <div className="flex sm:hidden overflow-x-auto pb-4 gap-2 scrollbar-none px-4 mb-4">
                {ITIN_DATA.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => {
                            setActiveDay(day.id);
                        }}
                        className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full border transition-all ${activeDay === day.id
                            ? "bg-[#800020] text-white border-[#800020]"
                            : "bg-white text-[#1C1C1C]/75 border-stone-200"
                            }`}
                    >
                        Día {day.id} ({day.date})
                    </button>
                ))}
            </div>

            {/* Desktop Day Selector (Tabs) */}
            <div className="hidden sm:flex justify-between border-b border-[#C5A059]/30 mb-8 px-4 sm:px-0">
                {ITIN_DATA.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => {
                            setActiveDay(day.id);
                        }}
                        className={`pb-4 px-2 text-center border-b-2 text-sm transition-all focus:outline-none ${activeDay === day.id
                            ? "border-[#800020] text-[#800020] font-bold"
                            : "border-transparent text-[#1C1C1C]/60 hover:text-[#800020]"
                            }`}
                    >
                        <span className="block font-serif text-lg">Día {day.id}</span>
                        <span className="block text-xs uppercase tracking-widest mt-1 font-semibold">{day.date}</span>
                    </button>
                ))}
            </div>

            {/* Selected Day Content with Split Layout */}
            {ITIN_DATA.map((day) => {
                if (day.id !== activeDay) return null;

                const videoKey = getVideoKey(day.id);
                const hasVideo = videosExist?.[videoKey];
                const thumb = DAY_THUMBNAILS[day.id];

                return (
                    <div key={day.id} className="animate-fadeIn grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0 items-start">

                        {/* LEFT COLUMN: Vertical event timeline (col-span-7) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Day Header */}
                            <div className="border-l-4 border-[#800020] pl-4 sm:pl-6 py-1 bg-gradient-to-r from-[#FAF9F6] to-transparent rounded-r-md">
                                <span className="text-[#C5A059] font-serif italic text-sm uppercase tracking-wider block">
                                    {day.dayName}
                                </span>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                                    {day.title}
                                </h3>
                                <p className="text-stone-600 mt-2 text-sm italic leading-relaxed">
                                    "{day.desc}"
                                </p>
                            </div>

                            {/* Events Vertical Timeline */}
                            <div className="relative border-l border-stone-200 ml-4 pl-6 sm:pl-8 py-3 space-y-6">
                                {day.events.map((evt, index) => (
                                    <div key={index} className="relative">
                                        {/* Timeline Dot Indicator */}
                                        <span className={`absolute -left-[37px] sm:-left-[41px] top-1.5 flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white transition-all ${evt.type === "concert"
                                            ? "border-[#800020] text-[#800020] shadow-md ring-4 ring-[#800020]/10"
                                            : evt.type === "meal"
                                                ? "border-[#2E5A44] text-[#2E5A44]"
                                                : evt.type === "transport"
                                                    ? "border-[#C5A059] text-[#C5A059]"
                                                    : "border-stone-400 text-stone-600"
                                            }`}>
                                            {evt.type === "concert" ? (
                                                <Music className="w-3.5 h-3.5 animate-pulse" />
                                            ) : evt.type === "meal" ? (
                                                <Utensils className="w-3.5 h-3.5" />
                                            ) : (
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            )}
                                        </span>

                                        {/* Event Details Card */}
                                        <div className={`p-4 rounded-lg border transition duration-200 ${evt.type === "concert"
                                            ? "bg-[#800020]/5 border-[#800020]/20 shadow-md shadow-[#800020]/5"
                                            : evt.type === "meal"
                                                ? "bg-[#2E5A44]/5 border-[#2E5A44]/15"
                                                : "bg-white border-stone-150 hover:border-[#C5A059]/30"
                                            }`}>
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {evt.time && (
                                                        <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {evt.time}
                                                        </span>
                                                    )}
                                                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${evt.type === "concert"
                                                        ? "bg-[#800020]/15 text-[#800020]"
                                                        : evt.type === "meal"
                                                            ? "bg-[#2E5A44]/10 text-[#2E5A44]"
                                                            : evt.type === "transport"
                                                                ? "bg-[#C5A059]/15 text-[#C5A059]"
                                                                : "bg-stone-100 text-stone-600"
                                                        }`}>
                                                        {evt.type === "concert" ? "Música / Recital" : evt.type === "meal" ? "Gastronomía" : evt.type === "transport" ? "Trayecto" : "Visita Cultural"}
                                                    </span>
                                                </div>

                                                {evt.venue && (
                                                    <span className="inline-flex items-center text-xs text-[#1C1C1C]/65 font-medium">
                                                        <MapPin className="w-3 h-3 mr-1 text-[#C5A059]" />
                                                        {evt.venue}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="font-serif text-base font-bold text-stone-900 mb-1">
                                                {evt.title}
                                            </h4>

                                            <p className="text-xs text-[#1C1C1C]/80 leading-relaxed">
                                                {evt.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Multimedia display with toggle cards (col-span-5) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-4 w-full">
                            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#C5A059]/25 shadow-lg shadow-[#800020]/5 w-full">
                                {/* Title of the Multimedia Block */}
                                <div className="text-center pb-3 border-b border-[#C5A059]/10 mb-4 select-none">
                                    <h4 className="font-serif text-[#800020] uppercase font-bold text-sm tracking-widest">
                                        Diario Visual del Día
                                    </h4>
                                    <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-semibold">
                                        Falla multimedia • Día {day.id}
                                    </span>
                                </div>

                                {/* Mode Selector Toggle Tabs */}
                                <div className="flex border border-[#C5A059]/25 rounded-lg overflow-hidden text-[10px] uppercase font-bold tracking-wider mb-4">
                                    <button
                                        onClick={() => setMode(day.id, "summary")}
                                        className={`flex-1 py-2 text-center transition focus:outline-none ${currentMode === "summary"
                                            ? "bg-[#800020] text-white"
                                            : "bg-[#FAF9F6] text-stone-600 hover:text-[#800020]"
                                            }`}
                                    >
                                        Resumen Visual
                                    </button>
                                    <button
                                        onClick={() => setMode(day.id, "video")}
                                        className={`flex-1 py-2 text-center transition focus:outline-none ${currentMode === "video"
                                            ? "bg-[#800020] text-white"
                                            : "bg-[#FAF9F6] text-stone-600 hover:text-[#800020]"
                                            }`}
                                    >
                                        Vídeo Completo
                                    </button>
                                </div>

                                {/* Video or Summary Image Box */}
                                <div className="relative aspect-video rounded-md overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                                    {currentMode === "summary" ? (
                                        /* SUMMARY IMAGE WITH INTERPRETER-STYLE OVERLAY */
                                        <div
                                            onClick={() => setMode(day.id, "video")}
                                            className="relative w-full h-full cursor-pointer group"
                                            title="Haz clic para ver el vídeo completo"
                                        >
                                            <img
                                                src={thumb.src}
                                                alt={thumb.caption}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            {/* ccmfalla.com interpreter card theme overlay: dark filter with centered elegant elements */}
                                            <div className="absolute inset-0 bg-black/45 group-hover:bg-[#800020]/65 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                                                {/* Title */}
                                                <h5 className="text-[17px] sm:text-[19px] font-bold text-white tracking-wide leading-snug drop-shadow-sm">
                                                    {DAY_OVERLAY_DETAILS[day.id].title}
                                                </h5>

                                                {/* Subtitle / Category: all caps gold accent */}
                                                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E9C168] mt-1.5 uppercase">
                                                    {DAY_OVERLAY_DETAILS[day.id].category}
                                                </span>

                                                {/* Small details description in italic (Alegreya/Cormorant feel) */}
                                                <p className="text-[12px] sm:text-[13px] italic text-[#FAF9F6]/90 mt-2 font-serif font-light max-w-[280px]">
                                                    {DAY_OVERLAY_DETAILS[day.id].description}
                                                </p>

                                                {/* Date */}
                                                <span className="text-[10px] text-stone-300 font-sans tracking-wider mt-2.5 opacity-85">
                                                    {DAY_OVERLAY_DETAILS[day.id].date}
                                                </span>

                                                {/* Play Button Icon: Hollow white circle with custom play triangle arrow */}
                                                <div className="mt-4 flex items-center justify-center">
                                                    <div className="w-9 h-9 rounded-full border border-white/50 flex flex-col items-center justify-center bg-black/10 group-hover:bg-[#800020]/80 group-hover:scale-110 shadow-md transition-all duration-300">
                                                        <svg className="w-3.5 h-3.5 fill-current text-white translate-x-[0.5px]" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* VIDEO PLAYLIST PLAYER & DUAL PLAYER CONTROLS */
                                        (() => {
                                            const dayVideos = ITINERARY_VIDEOS[day.id] || [];
                                            const activeIdx = activeVideoIndexes[day.id] || 0;
                                            const currentVideo = dayVideos[activeIdx];
                                            const mediaType = timelineMediaTypes[day.id] || "completo";
                                            const videoSrc = mediaType === "resumen" && currentVideo ? currentVideo.filePath.replace(".mp4", "_resumen.mp4") : currentVideo?.filePath;

                                            if (currentVideo) {
                                                return (
                                                    <div className="w-full h-full flex flex-col justify-between bg-[#1C1C1C]">
                                                        {/* Dual Player Toggle Switch (Timeline version) */}
                                                        <div className="flex border-b border-stone-850 bg-stone-900 text-[10px] z-10">
                                                            <button
                                                                onClick={() => setTimelineMediaTypes(prev => ({ ...prev, [day.id]: "completo" }))}
                                                                className={`flex-1 py-1.5 text-center font-bold uppercase transition ${mediaType === "completo" ? "bg-[#800020] text-white" : "text-stone-300 hover:bg-[#800020]/20"
                                                                    }`}
                                                            >
                                                                ▶ Completo
                                                            </button>
                                                            <button
                                                                onClick={() => setTimelineMediaTypes(prev => ({ ...prev, [day.id]: "resumen" }))}
                                                                className={`flex-1 py-1.5 text-center font-bold uppercase transition ${mediaType === "resumen" ? "bg-[#800020] text-white" : "text-stone-300 hover:bg-[#800020]/20"
                                                                    }`}
                                                            >
                                                                ⏱ Resumen
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 min-h-0 relative aspect-video">
                                                            <video
                                                                key={`${day.id}-${activeIdx}-${mediaType}`}
                                                                src={videoSrc}
                                                                controls
                                                                autoPlay
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                /* Fallback if video does not exist yet */
                                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF9F6] border border-dashed border-[#C5A059]/30">
                                                    <div className="w-10 h-10 rounded-full bg-[#800020]/5 flex items-center justify-center text-[#800020] mb-2 animate-bounce">
                                                        <Music className="w-5 h-5" />
                                                    </div>
                                                    <h5 className="font-serif text-sm font-bold text-[#800020]">Vídeo en Sincronización</h5>
                                                    <p className="text-[10px] text-stone-500 mt-1 max-w-[200px]">
                                                        El fragmento cinematográfico está siendo mezclado con el audio del concierto.
                                                    </p>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>

                                {/* Playlist selection buttons for day videos */}
                                {currentMode === "video" && (ITINERARY_VIDEOS[day.id]?.length || 0) > 1 && (
                                    <div className="mt-3 border-t border-stone-100 pt-3 select-none">
                                        <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">
                                            Lista de Reproducción del Día
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {ITINERARY_VIDEOS[day.id].map((vid, idx) => {
                                                const activeIdx = activeVideoIndexes[day.id] || 0;
                                                const isCurrent = activeIdx === idx;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveVideoIndexes(prev => ({ ...prev, [day.id]: idx }))}
                                                        className={`text-[9px] uppercase tracking-wider font-bold py-1 px-2 rounded-md transition ${isCurrent
                                                            ? "bg-[#800020] text-white"
                                                            : "bg-[#FAF9F6] text-stone-600 hover:bg-[#800020]/10 hover:text-[#800020] border border-stone-200"
                                                            }`}
                                                    >
                                                        {vid.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Caption at bottom of framed element */}
                                <div className="mt-3 text-center select-none text-[10px] border-t border-[#C5A059]/10 pt-3">
                                    <p className="font-serif italic font-bold text-[#800020] text-[11px]">
                                        "{thumb.caption}"
                                    </p>
                                    <p className="text-[9px] text-stone-400 mt-0.5">
                                        Archivo Documental Manuel de Falla. Todos los derechos reservados.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}
