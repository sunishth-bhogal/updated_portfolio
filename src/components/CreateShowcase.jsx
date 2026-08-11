// src/components/CreateShowcase.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const ITEMS = [
  { to: "/photos#top", icon: "📷", title: "Photo Journal", sub: "A collection of moments captured.", cta: "View Photos",  meta: { entries: 20, updated: "2d ago" } },
  { to: "/Deep",       icon: "💬", title: "Thought Forest", sub: "Words can go a long way",        cta: "View Diary",   meta: { entries: 6,  updated: "today" } },
  { to: "/growth",     icon: "🗺️", title: "Growth",         sub: "A log of things I want to grow", cta: "View Progress",meta: { entries: 18, updated: "5d ago" } },
];

export default function CreateShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="create" className="section-dark">
      <div className="container">
        <div className="create-grid clean">
          {ITEMS.map(({ to, icon, title, sub, cta, meta }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={to} className="create-card clean" aria-label={title}>
                <span className="card-watermark" aria-hidden="true">{icon}</span>

                <div className="card-top">
                  <span className="card-icon" aria-hidden="true">{icon}</span>
                  <h3 className="card-title">{title}</h3>
                  <p className="card-sub">{sub}</p>

                  {meta && (
                    <div className="card-meta">
                      <span>{meta.entries} entries</span>
                      <span className="meta-dot" />
                      <span>Updated {meta.updated}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <span className="cta cta--lg clean">{cta}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        /* grid */
        .create-grid.clean{
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(18px, 2.2vw, 26px);
          align-items: stretch;
        }

        /* card */
        .create-card.clean{
          position: relative;
          overflow: hidden;
          display:flex; flex-direction:column;
          padding: 20px;
          border-radius: 16px;
          background: rgba(14,18,26,.65);
          border: 1px solid rgba(255,255,255,.06);
          box-shadow: 0 4px 14px rgba(0,0,0,.24);
          min-height: 240px;           /* ↓ was 260; reduces empty bottom */
          transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease, background .2s ease;
          text-decoration: none;
        }
        .create-card.clean:hover,
        .create-card.clean:focus-visible{
          border-color: hsl(220 70% 60% / .35);
          background: rgba(18,23,34,.75);
          transform: translateY(-4px);
          box-shadow: 0 16px 34px rgba(0,0,0,.32), 0 0 0 1px hsl(220 70% 60% / .12);
        }
        .card-watermark{
          position: absolute;
          right: -18px;
          bottom: -28px;
          font-size: 140px;
          line-height: 1;
          opacity: .07;
          filter: saturate(0.6);
          pointer-events: none;
          transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .3s ease;
        }
        .create-card.clean:hover .card-watermark{
          transform: scale(1.08) rotate(-4deg);
          opacity: .1;
        }

        /* icon + text */
        .card-icon{
          position: relative;
          display:inline-flex; align-items:center; justify-content:center;
          width:48px; height:48px;
          border-radius:14px;
          background: linear-gradient(135deg, hsl(220 90% 60% / .18), hsl(266 80% 62% / .18));
          border: 1px solid hsl(220 60% 65% / .25);
          font-size: 22px; margin-bottom: 14px;
        }
        .card-title{
          font-weight: 800;
          font-size: 22px;               /* ↓ was 24 */
          letter-spacing:-.2px;
          margin: 6px 0 6px;
        }
        .card-sub{
          color: rgba(225,235,255,.78);
          font-size: 14px;               /* ↓ was 15 */
          line-height: 1.45;
          margin: 0 0 8px;
        }
        .card-meta{
          display:flex; align-items:center; gap:10px;
          color: rgba(225,235,255,.65);
          font-size: 12px;               /* ↓ was 13 */
          margin-bottom: 6px;
        }
        .meta-dot{ width:4px; height:4px; border-radius:50%; background: rgba(225,235,255,.45); display:inline-block; }

        /* CTA — smaller & centered, consistent size */
        .card-actions{
          margin-top: auto;
          display:flex; justify-content:center;
        }
        .cta.cta--lg.clean{
          display:inline-flex; align-items:center; justify-content:center;
          gap: 8px;
          height: 44px;                   /* fixed height = consistent proportion */
          min-width: 160px;               /* consistent footprint across cards */
          padding: 0 18px;                /* slimmer */
          border-radius: 10px;
          background: #f2f4fb;
          color:#0b1220;
          font-weight: 700;               /* ↓ a touch lighter */
          font-size: 14.5px;              /* ↓ */
          letter-spacing:.2px;
          border: 1px solid transparent;
          box-shadow: 0 8px 18px rgba(0,0,0,.3);
          transition: transform .12s ease, background .15s ease, box-shadow .15s ease;
        }
        .cta.cta--lg.clean::after{ content: "→"; transition: transform .15s ease; }
        .cta.cta--lg.clean:hover{ transform: translateY(-2px); background: #ffffff; box-shadow: 0 12px 24px rgba(0,0,0,.36); }
        .cta.cta--lg.clean:hover::after{ transform: translateX(3px); }
        .cta.cta--lg.clean:active{ transform: translateY(0); }

        @media (max-width: 720px){
          .create-card.clean{ min-height: 220px; }           /* tighter on mobile */
          .cta.cta--lg.clean{ height: 42px; min-width: 150px; border-radius: 10px; }
        }

        @media (prefers-reduced-motion: reduce){
          .create-card.clean, .cta.cta--lg.clean { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
