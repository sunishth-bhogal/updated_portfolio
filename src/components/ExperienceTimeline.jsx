// src/components/ExperienceTimeline.jsx
import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import shoppersLogo from "./assets/Shoppers.jpg";
import stealthLogo from "./assets/stealthlogo.jpg";
import remaxLogo from "./assets/remaxlogo.png";
import TDLogo from "./assets/TD.jpg";
import ShipdLogo from "./assets/shipd.jpeg";



const EXPERIENCES = [
  {
    id: "td",
    company: "TD Bank",
    status: "Present",
    role: "Software Engineer Intern",
    location: "Toronto, Canada",
    dates: "Sep 2026 – Dec 2026",
    year: "2026",
    logo: TDLogo,
    color: "#0F8A3C",
    motif: "grid",
    highlights: [],
  },
  {
    id: "shipd",
    company: "Shipd",
    status: "Ongoing",
    role: "Ambassador",
    location: "Remote",
    dates: "Jul 2026 – Present",
    year: "2026",
    logo: ShipdLogo,
    color: "#F5A623",
    motif: "grid",
    highlights: [],
  },
  {
    id: "stealth",
    company: "Stealth Startup",
    status: "8 mo",
    role: "AI Software Engineer Intern",
    location: "Toronto, Canada",
    dates: "Jan – Aug 2025",
    year: "2025",
    logo: stealthLogo,
    color: "#6C5CE7",
    motif: "redacted",
    highlights: [
      "Built 4 backend services and 6 data pipelines for a product taken from zero to launch",
      "Reduced MTTR by 35% across 15+ production incidents",
      "Collaborated directly with the founding team across the stack",
    ],
  },
  {
    id: "remax",
    company: "RE/MAX Real Estate Centre",
    status: "4 mo",
    role: "Software Engineer Intern",
    location: "Mississauga, Canada",
    dates: "May – Aug 2023",
    year: "2023",
    logo: remaxLogo,
    color: "#003DA5",
    motif: "map",
    highlights: [
      "Built and optimized real-estate web experiences for property listings",
      "Improved property discovery through performance and UX work",
      "Simplified listing management workflows for agents",
    ],
  },
  {
    id: "shoppers",
    company: "Shoppers Drug Mart",
    status: "3 mo",
    role: "Pharmacy Assistant",
    location: "Etobicoke, Canada",
    dates: "Jun – Aug 2022",
    year: "2022",
    logo: shoppersLogo,
    color: "#E4002B",
    motif: "receipt",
    highlights: [
      "Managed prescription processing in a high-volume pharmacy",
      "Maintained inventory accuracy and stock levels",
      "Handled customer requests and service under time pressure",
    ],
  },
];

