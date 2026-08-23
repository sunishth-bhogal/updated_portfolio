// src/components/ProjectRails.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TML from "../components/assets/TML.jpg";
import Stock from "../components/assets/Stock.jpg";
import Portfolio from "../components/assets/Portfolio.jpg";
import UWStudySpots from "../components/assets/UWStudySpots.jpg";

// `video` is left undefined until real screen-recording clips exist for
// each project — see the note at the bottom of this file for the format
// BentoMedia expects. Until then every card falls back to its still cover
// image, which is why none of these show `video: "..."` yet.
const PROJECTS = [
  {
    id: "uw-study-spots",
    slot: "large",
    title: "UW Study Spots",
    blurb:
      "Live study-space finder for University of Waterloo students with occupancy data, campus maps, and student-submitted reports.",
    metric: "1,000+ users in 5 days",
    cover: UWStudySpots,
    video: undefined,
    tags: ["Next.js", "TypeScript", "Supabase", "UX"],
    url: "https://uw-study-spots.vercel.app/",
  },
  {
    id: "stock",
    slot: "stack",
    title: "New Stock Movers",
    blurb: "A market-tracking project currently in progress.",
    metric: null,
    cover: Stock,
    video: undefined,
    tags: ["Python", "Pandas", "Finance"],
    url: null, // no live destination yet — rendered as a non-link card
  },
  {
    id: "xg",
    slot: "stack",
    title: "NHL Predictions",
    blurb: "Predicts outcomes for the rest of the NHL season.",
    metric: null,
    cover: TML,
    video: undefined,
    tags: ["Python", "Pandas", "Modeling"],
    url: "https://github.com/sunishth-bhogal/NHL-Game-Predictor",
  },
  {
    id: "sitev3",
    slot: "wide",
    title: "Personal Site",
    blurb: "Portfolio website showcasing my experience, projects, and background.",
    metric: null,
    cover: Portfolio,
    video: undefined,
    tags: ["React", "Routing", "UX"],
    url: "https://github.com/sunishth-bhogal/Portfolio",
  },
];

// Plays a muted, looping clip once the card scrolls into view, pauses it
// once the card leaves — a still cover image is used whenever a project
// has no `video` yet, so the layout never depends on assets that don't
// exist.
function BentoMedia({ src, video, alt }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  return (
    <div className="bento-media" ref={wrapRef}>
      <div className="bento-browser-bar" aria-hidden="true">
        <span className="bento-dot" />
        <span className="bento-dot" />
        <span className="bento-dot" />
      </div>
      <div className="bento-media-inner">
        {video ? (
          <video
            ref={videoRef}
            src={video}
            poster={src}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={src} alt={alt} loading="lazy" />
        )}
      </div>
    </div>
  );
}

