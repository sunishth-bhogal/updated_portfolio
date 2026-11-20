// src/components/DiveBackdrop.jsx
// The home page as a slow dive: the page background deepens from the hero's
// cream into dark water by the Contact section, a few fish drift behind the
// content, and a small gauge counts the depth.
//
// Performance: nothing is redrawn per frame. The water is one CSS gradient on
// .main-band; fish, snow, rays and kelp are a few small DOM elements animated
// with CSS transforms/opacity only (GPU-composited). The gauge updates from a
// passive scroll listener, at most once per animation frame.

import React from "react";

// Which section starts at which depth (metres); `end` is the bottom of the
// page. Real ocean zones: sunlight < 200 m, twilight < 1,000 m, midnight
// < 4,000 m, abyss beyond.
const DEPTHS = { about: 0, experiences: 150, projects: 600, create: 1000, contact: 3000, end: 4000 };
const IDS = ["about", "experiences", "projects", "create", "contact"];
const DEEP = ["create", "contact"]; // sections whose text flips to light

// Fish per section: [count, deep-water style?]
const FISH = { about: [3, false], experiences: [3, false], projects: [3, false], create: [3, true], contact: [3, true] };

const zoneName = (d) =>
  d < 200 ? "Sunlight zone" : d < 1000 ? "Twilight zone" : d < 4000 ? "Midnight zone" : "Abyssal zone";

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const fishSvg = (lure) =>
  `<svg viewBox="0 0 40 16" width="100%" height="100%" aria-hidden="true">` +
  `<ellipse cx="22" cy="8" rx="14" ry="5.4"/><path d="M9 8 L1 2.5 L1 13.5 Z"/>` +
  (lure ? `<circle class="dive-fish__lure" cx="38.5" cy="3" r="1.6"/>` : "") +
  `</svg>`;

const seafloorSvg =
  `<svg viewBox="0 0 1200 120" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">` +
  `<path class="dive-floor__sand" d="M0 120 L0 78 C 150 60 260 92 420 80 C 600 66 720 96 880 82 C 1010 70 1110 88 1200 76 L1200 120 Z"/>` +
  `</svg>`;

