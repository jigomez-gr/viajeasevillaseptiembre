import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 180], [1.1, 1.0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp" });

  const badgeY = interpolate(frame, [15, 35], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", overflow: "hidden", opacity: fadeOut }}>
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale})`,
          opacity: 0.4,
        }}
        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1280&auto=format&fit=crop"
        alt=""
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#e5be3c",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            fontFamily: "sans-serif",
          }}
        >
          Parrilla artesanal sin atajos
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#ffffff",
            transform: `scale(${titleScale})`,
            marginTop: 20,
            fontFamily: "serif",
          }}
        >
          BRUTAL BURGER
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#a1a1aa",
            fontStyle: "italic",
            opacity: subtitleOpacity,
            marginTop: 20,
            fontFamily: "serif",
          }}
        >
          Muerde la perfección de la parrilla
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BaconScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 180], [1.15, 1.0], { extrapolateRight: "clamp" });
  const bgX = interpolate(frame, [0, 180], [50, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp" });

  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp" });
  const textX = interpolate(frame, [15, 45], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const priceScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 120, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", overflow: "hidden", opacity: fadeOut }}>
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale}) translateX(${bgX}px)`,
          opacity: 0.5,
        }}
        src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1280&auto=format&fit=crop"
        alt=""
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent 100%)" }}></div>
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "0 100px" }}>
        <div style={{ maxWidth: 600, opacity: textOpacity, transform: `translateX(${textX}px)` }}>
          <span style={{ padding: "6px 12px", background: "rgba(229, 190, 60, 0.15)", border: "1px solid rgba(229, 190, 60, 0.3)", borderRadius: 6, fontSize: 16, fontWeight: "bold", color: "#edd87a", textTransform: "uppercase" }}>
            Crujiente perfecto
          </span>
          <h2 style={{ fontSize: 72, fontWeight: "bold", color: "#ffffff", marginTop: 24, fontFamily: "serif" }}>Bacon Banana Crunch</h2>
          <p style={{ fontSize: 20, color: "#d4d4d8", marginTop: 20, lineHeight: 1.6, fontFamily: "sans-serif" }}>
            Carne de buey madurada a la parrilla, bacon ahumado crujiente en leña de roble, cebolla frita al momento y nuestra salsa barbacoa secreta de plátano caramelizado.
          </p>
        </div>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "2px solid rgba(229, 190, 60, 0.3)",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${priceScale})`,
            boxShadow: "0 0 25px rgba(229, 190, 60, 0.2)",
          }}
        >
          <span style={{ fontSize: 14, color: "#71717a", textTransform: "uppercase", fontWeight: "bold" }}>Precio</span>
          <span style={{ fontSize: 36, fontWeight: "bold", color: "#e5be3c", marginTop: 5, fontFamily: "serif" }}>14.90€</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TruffleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 180], [1.15, 1.0], { extrapolateRight: "clamp" });
  const bgX = interpolate(frame, [0, 180], [-50, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp" });

  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp" });
  const textX = interpolate(frame, [15, 45], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const priceScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 120, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", overflow: "hidden", opacity: fadeOut }}>
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale}) translateX(${bgX}px)`,
          opacity: 0.5,
        }}
        src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1280&auto=format&fit=crop"
        alt=""
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(0,0,0,0.85) 40%, transparent 100%)" }}></div>
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "0 100px" }}>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "2px solid rgba(229, 190, 60, 0.3)",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${priceScale})`,
            boxShadow: "0 0 25px rgba(229, 190, 60, 0.2)",
          }}
        >
          <span style={{ fontSize: 14, color: "#71717a", textTransform: "uppercase", fontWeight: "bold" }}>Gourmet</span>
          <span style={{ fontSize: 36, fontWeight: "bold", color: "#e5be3c", marginTop: 5, fontFamily: "serif" }}>16.50€</span>
        </div>
        <div style={{ maxWidth: 600, textAlign: "right", opacity: textOpacity, transform: `translateX(${textX}px)` }}>
          <span style={{ padding: "6px 12px", background: "rgba(229, 190, 60, 0.15)", border: "1px solid rgba(229, 190, 60, 0.3)", borderRadius: 6, fontSize: 16, fontWeight: "bold", color: "#edd87a", textTransform: "uppercase" }}>
            Sofisticación pura
          </span>
          <h2 style={{ fontSize: 72, fontWeight: "bold", color: "#ffffff", marginTop: 24, fontFamily: "serif" }}>Double Black Truffle</h2>
          <p style={{ fontSize: 20, color: "#d4d4d8", marginTop: 20, lineHeight: 1.6, fontFamily: "sans-serif" }}>
            Dos discos de carne smashed con costra crujiente, queso provolone fundido y crema artesanal de trufa negra silvestre.
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StudioScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp" });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  const textOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp" });
  const textY = interpolate(frame, [20, 45], [30, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f12", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 100, padding: "0 100px", opacity: fadeOut }}>
      <div style={{ transform: `scale(${logoScale})`, position: "relative" }}>
        <div style={{ position: "absolute", width: 300, height: 300, background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }}></div>
        <svg style={{ width: 250, height: 250, color: "#e5be3c", filter: "drop-shadow(0 0 15px rgba(229, 190, 60, 0.4))" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C8.5 2 4.5 4.5 3 8c-1.5 3.5-1 7.5 1 10.5 1.5 2.5 4 4.5 7 5 3 .5 6.5-1 8.5-3.5 2-2.5 2.5-6.5 1.5-10-1-3.5-4-6.5-7.5-8-1-.5-2-.8-3.5-1z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2c-.5 1-1 3.5-.5 6s2.5 4.5 4 6.5c1.5 2 2 4.5 1.5 6-.5 1.5-2 2.5-3.5 3.5" strokeLinecap="round"/>
          <path d="M5 4l1 1M19 4l-1 1M4 20l1-1M20 20l-1-1M12 6V4M12 20v-2M4 12h2M18 12h2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ maxWidth: 600, opacity: textOpacity, transform: `translateY(${textY}px)` }}>
        <span style={{ fontSize: 14, fontWeight: "bold", color: "#e5be3c", textTransform: "uppercase", letterSpacing: "0.2em" }}>Proporciones de Oro</span>
        <h2 style={{ fontSize: 60, fontWeight: "black", color: "#ffffff", marginTop: 15, fontFamily: "serif", lineHeight: 1.2 }}>Visualizado por Nano Banana</h2>
        <p style={{ fontSize: 20, color: "#a1a1aa", marginTop: 20, lineHeight: 1.6, fontFamily: "sans-serif" }}>
          El modelo de IA Nano Banana equilibra los sabores, calcula la textura de cada capa y perfecciona la estética de tu hamburguesa para que disfrutes de un plato impecable.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 180], [1.1, 1.0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const logoScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const textY = interpolate(frame, [30, 50], [20, 0], { extrapolateLeft: "clamp" });
  const textOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp" });

  const ctaScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", overflow: "hidden" }}>
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale})`,
          opacity: 0.35,
        }}
        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1280&auto=format&fit=crop"
        alt=""
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.7)" }}></div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", padding: "0 100px", zIndex: 10 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", transform: `scale(${logoScale})`, fontFamily: "serif", letterSpacing: "0.05em" }}>
          BRUTAL<span style={{ color: "#e5be3c" }}>.</span>BURGER
        </div>
        <h1 style={{ fontSize: 80, fontWeight: "black", color: "#ffffff", marginTop: 30, fontFamily: "serif", opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          Muerde la <span style={{ color: "#e5be3c", textShadow: "0 0 20px rgba(229,190,60,0.3)" }}>Perfección</span>
        </h1>
        <p style={{ fontSize: 20, color: "#d4d4d8", marginTop: 20, maxWidth: 650, textAlign: "center", lineHeight: 1.6, fontFamily: "sans-serif", opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          Carne madurada durante 45 días sobre pan brioche de mantequilla horneado a diario. Ordena hoy mismo y experimenta la diferencia.
        </p>
        <div
          style={{
            marginTop: 40,
            padding: "18px 48px",
            backgroundColor: "#e5be3c",
            color: "#0a0a0a",
            fontWeight: "bold",
            fontSize: 20,
            borderRadius: 6,
            transform: `scale(${ctaScale})`,
            boxShadow: "0 0 25px rgba(229, 190, 60, 0.4)",
            fontFamily: "sans-serif",
          }}
        >
          ordenar ahora en brutalburger.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ad = () => (
  <AbsoluteFill style={{ backgroundColor: "#000000" }}>
    <Sequence from={0} durationInFrames={180}>
      <TitleScene />
    </Sequence>
    <Sequence from={180} durationInFrames={180}>
      <BaconScene />
    </Sequence>
    <Sequence from={360} durationInFrames={180}>
      <TruffleScene />
    </Sequence>
    <Sequence from={540} durationInFrames={180}>
      <StudioScene />
    </Sequence>
    <Sequence from={720} durationInFrames={180}>
      <CtaScene />
    </Sequence>
    <Audio
      src={staticFile("music.wav")}
      volume={0.4}
    />
  </AbsoluteFill>
);
