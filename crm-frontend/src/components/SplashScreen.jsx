// src/components/SplashScreen.jsx
// Usage: show this while your app is loading, then fade it out.
//
// <SplashScreen onComplete={() => setReady(true)} />
//
import { useEffect, useState } from "react";

const LABELS = [
  "Initializing workspace...",
  "Loading pipeline data...",
  "Syncing contacts...",
  "Preparing dashboard...",
  "Almost ready...",
];

export default function SplashScreen({ onComplete }) {
  const [labelIdx, setLabelIdx]   = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const [exiting, setExiting]     = useState(false);

  /* Cycle through loading labels */
  useEffect(() => {
    const iv = setInterval(() => {
      setLabelVisible(false);
      setTimeout(() => {
        setLabelIdx(i => (i + 1) % LABELS.length);
        setLabelVisible(true);
      }, 300);
    }, 560);
    return () => clearInterval(iv);
  }, []);

  /* Trigger exit after 4.2s */
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete?.(), 650);
    }, 4200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <>
      <style>{css}</style>
      <div className={`sp-root ${exiting ? "sp-root--exit" : ""}`}>
        {/* Grain */}
        <div className="sp-grain" />

        {/* Blobs */}
        <div className="sp-blob sp-blob-1" />
        <div className="sp-blob sp-blob-2" />
        <div className="sp-blob sp-blob-3" />

        {/* Grid */}
        <div className="sp-grid" />

        {/* Corner brackets */}
        <div className="sp-corner sp-corner--tl" />
        <div className="sp-corner sp-corner--tr" />
        <div className="sp-corner sp-corner--bl" />
        <div className="sp-corner sp-corner--br" />

        {/* Particles */}
        <div className="sp-particles">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="sp-particle" style={{
              width:  `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left:   `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay:    `${Math.random() * 6}s`,
              background: `hsl(${240 + Math.random() * 40}, 80%, ${65 + Math.random() * 20}%)`,
            }} />
          ))}
        </div>

        {/* Center content */}
        <div className="sp-center">
          {/* Icon mark */}
          <div className="sp-icon-wrap">
            <div className="sp-pulse-ring" />
            <div className="sp-orbit-ring" />
            <div className="sp-icon-box">
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                <rect x="4"  y="36" width="9" height="14" rx="2.5" fill="rgba(255,255,255,0.35)"/>
                <rect x="16" y="28" width="9" height="22" rx="2.5" fill="rgba(255,255,255,0.55)"/>
                <rect x="28" y="18" width="9" height="32" rx="2.5" fill="rgba(255,255,255,0.78)"/>
                <rect x="40" y="6"  width="9" height="44" rx="2.5" fill="white"/>
                <line x1="8"  y1="37" x2="20" y2="29" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
                <line x1="20" y1="29" x2="32" y2="19" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
                <line x1="32" y1="19" x2="44" y2="7"  stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
                <circle cx="44" cy="7" r="4" fill="#c4b5fd"/>
                <circle cx="44" cy="7" r="7" fill="rgba(196,181,253,0.2)"/>
              </svg>
            </div>
          </div>

          {/* Wordmark */}
          <div className="sp-wordmark">
            <span className="sp-crm">CRM</span>
            <span className="sp-pro">Pro</span>
          </div>

          {/* Tagline */}
          <p className="sp-tagline">Enterprise Sales Platform</p>

          {/* Progress */}
          <div className="sp-progress-wrap">
            <div className="sp-track">
              <div className="sp-fill" />
            </div>
            <p className="sp-label" style={{ opacity: labelVisible ? 1 : 0, transition: "opacity 0.3s" }}>
              {LABELS[labelIdx]}
            </p>
          </div>

          {/* Dots */}
          <div className="sp-dots">
            <div className="sp-dot sp-dot-1" />
            <div className="sp-dot sp-dot-2" />
            <div className="sp-dot sp-dot-3" />
          </div>
        </div>

        {/* Bottom strip */}
        <div className="sp-strip">
          Powered by CRMPro <span style={{ color: "rgba(99,102,241,0.6)", margin: "0 6px" }}>✦</span> v2.0
        </div>
      </div>
    </>
  );
}

/* ─── Styles ─── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.sp-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #07090f;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}
.sp-root--exit {
  animation: spExit 0.65s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes spExit {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(1.05); pointer-events: none; }
}

/* Grain */
.sp-grain {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.035;
}

/* Blobs */
.sp-blob {
  position: absolute; border-radius: 50%; filter: blur(80px);
  animation: blobF 8s ease-in-out infinite;
}
.sp-blob-1 { width:600px;height:600px;background:radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%);top:-200px;left:-150px;animation-delay:0s; }
.sp-blob-2 { width:500px;height:500px;background:radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 70%);bottom:-150px;right:-100px;animation-delay:3s; }
.sp-blob-3 { width:350px;height:350px;background:radial-gradient(circle,rgba(167,139,250,.10) 0%,transparent 70%);top:50%;left:60%;animation-delay:5s; }
@keyframes blobF { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-20px)scale(1.05)} }

/* Grid */
.sp-grid {
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(99,102,241,.04)1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04)1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,black 0%,transparent 100%);
  -webkit-mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,black 0%,transparent 100%);
}