export default function DiveBackdrop() {
  const gaugeRef = React.useRef(null);
  const depthRef = React.useRef(null);
  const zoneRef = React.useRef(null);
  const barRef = React.useRef(null);

  React.useEffect(() => {
    const band = document.querySelector(".main-band");
    const els = IDS.map((id) => document.getElementById(id));
    if (!band || els.some((e) => !e)) return undefined;

    band.classList.add("dive");
    const added = [];
    const R = rng(11);

    els.forEach((el, i) => {
      const id = IDS[i];
      if (DEEP.includes(id)) el.classList.add("dive-deep");

      const layer = document.createElement("div");
      layer.className = "dive-layer";
      layer.setAttribute("aria-hidden", "true");

      if (id === "about") {
        const rays = document.createElement("div");
        rays.className = "dive-rays";
        layer.appendChild(rays);
      }
      if (DEEP.includes(id)) {
        const snow = document.createElement("div");
        snow.className = "dive-snow";
        layer.appendChild(snow);
      }

      const [n, deep] = FISH[id];
      for (let k = 0; k < n; k++) {
        const f = document.createElement("span");
        const left = R() < 0.5;
        f.className = `dive-fish${deep ? " dive-fish--deep" : ""}${left ? " dive-fish--left" : ""}`;
        f.style.top = `${10 + R() * 78}%`;
        f.style.setProperty("--len", `${22 + R() * 20}px`);
        const dur = 38 + R() * 30;
        f.style.animationDuration = `${dur}s`;
        f.style.animationDelay = `${-R() * dur}s`;
        f.innerHTML = fishSvg(deep && R() < 0.6);
        layer.appendChild(f);
      }

      if (id === "contact") {
        const floor = document.createElement("div");
        floor.className = "dive-floor";
        floor.innerHTML = seafloorSvg;
        for (let k = 0; k < 7; k++) {
          const kelp = document.createElement("span");
          kelp.className = "dive-kelp";
          kelp.style.left = `${6 + k * 14.5}%`;
          kelp.style.height = `${44 + ((k * 37) % 50)}px`;
          kelp.style.animationDelay = `${-k * 0.7}s`;
          floor.appendChild(kelp);
        }
        layer.appendChild(floor);
      }

      el.prepend(layer);
      added.push(layer);
    });

    let L = null;
    let last = "";

    const depthAt = (y) => {
      const a = L.anchors;
      if (y <= a[0][0]) return 0;
      for (let i = 1; i < a.length; i++) {
        if (y <= a[i][0]) return a[i - 1][1] + ((a[i][1] - a[i - 1][1]) * (y - a[i - 1][0])) / Math.max(1, a[i][0] - a[i - 1][0]);
      }
      return a[a.length - 1][1];
    };

    // ---- gauge: updated on scroll, at most once per frame ----
    const update = () => {
      if (!L) return;
      const sy = window.scrollY;
      const H = window.innerHeight;
      const p = Math.min(1, Math.max(0, sy / Math.max(1, L.docH - H)));
      const d = p > 0.995 ? DEPTHS.end : Math.max(0, depthAt(sy + H * p));
      const g = gaugeRef.current;
      if (g) {
        g.classList.toggle("is-on", sy + H * 0.5 > L.about);
        g.classList.toggle("is-deep", sy + H * 0.5 > L.create);
      }
      const text = String(Math.round(d / 5) * 5);
      if (text !== last && depthRef.current && zoneRef.current) {
        last = text;
        depthRef.current.textContent = `${Number(text).toLocaleString()} m`;
        zoneRef.current.textContent = zoneName(d);
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };

    // ---- layout: gradient + depth anchors (only on load/resize) ----
    const measure = () => {
      const top = (el) => el.getBoundingClientRect().top + window.scrollY;
      const bandTop = top(band);
      const bandBottom = bandTop + band.offsetHeight;
      const t = Object.fromEntries(IDS.map((id, i) => [id, top(els[i])]));
      L = {
        about: t.about,
        create: t.create,
        docH: document.documentElement.scrollHeight,
        anchors: [
          [t.about, DEPTHS.about],
          [t.experiences, DEPTHS.experiences],
          [t.projects, DEPTHS.projects],
          [t.create, DEPTHS.create],
          [t.contact, DEPTHS.contact],
          [bandBottom, DEPTHS.end],
        ],
      };
      // The light→dark drop sits in the padding between Projects and Create,
      // so no text ever lands on a mid-tone.
      const rel = (y) => Math.max(0, Math.round(y - bandTop));
      band.style.setProperty(
        "--dive-gradient",
        `linear-gradient(180deg, #F6F4EF 0px, #ECF3F1 ${rel(t.experiences)}px, #DDEEF0 ${rel(t.projects)}px,` +
          ` #C9E4EA ${rel(t.create - 70)}px, #23527A ${rel(t.create + 60)}px, #10304F ${rel(t.contact)}px,` +
          ` #081627 ${rel(bandBottom)}px)`
      );
      update();
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(measure, 150);
    };

    measure();
    const ro = new ResizeObserver(onResize);
    ro.observe(band);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(rt);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      added.forEach((node) => node.remove());
      band.classList.remove("dive");
      band.style.removeProperty("--dive-gradient");
      els.forEach((el) => el.classList.remove("dive-deep"));
    };
  }, []);

  return (
    <div ref={gaugeRef} className="dive-gauge" aria-hidden="true">
      <span className="dive-gauge__depth" ref={depthRef}>0 m</span>
      <span className="dive-gauge__zone" ref={zoneRef}>Sunlight zone</span>
      <span className="dive-gauge__track">
        <span className="dive-gauge__bar" ref={barRef} />
      </span>
    </div>
  );
}
