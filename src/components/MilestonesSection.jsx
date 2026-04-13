import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import JayShetty from "../components/assets/JayShetty.jpg"
import AtomicHabits from "../components/assets/AtomicHabits.jpg"
import Masters from "../components/assets/Masters.jpg"
import Jung from "../components/assets/JUNG.jpg"

/** ──────────────────────────────────────────────────────────────
 * Helpers for country flags
 * ──────────────────────────────────────────────────────────────*/
const CODE3_TO_ISO2 = {
  CAN: "CA",
  USA: "US",
  IT: "ITA", ITA: "IT",
  SWI: "CH", CHE: "CH", SUI: "CH",
  DEN: "DK",
  IND: "IN",
  ENG: "GB", // England → UK fallback
  KUW: "KW",
  FRA: "FR",
  BAH: "BS",
  HAI: "HT",
  JAM: "JM",
  UAE: "AE",
};

function iso2ToEmoji(code2 = "") {
  const up = (code2 || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(up)) return "🌍";
  const base = 0x1f1e6; // 'A'
  return String.fromCodePoint(...[...up].map(c => base + (c.charCodeAt(0) - 65)));
}
function flagUrlFromCode(displayCode = "") {
  const code2 = CODE3_TO_ISO2[displayCode?.toUpperCase()] || displayCode?.slice(0, 2)?.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code2)) return null;
  return `https://flagcdn.com/${code2.toLowerCase()}.svg`;
}

/**
 * MilestonesSection
 */
