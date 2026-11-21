// src/components/ProjectVisuals.jsx
// Visuals for the three lead projects, shared by the hero preview and the
// Projects section.
//
// Honesty rules:
// - UW Study Spots uses REAL screenshots of the live site (uwstudyspots.vercel.app).
// - Draftfolio has no public deployment yet, so it gets an interface SKETCH
//   built from the repo's real design (ledger, invariants, explainer). It is
//   labelled as a sketch on screen and its figures are placeholders.
// - NHL Predictions renders real rows copied from predictions_2026-01-14.csv
//   in the NHL-Game-Predictor repo, and says so on screen.
import React from "react";
import uwHome from "./assets/projects/uwss-home.jpg";
import uwMap from "./assets/projects/uwss-map.jpg";

export const LEAD_PROJECTS = [
  {
    id: "uw-study-spots",
    title: "UW Study Spots",
    short: "Study Spots",
    kind: "Live product",
    tagline: "Find a good study spot before you waste the walk.",
    url: "https://uwstudyspots.vercel.app/",
    urlLabel: "Visit the live site",
    repo: "https://github.com/sunishth-bhogal/uw-study-spots",
    problem:
      "Waterloo students walk across campus only to find their study spot is packed or loud.",
    built:
      "A campus map of study spaces with live busyness where data exists, plus quick student reports on quietness, seating and crowd levels. A scheduled job refreshes occupancy, and each spot keeps a history.",
    outcome: "Used by 200+ students a month at Waterloo.",
    stack: ["Next.js", "TypeScript", "Supabase", "Leaflet", "Recharts"],
  },
  {
    id: "draftfolio",
    title: "Draftfolio",
    short: "Draftfolio",
    kind: "In development",
    tagline: "A ledger you can't lose or invent money in.",
    url: null,
    urlLabel: null,
    repo: "https://github.com/sunishth-bhogal/Draftfolio",
    problem:
      "A trading game is only fair if its books are exact: rounding errors, retried requests and edited history all quietly create or destroy money.",
    built:
      "A simulated sports market for virtual NBA player assets, traded with fake money. It runs on an append-only brokerage ledger with Decimal money, idempotent orders, and positions rebuilt from the log. Prices come from real box scores and every price movement gets a plain-language explanation.",
    outcome:
      "Six ledger invariants, such as “cash + market value = equity” and “replaying the log reproduces live state,” are checked by property-based tests over thousands of generated trade sequences. CI runs the tests and a production build on every push.",
    stack: ["FastAPI", "Postgres", "Redis", "Next.js", "Hypothesis"],
  },
  {
    id: "nhl",
    title: "NHL Predictions",
    short: "NHL model",
    kind: "Model",
    tagline: "Win probabilities for every game left on the schedule.",
    url: null,
    urlLabel: null,
    repo: "https://github.com/sunishth-bhogal/NHL-Game-Predictor",
    problem: "As a Leafs fan, I wanted an honest read on how the rest of the season might go.",
    built:
      "A Python pipeline that pulls games from the NHL API, builds Elo ratings and rolling 10-game form, and fits a logistic regression to predict each game's home-win probability and a likely score.",
    outcome: "One run produced predictions for 578 upcoming games.",
    stack: ["Python", "Pandas", "scikit-learn", "NHL API"],
  },
];

/* ---------- shared browser frame ---------- */
export function BrowserFrame({ address, note, children, className = "" }) {
  return (
    <div className={`pv-frame ${className}`}>
      <div className="pv-bar" aria-hidden="true">
        <span className="pv-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="pv-address">{address}</span>
      </div>
      <div className="pv-screen">{children}</div>
      {note ? <p className="pv-note">{note}</p> : null}
    </div>
  );
}

/* ---------- UW Study Spots: real screenshots ---------- */
export function UWStudySpotsShot({ variant = "home" }) {
  const src = variant === "map" ? uwMap : uwHome;
  const alt =
    variant === "map"
      ? "Screenshot of UW Study Spots: a campus map with study spots marked across the University of Waterloo."
      : "Screenshot of the UW Study Spots home page: “Find a good study spot before you waste the walk,” with live campus stats.";
  return (
    <BrowserFrame address="uwstudyspots.vercel.app" note="Screenshot of the live site">
      <img className="pv-img" src={src} alt={alt} loading={variant === "home" ? "eager" : "lazy"} />
    </BrowserFrame>
  );
}

/* ---------- Draftfolio: labelled interface sketch ---------- */
const LEDGER_ROWS = [
  { id: "tx_0412", type: "BUY", what: "Player asset A × 10" },
  { id: "tx_0413", type: "FEE", what: "Execution fee" },
  { id: "tx_0414", type: "SELL", what: "Player asset B × 4" },
];
const INVARIANTS = [
  "cash + market value = equity",
  "replay(log) == live state",
  "same order id twice → no-op",
  "cash never goes negative",
];