function BentoCard({ project, index, reduceMotion }) {
  const hasLink = Boolean(project.url);
  const Tag = hasLink ? motion.a : motion.div;
  const linkProps = hasLink
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className={`bento-card bento-card--${project.slot} ${hasLink ? "" : "is-static"}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : 0.08 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <BentoMedia src={project.cover} video={project.video} alt={project.title} />

      <div className="bento-body">
        <div className="bento-heading">
          <h3 className="bento-title">{project.title}</h3>
          {hasLink ? (
            <span className="bento-arrow" aria-hidden="true">
              ↗
            </span>
          ) : (
            <span className="bento-static-pill">In progress</span>
          )}
        </div>

        {project.metric ? (
          <span className="bento-metric">{project.metric}</span>
        ) : (
          <p className="bento-blurb">{project.blurb}</p>
        )}

        {project.tags?.length ? (
          <div className="bento-tags">
            {project.tags.map((t) => (
              <span key={t} className="bento-tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Tag>
  );
}

export default function ProjectRails() {
  const reduceMotion = useReducedMotion();
  const large = PROJECTS.find((p) => p.slot === "large");
  const stack = PROJECTS.filter((p) => p.slot === "stack");
  const wide = PROJECTS.find((p) => p.slot === "wide");

  return (
    <div className="bento-grid">
      <BentoCard project={large} index={0} reduceMotion={reduceMotion} />
      <div className="bento-stack">
        {stack.map((p, i) => (
          <BentoCard key={p.id} project={p} index={i + 1} reduceMotion={reduceMotion} />
        ))}
      </div>
      <BentoCard project={wide} index={3} reduceMotion={reduceMotion} />

      <style>{`
        /* Scoped to #projects only — .section__title's own margin is shared
           by every other section on the page, so it's tightened here
           rather than changed globally, closing up the gap between the
           heading and the grid below it. */
        #projects .section__title{ margin-bottom: 14px; }

        .bento-grid{
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: clamp(8px, 1vw, 12px);
        }
        .bento-stack{
          /* Explicit placement — without it, grid auto-placement drops this
             into a single implicit row instead of spanning the same two
             rows as the large card next to it, since nothing here tells it
             to match that span on its own. */
          grid-column: 2;
          grid-row: 1 / span 2;
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1vw, 12px);
          min-height: 0;
        }

        .bento-card{
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          border: 1px solid var(--line, #DDDAD3);
          background: var(--panel, #fff);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
        }
        .bento-card.is-static{ cursor: default; }
        .bento-card:hover{
          border-color: var(--accent, #2563EB);
          box-shadow: 0 20px 44px rgba(17,24,39,.09);
        }

        .bento-card--large{ grid-column: 1; grid-row: 1 / span 2; }
        /* Kept short on purpose — with two stacked cards on the right,
           whichever column is taller stretches the other to match (CSS
           Grid's default row-fill behaviour), so both sides need to be
           deliberately compact for the whole grid to fit near one screen
           alongside the heading, as requested. */
        .bento-card--large .bento-media{ aspect-ratio: 16 / 10; }
        .bento-stack .bento-card--stack .bento-media{ aspect-ratio: 3 / 1; }
        .bento-card--wide{
          grid-column: 1 / span 2;
          flex-direction: row;
        }
        .bento-card--wide .bento-media{ flex: 0 0 44%; aspect-ratio: auto; }
        .bento-card--wide .bento-body{ flex: 1; justify-content: center; }
        @media (max-width: 780px){
          .bento-grid{ grid-template-columns: 1fr; }
          .bento-card--large{ grid-column: 1; grid-row: auto; }
          .bento-stack{ grid-column: 1; grid-row: auto; }
          .bento-card--wide{ grid-column: 1; flex-direction: column; }
          .bento-card--wide .bento-media{ flex: none; aspect-ratio: 16 / 10; }
        }

        /* Consistent "browser window" frame around every media area,
           rather than differently styled raw images. */
        .bento-media{ position: relative; background: var(--bg-1, #F6F4EF); overflow: hidden; }
        .bento-browser-bar{
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          background: rgba(17,24,39,.04);
          border-bottom: 1px solid var(--line, #DDDAD3);
        }
        .bento-dot{ width: 7px; height: 7px; border-radius: 50%; background: rgba(17,24,39,.16); }
        .bento-dot:last-child{ background: var(--accent, #2563EB); opacity: .55; }
        .bento-media-inner{ position: relative; width: 100%; height: 100%; overflow: hidden; }
        .bento-card--wide .bento-media-inner{ min-height: 132px; }
        .bento-media-inner img, .bento-media-inner video{
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .bento-card:hover .bento-media-inner img,
        .bento-card:hover .bento-media-inner video{ transform: scale(1.025); }

        .bento-body{
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: clamp(12px, 1.5vw, 16px);
        }
        .bento-heading{ display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .bento-title{
          margin: 0;
          font-weight: 800;
          font-size: clamp(16px, 1.7vw, 21px);
          letter-spacing: -.01em;
          color: var(--text-1, #111827);
          transition: transform .25s ease;
        }
        .bento-card:hover .bento-title{ transform: translateY(-4px); }
        .bento-arrow{
          flex: 0 0 auto;
          color: var(--accent, #2563EB);
          font-size: 18px;
          transition: transform .25s ease;
        }
        .bento-card:hover .bento-arrow{ transform: translate(4px, -4px); }
        .bento-static-pill{
          flex: 0 0 auto;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: var(--text-3, #8A8F98);
        }

        .bento-metric{
          font-size: clamp(14px, 1.3vw, 16px);
          font-weight: 700;
          color: var(--accent, #2563EB);
        }
        .bento-blurb{
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--text-2, #5F6672);
        }
        .bento-card--large .bento-blurb{ font-size: 14.5px; }

        .bento-tags{
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity .2s ease, transform .2s ease;
        }
        .bento-card:hover .bento-tags{ opacity: 1; transform: translateY(0); }
        .bento-tag{
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(17,24,39,.05);
          color: var(--text-2, #5F6672);
        }

        @media (hover: none){
          /* No hover on touch — keep the tech stack visible instead of
             permanently hidden behind an interaction that can't happen. */
          .bento-tags{ opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce){
          .bento-card, .bento-title, .bento-arrow, .bento-tags,
          .bento-media-inner img, .bento-media-inner video{ transition: none; }
        }
      `}</style>
    </div>
  );
}

/* To turn on the autoplay demo clips: drop 5–8s, muted-friendly .mp4 files
   (ideally already silent/no audio track) into src/components/assets/, import
   them the same way the cover images are imported above, and set the
   corresponding project's `video` field to that import. BentoMedia already
   handles play-on-enter/pause-on-leave and falls back to the still cover
   whenever `video` is left undefined, so nothing else needs to change. */