/* Corner brackets */
.sp-corner { position:fixed;width:60px;height:60px;opacity:.3;animation:spFade 1s ease .5s both; }
.sp-corner--tl{top:24px;left:24px;border-top:1.5px solid #6366f1;border-left:1.5px solid #6366f1;border-radius:4px 0 0 0}
.sp-corner--tr{top:24px;right:24px;border-top:1.5px solid #6366f1;border-right:1.5px solid #6366f1;border-radius:0 4px 0 0}
.sp-corner--bl{bottom:24px;left:24px;border-bottom:1.5px solid #6366f1;border-left:1.5px solid #6366f1;border-radius:0 0 0 4px}
.sp-corner--br{bottom:24px;right:24px;border-bottom:1.5px solid #6366f1;border-right:1.5px solid #6366f1;border-radius:0 0 4px 0}

/* Particles */
.sp-particles { position:absolute;inset:0;pointer-events:none; }
.sp-particle {
  position:absolute; border-radius:50%; opacity:0;
  bottom:0;
  animation: partRise linear infinite;
}
@keyframes partRise {
  0%   { transform:translateY(0)scale(1);   opacity:0; }
  10%  { opacity:1; }
  90%  { opacity:.6; }
  100% { transform:translateY(-100vh)scale(.3); opacity:0; }
}

/* Center */
.sp-center {
  position:relative; z-index:10;
  display:flex; flex-direction:column; align-items:center;
}

/* Icon wrap */
.sp-icon-wrap {
  position:relative; width:96px; height:96px; margin-bottom:32px;
  animation:iconDrop .8s cubic-bezier(.34,1.56,.64,1) .2s both;
}
@keyframes iconDrop {
  from { opacity:0; transform:translateY(-30px)scale(.7); }
  to   { opacity:1; transform:translateY(0)scale(1); }
}
.sp-pulse-ring {
  position:absolute; inset:-28px; border-radius:50%;
  border:1px solid rgba(99,102,241,.12);
  animation:pulseExp 2.5s ease-out infinite;
}
@keyframes pulseExp { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.4)} }
.sp-orbit-ring {
  position:absolute; inset:-16px; border-radius:50%;
  border:1.5px solid rgba(99,102,241,.25);
  animation:orbitSpin 6s linear infinite;
}
.sp-orbit-ring::before {
  content:''; position:absolute; top:-4px; left:50%;
  width:8px; height:8px; border-radius:50%;
  background:#a78bfa;
  box-shadow:0 0 12px #a78bfa,0 0 24px #6366f1;
  transform:translateX(-50%);
}
@keyframes orbitSpin { to { transform:rotate(360deg); } }
.sp-icon-box {
  width:96px; height:96px; border-radius:26px;
  background:linear-gradient(135deg,#4f46e5,#7c3aed);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 1px rgba(255,255,255,.12) inset,0 8px 32px rgba(99,102,241,.55),0 0 80px rgba(99,102,241,.2);
  position:relative; overflow:hidden;
}
.sp-icon-box::before {
  content:''; position:absolute; top:0; left:-50%;
  width:60%; height:50%;
  background:linear-gradient(135deg,rgba(255,255,255,.25),transparent);
  border-radius:0 0 100% 0;
}

/* Wordmark */
.sp-wordmark {
  display:flex; align-items:baseline; gap:2px; margin-bottom:10px;
  animation:spFade .7s ease .7s both;
}
.sp-crm {
  font-family:'Syne',sans-serif; font-size:52px; font-weight:800;
  color:#f0f4ff; letter-spacing:-2px; line-height:1;
}
.sp-pro {
  font-family:'Syne',sans-serif; font-size:52px; font-weight:800;
  background:linear-gradient(135deg,#818cf8,#a78bfa,#c4b5fd);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
  letter-spacing:-2px; line-height:1;
}

/* Tagline */
.sp-tagline {
  font-size:11px; font-weight:500; letter-spacing:5px;
  text-transform:uppercase; color:#4a5570;
  margin-bottom:52px;
  animation:spFade .7s ease 1s both;
}

/* Progress */
.sp-progress-wrap { width:220px; animation:spFade .7s ease 1.2s both; }
.sp-track { height:3px; border-radius:10px; background:rgba(99,102,241,.12); overflow:hidden; margin-bottom:14px; }
.sp-fill {
  height:100%; border-radius:10px;
  background:linear-gradient(90deg,#6366f1,#a78bfa);
  box-shadow:0 0 12px rgba(99,102,241,.8);
  animation:progGrow 2.8s cubic-bezier(.4,0,.2,1) 1.3s both;
}
@keyframes progGrow { from{width:0%} to{width:100%} }
.sp-label {
  text-align:center; font-size:11.5px; color:#4a5570; letter-spacing:.5px;
}

/* Dots */
.sp-dots { display:flex; gap:8px; margin-top:20px; animation:spFade .5s ease 1.4s both; }
.sp-dot {
  width:6px; height:6px; border-radius:50%; background:#4a5570;
  animation:dotP 1.2s ease-in-out infinite;
}
.sp-dot-1{animation-delay:0s}
.sp-dot-2{animation-delay:.2s}
.sp-dot-3{animation-delay:.4s}
@keyframes dotP {
  0%,100%{background:#4a5570;transform:scale(1)}
  50%{background:#a78bfa;transform:scale(1.4);box-shadow:0 0 8px #6366f1}
}

/* Bottom strip */
.sp-strip {
  position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
  font-size:11px; color:#4a5570; letter-spacing:2px; text-transform:uppercase;
  animation:spFade .6s ease 1.6s both; white-space:nowrap;
}

@keyframes spFade {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
}
`;
