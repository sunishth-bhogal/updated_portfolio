// src/components/CreateShowcase.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import BrooklynBridge from "./assets/BrooklynBridge.jpg";
import NiagaraFalls from "./assets/NiagaraFalls.jpg";
import EmpireState from "./assets/EmpireState.jpg";

function PeekingFigure() {
  return (
    <svg width="30" height="26" viewBox="0 0 30 26" className="tabs-peek" aria-hidden="true">
      <circle cx="15" cy="15" r="10" fill="#161616" />
      <ellipse cx="10.5" cy="13" rx="4.4" ry="2.7" fill="#fff" transform="rotate(-16 10.5 13)" />
      <ellipse cx="19.5" cy="13" rx="4.4" ry="2.7" fill="#fff" transform="rotate(16 19.5 13)" />
    </svg>
  );
}

export default function CreateShowcase() {
  const reduceMotion = useReducedMotion();
  const initial = (y = 22) => ({ opacity: 0, y: reduceMotion ? 0 : y });
  const inView = { opacity: 1, y: 0 };

  return (
    <div className="tabs-outer">
      <div className="tabs-container">
        <div className="tabs-grid">
          {/* Photo Journal — large */}
          <motion.div
            className="tabs-card tabs-card--photo"
            initial={initial(30)}
            whileInView={inView}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/photos#top" className="tabs-card-link" aria-label="Photo Journal">
              <span className="tabs-tape" aria-hidden="true" />
              <span className="tabs-label">PHOTO JOURNAL</span>

              <div className="tabs-collage">
                <motion.img
                  src={NiagaraFalls}
                  alt=""
                  className="tabs-photo tabs-photo--a"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.05 }}
                />
                <motion.img
                  src={BrooklynBridge}
                  alt=""
                  className="tabs-photo tabs-photo--b"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                />
                <motion.img
                  src={EmpireState}
                  alt=""
                  className="tabs-photo tabs-photo--c"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                />
                <PeekingFigure />
              </div>

              <p className="tabs-caption">"A collection of moments captured."</p>
              <span className="tabs-open">
                OPEN JOURNAL <i>↗</i>
              </span>
            </Link>
          </motion.div>

          {/* Thought Forest */}
          <motion.div
            className="tabs-card tabs-card--thoughts"
            initial={initial()}
            whileInView={inView}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/Deep" className="tabs-card-link" aria-label="Thought Forest">
              <span className="tabs-pin" aria-hidden="true" />
              <span className="tabs-label">THOUGHT FOREST</span>

              <motion.div
                className="tabs-sticky"
                initial={{ opacity: 0, y: 10, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                Words can go a long way
              </motion.div>
              <span className="tabs-count">06 notes</span>

              <span className="tabs-open">
                READ 06 THOUGHTS <i>↗</i>
              </span>
            </Link>
          </motion.div>

          {/* Growth */}
          <motion.div
            className="tabs-card tabs-card--growth"
            initial={initial()}
            whileInView={inView}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/growth" className="tabs-card-link" aria-label="Growth">
              <span className="tabs-tape tabs-tape--growth" aria-hidden="true" />
              <span className="tabs-label">GROWTH</span>

              <div className="tabs-ring-row">
                <svg width="52" height="52" viewBox="0 0 52 52" className="tabs-ring">
                  <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(22,163,74,.16)" strokeWidth="5" />
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="21"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="132"
                    transform="rotate(-90 26 26)"
                    initial={{ strokeDashoffset: 132 }}
                    whileInView={{ strokeDashoffset: 42 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
                <span className="tabs-count">18 entries logged</span>
              </div>

              <span className="tabs-open">
                VIEW MY PROGRESS <i>↗</i>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        /* Scoped, uniquely-named wrappers — the old .section-dark/.container
           names are reused elsewhere in the global stylesheet for the
           previous dark theme (full-viewport min-height, dark gradient
           background, large padding), and colliding with them here was
           padding this section out to nearly a full screen of empty space
           below the cards. */
        .tabs-outer{ background: transparent; }
        .tabs-container{ max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        .tabs-grid{
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          grid-auto-rows: min-content;
          gap: clamp(18px, 2.4vw, 26px);
        }
        .tabs-card--photo{ grid-column: 1; grid-row: 1 / span 2; }
        .tabs-card--thoughts{ grid-column: 2; grid-row: 1; }
        .tabs-card--growth{ grid-column: 2; grid-row: 2; margin-top: clamp(10px, 2vw, 20px); }

        @media (max-width: 780px){
          .tabs-grid{ grid-template-columns: 1fr; gap: clamp(28px, 6vw, 36px); }
          .tabs-card--photo, .tabs-card--thoughts, .tabs-card--growth{
            grid-column: 1; grid-row: auto; margin-top: 0;
          }
        }

        .tabs-card-link{
          /* height:100% + padding with the default content-box sizing made
             this ~40px (its own padding) taller than its parent grid item —
             the parent's own min-content row sizing was based on this same
             child, so the two were fighting: the real fix. */
          box-sizing: border-box;
          position: relative;
          display: flex; flex-direction: column;
          height: 100%;
          padding: 22px 20px 18px;
          border-radius: 10px;
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: 0 4px 14px rgba(17,24,39,.05);
          text-decoration: none;
          transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease;
        }
        .tabs-card--photo .tabs-card-link{ transform: rotate(-0.6deg); }
        .tabs-card--thoughts .tabs-card-link{ transform: rotate(0.8deg); min-height: 168px; }
        .tabs-card--growth .tabs-card-link{ transform: rotate(-0.5deg); }

        .tabs-card--photo .tabs-card-link:hover{ transform: rotate(-0.6deg) translateY(-5px); border-color: rgba(234,140,44,.4); box-shadow: 0 18px 36px rgba(17,24,39,.1); }
        .tabs-card--thoughts .tabs-card-link:hover{ transform: rotate(0.8deg) translateY(-5px); border-color: rgba(124,92,240,.4); box-shadow: 0 18px 36px rgba(17,24,39,.1); }
        .tabs-card--growth .tabs-card-link:hover{ transform: rotate(-0.5deg) translateY(-5px); border-color: rgba(22,163,74,.4); box-shadow: 0 18px 36px rgba(17,24,39,.1); }

        /* The subtle rotation above reads as intentional "scattered
           stickies" on a wide desktop grid, but a rotated box's visual
           bounding height is taller than its layout height — stacked
           tightly in a single mobile column, that was enough to visually
           overlap the card below it. Flat + a bigger gap (see the grid
           media query above) keeps them cleanly apart. Placed after the
           unconditional rotation rules above (same specificity, so source
           order decides) so this actually wins on narrow screens. */
        @media (max-width: 780px){
          .tabs-card--photo .tabs-card-link,
          .tabs-card--thoughts .tabs-card-link,
          .tabs-card--growth .tabs-card-link{
            transform: none;
          }
          .tabs-card--photo .tabs-card-link:hover,
          .tabs-card--thoughts .tabs-card-link:hover,
          .tabs-card--growth .tabs-card-link:hover{
            transform: translateY(-5px);
          }
        }

        /* tape / pin accents */
        .tabs-tape{
          position: absolute; top: -8px; left: 26px;
          width: 46px; height: 16px;
          background: rgba(234,140,44,.5);
          border: 1px solid rgba(234,140,44,.3);
          transform: rotate(-4deg);
        }
        .tabs-tape--growth{ background: rgba(22,163,74,.4); border-color: rgba(22,163,74,.28); left: 20px; }
        .tabs-pin{
          position: absolute; top: -6px; left: 30px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #7C5CF0;
          box-shadow: 0 2px 4px rgba(17,24,39,.25);
        }

        .tabs-label{
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          color: var(--text-2);
          margin-bottom: 14px;
        }

        /* photo collage */
        .tabs-collage{
          position: relative;
          flex: 1;
          min-height: 190px;
          margin-bottom: 12px;
        }
        .tabs-photo{
          position: absolute;
          width: 58%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          border-radius: 4px;
          background: #fff;
          padding: 6px 6px 18px;
          box-shadow: 0 10px 22px rgba(17,24,39,.18);
        }
        .tabs-photo--a{ left: 2%; top: 4px; transform: rotate(-6deg); z-index: 1; }
        .tabs-photo--b{ left: 26%; top: 26px; transform: rotate(4deg); z-index: 2; }
        .tabs-photo--c{ left: 48%; top: 2px; transform: rotate(-2deg); z-index: 3; }
        .tabs-card--photo .tabs-card-link:hover .tabs-photo--a{ transform: rotate(-9deg) translateY(-3px); }
        .tabs-card--photo .tabs-card-link:hover .tabs-photo--b{ transform: rotate(6deg) translateY(-3px); }
        .tabs-card--photo .tabs-card-link:hover .tabs-photo--c{ transform: rotate(-4deg) translateY(-3px); }
        .tabs-photo, .tabs-card--photo .tabs-card-link:hover .tabs-photo--a,
        .tabs-card--photo .tabs-card-link:hover .tabs-photo--b,
        .tabs-card--photo .tabs-card-link:hover .tabs-photo--c{
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .tabs-peek{
          position: absolute;
          right: 6%; bottom: -4px;
          z-index: 4;
          transition: transform .3s ease;
        }
        .tabs-card--photo .tabs-card-link:hover .tabs-peek{ transform: translateY(-6px); }

        .tabs-caption{
          font-style: italic;
          font-size: 13.5px;
          color: var(--text-2);
          margin: 0 0 4px;
        }

        /* thought forest */
        .tabs-sticky{
          align-self: flex-start;
          background: #FBF3FF;
          border: 1px solid rgba(124,92,240,.25);
          color: #4C3A8A;
          font-size: 13.5px;
          font-weight: 600;
          padding: 12px 14px;
          border-radius: 3px;
          box-shadow: 0 6px 14px rgba(124,92,240,.14);
          margin-bottom: 10px;
        }

        .tabs-count{
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 12px;
          color: var(--text-3);
        }

        /* growth */
        .tabs-ring-row{
          display: flex; align-items: center; gap: 14px;
          margin: 4px 0 14px;
        }

        .tabs-open{
          margin-top: auto;
          padding-top: 12px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: .04em;
          color: var(--text-2);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .tabs-open i{ font-style: normal; transition: transform .2s ease; display: inline-block; }
        .tabs-card-link:hover .tabs-open{ color: var(--text-1); text-decoration: underline; text-underline-offset: 3px; }
        .tabs-card-link:hover .tabs-open i{ transform: translate(3px, -2px); }

        @media (prefers-reduced-motion: reduce){
          .tabs-card-link, .tabs-photo, .tabs-peek, .tabs-open i{ transition: none !important; }
        }
      `}</style>
    </div>
  );
}
