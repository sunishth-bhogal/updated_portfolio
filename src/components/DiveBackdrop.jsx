// src/components/DiveBackdrop.jsx
// The home page as a slow dive: the page background deepens from the hero's
// cream into dark water by the Contact section, a few fish drift behind the
// content, and a small gauge counts the depth. The red SwingingFigure leaves
// bubbles once it is "underwater".
//
// Everything here is decorative: the canvas and gauge are aria-hidden and
// pointer-events:none, and under prefers-reduced-motion only the static
// gradient and gauge are kept (no canvas animation).

import React from "react";
import { useReducedMotion } from "framer-motion";

// Which section starts at which depth (metres). The last value is the bottom
// of the page. Real ocean zones: sunlight < 200 m, twilight < 1,000 m,
// midnight < 4,000 m, abyss beyond.
const DEPTHS = { about: 0, experiences: 150, projects: 600, create: 1000, contact: 3000, end: 4000 };
const DEEP_SECTIONS = ["create", "contact"]; // sections whose text flips to light

const zoneName = (d) =>
  d < 200 ? "Sunlight zone" : d < 1000 ? "Twilight zone" : d < 4000 ? "Midnight zone" : "Abyssal zone";

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export default function DiveBackdrop() {
  const reduceMotion = useReducedMotion();
  const canvasRef = React.useRef(null);
  const gaugeRef = React.useRef(null);
  const depthRef = React.useRef(null);
  const zoneRef = React.useRef(null);
  const barRef = React.useRef(null);

  React.useEffect(() => {
    const band = document.querySelector(".main-band");
    if (!band) return undefined;
    band.classList.add("dive");

    const ids = ["about", "experiences", "projects", "create", "contact"];
    const els = ids.map((id) => document.getElementById(id));
    els.forEach((el, i) => el && DEEP_SECTIONS.includes(ids[i]) && el.classList.add("dive-deep"));

    // ---- layout (document coordinates) ----
    let L = null;
    const measure = () => {
      if (els.some((e) => !e)) return;
      const top = (el) => el.getBoundingClientRect().top + window.scrollY;
      const bandTop = top(band);
      const bandBottom = bandTop + band.offsetHeight;
      const t = Object.fromEntries(ids.map((id, i) => [id, top(els[i])]));
      L = { bandTop, bandBottom, ...t, docH: document.documentElement.scrollHeight };
      L.anchors = [
        [t.about, DEPTHS.about],
        [t.experiences, DEPTHS.experiences],
        [t.projects, DEPTHS.projects],
        [t.create, DEPTHS.create],
        [t.contact, DEPTHS.contact],
        [bandBottom, DEPTHS.end],
      ];

      // Background gradient painted on .main-band itself, so it scrolls with
      // the content. The light→dark drop sits in the padding between
      // Projects and Create, so no text ever lands on a mid-tone.
      const rel = (y) => Math.max(0, Math.round(y - bandTop));
      band.style.setProperty("--dive-gradient", `linear-gradient(180deg,
        #F6F4EF 0px,
        #ECF3F1 ${rel(t.experiences)}px,
        #DDEEF0 ${rel(t.projects)}px,
        #C9E4EA ${rel(t.create - 70)}px,
        #23527A ${rel(t.create + 60)}px,
        #10304F ${rel(t.contact)}px,
        #081627 ${rel(bandBottom)}px)`);
      if (fishes.length === 0) buildFish();
    };

    const depthAt = (y) => {
      if (!L || y <= L.anchors[0][0]) return 0;
      const a = L.anchors;
      for (let i = 1; i < a.length; i++) {
        if (y <= a[i][0]) return a[i - 1][1] + ((a[i][1] - a[i - 1][1]) * (y - a[i - 1][0])) / Math.max(1, a[i][0] - a[i - 1][0]);
      }
      return a[a.length - 1][1];
    };

    // ---- creatures ----
    let fishes = [];
    let snow = [];
    let bubbles = [];
    const buildFish = () => {
      if (!L) return;
      const R = rng(11);
      const add = (n, y0, y1, deep, glowChance) => {
        for (let i = 0; i < n; i++) {
          fishes.push({
            y: y0 + R() * (y1 - y0),
            x0: R() * 2000,
            len: 16 + R() * 18,
            sp: (14 + R() * 22) * (R() < 0.5 ? -1 : 1),
            ph: R() * 6.28,
            deep,
            glow: R() < glowChance,
            a: 0.6 + R() * 0.4,
          });
        }
      };
      add(7, L.about + 120, L.projects, false, 0);
      add(5, L.projects, L.create - 120, false, 0);
      add(8, L.create + 120, L.bandBottom - 140, true, 0.35);
      snow = Array.from({ length: 70 }, () => ({ x: R(), y: R(), s: 0.4 + R() * 0.8, r: 0.6 + R() * 1.1 }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(band);
    window.addEventListener("resize", measure);

    // ---- canvas ----
    const cv = canvasRef.current;
    const ctx = cv && !reduceMotion ? cv.getContext("2d") : null;
    let W = 0, H = 0, dpr = 1;
    const size = () => {
      if (!cv) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };
    size();
    window.addEventListener("resize", size);

    const drawFish = (f, x, y, t) => {
      const dir = f.sp > 0 ? 1 : -1;
      const wag = Math.sin(t * 6 + f.ph) * 0.18;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(dir, 1);
      ctx.globalAlpha = f.a;
      ctx.fillStyle = f.deep ? "rgba(196,226,255,0.2)" : "rgba(24,78,102,0.17)";
      ctx.beginPath();
      ctx.ellipse(0, 0, f.len / 2, f.len / 5.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-f.len / 2 + 2, 0);
      ctx.lineTo(-f.len / 2 - f.len / 3.2, -f.len / 5 + wag * f.len * 0.3);
      ctx.lineTo(-f.len / 2 - f.len / 3.2, f.len / 5 + wag * f.len * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (f.glow) {
        const gx = x + dir * (f.len / 2 + 5), gy = y - f.len / 4;
        const pulse = 0.55 + 0.35 * Math.sin(t * 2.4 + f.ph);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 14);
        g.addColorStop(0, `rgba(140,255,222,${0.55 * pulse})`);
        g.addColorStop(1, "rgba(140,255,222,0)");
        ctx.fillStyle = g;
        ctx.fillRect(gx - 14, gy - 14, 28, 28);
        ctx.fillStyle = `rgba(200,255,240,${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    const swinger = () => document.querySelector(".swinger");

    const frame = (now) => {
      const t = now / 1000;
      const sy = window.scrollY;
      vel += (sy - lastY - vel) * 0.2;
      lastY = sy;

      // gauge
      if (L) {
        const max = Math.max(1, L.docH - H);
        const p = Math.min(1, Math.max(0, sy / max));
        const d = p > 0.995 ? DEPTHS.end : Math.max(0, depthAt(sy + H * p));
        const visible = sy + H * 0.5 > L.about;
        if (gaugeRef.current) {
          gaugeRef.current.classList.toggle("is-on", visible);
          gaugeRef.current.classList.toggle("is-deep", sy + H * 0.5 > L.create);
        }
        if (depthRef.current) depthRef.current.textContent = `${Math.round(d).toLocaleString()} m`;
        if (zoneRef.current) zoneRef.current.textContent = zoneName(d);
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      }

      if (ctx && L) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const surf = L.bandTop - sy;

        if (surf < H) {
          // soft light rays from the surface down to Projects
          const rayEnd = L.projects - sy;
          if (rayEnd > 0) {
            for (let k = 0; k < 5; k++) {
              const x = W * (0.08 + k * 0.21) + Math.sin(t * 0.35 + k * 1.7) * 30;
              const g = ctx.createLinearGradient(0, surf, 0, rayEnd);
              g.addColorStop(0, "rgba(255,255,255,0.34)");
              g.addColorStop(1, "rgba(255,255,255,0)");
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.moveTo(x, surf);
              ctx.lineTo(x + 46, surf);
              ctx.lineTo(x + 230, rayEnd);
              ctx.lineTo(x + 110, rayEnd);
              ctx.closePath();
              ctx.fill();
            }
          }

          // marine snow in the dark water (half-speed parallax)
          const deepTop = L.create - sy;
          if (deepTop < H) {
            ctx.fillStyle = "rgba(220,236,255,0.32)";
            for (const s of snow) {
              const y = (((s.y * H + t * 9 * s.s - sy * 0.5) % H) + H) % H;
              if (y < deepTop) continue;
              ctx.beginPath();
              ctx.arc(s.x * W + Math.sin(t * 0.6 + s.y * 10) * 6, y, s.r, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // fish
          const span = W + 120;
          for (const f of fishes) {
            const y = f.y - sy + Math.sin(t * 0.9 + f.ph) * 4;
            if (y < -30 || y > H + 30) continue;
            const x = ((((f.x0 + t * f.sp) % span) + span) % span) - 60;
            drawFish(f, x, y, t);
          }

          // seafloor silhouette at the very bottom
          const floor = L.bandBottom - sy;
          if (floor < H + 80) {
            ctx.fillStyle = "rgba(4,12,24,0.55)";
            ctx.beginPath();
            ctx.moveTo(0, floor);
            for (let x = 0; x <= W; x += 16) ctx.lineTo(x, floor - 18 - Math.sin(x * 0.006) * 12 - Math.sin(x * 0.019) * 5);
            ctx.lineTo(W, floor);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "rgba(60,140,120,0.35)";
            ctx.lineWidth = 2;
            for (let k = 0; k < 7; k++) {
              const bx = W * (0.06 + k * 0.145);
              const h = 40 + ((k * 37) % 50);
              ctx.beginPath();
              ctx.moveTo(bx, floor - 20);
              for (let s = 1; s <= 8; s++) ctx.lineTo(bx + Math.sin(t * 1.1 + k + s * 0.5) * s * 1.2, floor - 20 - (h * s) / 8);
              ctx.stroke();
            }
          }

          // bubbles from the red figure once it is below the surface
          const fig = swinger();
          if (fig && Math.abs(vel) > 1.2 && Math.random() < 0.5) {
            const r = fig.getBoundingClientRect();
            const hx = r.left + r.width / 2, hy = r.top + 24;
            if (r.width > 0 && hy > surf) bubbles.push({ x: hx + (Math.random() - 0.5) * 8, y: hy + sy, v: 22 + Math.random() * 30, r: 1.5 + Math.random() * 2.5, life: 0 });
          }
          bubbles = bubbles.filter((b) => b.life < 3.5 && b.y > L.bandTop + 4);
          for (const b of bubbles) {
            b.life += 1 / 60;
            b.y -= b.v / 60;
            const deep = b.y > L.create;
            ctx.strokeStyle = deep ? `rgba(205,235,255,${0.6 - b.life / 7})` : `rgba(30,100,130,${0.4 - b.life / 10})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(b.x + Math.sin(b.life * 5) * 2, b.y - sy, b.r, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("resize", size);
      band.classList.remove("dive");
      band.style.removeProperty("--dive-gradient");
      els.forEach((el) => el && el.classList.remove("dive-deep"));
    };
  }, [reduceMotion]);

  return (
    <>
      {!reduceMotion && <canvas ref={canvasRef} className="dive-canvas" aria-hidden="true" />}
      <div ref={gaugeRef} className="dive-gauge" aria-hidden="true">
        <span className="dive-gauge__depth" ref={depthRef}>0 m</span>
        <span className="dive-gauge__zone" ref={zoneRef}>Sunlight zone</span>
        <span className="dive-gauge__track">
          <span className="dive-gauge__bar" ref={barRef} />
        </span>
      </div>
    </>
  );
}
