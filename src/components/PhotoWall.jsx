import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";

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

const CAPTIONS = [
  "Chicago, IL · beauty in the rain",
  "Mississauga, ON · sunlight in the rain",
  "Brampton, ON · cotton-candy sky",
  "Elora, ON · stream in the forest",
  "Naples, IL · evening walks",
  "Little Island, NYC · the world is our stage",
  "Brooklyn Bridge, NYC · cecconi's",
  "Lugano, Switzerland · view from the villa",
  "Lugano, Switzerland · fog rolling in",
  "Milano, Italy · vintage train",
  "Waterloo, ON · sunrise",
  "Exchange Place, NJ · sunset views",
  "Bryant Park, NYC · christmas in nyc",
  "Milano, Italy · spring flowers",
  "Niagara Falls, ON · shining rays",
  "Waterloo, ON · foggy nights",
  "White Rock, BC · sunrise by the pier",
  "Copenhagen, Denmark · above the clouds",
  "Lugano, Switzerland · evening rain",
  "Toronto, ON · landmark",
  "Brampton, ON · temple ",
  "Waterloo, ON · train track ",
  "The Blue Mountains, ON · amongst the trees ",
  "The Blue Mountains, ON · golden nights ",
  "Waterloo, ON · super moon ",
  "The Blue Mountains, ON · light pollutionless skies ",
  "The Blue Mountains, ON · fall nights ",
  "The Blue Mountains, ON · late night walks",
  "Brampton, ON · fluffy sunsets",
  "Toronto, ON · city on their backs",
  "Toronto, ON · blue and white",
  "Toronto, ON · AL champions 2025",
  "Nizamuddin, India · history",
  "Delhi, India · tranquility",
  "Toronto, ON · branches",
  "Manhattan, NYC · empire state",
  "Brooklyn, NYC · bridge",
  "Manhattan, NYC · central ice",
  "Manhattan, NYC · christmas lights",
  "Manhattan, NYC · cathedral",
  "Brooklyn, NYC · barclays",



];

const DATA = PHOTOS.map((src, i) => ({ src, cap: CAPTIONS[i] ?? `Photo ${i+1}` }));

export default function PhotoWall() {
  const [idx, setIdx] = useState(0);
  const heroRef = useRef(null);
  const touch = useRef({ x: 0, y: 0 });

  const next  = useCallback(() => setIdx(i => (i + 1) % DATA.length), []);
  const prev  = useCallback(() => setIdx(i => (i - 1 + DATA.length) % DATA.length), []);

  const cur   = useMemo(() => DATA[idx], [idx]);
  const nextI = (idx + 1) % DATA.length;
  const prevI = (idx - 1 + DATA.length) % DATA.length;

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // touch swipe on hero
  const onTouchStart = (e) => { touch.current.x = e.touches[0].clientX; touch.current.y = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  return (
    <section id="photos" className="photos-sec" aria-labelledby="photos-title">
      <div className="photos-wrap">
        <h2 id="photos-title" className="photos-title">Time Capsule</h2>
        <p id="caption" className="caption">
          A picture tells a thousand words. Its a phrase we have been hearing since we were kids, but I did not realize the true
          meaning of it until I started taking photos of my own. Not only is it a blessing to be able to catch a moment in time, 
          but also be able to relive it by just looking at it. It reminds us how much beauty there is even in the simplest moments. 
          Here's a couple of moments that remind me that I am living. So just remember YOU'RE ALIVE!
        </p>

        {/* ---------- HERO + PREVIEW PANEL ROW ---------- */}
        <div className="hero-row">
          {/* Left: hero */}
          <div className="hero-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <button className="hero-nav left" onClick={prev} aria-label="Previous">‹</button>

            <div className="hero-stage">
              {/* left preview (clickable) */}
              <img
                className="hero-peek left"
                src={DATA[prevI].src}
                alt=""
                aria-hidden="true"
                onClick={prev}
              />

              {/* main image (uncropped) */}
              <img
                ref={heroRef}
                className="hero-img"
                src={cur.src}
                alt={cur.cap}
              />

              {/* right preview (clickable) */}
              <img
                className="hero-peek right"
                src={DATA[nextI].src}
                alt=""
                aria-hidden="true"
                onClick={next}
              />

              <div className="hero-caption">{cur.cap}</div>
            </div>

            <button className="hero-nav right" onClick={next} aria-label="Next">›</button>
          </div>

          {/* Right: preview panel */}
          <aside className="peek-panel">
            <h3 className="peek-title">Up next</h3>

            {/* big preview card */}
            <button className="peek-card" onClick={next} aria-label="Open next photo">
              <img src={DATA[nextI].src} alt="" loading="lazy" />
              <span className="peek-cap">{DATA[nextI].cap}</span>
            </button>

            {/* quick jump strip (next 4) */}
            <div className="peek-strip" role="list">
              {Array.from({ length: 4 }).map((_, k) => {
                const j = (idx + 2 + k) % DATA.length;
                return (
                  <button
                    key={j}
                    role="listitem"
                    className="peek-thumb"
                    onClick={() => setIdx(j)}
                    aria-label={`Jump to photo ${j + 1}`}
                    title={DATA[j].cap}
                  >
                    <img src={DATA[j].src} alt="" loading="lazy" />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
        {/* ---------- /HERO + PREVIEW PANEL ROW ---------- */}

        {/* Thumbnails */}
        <div className="photo-grid" role="list">
          {DATA.map((p, i) => (
            <button
              key={i}
              role="listitem"
              className={`photo-tile ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Show photo ${i + 1}`}
            >
              <img src={p.src} alt={p.cap} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