export function DraftfolioSketch() {
  return (
    <BrowserFrame
      address="draftfolio · local build"
      note="Interface sketch based on the repo's design. Not a screenshot, and the values are placeholders."
      className="pv-frame--sketch"
    >
      <div className="dfs">
        <div className="dfs-top">
          <div>
            <p className="dfs-label">Player asset A</p>
            <p className="dfs-price">
              <span className="dfs-skel dfs-skel--lg" aria-hidden="true" />
              <span className="dfs-chip">priced from box scores</span>
            </p>
          </div>
          <span className="dfs-btn" aria-hidden="true">Trade</span>
        </div>

        <svg className="dfs-chart" viewBox="0 0 320 90" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="dfsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(37,99,235,.22)" />
              <stop offset="1" stopColor="rgba(37,99,235,0)" />
            </linearGradient>
          </defs>
          <path d="M0 70 L40 62 L80 66 L120 48 L160 52 L200 34 L240 40 L280 22 L320 26 L320 90 L0 90 Z" fill="url(#dfsArea)" />
          <path d="M0 70 L40 62 L80 66 L120 48 L160 52 L200 34 L240 40 L280 22 L320 26" fill="none" stroke="#2563EB" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="dfs-grid">
          <div className="dfs-card">
            <p className="dfs-card-title">Why did it move?</p>
            <ul className="dfs-why">
              <li><span className="dfs-skel" aria-hidden="true" /> Minutes played</li>
              <li><span className="dfs-skel" aria-hidden="true" /> Recent form</li>
              <li><span className="dfs-skel" aria-hidden="true" /> Availability</li>
            </ul>
          </div>
          <div className="dfs-card">
            <p className="dfs-card-title">Append-only ledger</p>
            <ul className="dfs-ledger">
              {LEDGER_ROWS.map((r) => (
                <li key={r.id}>
                  <code>{r.id}</code>
                  <span className={`dfs-type dfs-type--${r.type.toLowerCase()}`}>{r.type}</span>
                  <span className="dfs-what">{r.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="dfs-invariants" aria-label="Ledger invariants checked by property-based tests">
          {INVARIANTS.map((inv) => (
            <li key={inv}>
              <span aria-hidden="true">✓</span> <code>{inv}</code>
            </li>
          ))}
        </ul>
      </div>
    </BrowserFrame>
  );
}

/* ---------- NHL Predictions: real rows from the repo ---------- */
// Copied verbatim (rounded) from predictions_2026-01-14.csv.
const NHL_ROWS = [
  { date: "Jan 14", away: "SEA", home: "NJD", p: 0.546, score: "SEA 4 – NJD 2" },
  { date: "Jan 14", away: "OTT", home: "NYR", p: 0.502, score: "OTT 3 – NYR 4 (OT)" },
  { date: "Jan 14", away: "PHI", home: "BUF", p: 0.532, score: "PHI 3 – BUF 4" },
  { date: "Jan 14", away: "VGK", home: "LAK", p: 0.525, score: "VGK 4 – LAK 3" },
  { date: "Jan 15", away: "SEA", home: "BOS", p: 0.548, score: "SEA 3 – BOS 4 (OT)" },
  { date: "Jan 15", away: "DAL", home: "UTA", p: 0.464, score: "DAL 2 – UTA 4" },
];

export function NhlSketch() {
  return (
    <BrowserFrame
      address="predictions_2026-01-14.csv"
      note="Real model output from the repo's predictions file, shown as a table."
      className="pv-frame--data"
    >
      <div className="nhl">
        <div className="nhl-head">
          <p className="nhl-title">Upcoming games</p>
          <p className="nhl-sub">Elo + 10-game form → logistic regression</p>
        </div>
        <table className="nhl-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Matchup</th>
              <th scope="col" className="num">Home win</th>
              <th scope="col" className="nhl-hide-sm">Predicted score</th>
            </tr>
          </thead>
          <tbody>
            {NHL_ROWS.map((r) => (
              <tr key={r.date + r.home}>
                <td className="nhl-date">{r.date}</td>
                <td>
                  {r.away} <span className="nhl-at">@</span> <b>{r.home}</b>
                </td>
                <td className="num">
                  <span className="nhl-bar" aria-hidden="true">
                    <span style={{ width: `${Math.round(r.p * 100)}%` }} />
                  </span>
                  {Math.round(r.p * 100)}%
                </td>
                <td className="nhl-hide-sm nhl-score">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BrowserFrame>
  );
}

export function ProjectVisual({ id, variant }) {
  if (id === "uw-study-spots") return <UWStudySpotsShot variant={variant} />;
  if (id === "draftfolio") return <DraftfolioSketch />;
  if (id === "nhl") return <NhlSketch />;
  return null;
}
