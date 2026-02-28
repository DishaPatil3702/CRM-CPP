// src/components/CRMProLogo.jsx
// The exact same logo mark used in SplashScreen — reusable everywhere.
// Props:
//   size      – icon box px (default 64)
//   showText  – show "CRMPro" wordmark (default true)
//   showTag   – show tagline below (default false)

export default function CRMProLogo({ size = 64, showText = true, showTag = false }) {
  const s = size;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* ── Icon mark ── */}
      <div style={{ position: "relative", width: s, height: s }}>
        {/* Pulse ring */}
        <div style={{
          position: "absolute",
          inset: -s * 0.22,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.18)",
          animation: "logoPulse 2.5s ease-out infinite",
        }} />
        {/* Orbit ring */}
        <div style={{
          position: "absolute",
          inset: -s * 0.12,
          borderRadius: "50%",
          border: "1.5px solid rgba(99,102,241,0.28)",
          animation: "logoOrbit 6s linear infinite",
        }}>
          {/* Orbiting dot */}
          <div style={{
            position: "absolute",
            top: -4, left: "50%",
            width: 8, height: 8,
            borderRadius: "50%",
            background: "#a78bfa",
            boxShadow: "0 0 12px #a78bfa, 0 0 24px #6366f1",
            transform: "translateX(-50%)",
          }} />
        </div>

        {/* Main box */}
        <div style={{
          width: s, height: s,
          borderRadius: s * 0.27,
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.12) inset, 0 ${s*0.08}px ${s*0.35}px rgba(99,102,241,0.55), 0 0 ${s*0.9}px rgba(99,102,241,0.18)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Shine overlay */}
          <div style={{
            position: "absolute", top: 0, left: "-50%",
            width: "60%", height: "50%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.22), transparent)",
            borderRadius: "0 0 100% 0",
          }} />

          {/* Bar chart SVG — scales with size */}
          <svg
            width={s * 0.56}
            height={s * 0.56}
            viewBox="0 0 54 54"
            fill="none"
          >
            <rect x="4"  y="36" width="9" height="14" rx="2.5" fill="rgba(255,255,255,0.35)"/>
            <rect x="16" y="28" width="9" height="22" rx="2.5" fill="rgba(255,255,255,0.55)"/>
            <rect x="28" y="18" width="9" height="32" rx="2.5" fill="rgba(255,255,255,0.80)"/>
            <rect x="40" y="6"  width="9" height="44" rx="2.5" fill="white"/>
            <line x1="8"  y1="37" x2="20" y2="29" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
            <line x1="20" y1="29" x2="32" y2="19" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
            <line x1="32" y1="19" x2="44" y2="7"  stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
            <circle cx="44" cy="7" r="4"   fill="#c4b5fd"/>
            <circle cx="44" cy="7" r="7"   fill="rgba(196,181,253,0.2)"/>
          </svg>
        </div>
      </div>

      {/* ── Wordmark ── */}
      {showText && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: s * 0.65,
            fontWeight: 800,
            color: "#f0f4ff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>CRM</span>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: s * 0.65,
            fontWeight: 800,
            background: "linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>Pro</span>
        </div>
      )}

      {/* ── Tagline ── */}
      {showTag && (
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "4px",
          textTransform: "uppercase", color: "#4a5570",
          fontFamily: "'DM Sans', sans-serif",
        }}>Enterprise Sales Platform</p>
      )}

      <style>{`
        @keyframes logoPulse {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.45); }
        }
        @keyframes logoOrbit {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