export default function ExperienceTimeline() {
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = React.useState(null);
  const listRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="xp2">
      <div className="xp2-list" ref={listRef}>
        <span className="xp2-rail-track" aria-hidden="true" />
        <motion.span
          className="xp2-rail"
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : railScale }}
        />

        {EXPERIENCES.map((e, i) => {
          const isPinned = pinned === e.id;
          return (
            <motion.article
              key={e.id}
              className={["xp2-card", `xp2-card--${e.motif}`, isPinned ? "is-pinned" : ""]
                .filter(Boolean)
                .join(" ")}
              style={{ "--brand": e.color }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduceMotion ? undefined : { y: -6, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              onClick={() => setPinned((cur) => (cur === e.id ? null : e.id))}
              tabIndex={0}
              role="button"
              aria-expanded={isPinned}
            >
              <span className="xp2-year" aria-hidden="true">
                {e.year}
              </span>

              <div className="xp2-side">
                <span className="xp2-marker" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {e.logo ? (
                  <img className="xp2-logo" src={e.logo} alt="" aria-hidden="true" />
                ) : (
                  <div className="xp2-logo xp2-logo--fallback" aria-hidden="true">
                    {e.company[0]}
                  </div>
                )}
              </div>

              <div className="xp2-body">
                <div className="xp2-title-row">
                  <h3 className="xp2-company">{e.company}</h3>
                  <span className="xp2-status">{e.status}</span>
                </div>
                <div className="xp2-role">{e.role}</div>
                <div className="xp2-meta">
                  {e.location} · {e.dates}
                </div>

                {e.highlights.length > 0 && (
                  <ul className="xp2-highlights">
                    {e.highlights.map((h, hi) => (
                      <li key={hi} style={{ "--i": hi }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      <style>{`
        .xp2{ width: 100%; }

        /* ---- list / rail ---- */
        .xp2-list{ position: relative; padding-left: clamp(28px, 4vw, 40px); }
        .xp2-rail-track, .xp2-rail{
          position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px;
          border-radius: 2px;
        }
        .xp2-rail-track{ background: var(--line); }
        .xp2-rail{
          background: var(--accent);
          transform-origin: top;
        }

        /* ---- card ---- */
        .xp2-card{
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 18px;
          padding: clamp(18px, 2.6vw, 26px) clamp(20px, 2.8vw, 28px);
          margin-bottom: clamp(16px, 2.4vw, 22px);
          border-radius: 10px;
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: 0 4px 14px rgba(17,24,39,.05);
          cursor: pointer;
          overflow: hidden;
          transition: border-color .25s ease, box-shadow .25s ease, background .35s ease, opacity .25s ease;
        }
        .xp2-card:nth-child(odd){ margin-left: 0; }
        .xp2-card:nth-child(even){ margin-left: clamp(0px, 4vw, 46px); }

        .xp2-card:hover,
        .xp2-card.is-pinned{
          border-color: color-mix(in srgb, var(--brand) 55%, var(--line));
          box-shadow: 0 16px 34px rgba(17,24,39,.09);
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--brand) 7%, var(--panel)), var(--panel) 60%);
        }
        .xp2-year{
          position: absolute;
          right: clamp(6px, 1.5vw, 18px);
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(64px, 9vw, 128px);
          font-weight: 900;
          line-height: 1;
          color: color-mix(in srgb, var(--brand) 60%, var(--text-1));
          opacity: .05;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }

        .xp2-side{
          grid-row: 1 / span 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
          padding-top: 2px;
        }
        .xp2-marker{
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-weight: 700;
          font-size: 13px;
          color: var(--text-2);
        }
        .xp2-card:hover .xp2-marker,
        .xp2-card.is-pinned .xp2-marker{ color: var(--accent); }

        .xp2-logo{
          width: 34px; height: 34px;
          border-radius: 9px;
          object-fit: contain;
          background: #fff;
          border: 1px solid var(--line);
          padding: 5px;
        }
        .xp2-logo--fallback{
          display: grid; place-items: center;
          font-weight: 800; color: var(--text-2);
        }

        .xp2-body{ position: relative; z-index: 1; min-width: 0; }
        .xp2-title-row{
          display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap;
        }
        .xp2-company{
          margin: 0; font-weight: 800; font-size: clamp(16px, 1.8vw, 19px);
          letter-spacing: -.01em;
          color: var(--text-1);
        }
        .xp2-status{
          flex: 0 0 auto;
          font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
          color: color-mix(in srgb, var(--brand) 70%, var(--text-1));
        }
        .xp2-role{ margin-top: 3px; font-weight: 700; font-size: 14px; color: var(--text-2); }
        .xp2-meta{ margin-top: 4px; font-size: 12.5px; color: var(--text-3); }

        .xp2-highlights{
          list-style: none; margin: 0; padding: 0;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height .4s ease, opacity .3s ease, margin-top .4s ease;
        }
        .xp2-card:hover .xp2-highlights,
        .xp2-card.is-pinned .xp2-highlights{
          max-height: 240px; opacity: 1; margin-top: 14px;
        }
        .xp2-highlights li{
          position: relative;
          padding-left: 16px;
          margin-bottom: 7px;
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text-2);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity .35s ease, transform .35s ease;
          transition-delay: calc(var(--i) * 70ms);
        }
        .xp2-card:hover .xp2-highlights li,
        .xp2-card.is-pinned .xp2-highlights li{
          opacity: 1; transform: translateY(0);
        }
        .xp2-highlights li::before{
          content: ""; position: absolute; left: 0; top: 7px;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--brand);
        }

        /* ---- per-company faint motifs ---- */
        .xp2-card--grid::before{
          content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, color-mix(in srgb, var(--brand) 35%, transparent) 0 1px, transparent 1px 22px),
            repeating-linear-gradient(90deg, color-mix(in srgb, var(--brand) 35%, transparent) 0 1px, transparent 1px 22px);
          opacity: .05;
        }
        .xp2-card--map::before{
          content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, color-mix(in srgb, var(--brand) 40%, transparent) 0 1px, transparent 1px 34px),
            repeating-linear-gradient(90deg, color-mix(in srgb, var(--brand) 40%, transparent) 0 1px, transparent 1px 34px);
          opacity: .06;
        }
        .xp2-card--receipt::before{
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 6px; z-index: 0; pointer-events: none;
          background-image: repeating-linear-gradient(90deg, color-mix(in srgb, var(--brand) 55%, transparent) 0 3px, transparent 3px 7px);
          opacity: .35;
        }
        .xp2-card--redacted{ }
        .xp2-card--redacted .xp2-company{ position: relative; }
        .xp2-card--redacted::before{
          content: ""; position: absolute; z-index: 0; pointer-events: none;
          left: clamp(58px, 8vw, 74px); top: 20px; width: 92px; height: 15px;
          background: color-mix(in srgb, var(--brand) 70%, #111827);
          opacity: .12; border-radius: 3px; filter: blur(2px);
        }

        @media (max-width: 640px){
          .xp2-card:nth-child(even){ margin-left: 0; }
          .xp2-year{ font-size: clamp(48px, 18vw, 80px); }
        }

        @media (prefers-reduced-motion: reduce){
          .xp2-card{ transition: none; }
        }
      `}</style>
    </div>
  );
}