export default function MilestonesSection({
  gym = {
    lifts: [
      { key: "bench",   label: "Bench",   unit: "lb",   best: 255, lastUpdated: "2025-09-25", points: [170,185,195,205,215,225,255], target: 275 },
      { key: "squat",   label: "Squat",   unit: "lb",   best: 325, lastUpdated: "2025-09-25", points: [225,245,265,285,295,305,325], target: 365 },
      { key: "pullups", label: "Pullups", unit: "reps", best: 10,  lastUpdated: "2025-09-20", points: [0,0,1,4,8,10],                target: 12 },
    ],
  },
  travel = {
    countries: [
      { code: "CAN", name: "Canada" },
      { code: "IND", name: "India", year: 2025 },
      { code: "USA", name: "United States", year: 2025 },
      { code: "ITA",  name: "Italy", year: 2025 },
      { code: "SWI", name: "Switzerland", year: 2025 },
      { code: "DEN", name: "Denmark", year: 2025 },
      { code: "BAH", name: "Bahamas", year: 2022 },
      { code: "HAI", name: "Haiti", year: 2022 },
      { code: "JAM", name: "Jamaica", year: 2022 },
      { code: "ENG", name: "England", year: 2012 },
      { code: "KUW", name: "Kuwait", year: 2012 },
      { code: "FRA", name: "France", year: 2012 },
      { code: "UAE", name: "UAE", year: 2012 },
    ],
    goal: 25,
  },
  shelf = {
    items: [
      { type: "Podcast",    title: "On Purpose with Jay Shetty", by: "Jay Shetty", cover: JayShetty, progress: 0.7 },
      { type: "Book", title: "Many Lives, Many Masters", by: "Dr. Brian L. Weiss", cover: Masters, progress: 0.35 },
      { type: "Book",    title: "Atomic Habits", by: "James Clear", cover: AtomicHabits, progress: 0.15 },
      { type: "Book",    title: "Man and His Symbols", by: "C. G. Jung", cover: Jung, progress: 1 },
    ],
  },
  title = "Growth",
  subtitle = "Movement comes above all. Progress I’m proud of for my body, my adventurous self, and my mind.",
}) {
  useScopedStyles();

  const [activeLift, setActiveLift] = useState(gym.lifts[0].key);
  const active = useMemo(() => gym.lifts.find(l => l.key === activeLift) ?? gym.lifts[0], [activeLift, gym.lifts]);

  const countriesCount = travel.countries.length;
  const pct = Math.min(100, Math.round((countriesCount / travel.goal) * 100));

  // keyboard support for tabs
  const tabRefs = useRef({});
  const onTabsKey = useCallback((e) => {
    const idx = gym.lifts.findIndex(l => l.key === activeLift);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = gym.lifts[(idx + 1) % gym.lifts.length].key;
      setActiveLift(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = gym.lifts[(idx - 1 + gym.lifts.length) % gym.lifts.length].key;
      setActiveLift(prev);
      tabRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      const key = gym.lifts[0].key;
      setActiveLift(key);
      tabRefs.current[key]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const key = gym.lifts[gym.lifts.length - 1].key;
      setActiveLift(key);
      tabRefs.current[key]?.focus();
    }
  }, [activeLift, gym.lifts]);

  return (
    <section className="mile">
      <header className="mile__hdr">
        <h2 className="mile__title">{title}</h2>
        <p className="mile__subtitle">{subtitle}</p>
      </header>

      <div className="mile__grid">
        {/* GYM GROWTH */}
        <article className="card card--gym">
          <div className="card__hdr">
            <span className="chip">Gym Growth</span>
            <div className="tabs" role="tablist" aria-label="Lifts" onKeyDown={onTabsKey}>
              {gym.lifts.map(lift => (
                <button
                  key={lift.key}
                  ref={el => (tabRefs.current[lift.key] = el)}
                  role="tab"
                  aria-selected={activeLift === lift.key}
                  aria-controls={`lift-panel-${lift.key}`}
                  id={`lift-tab-${lift.key}`}
                  className={`tab ${activeLift === lift.key ? "is-active" : ""}`}
                  onClick={() => setActiveLift(lift.key)}
                  type="button"
                >
                  {lift.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card__body" id={`lift-panel-${active.key}`} role="tabpanel" aria-labelledby={`lift-tab-${active.key}`}>
            <div className="stat">
              <div className="stat__num">
                {active.best}
                <span className="stat__unit">{active.unit}</span>
              </div>
              <div className="stat__lbl">Current Best</div>
              <div className="stat__meta">Updated {fmtDate(active.lastUpdated)}</div>
            </div>

            <MiniLineChart
              points={active.points}
              unit={active.unit}
              target={active.target}
            />

            <ul className="legend" aria-hidden="true">
              <li><span className="dot" /> Previous PR</li>
              <li className="muted">Trend is illustrative</li>
            </ul>
          </div>
        </article>

        {/* COUNTRIES */}
        <article className="card card--travel">
          <div className="card__hdr">
            <span className="chip">Countries Visited (25 by 25)</span>
            <span className="count">{countriesCount} / {travel.goal}</span>
          </div>

          <div className="card__body card__body--travel">
            <div className="ring-wrap">
              <ProgressRing value={pct} label={`${pct}% of goal`} />
            </div>

            <ul className="stamps" aria-label="Visited countries">
              {travel.countries.map((c) => {
                const url = flagUrlFromCode(c.code);
                const code2 = CODE3_TO_ISO2[c.code?.toUpperCase()] || c.code?.slice(0,2)?.toUpperCase();
                return (
                  <li key={`${c.code}-${c.year || "na"}`} className="stamp" title={`${c.name}${c.year ? ` (${c.year})` : ""}`}>
                    <span className="flag-box" aria-hidden="true">
                      {url ? (
                        <img className="flag-img" src={url} alt="" loading="lazy" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="flag-emoji">{iso2ToEmoji(code2)}</span>
                      )}
                    </span>
                    <span className="code" aria-hidden="true">{c.code}</span>
                    {c.year ? <span className="year">{c.year}</span> : <span className="year muted">—</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </article>

        {/* SHELF */}
        <article className="card card--shelf">
          <div className="card__hdr">
            <span className="chip">On My Shelf</span>
            <span className="hint">Scroll ▸</span>
          </div>

          <div className="shelf" role="list">
            {shelf.items.map((it, i) => (
              <div className="tile" role="listitem" key={`${it.title}-${i}`}>
                <div className="cover">
                  <img src={it.cover} alt={`${it.type} cover for ${it.title}`} />
                </div>
                <div className="tile__meta">
                  <div className="eyebrow">{it.type}</div>
                  <div className="t">{it.title}</div>
                  <div className="by">{it.by}</div>
                  <div className="bar" aria-label={`Progress ${Math.round(it.progress * 100)}%`}>
                    <div className="fill" style={{ width: `${Math.round(it.progress * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

/* =============================
   PRESENTATION UTILITIES
============================= */
function useScopedStyles() {
  const styleRef = useRef(null);
  useEffect(() => {
    if (styleRef.current) return; // once
    const el = document.createElement("style");
    el.setAttribute("data-milestones", "");
    el.textContent = CSS_TEXT;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);
}
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
}

/* =============================
   MINI LINE CHART (SVG) — with target, PR tag, tooltip
============================= */
function MiniLineChart({ points = [], unit = "", target }) {
  const w = 400, h = 140, pad = 10;
  const min = Math.min(...points);
  const max = Math.max(...points, target ?? -Infinity);
  const scaleX = (i) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1);
  const scaleY = (v) => pad + (h - pad * 2) - ((v - min) / Math.max(1, (max - min) || 1)) * (h - pad * 2);
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`).join(" ");
  const area = `M${pad},${h - pad} ${points.map((v, i) => `L${scaleX(i)},${scaleY(v)}`).join(" ")} L${w - pad},${h - pad} Z`;

  // tooltip
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // {x,y,val,idx}

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // find nearest point by x
    const xs = points.map((_, i) => scaleX(i));
    let idx = 0, best = Infinity;
    xs.forEach((vx, i) => {
      const diff = Math.abs(vx - x);
      if (diff < best) { best = diff; idx = i; }
    });
    const val = points[idx];
    setHover({ x: xs[idx], y: scaleY(val), val, idx });
  };
  const onLeave = () => setHover(null);

  // target y
  const ty = target != null ? scaleY(target) : null;

  return (
    <div className="mini-wrap" ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave}>
      <svg className="mini" viewBox={`0 0 ${w} ${h}`} width="100%" height="150" role="img" aria-label="progress chart">
        <defs>
          <linearGradient id="miniArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {ty != null && (
          <>
            <line x1={pad} x2={w - pad} y1={ty} y2={ty} className="mini__target"/>
            <text x={pad + 4} y={ty - 6} className="mini__target-label">Target {target} {unit}</text>
          </>
        )}

        <path className="mini__area" d={area} />
        <path className="mini__line" d={d} />

        {points.map((v, i) => (
          <g key={i}>
            <circle cx={scaleX(i)} cy={scaleY(v)} r={3.6} className="mini__pt" />
            {i === points.length - 1 && <text x={scaleX(i) + 8} y={scaleY(v) - 8} className="mini__pr">PR</text>}
          </g>
        ))}

        {hover && (
          <>
            <line x1={hover.x} x2={hover.x} y1={pad} y2={h - pad} className="mini__hover-line"/>
            <circle cx={hover.x} cy={hover.y} r="5" className="mini__pt mini__pt--hover" />
          </>
        )}
      </svg>

      {hover && (
        <div className="mini__tip" style={{ left: hover.x, top: hover.y }}>
          <div className="mini__tip-val">{hover.val}<span className="u">{unit}</span></div>
          <div className="mini__tip-sub">Session {hover.idx + 1}</div>
        </div>
      )}
    </div>
  );
}

/* =============================
   PROGRESS RING (SVG)
============================= */
function ProgressRing({ value = 0, size = 120, label = "" }) {
  const r = 52, c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;
  return (
    <div className="ring" aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle className="ring__bg" cx="60" cy="60" r={r} />
        <circle className="ring__fg" cx="60" cy="60" r={r} strokeDasharray={`${dash} ${c - dash}`} transform="rotate(-90 60 60)" />
      </svg>
      <div className="ring__txt">
        <div className="ring__num">{clamped}%</div>
        <div className="ring__lbl">to goal</div>
      </div>
    </div>
  );
}

/* =============================
   SCOPED CSS
============================= */
const CSS_TEXT = `
:root{
  --brand: hsl(208 100% 62%);
  --brand-2: hsl(190 95% 62%);
  --bg-0: hsl(220 18% 9%);
  --bg-1: hsl(220 18% 12%);
  --bg-2: hsl(220 16% 16%);
  --txt-1: hsl(210 30% 96%);
  --txt-2: hsl(215 20% 78%);
  --muted: hsl(215 14% 64%);
  --ok: hsl(151 68% 44%);
  --shadow: 0 10px 30px hsl(220 50% 2% / 0.35);
  --radius: 18px;

  --flag-w: 28px;
  --flag-h: 20px;
  --flag-pad: 2px;
}

.mile{
  position: relative;
  display: grid;
  gap: clamp(18px, 3vw, 28px);
  padding: clamp(16px, 3.2vw, 28px);
  color: var(--txt-1);
  background: linear-gradient(180deg, var(--bg-0), var(--bg-1));
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.mile__hdr{ display: grid; gap: 6px; }
.mile__title{ font-size: clamp(24px, 3.4vw, 40px); line-height: 1.05; letter-spacing: -0.02em; font-weight: 800; }
.mile__subtitle{ color: var(--txt-2); font-size: clamp(14px, 1.7vw, 16px); }

.mile__grid{ display: grid; grid-template-columns: repeat(12, 1fr); gap: clamp(16px, 2.4vw, 24px); }
.card{ grid-column: span 12; }
@media (min-width: 760px){
  .card--gym{ grid-column: span 7; }
  .card--travel{ grid-column: span 5; }
  .card--shelf{ grid-column: span 12; }
}

.card{
  background: linear-gradient(180deg, var(--bg-1), var(--bg-2));
  border: 1px solid hsl(220 18% 20% / 0.7);
  border-radius: var(--radius);
  padding: clamp(14px, 2.2vw, 22px);
  box-shadow: var(--shadow);
}
.card__hdr{ display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.chip{
  font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px;
  background: linear-gradient(90deg, var(--brand), var(--brand-2)); color: white; box-shadow: 0 4px 14px hsl(200 100% 50% / 0.35);
}

/* Tabs */
.tabs{ display: flex; gap: 6px; }
.tab{
  cursor: pointer;
  background: hsl(220 18% 20% / 0.55);
  color: var(--txt-2);
  border: 1px solid hsl(220 18% 22% / 0.7);
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  transition: 200ms ease;
}
.tab:hover{ filter: brightness(1.12); }
.tab.is-active{ color: white; background: linear-gradient(90deg, var(--brand), var(--brand-2)); border-color: transparent; }

.card__body{ display: grid; gap: 10px; }

/* Stat */
.stat{ display: grid; gap: 4px; }
.stat__num{ font-size: 42px; font-weight: 800; letter-spacing: -0.02em; }
.stat__unit{ font-size: 16px; margin-left: 6px; color: var(--txt-2); font-weight: 600; }
.stat__lbl{ color: var(--txt-2); font-weight: 600; }
.stat__meta{ color: var(--muted); font-size: 12px; }

/* Legend */
.legend{ display: flex; gap: 14px; align-items: center; color: var(--muted); font-size: 12px; }
.legend .dot{ width: 8px; height: 8px; border-radius: 999px; background: var(--brand); display: inline-block; box-shadow: 0 0 0 4px hsl(200 100% 50% / 0.14); margin-right: 6px; }
.legend .muted{ opacity: 0.8; }

/* Mini chart */
.mini-wrap{ position: relative; }
.mini{ overflow: visible; color: var(--brand); }
.mini__line{ fill: none; stroke: currentColor; stroke-width: 3; filter: drop-shadow(0 2px 6px hsl(200 100% 50% / 0.35)); }
.mini__area{ fill: url(#miniArea); }
.mini__pt{ fill: white; stroke: currentColor; stroke-width: 2; }
.mini__pt--hover{ r: 6; }
.mini__pr{ font-size: 10px; fill: var(--txt-2); }
.mini__hover-line{ stroke: hsl(210 20% 70% / .25); stroke-width: 1; }
.mini__target{ stroke: hsl(210 20% 70% / .35); stroke-dasharray: 5 5; }
.mini__target-label{ font-size: 10px; fill: var(--txt-2); }
.mini__tip{
  position: absolute; transform: translate(-50%, -120%); pointer-events: none;
  background: hsl(220 18% 18%); border: 1px solid hsl(220 18% 26% / .7); padding: 6px 8px; border-radius: 8px;
  box-shadow: var(--shadow); white-space: nowrap;
}
.mini__tip-val{ font-weight: 800; }
.mini__tip-val .u{ margin-left: 3px; color: var(--txt-2); font-weight: 600; }
.mini__tip-sub{ color: var(--txt-2); font-size: 12px; margin-top: 2px; }

/* Travel */
.card__body--travel{ display: grid; grid-template-columns: 140px 1fr; gap: 16px; align-items: start; }
.count{ color: var(--txt-2); font-weight: 700; }
.ring-wrap{ position: sticky; top: 12px; }

.ring{ position: relative; width: 120px; height: 120px; display: grid; place-items: center; }
.ring__bg{ fill: none; stroke: hsl(220 14% 25%); stroke-width: 10; }
.ring__fg{ fill: none; stroke: var(--ok); stroke-width: 10; stroke-linecap: round; filter: drop-shadow(0 4px 12px hsl(151 68% 44% / 0.25)); }
.ring__txt{ position: absolute; text-align: center; }
.ring__num{ font-size: 22px; font-weight: 800; }
.ring__lbl{ color: var(--txt-2); font-size: 12px; }

.stamps{ display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.stamp{
  background: linear-gradient(180deg, hsl(220 18% 18%), hsl(220 18% 14%));
  border: 1px dashed hsl(210 30% 96% / 0.25);
  box-shadow: inset 0 0 0 8px hsl(200 100% 50% / 0.04);
  padding: 10px 12px;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  transform: rotate(calc(var(--tw) * 1deg));
  transition: transform 200ms ease, filter 200ms ease;
}
.stamp:hover{ transform: rotate(0deg) translateY(-3px); filter: brightness(1.05); }

/* Flags */
.flag-box{
  width: var(--flag-w);
  height: var(--flag-h);
  padding: var(--flag-pad);
  display: grid; place-items: center;
  border-radius: 6px;
  background: hsl(220 18% 20% / 0.6);
  box-shadow: 0 0 0 1px hsl(220 18% 22% / .55), 0 2px 6px hsl(220 50% 2% / .35);
}
.flag-img{ width: 100%; height: 100%; object-fit: contain; border-radius: 4px; }
.flag-emoji{ font-size: 14px; line-height: 1; }

.stamp .code{ font-weight: 800; letter-spacing: 0.08em; }
.stamp .year{ color: var(--muted); font-size: 12px; }
.stamp .year.muted{ opacity: .6; }
.stamp:nth-child(odd){ --tw: -1.6; }
.stamp:nth-child(even){ --tw: 1.2; }

/* Shelf */
.card--shelf{ overflow: hidden; }
.hint{ color: var(--txt-2); font-size: 12px; }
.shelf{
  display: grid;
  grid-auto-flow: column;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
}
.shelf::-webkit-scrollbar{ height: 10px; }
.shelf::-webkit-scrollbar-thumb{ background: hsl(220 18% 30%); border-radius: 999px; }

.tile{
  scroll-snap-align: start;
  min-width: min(280px, 78vw);
  background: linear-gradient(180deg, hsl(220 18% 18%), hsl(220 18% 14%));
  border: 1px solid hsl(220 18% 20% / 0.7);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
}
.cover{ aspect-ratio: 16/10; overflow: hidden; }
.cover img{ width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 300ms ease; }
.tile:hover .cover img{ transform: scale(1.1); }
.tile__meta{ padding: 12px; display: grid; gap: 6px; }
.eyebrow{ text-transform: uppercase; letter-spacing: 0.09em; font-size: 11px; color: var(--txt-2); }
.t{ font-weight: 800; letter-spacing: -0.01em; }
.by{ color: var(--muted); font-size: 13px; }
.bar{ height: 8px; background: hsl(220 18% 22%); border-radius: 999px; overflow: hidden; margin-top: 4px; }
.fill{ height: 100%; background: linear-gradient(90deg, var(--brand), var(--brand-2)); box-shadow: 0 6px 16px hsl(200 100% 50% / 0.35); }
`;
