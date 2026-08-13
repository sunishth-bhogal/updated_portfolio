import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import chicago from  "../components/assets/Chicago.jpg";
import bp from "../components/assets/BostonPizza.jpg";
import home from "../components/assets/HomeSunset.JPG";
import Elora from "../components/assets/Elora.jpg";
import Naplesil from "../components/assets/Naplesil.jpg";
import LittleIsland from "../components/assets/LittleIsland.jpg";
import BrooklynBridge from "../components/assets/BrooklynBridge.jpg";
import Lugano from "../components/assets/Lugano.jpg";
import LuganoFog from "../components/assets/LuganoFog.jpg";
import MilanoTrain from "../components/assets/MilanoTrain.jpg";
import SLCmorning from "../components/assets/SLCmorning.jpg";
import WTCsunset from "../components/assets/WTCsunset.JPG";
import NewYorkChristmas from "../components/assets/NewYorkChristmas.jpg";
import MilanoFlowers from "../components/assets/MilanoFlowers.jpg";
import NiagaraFalls from "../components/assets/NiagaraFalls.jpg";
import WaterlooGO from "../components/assets/WaterlooGO.jpg";
import WhiteRock from "../components/assets/WhiteRock.jpg";
import Plane from "../components/assets/Plane.jpg";
import LuganoRain from "../components/assets/LuganoRain.jpg";
import CNTower from "../components/assets/Toronto.jpg";
import Bhawan from "../components/assets/Bhawan.jpg";
import E7 from "../components/assets/E7.jpg";
import Fall from "../components/assets/Fall.jpg";
import Golden from "../components/assets/Golden.jpg";
import Moon from "../components/assets/Moon.jpg";
import Starry from "../components/assets/Starry.jpg";
import Stars from "../components/assets/Stars.jpg";
import Vibe from "../components/assets/Vibe.jpg";
import Cottoncandy from "../components/assets/Cottoncandy.jpg";
import Bluejays from "../components/assets/Bluejays.jpg";
import Make from "../components/assets/make.jpg";
import Champions from "../components/assets/Champions.jpg";

import Fort from "../components/assets/Fort.jpg";
import SundarNursery from "../components/assets/SundarNursery.jpg";
import CNTree from "../components/assets/CNTree.jpg";
import EmpireState from "../components/assets/EmpireState.jpg";
import BrooklynBridgeNight from "../components/assets/BrooklynBridgeNight.jpg";
import CentralParkIce from "../components/assets/CentralParkIce.jpg";
import MadisonGarden from "../components/assets/MadisonGarden.jpg"
import NYCathedral from "../components/assets/NYCathedral.jpg";
import NetsRaptors from "../components/assets/NetsRaptors.jpg"

const PHOTOS = [
  chicago, bp, home, Elora, Naplesil, LittleIsland,
  BrooklynBridge, Lugano, LuganoFog, MilanoTrain, SLCmorning, WTCsunset,
  NewYorkChristmas, MilanoFlowers, NiagaraFalls,
  WaterlooGO, WhiteRock, Plane, LuganoRain, CNTower, Bhawan, E7, Fall, Golden,
  Moon, Starry, Stars, Vibe, Cottoncandy, Bluejays, Make, Champions, Fort, SundarNursery, CNTree,
  EmpireState, BrooklynBridgeNight, CentralParkIce, MadisonGarden, NYCathedral, NetsRaptors
];

