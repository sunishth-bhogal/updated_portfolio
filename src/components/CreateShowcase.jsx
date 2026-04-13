// src/components/CreateShowcase.jsx
import React from "react";
import { Link } from "react-router-dom";

const ITEMS = [
  { to: "/photos#top", icon: "📷", title: "Photo Journal", sub: "A collection of moments captured.", cta: "View Photos",  meta: { entries: 20, updated: "2d ago" } },
  { to: "/Deep",       icon: "💬", title: "Thought Forest", sub: "Words can go a long way",        cta: "View Diary",   meta: { entries: 6,  updated: "today" } },
  { to: "/growth",     icon: "🗺️", title: "Growth",         sub: "A log of things I want to grow", cta: "View Progress",meta: { entries: 18, updated: "5d ago" } },
];

export default function CreateShowcase() {
  return (
    <section id="create" className="section-dark">
      <div className="container">
        <div className="create-grid clean">
          {ITEMS.map(({ to, icon, title, sub, cta, meta }) => (
            <Link key={to} to={to} className="create-card clean" aria-label={title}>
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
          display:flex; flex-direction:column;
          padding: 18px;
          border-radius: 14px;
          background: rgba(14,18,26,.65);
          border: 1px solid rgba(255,255,255,.06);
          box-shadow: 0 4px 14px rgba(0,0,0,.24);
          min-height: 240px;           /* ↓ was 260; reduces empty bottom */
          transition: border-color .15s ease, transform .12s ease, box-shadow .15s ease;
          text-decoration: none;
        }
        .create-card.clean:hover,
        .create-card.clean:focus-visible{
          border-color: rgba(255,255,255,.10);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,.26);
        }

        /* icon + text */
        .card-icon{
          display:inline-flex; align-items:center; justify-content:center;
          width:28px; height:28px;       /* ↓ was 32 */
          border-radius:10px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          font-size: 16px; margin-bottom: 10px;
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
          height: 44px;                   /* fixed height = consistent proportion */
          min-width: 160px;               /* consistent footprint across cards */
          padding: 0 18px;                /* slimmer */
          border-radius: 22px;            /* matches height/2 */
          background: linear-gradient(90deg, #6ca8ff 0%, #b18cff 100%);
          color:#0b1220;
          font-weight: 700;               /* ↓ a touch lighter */
          font-size: 14.5px;              /* ↓ */
          letter-spacing:.2px;
          border: 1px solid rgba(255,255,255,.14);
          box-shadow: 0 4px 12px rgba(108,168,255,.18); /* lighter shadow */
          transition: transform .12s ease, filter .15s ease, box-shadow .15s ease;
        }
        .cta.cta--lg.clean:hover{ transform: translateY(-1px); filter: saturate(1.03); }
        .cta.cta--lg.clean:active{ transform: translateY(0); }

        @media (max-width: 720px){
          .create-card.clean{ min-height: 220px; }           /* tighter on mobile */
          .cta.cta--lg.clean{ height: 42px; min-width: 150px; border-radius: 21px; }
        }

        @media (prefers-reduced-motion: reduce){
          .create-card.clean, .cta.cta--lg.clean { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
