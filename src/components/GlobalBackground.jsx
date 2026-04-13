// src/components/GlobalBackground.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * GlobalBackground — safe version
 * - Overlays are z-index -1 (always behind content)
 * - Double-mount guard (renders overlays only once)
 */
export default function GlobalBackground({
  variant = "space",
  noise = true,
  animated = true,
  className = "",
  children,
}) {
  // Guard: only allow one instance to render overlays
  const [isPrimary, setIsPrimary] = useState(true);
  useEffect(() => {
    const FLAG = "gb-mounted";
    if (document.body.hasAttribute(FLAG)) {
      setIsPrimary(false); // another instance already exists
    } else {
      document.body.setAttribute(FLAG, "1");
      setIsPrimary(true);
    }
    return () => {
      // if this was the primary, clean up the flag so a remount can re-own
      if (isPrimary) document.body.removeAttribute(FLAG);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useMemo(
    () => `gb-root ${className}`.trim(),
    [className]
  );

  return (
    <div className={classes} data-variant={variant} data-animated={animated}>
      <style>{css}</style>

      {/* Content surface */}
      <div className="gb-surface">{children}</div>

      {/* Only the first mounted instance paints the overlays */}
      {isPrimary && (
        <>
          {noise && <div aria-hidden className="gb-noise" />}
          <div aria-hidden className="gb-veil gb-veil-a" />
          <div aria-hidden className="gb-veil gb-veil-b" />
        </>
      )}
    </div>
  );
}

const css = `
/* ----- Root + sizing ----- */
.gb-root, .gb-surface { min-height: 100dvh; }
.gb-root {
  position: relative;
  isolation: isolate; /* new stacking context */
  overflow: clip;
}

/* Content layer sits above everything (but we push overlays to -1 anyway) */
.gb-surface {
  position: relative;
  z-index: 1;
  background: transparent;
}

/* ----- Base backgrounds (variants) ----- */
.gb-root[data-variant="space"] {
  background:
    radial-gradient(1200px 700px at 50% 15%, rgba(28,34,46,0.75), transparent 55%),
    linear-gradient(180deg, #0b1220, rgba(12,16,24,0.9));
  background-attachment: fixed, fixed;
}

.gb-root[data-variant="aurora"] {
  background:
    radial-gradient(1000px 600px at 50% 10%, rgba(16,20,30,0.92), #0b1220 60%);
  background-attachment: fixed;
}

.gb-root[data-variant="mesh"] {
  background: #0c1422;
  background-attachment: fixed;
}

/* ----- Film grain (always behind content) ----- */
.gb-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  mix-blend-mode: soft-light;
  z-index: -1; /* <<< behind content */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cdefs%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ----- Veils (color washes / grid) — behind content ----- */
.gb-veil {
  position: fixed;
  inset: -20%;
  pointer-events: none;
  z-index: -1; /* <<< behind content */
  opacity: 0;  /* default hidden; variants enable it */
  filter: blur(60px) saturate(120%);
  transform: translateZ(0);
}

/* Aurora veils */
.gb-root[data-variant="aurora"] .gb-veil { opacity: 0.22; }
.gb-root[data-variant="aurora"] .gb-veil-a {
  background:
    radial-gradient(40% 30% at 40% 20%, hsla(217,91%,60%,0.8), transparent 60%),
    radial-gradient(35% 28% at 70% 35%, hsla(192,95%,60%,0.7), transparent 60%),
    radial-gradient(45% 35% at 60% 70%, hsla(266,70%,62%,0.7), transparent 60%);
  animation: aurora-float 18s ease-in-out infinite alternate;
}
.gb-root[data-variant="aurora"][data-animated="false"] .gb-veil-a { animation: none; }
.gb-root[data-variant="aurora"] .gb-veil-b {
  opacity: 0.18;
  transform: rotate(8deg) scale(1.1);
  background:
    radial-gradient(36% 28% at 30% 70%, hsla(192,95%,60%,0.6), transparent 60%),
    radial-gradient(42% 34% at 72% 48%, hsla(217,91%,60%,0.6), transparent 60%);
  animation: aurora-float 22s ease-in-out infinite alternate-reverse;
}
.gb-root[data-variant="aurora"][data-animated="false"] .gb-veil-b { animation: none; }

@keyframes aurora-float {
  0%   { transform: translateY(-2%) translateX(-1%) scale(1.05) rotate(-2deg); }
  100% { transform: translateY( 2%) translateX( 1%) scale(1.12) rotate( 2deg); }
}

/* Mesh/grid variant (subtle animated lines) */
.gb-root[data-variant="mesh"] .gb-veil-a {
  opacity: 0.18;
  inset: -1px; /* avoid subpixel seams */
  filter: none;
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 36px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 36px);
  mask-image: radial-gradient(1200px 700px at 50% 20%, black 60%, transparent 100%);
  animation: mesh-breathe 14s ease-in-out infinite;
}
.gb-root[data-variant="mesh"][data-animated="false"] .gb-veil-a { animation: none; }
@keyframes mesh-breathe {
  0%,100% { opacity: 0.18; transform: scale(1); }
  50%     { opacity: 0.28; transform: scale(1.01); }
}
`;