// location + memory come from the same real captions as before, just split
// into two fields; `cat` groups them for the filter row (Ontario vs
// everywhere else — "travel").
const CAPTIONS = [
  { location: "Chicago, IL", memory: "beauty in the rain", cat: "travel" },
  { location: "Mississauga, ON", memory: "sunlight in the rain", cat: "on" },
  { location: "Brampton, ON", memory: "cotton-candy sky", cat: "on" },
  { location: "Elora, ON", memory: "stream in the forest", cat: "on" },
  { location: "Naples, IL", memory: "evening walks", cat: "travel" },
  { location: "Little Island, NYC", memory: "the world is our stage", cat: "travel" },
  { location: "Brooklyn Bridge, NYC", memory: "cecconi's", cat: "travel" },
  { location: "Lugano, Switzerland", memory: "view from the villa", cat: "travel" },
  { location: "Lugano, Switzerland", memory: "fog rolling in", cat: "travel" },
  { location: "Milano, Italy", memory: "vintage train", cat: "travel" },
  { location: "Waterloo, ON", memory: "sunrise", cat: "on" },
  { location: "Exchange Place, NJ", memory: "sunset views", cat: "travel" },
  { location: "Bryant Park, NYC", memory: "christmas in nyc", cat: "travel" },
  { location: "Milano, Italy", memory: "spring flowers", cat: "travel" },
  { location: "Niagara Falls, ON", memory: "shining rays", cat: "on" },
  { location: "Waterloo, ON", memory: "foggy nights", cat: "on" },
  { location: "White Rock, BC", memory: "sunrise by the pier", cat: "travel" },
  { location: "Copenhagen, Denmark", memory: "above the clouds", cat: "travel" },
  { location: "Lugano, Switzerland", memory: "evening rain", cat: "travel" },
  { location: "Toronto, ON", memory: "landmark", cat: "on" },
  { location: "Brampton, ON", memory: "temple", cat: "on" },
  { location: "Waterloo, ON", memory: "train track", cat: "on" },
  { location: "The Blue Mountains, ON", memory: "amongst the trees", cat: "on" },
  { location: "The Blue Mountains, ON", memory: "golden nights", cat: "on" },
  { location: "Waterloo, ON", memory: "super moon", cat: "on" },
  { location: "The Blue Mountains, ON", memory: "light pollutionless skies", cat: "on" },
  { location: "The Blue Mountains, ON", memory: "fall nights", cat: "on" },
  { location: "The Blue Mountains, ON", memory: "late night walks", cat: "on" },
  { location: "Brampton, ON", memory: "fluffy sunsets", cat: "on" },
  { location: "Toronto, ON", memory: "city on their backs", cat: "on" },
  { location: "Toronto, ON", memory: "blue and white", cat: "on" },
  { location: "Toronto, ON", memory: "AL champions 2025", cat: "on" },
  { location: "Nizamuddin, India", memory: "history", cat: "travel" },
  { location: "Delhi, India", memory: "tranquility", cat: "travel" },
  { location: "Toronto, ON", memory: "branches", cat: "on" },
  { location: "Manhattan, NYC", memory: "empire state", cat: "travel" },
  { location: "Brooklyn, NYC", memory: "bridge", cat: "travel" },
  { location: "Manhattan, NYC", memory: "central ice", cat: "travel" },
  { location: "Manhattan, NYC", memory: "christmas lights", cat: "travel" },
  { location: "Manhattan, NYC", memory: "cathedral", cat: "travel" },
  { location: "Brooklyn, NYC", memory: "barclays", cat: "travel" },
];

const DATA = PHOTOS.map((src, i) => ({ src, id: i, ...CAPTIONS[i] }));

const FILTERS = [
  { id: "all", label: "ALL" },
  { id: "on", label: "ON" },
  { id: "travel", label: "TRAVEL" },
];

