import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import WorldMap from "react-svg-worldmap";
import JayShetty from "../components/assets/JayShetty.jpg";
import AtomicHabits from "../components/assets/AtomicHabits.jpg";
import Masters from "../components/assets/Masters.jpg";
import Jung from "../components/assets/JUNG.jpg";
import Morrie from "../components/assets/Morrie.jpg";
import MilanoFlowers from "../components/assets/MilanoFlowers.jpg";

// Full country names only from here on — the old badge showed raw codes
// like "ENG" next to proper names, which reads as the UK when it actually
// meant England specifically. iso2 below is just what the map component
// needs to draw the country; it's never shown to the user.
const ISO2 = {
  Canada: "ca",
  India: "in",
  "United States": "us",
  Italy: "it",
  Switzerland: "ch",
  Denmark: "dk",
  Bahamas: "bs",
  Haiti: "ht",
  Jamaica: "jm",
  England: "gb",
  Kuwait: "kw",
  France: "fr",
  UAE: "ae",
};

export default function MilestonesSection({
  gym = {
    lifts: [
      { key: "bench", label: "Bench", unit: "lb", best: 255, lastUpdated: "2025-09-25", points: [170, 185, 195, 205, 215, 225, 255], target: 275 },
      { key: "squat", label: "Squat", unit: "lb", best: 325, lastUpdated: "2025-09-25", points: [225, 245, 265, 285, 295, 305, 325], target: 365 },
      { key: "pullups", label: "Pull-ups", unit: "reps", best: 10, lastUpdated: "2025-09-20", points: [0, 0, 1, 4, 8, 10], target: 12 },
    ],
  },
  travel = {
    countries: [
      { name: "Canada" },
      { name: "India", year: 2025 },
      { name: "United States", year: 2025 },
      { name: "Italy", year: 2025 },
      { name: "Switzerland", year: 2025 },
      { name: "Denmark", year: 2025 },
      { name: "Bahamas", year: 2022 },
      { name: "Haiti", year: 2022 },
      { name: "Jamaica", year: 2022 },
      { name: "England", year: 2012 },
      { name: "Kuwait", year: 2012 },
      { name: "France", year: 2012 },
      { name: "UAE", year: 2012 },
    ],
    goal: 25,
    mostRecent: { name: "Italy", year: 2025, photo: MilanoFlowers },
  },
  shelf = {
    items: [
      { type: "Podcast", title: "On Purpose with Jay Shetty", by: "Jay Shetty", cover: JayShetty, progress: 0.7 },
      { type: "Book", title: "Many Lives, Many Masters", by: "Dr. Brian L. Weiss", cover: Masters, progress: 0.35 },
      { type: "Book", title: "Atomic Habits", by: "James Clear", cover: AtomicHabits, progress: 0.15 },
      { type: "Book", title: "Man and His Symbols", by: "C. G. Jung", cover: Jung, progress: 1 },
      { type: "Book", title: "Tuesdays with Morrie", by: "Mitch Albom", cover: Morrie, progress: 1 },
    ],
  },
  title = "Life in Progress",
  subtitle = "You are made of an assortment of habits, experiences, and knowledge. Here's what I want to keep improving.",
}) {
  useScopedStyles();
  const reduceMotion = useReducedMotion();
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.25", "end 0.75"],
  });

  const [activeLift, setActiveLift] = useState(null);
  const countriesCount = travel.countries.length;
  const finishedBooks = shelf.items.filter((b) => b.progress === 1).length;

  return (
    <section className="lip">
      <div className="lip__hdr">
        <div className="lip__hdr-row">
          <span className="lip__eyebrow">LIFE IN PROGRESS</span>
          <span className="lip__year">2026</span>
        </div>
        <p className="lip__subtitle">{subtitle}</p>
      </div>

      <div className="lip__rail-wrap" ref={railRef}>
        <div className="lip__rail-track" aria-hidden="true" />
        <motion.div
          className="lip__rail"
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
        />

        {/* 01 / BODY */}
        <section className="lip__chapter">
          <div className="lip__chapter-num">01</div>
          <div className="lip__chapter-body">
            <span className="lip__chapter-kicker">PHYSICAL</span>
            <h2 className="lip__chapter-headline">
              1% stronger <span className="lip__accent">every day.</span>
            </h2>
            <p className="lip__note">
              Training taught me that progress is usually invisible until suddenly it isn't.
            </p>

            <div className="lip__tiles">
              {gym.lifts.map((lift) => {
                const pct = Math.min(100, Math.round((lift.best / lift.target) * 100));
                const isOpen = activeLift === lift.key;
                return (
                  <button
                    key={lift.key}
                    type="button"
                    className={`lip__tile ${isOpen ? "is-open" : ""}`}
                    onClick={() => setActiveLift((cur) => (cur === lift.key ? null : lift.key))}
                    aria-expanded={isOpen}
                  >
                    <span className="lip__tile-label">{lift.label}</span>
                    <span className="lip__tile-num">
                      {lift.best}
                      <span className="lip__tile-unit">{lift.unit}</span>
                    </span>
                    <span className="lip__tile-goal">Goal: {lift.target}</span>

                    <span className="lip__tile-bar-track">
                      <motion.span
                        className="lip__tile-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
                      />
                    </span>

                    <span className={`lip__tile-progression ${isOpen ? "is-open" : ""}`}>
                      {lift.points.join(` → `)} {lift.unit}
                      <span className="lip__tile-updated">Updated {fmtDate(lift.lastUpdated)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 02 / WORLD */}
        <section className="lip__chapter">
          <div className="lip__chapter-num">02</div>
          <div className="lip__chapter-body">
            <span className="lip__chapter-kicker">SPIRITUAL</span>

            <div className="lip__world-grid">
              <div className="lip__map-wrap">
                <WorldMap
                  size="responsive"
                  color="var(--lip-amber)"
                  backgroundColor="transparent"
                  borderColor="var(--lip-line)"
                  strokeOpacity={0.6}
                  data={travel.countries.map((c) => ({ country: ISO2[c.name], value: 1 }))}
                  tooltipTextFunction={(ctx) => {
                    const c = travel.countries.find((c) => ISO2[c.name] === ctx.countryCode.toLowerCase());
                    return c ? `${c.name}${c.year ? ` · ${c.year}` : ""}` : ctx.countryName;
                  }}
                  styleFunction={(ctx) =>
                    ctx.countryValue !== undefined
                      ? {
                          fill: "var(--lip-amber)",
                          fillOpacity: 0.85,
                          stroke: "var(--lip-line)",
                          strokeWidth: 0.6,
                          cursor: "pointer",
                        }
                      : {
                          fill: "var(--lip-line)",
                          fillOpacity: 1,
                          stroke: "var(--lip-bg)",
                          strokeWidth: 0.6,
                        }
                  }
                />
              </div>

              <aside className="lip__world-side">
                <div className="lip__world-count">
                  <span className="lip__world-count-num">{String(countriesCount).padStart(2, "0")}</span>
                  <span className="lip__world-count-goal">/ {travel.goal}</span>
                </div>
                <div className="lip__world-goal-label">Countries before 25</div>

                {travel.mostRecent && (
                  <div className="lip__trip">
                    <img src={travel.mostRecent.photo} alt="" className="lip__trip-photo" />
                    <div className="lip__trip-meta">
                      <span className="lip__trip-kicker">Most recent</span>
                      <span className="lip__trip-name">
                        {travel.mostRecent.name} · {travel.mostRecent.year}
                      </span>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* 03 / MIND */}
        <section className="lip__chapter lip__chapter--mind">
          <div className="lip__chapter-num">03</div>
          <div className="lip__chapter-body">
            <span className="lip__chapter-kicker">MENTAL</span>
            <h2 className="lip__chapter-headline">
              {finishedBooks} finished, {shelf.items.length - finishedBooks} in progress.
            </h2>

            <div className="lip__shelf">
              {shelf.items.map((it, i) => {
                const status = it.progress === 1 ? "Finished" : "Reading";
                return (
                  <div className="lip__book" key={`${it.title}-${i}`} style={{ "--r": i % 2 === 0 ? "-3deg" : "3deg" }}>
                    <img src={it.cover} alt={`${it.type} cover for ${it.title}`} className="lip__book-cover" />
                    <div className="lip__book-meta">
                      <span className="lip__book-type">{it.type}</span>
                      <span className="lip__book-title">{it.title}</span>
                      <span className="lip__book-by">{it.by}</span>
                      <span className="lip__book-status">{status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="lip__shelf-line" aria-hidden="true" />
          </div>
        </section>
      </div>
    </section>
  );
}

/* ---------------- helpers + scoped styles ---------------- */
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function useScopedStyles() {
  const styleRef = useRef(null);
  useEffect(() => {
    if (styleRef.current) return;
    const el = document.createElement("style");
    el.setAttribute("data-life-in-progress", "");
    el.textContent = CSS_TEXT;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
    };
  }, []);
}

const CSS_TEXT = `
.lip{
  /* Deliberately dark (per design brief) but built from the site's own
     tokens instead of an unrelated custom navy — --text-1 (the site's
     near-black) as the background, --bg-1 (the site's off-white) as the
     inverted primary text, so this page reads as "this site, inverted"
     rather than a different palette bolted on. Amber stays a one-off —
     it's the deliberate single warm accent against all the blue. */
  /* Same light palette as the rest of the site — this page just reuses the
     global tokens directly rather than inventing its own theme. */
  --lip-bg: var(--bg-1);
  --lip-panel: var(--panel);
  --lip-panel-hover: var(--highlight);
  --lip-line: var(--line);
  --lip-track: var(--line);
  --lip-txt1: var(--text-1);
  --lip-txt2: var(--text-2);
  --lip-txt3: var(--text-3);
  --lip-blue: var(--accent);
  --lip-amber: #b45309;

  /* !important: a legacy global rule forces every bare <section> tag to
     background:transparent!important (see styles.css, "keep sections clear
     so the global background shows through"), which would otherwise let the
     page's real background bleed through unpredictably here. */
  background: var(--lip-bg) !important;
  color: var(--lip-txt1);
  padding: clamp(96px, 12vw, 140px) clamp(20px, 6vw, 60px) clamp(80px, 10vw, 120px);
  min-height: 100vh;
}

.lip__hdr{ max-width: 1200px; margin: 0 auto clamp(48px, 7vw, 80px); }
.lip__hdr-row{ display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
.lip__eyebrow{
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px; font-weight: 700; letter-spacing: .14em; color: var(--lip-blue);
}
.lip__year{
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px; color: var(--lip-txt3);
}
.lip__subtitle{
  max-width: 52ch; font-size: clamp(20px, 2.6vw, 28px); font-weight: 700;
  letter-spacing: -.01em; color: var(--lip-txt1); margin: 0;
}

.lip__rail-wrap{ position: relative; max-width: 1200px; margin: 0 auto; padding-left: clamp(48px, 6vw, 76px); }
.lip__rail-track, .lip__rail{
  position: absolute; left: 8px; top: 6px; bottom: 6px; width: 2px; border-radius: 2px;
}
.lip__rail-track{ background: var(--lip-line); }
.lip__rail{ background: linear-gradient(180deg, var(--lip-blue), var(--lip-amber)); transform-origin: top; }

.lip__chapter{ position: relative; padding: clamp(48px, 7vw, 76px) 0; border-top: 1px solid var(--lip-line); }
.lip__chapter:first-child{ border-top: none; }
.lip__chapter-num{
  position: absolute; left: clamp(-48px, -6vw, -76px); top: clamp(48px, 7vw, 76px);
  font-size: clamp(48px, 7vw, 84px); font-weight: 900; color: var(--lip-txt1);
  opacity: .06; line-height: 1; user-select: none; pointer-events: none;
}
.lip__chapter-kicker{
  display: block;
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px; font-weight: 700; letter-spacing: .14em; color: var(--lip-txt3);
  margin-bottom: 14px;
}
.lip__chapter-headline{
  font-size: clamp(24px, 3.2vw, 34px); font-weight: 800; letter-spacing: -.01em;
  max-width: 26ch; margin: 0 0 14px;
}
.lip__accent{ color: var(--lip-amber); }
.lip__note{ max-width: 52ch; color: var(--lip-txt2); font-size: 15px; line-height: 1.6; margin: 0 0 32px; font-style: italic; }

/* strength tiles */
.lip__tiles{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
.lip__tile{
  all: unset; box-sizing: border-box; cursor: pointer;
  display: flex; flex-direction: column; gap: 6px;
  padding: 20px; border-radius: 12px;
  background: var(--lip-panel); border: 1px solid var(--lip-line);
  box-shadow: 0 4px 14px rgba(17,24,39,.05);
  transition: border-color .2s ease, background .2s ease;
}
.lip__tile:hover, .lip__tile.is-open{ border-color: var(--lip-line); background: var(--lip-panel-hover); }
.lip__tile-label{ font-size: 12.5px; letter-spacing: .04em; text-transform: uppercase; color: var(--lip-txt3); }
.lip__tile-num{ font-size: clamp(30px, 3.4vw, 38px); font-weight: 800; letter-spacing: -.02em; }
.lip__tile-unit{ font-size: 14px; margin-left: 4px; color: var(--lip-txt2); font-weight: 600; }
.lip__tile-goal{ font-size: 12.5px; color: var(--lip-txt3); margin-bottom: 6px; }
.lip__tile-bar-track{ display: block; height: 4px; border-radius: 999px; background: var(--lip-track); overflow: hidden; }
.lip__tile-bar-fill{ display: block; height: 100%; background: linear-gradient(90deg, var(--lip-blue), var(--lip-amber)); }
.lip__tile-progression{
  display: block; text-align: left;
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px; color: var(--lip-txt3);
  max-height: 0; opacity: 0; overflow: hidden;
  transition: max-height .3s ease, opacity .25s ease, margin-top .3s ease;
}
.lip__tile-progression.is-open{ max-height: 80px; opacity: 1; margin-top: 10px; }
.lip__tile-updated{ display: block; margin-top: 4px; color: var(--lip-txt3); opacity: .7; }

/* world */
.lip__world-grid{ display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(220px, 1fr); gap: clamp(24px, 4vw, 48px); align-items: center; }
@media (max-width: 760px){ .lip__world-grid{ grid-template-columns: 1fr; } }
.lip__map-wrap{ width: 100%; }
.lip__map-wrap svg{ width: 100%; height: auto; }

.lip__world-side{ display: flex; flex-direction: column; gap: 4px; }
.lip__world-count{ display: flex; align-items: baseline; gap: 6px; }
.lip__world-count-num{ font-size: clamp(36px, 4.4vw, 48px); font-weight: 800; letter-spacing: -.02em; }
.lip__world-count-goal{ font-size: 18px; color: var(--lip-txt3); }
.lip__world-goal-label{ font-size: 12.5px; letter-spacing: .04em; text-transform: uppercase; color: var(--lip-txt3); margin-bottom: 24px; }

.lip__trip{ display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; background: var(--lip-panel); border: 1px solid var(--lip-line); }
.lip__trip-photo{ width: 56px; height: 56px; object-fit: cover; border-radius: 6px; }
.lip__trip-meta{ display: flex; flex-direction: column; gap: 2px; }
.lip__trip-kicker{ font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--lip-txt3); }
.lip__trip-name{ font-size: 14px; font-weight: 700; }

/* shelf */
.lip__shelf{ display: flex; gap: clamp(16px, 3vw, 28px); flex-wrap: wrap; align-items: flex-end; padding-top: 8px; }
.lip__book{
  --r: 0deg;
  position: relative; width: 108px;
  display: flex; flex-direction: column; align-items: center;
  transform: rotate(var(--r));
  transition: transform .25s cubic-bezier(.16,1,.3,1);
}
.lip__book:hover{ transform: rotate(0deg) translateY(-8px); z-index: 2; }
.lip__book-cover{ width: 100%; aspect-ratio: 2/3; object-fit: cover; border-radius: 4px; box-shadow: 0 10px 22px rgba(0,0,0,.4); }
.lip__book-meta{ margin-top: 10px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; opacity: 0; transform: translateY(4px); transition: opacity .2s ease, transform .2s ease; }
.lip__book:hover .lip__book-meta{ opacity: 1; transform: translateY(0); }
.lip__book-type{ font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--lip-txt3); }
.lip__book-title{ font-size: 12.5px; font-weight: 700; line-height: 1.3; }
.lip__book-by{ font-size: 11px; color: var(--lip-txt3); }
.lip__book-status{ font-size: 10.5px; font-weight: 700; color: var(--lip-amber); margin-top: 2px; }
.lip__shelf-line{ height: 2px; background: var(--lip-line); margin-top: 12px; border-radius: 2px; }

@media (max-width: 640px){
  .lip__chapter-num{ display: none; }
  .lip__rail-wrap{ padding-left: 0; }
  .lip__rail-track, .lip__rail{ display: none; }
}
`;
