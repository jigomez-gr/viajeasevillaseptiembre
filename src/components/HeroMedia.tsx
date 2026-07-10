"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Maximize, Play, Pause } from "lucide-react";

export default function HeroMedia() {
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true); // video playing
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Sync state with audio playback
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            audio.pause();
        } else {
            audio.play().catch((err) => {
                console.warn("Autoplay block or audio play failed:", err);
                setIsMuted(true);
            });
        }
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
            (video as any).webkitRequestFullscreen();
        } else if ((video as any).msRequestFullscreen) {
            (video as any).msRequestFullscreen();
        }
    };

    const togglePlayVideo = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            video.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    return (
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black/5 border border-stone-200 group">
            {/* Background Audio Loop */}
            <audio
                ref={audioRef}
                src="/sonidos_mp3/Erik Satie - Gymnopédie No.1.mp3"
                loop
                preload="auto"
            />

            {/* Video Element */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover select-none"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Controls Overlay */}
            <div className="absolute inset-0 bg-transparent flex flex-col justify-between p-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {/* Top Control Bar */}
                <div className="flex items-center justify-between w-full pointer-events-auto">
                    {/* Audio toggle button */}
                    <button
                        onClick={toggleMute}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#800020]/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#800020] shadow-md transition duration-200"
                        title={isMuted ? "Activar música de fondo" : "Desactivar música de fondo"}
                    >
                        {isMuted ? (
                            <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>Música Desactivada</span>
                            </>
                        ) : (
                            <>
                                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                                <span>Música Activada</span>
                            </>
                        )}
                    </button>

                    {/* Fullscreen button (mobile specific but useful, shows on all screens or custom md:hidden) */}
                    <button
                        onClick={handleFullscreen}
                        className="p-2 rounded-full bg-white/95 text-[#1C1C1C] hover:bg-[#800020] hover:text-white shadow-md transition duration-200"
                        title="Pantalla Completa"
                    >
                        <Maximize className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Center Play/Pause Indicator (Optional but premium) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={togglePlayVideo}
                        className="pointer-events-auto p-4 rounded-full bg-black/45 text-white/90 hover:bg-[#800020]/80 transition opacity-0 group-hover:opacity-100 duration-200"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