export default function PhotoWall() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const [openAt, setOpenAt] = useState(null); // index within `filtered`

  const filtered = useMemo(
    () => (filter === "all" ? DATA : DATA.filter((d) => d.cat === filter)),
    [filter]
  );

  const close = useCallback(() => setOpenAt(null), []);
  const next = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (openAt === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openAt, close, next, prev]);

  const current = openAt !== null ? filtered[openAt] : null;

  return (
    <section id="photos" className="pj">
      <div className="pj-wrap">
        <div className="pj-intro">
          <span className="pj-eyebrow">PHOTO JOURNAL</span>
          <h1 className="pj-heading">Small moments I wanted to keep.</h1>
          <p className="pj-sub">Cities, light, weather, and whatever made me stop walking.</p>
          <div className="pj-meta-row">
            <span className="pj-count">{DATA.length} photographs ↓</span>
          </div>
        </div>

        <div className="pj-filters" role="group" aria-label="Filter photos by place">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`pj-filter ${filter === f.id ? "is-active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="pj-masonry">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                className="pj-item"
                onClick={() => setOpenAt(i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                aria-label={`${p.location} — ${p.memory}`}
              >
                <span className="pj-num">{String(i + 1).padStart(2, "0")}</span>
                <img src={p.src} alt={`${p.location} — ${p.memory}`} loading="lazy" />
                <span className="pj-hover">
                  <span className="pj-hover-loc">{p.location.toUpperCase()}</span>
                  <span className="pj-hover-memory">{p.memory}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="pj-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button className="pj-lb-close" onClick={close} aria-label="Close">
              ✕
            </button>
            <button
              className="pj-lb-nav pj-lb-nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <motion.figure
              className="pj-lb-figure"
              onClick={(e) => e.stopPropagation()}
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <img src={current.src} alt={`${current.location} — ${current.memory}`} />
              <figcaption>
                <span className="pj-lb-loc">{current.location.toUpperCase()}</span>
                <span className="pj-lb-memory">{current.memory}</span>
              </figcaption>
            </motion.figure>

            <button
              className="pj-lb-nav pj-lb-nav--next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pj{ background: var(--bg-1) !important; padding: clamp(96px, 12vw, 140px) 0 clamp(60px, 8vw, 100px); min-height: 100vh; }
        .pj-wrap{ width: min(1400px, 94vw); margin: 0 auto; }

        .pj-intro{ margin-bottom: clamp(28px, 4vw, 44px); }
        .pj-intro-row{
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          margin-bottom: 14px;
        }
        .pj-eyebrow{ font-size: 12.5px; font-weight: 700; letter-spacing: .14em; color: var(--accent); }
        .pj-range{ font-size: 12.5px; color: var(--text-3); }
        .pj-heading{ margin: 0 0 8px; font-size: clamp(24px, 3.4vw, 36px); font-weight: 800; letter-spacing: -.01em; color: var(--text-1); }
        .pj-sub{ margin: 0 0 16px; font-size: clamp(14px, 1.3vw, 16px); color: var(--text-2); max-width: 56ch; }
        .pj-meta-row{
          display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px;
          padding-top: 14px; border-top: 1px solid var(--line);
        }
        .pj-places{ font-size: 13px; color: var(--text-2); }
        .pj-count{ font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; color: var(--text-3); }

        .pj-filters{ display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: clamp(20px, 3vw, 30px); }
        .pj-filter{
          appearance: none; cursor: pointer;
          padding: 7px 14px; border-radius: 999px;
          border: 1px solid var(--line); background: transparent; color: var(--text-2);
          font-size: 12px; font-weight: 700; letter-spacing: .04em;
          transition: border-color .18s ease, color .18s ease, background .18s ease;
        }
        .pj-filter:hover{ border-color: rgba(37,99,235,.35); color: var(--text-1); }
        .pj-filter.is-active{ background: var(--accent); border-color: var(--accent); color: #fff; }

        /* masonry via CSS columns — each photo keeps its natural aspect ratio */
        .pj-masonry{ columns: 4 260px; column-gap: 16px; }
        .pj-item{
          position: relative;
          display: block; width: 100%; margin: 0 0 16px;
          break-inside: avoid;
          border: none; padding: 0; background: none; cursor: pointer;
          border-radius: 6px; overflow: hidden;
        }
        .pj-item img{ display: block; width: 100%; height: auto; border-radius: 6px; }
        .pj-num{
          position: absolute; top: 8px; left: 8px; z-index: 2;
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 10.5px; font-weight: 700; color: #fff;
          background: rgba(17,24,39,.45);
          padding: 2px 6px; border-radius: 4px;
          opacity: 0; transition: opacity .2s ease;
        }
        .pj-item:hover .pj-num, .pj-item:focus-visible .pj-num{ opacity: 1; }

        .pj-hover{
          position: absolute; inset: auto 0 0 0; z-index: 2;
          padding: 22px 12px 10px;
          background: linear-gradient(180deg, transparent, rgba(17,24,39,.72));
          display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
          opacity: 0; transform: translateY(4px);
          transition: opacity .22s ease, transform .22s ease;
        }
        .pj-item:hover .pj-hover, .pj-item:focus-visible .pj-hover{ opacity: 1; transform: translateY(0); }
        .pj-hover-loc{
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 10.5px; font-weight: 700; letter-spacing: .06em; color: #fff;
        }
        .pj-hover-memory{ font-size: 12.5px; color: rgba(255,255,255,.85); }

        @media (max-width: 900px){ .pj-masonry{ columns: 2 220px; } }
        @media (max-width: 560px){ .pj-masonry{ columns: 1; } }

        /* lightbox */
        .pj-lightbox{
          position: fixed; inset: 0; z-index: 4000;
          background: rgba(10,12,16,.94);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 4vw, 48px);
        }
        .pj-lb-figure{
          max-width: min(92vw, 1100px);
          max-height: 86vh;
          display: flex; flex-direction: column; align-items: center;
          margin: 0;
        }
        .pj-lb-figure img{
          display: block;
          max-width: 100%; max-height: 74vh;
          width: auto; height: auto;
          border-radius: 4px;
          object-fit: contain;
        }
        .pj-lb-figure figcaption{
          margin-top: 14px; text-align: center;
        }
        .pj-lb-loc{
          display: block;
          font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 12px; font-weight: 700; letter-spacing: .08em; color: rgba(255,255,255,.55);
          margin-bottom: 4px;
        }
        .pj-lb-memory{ font-size: 15px; color: #fff; }

        .pj-lb-close{
          position: absolute; top: 18px; right: 18px;
          width: 38px; height: 38px; border-radius: 999px;
          display: grid; place-items: center;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16);
          color: #fff; font-size: 16px; cursor: pointer;
        }
        .pj-lb-close:hover{ background: rgba(255,255,255,.16); }

        .pj-lb-nav{
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 999px;
          display: grid; place-items: center;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16);
          color: #fff; font-size: 22px; cursor: pointer;
        }
        .pj-lb-nav:hover{ background: rgba(255,255,255,.16); }
        .pj-lb-nav--prev{ left: clamp(10px, 3vw, 28px); }
        .pj-lb-nav--next{ right: clamp(10px, 3vw, 28px); }

        @media (max-width: 640px){
          .pj-lb-nav{ width: 38px; height: 38px; font-size: 18px; }
        }
      `}</style>
    </section>
  );
}
