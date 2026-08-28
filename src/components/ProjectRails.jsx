// src/components/ProjectRails.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TML from "../components/assets/TML.jpg";
import Stock from "../components/assets/Stock.jpg";
import Portfolio from "../components/assets/Portfolio.jpg";
import UWStudySpots from "../components/assets/UWStudySpots.jpg";

// `video` stays undefined until real screen-recording clips exist — see the
// note at the bottom of this file. Draftfolio has no screenshot yet, so it
// renders a branded preview (preview: "draftfolio") instead of a raw image.
const PROJECTS = [
  {
    id: "draftfolio",
    slot: "featured",
    title: "Draftfolio",
    // Real thesis from the project — accurate, not a claim.
    tagline: "A ledger you can't lose or invent money in.",
    blurb:
      "Risk-aware fantasy investing built on an append-only, property-tested brokerage ledger — with live scoring, a leaderboard, and a deterministic “why did my portfolio move?” explainer.",
    metric: null,
    cover: undefined,
    video: undefined,
    preview: "draftfolio",
    tags: ["FastAPI", "Postgres", "Next.js", "Hypothesis"],
    url: "https://github.com/sunishth-bhogal/Draftfolio",
    cta: "View on GitHub",
  },
  {
    id: "uw-study-spots",
    slot: "tall",
    title: "UW Study Spots",
    blurb:
      "Live study-space finder for University of Waterloo students — occupancy data, campus maps, and student-submitted reports.",
    metric: "1,000+ users in 5 days",
    cover: UWStudySpots,
    video: undefined,
    tags: ["Next.js", "TypeScript", "Supabase", "UX"],
    url: "https://uw-study-spots.vercel.app/",
    cta: "Visit site",
  },
  {
    id: "xg",
    slot: "half",
    title: "NHL Predictions",
    blurb: "A model that predicts outcomes for the rest of the NHL season.",
    metric: null,
    cover: TML,
    video: undefined,
    tags: ["Python", "Pandas", "Modeling"],
    url: "https://github.com/sunishth-bhogal/NHL-Game-Predictor",
    cta: "View on GitHub",
  },
  {
    id: "stock",
    slot: "half",
    title: "New Stock Movers",
    blurb: "A market-tracking project currently in progress.",
    metric: null,
    cover: Stock,
    video: undefined,
    tags: ["Python", "Pandas", "Finance"],
    url: null, // no live destination yet — non-link "In progress" card
    cta: null,
  },
  {
    id: "sitev3",
    slot: "more",
    title: "Personal Site",
    blurb: "Portfolio website showcasing my experience, projects, and background.",
    metric: null,
    cover: Portfolio,
    video: undefined,
    tags: ["React", "Routing", "UX"],
    url: "https://github.com/sunishth-bhogal/Portfolio",
    cta: "View on GitHub",
  },
];

// A tasteful, clearly-decorative brand panel for projects with no screenshot
// yet — an abstract rising "equity curve" over a soft brand gradient plus the
// wordmark. Deliberately carries no numbers, so it reads as branding, never as
// a real dashboard with real data.
function BrandPreview({ label }) {
  return (
    <div className="pc-brand" aria-hidden="true">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(37,99,235,.28)" />
            <stop offset="1" stopColor="rgba(37,99,235,0)" />
          </linearGradient>
        </defs>
        {/* faint ledger grid */}
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(17,24,39,.05)" />
        ))}
        {/* area under the curve */}
        <path
          d="M0 150 C 50 140, 70 120, 110 118 S 180 96, 220 70 S 290 44, 320 30 L 320 200 L 0 200 Z"
          fill="url(#pcArea)"
        />
        {/* the curve itself */}
        <path
          d="M0 150 C 50 140, 70 120, 110 118 S 180 96, 220 70 S 290 44, 320 30"
          fill="none"
          stroke="var(--accent, #2563EB)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="pc-brand-mark">{label}</span>
    </div>
  );
}

// Plays a muted, looping clip once the card scrolls into view; otherwise shows
// the still cover, or the branded preview when there's no image yet. Every
// media area sits inside the same browser-window frame for consistency.
function CardMedia({ src, video, alt, preview, label }) {
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
    <div className="pc-media" ref={wrapRef}>
      <div className="pc-bar" aria-hidden="true">
        <span className="pc-dot" />
        <span className="pc-dot" />
        <span className="pc-dot" />
      </div>
      <div className="pc-media-inner">
        {video ? (
          <video ref={videoRef} src={video} poster={src} muted loop playsInline preload="metadata" />
        ) : src ? (
          <img src={src} alt={alt} loading="lazy" />
        ) : preview ? (
          <BrandPreview label={label} />
        ) : (
          <div className="pc-brand" aria-hidden="true">
            <span className="pc-brand-mark">Preview coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, reduceMotion }) {
  const hasLink = Boolean(project.url);
  const Tag = hasLink ? motion.a : motion.div;
  const linkProps = hasLink
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className={`pc pc--${project.slot} ${hasLink ? "" : "is-static"}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : 0.07 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <CardMedia
        src={project.cover}
        video={project.video}
        alt={project.title}
        preview={project.preview}
        label={project.title}
      />

      <div className="pc-body">
        <div className="pc-heading">
          <h3 className="pc-title">{project.title}</h3>
          {hasLink ? (
            <span className="pc-arrow" aria-hidden="true">↗</span>
          ) : (
            <span className="pc-status">In progress</span>
          )}
        </div>

        {project.tagline ? <span className="pc-metric">{project.tagline}</span> : null}
        {!project.tagline && project.metric ? (
          <span className="pc-metric">{project.metric}</span>
        ) : null}

        <p className="pc-blurb">{project.blurb}</p>

        <div className="pc-foot">
          <div className="pc-tags">
            {project.tags?.map((t) => (
              <span key={t} className="pc-tag">{t}</span>
            ))}
          </div>
          {project.cta ? (
            <span className="pc-cta">
              {project.cta} <span aria-hidden="true">↗</span>
            </span>
          ) : null}
        </div>
      </div>
    </Tag>
  );
}

export default function ProjectRails() {
  const reduceMotion = useReducedMotion();
  const featured = PROJECTS.find((p) => p.slot === "featured");
  const tall = PROJECTS.find((p) => p.slot === "tall");
  const halves = PROJECTS.filter((p) => p.slot === "half");
  const more = PROJECTS.filter((p) => p.slot === "more");

  return (
    <div className="pj-shell">
      <header className="pj-head">
        <div>
          <motion.p
            className="pj-eyebrow"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Selected work
          </motion.p>
          <motion.h2
            className="pj-title"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            Projects
          </motion.h2>
        </div>
        <motion.p
          className="pj-sub"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          Products built across finance, machine learning, and full-stack engineering.
        </motion.p>
      </header>

      <div className="pj-grid">
        {featured ? <ProjectCard project={featured} index={0} reduceMotion={reduceMotion} /> : null}
        {tall ? <ProjectCard project={tall} index={1} reduceMotion={reduceMotion} /> : null}
        {halves.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={2 + i} reduceMotion={reduceMotion} />
        ))}
      </div>

      {more.length ? (
        <div className="pj-more">
          <p className="pj-more-label">More experiments</p>
          <div className="pj-more-grid">
            {more.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={4 + i} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      ) : null}

      <style>{`
        /* The base .section rule caps every section at min(1100px, 92vw) and
           centres it — that's the narrow column. Projects opts out so it can
           run nearly full-width; the shell below supplies its own side padding. */
        #projects.section{
          width: 100%;
          max-width: none;
          margin-inline: 0;
        }

        /* Full-width section — break out of the narrow shared container and use
           responsive side padding instead, so the grid nearly fills the screen
           rather than sitting in a column with big grey margins. */
        #projects .pj-shell{
          width: 100%;
          box-sizing: border-box;
          padding: clamp(6px, 1vw, 16px) clamp(20px, 4vw, 72px) clamp(16px, 2vw, 28px);
        }

        /* ---- Header: eyebrow + big title on the left, blurb on the right ---- */
        #projects .pj-head{
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: clamp(20px, 2.6vw, 34px);
        }
        #projects .pj-eyebrow{
          margin: 0 0 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px; font-weight: 600;
          letter-spacing: .22em; text-transform: uppercase;
          color: var(--accent, #2563EB);
        }
        #projects .pj-title{
          margin: 0;
          font-weight: 800;
          font-size: clamp(40px, 6vw, 78px);
          line-height: .98;
          letter-spacing: -.02em;
          color: var(--text-1, #111827);
        }
        #projects .pj-sub{
          margin: 0 0 6px;
          max-width: 34ch;
          text-align: right;
          color: var(--text-2, #5F6672);
          line-height: 1.5;
        }

        /* ---- 12-column grid ---- */
        #projects .pj-grid{
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(14px, 1.5vw, 22px);
        }
        #projects .pc--featured{ grid-column: span 8; grid-row: 1; }
        #projects .pc--tall{ grid-column: span 4; grid-row: 1 / span 2; }
        #projects .pc--half{ grid-column: span 4; grid-row: 2; }

        /* ---- Card shell — one consistent, polished treatment ---- */
        #projects .pc{
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-radius: 24px;
          border: 1px solid rgba(17,24,39,.08);
          background: var(--panel, #fff);
          box-shadow: 0 12px 40px rgba(15,23,42,.05);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: transform .3s cubic-bezier(.16,1,.3,1),
                      border-color .3s ease, box-shadow .3s ease;
        }
        #projects .pc.is-static{ cursor: default; }
        #projects .pc:hover{
          transform: translateY(-6px);
          /* softened blue, not a hard accent line */
          border-color: rgba(37,99,235,.38);
          box-shadow: 0 22px 60px rgba(15,23,42,.12);
        }
        #projects .pc--featured{ flex-direction: row; min-height: clamp(300px, 23vw, 360px); }
        #projects .pc--featured .pc-media{ flex: 0 0 47%; }
        #projects .pc--featured .pc-body{ flex: 1; justify-content: center; }

        /* ---- Media: consistent browser frame + image ratios ---- */
        #projects .pc-media{
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--bg-1, #F6F4EF);
          min-height: 0;
        }
        #projects .pc-bar{
          display: flex; align-items: center; gap: 6px;
          padding: 9px 12px;
          background: rgba(17,24,39,.03);
          border-bottom: 1px solid rgba(17,24,39,.06);
        }
        #projects .pc-dot{ width: 7px; height: 7px; border-radius: 50%; background: rgba(17,24,39,.14); }
        #projects .pc-dot:last-child{ background: var(--accent, #2563EB); opacity: .5; }
        #projects .pc-media-inner{ position: relative; flex: 1; min-height: 0; overflow: hidden; }
        /* The two secondary cards share one image ratio so the row reads as a
           set. Row-layout cards (featured, more) let the media fill height
           instead — an aspect-ratio there would force the whole card tall. */
        #projects .pc--half .pc-media-inner{ aspect-ratio: 16 / 10; }
        #projects .pc-media-inner img,
        #projects .pc-media-inner video{
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        #projects .pc:hover .pc-media-inner img,
        #projects .pc:hover .pc-media-inner video{ transform: scale(1.045); }

        /* branded preview panel (Draftfolio) */
        #projects .pc-brand{
          position: absolute; inset: 0;
          display: flex; align-items: flex-end;
          background:
            radial-gradient(130% 100% at 15% 0%, rgba(37,99,235,.12), transparent 55%),
            linear-gradient(140deg, #eef1fb, #f6f5f1);
        }
        #projects .pc-brand svg{ position: absolute; inset: 0; width: 100%; height: 100%; }
        #projects .pc-brand-mark{
          position: relative;
          margin: 16px 18px;
          font-weight: 800; letter-spacing: -.01em;
          font-size: clamp(15px, 1.5vw, 19px);
          color: var(--text-1, #111827);
        }

        /* ---- Body: title / metric / blurb / footer in consistent slots ---- */
        #projects .pc-body{
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: clamp(16px, 1.6vw, 24px);
        }
        #projects .pc-heading{ display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        #projects .pc-title{
          margin: 0; font-weight: 800; letter-spacing: -.01em;
          font-size: clamp(17px, 1.5vw, 20px);
          color: var(--text-1, #111827);
          transition: transform .25s ease;
        }
        #projects .pc--featured .pc-title{ font-size: clamp(24px, 2.4vw, 34px); }
        #projects .pc:hover .pc-title{ transform: translateY(-2px); }
        #projects .pc-arrow{
          flex: 0 0 auto; color: var(--accent, #2563EB); font-size: 18px;
          transition: transform .25s ease;
        }
        #projects .pc:hover .pc-arrow{ transform: translate(4px, -4px); }
        #projects .pc-status{
          flex: 0 0 auto; font-size: 11px; font-weight: 700;
          letter-spacing: .04em; text-transform: uppercase;
          color: var(--text-3, #8A8F98);
        }
        #projects .pc-metric{
          font-size: clamp(14px, 1.2vw, 16px); font-weight: 700;
          color: var(--accent, #2563EB);
        }
        #projects .pc--featured .pc-metric{ font-size: clamp(15px, 1.4vw, 18px); }
        #projects .pc-blurb{
          margin: 0; font-size: 14px; line-height: 1.55;
          color: var(--text-2, #5F6672); max-width: 52ch;
        }
        #projects .pc--featured .pc-blurb{ font-size: 15px; }

        /* footer pinned to the bottom so tags + CTA sit in the same place on
           every card, giving the equal-height cards a consistent baseline. */
        #projects .pc-foot{
          margin-top: auto;
          padding-top: 4px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        #projects .pc-tags{ display: flex; flex-wrap: wrap; gap: 6px; }
        #projects .pc-tag{
          font-size: 11px; font-weight: 600;
          padding: 3px 8px; border-radius: 999px;
          background: rgba(17,24,39,.05); color: var(--text-2, #5F6672);
        }
        #projects .pc-cta{
          flex: 0 0 auto;
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 700;
          color: var(--accent, #2563EB);
          transition: gap .2s ease;
        }
        #projects .pc:hover .pc-cta{ gap: 9px; }

        /* ---- "More experiments" row ---- */
        #projects .pj-more{ margin-top: clamp(16px, 1.8vw, 26px); }
        #projects .pj-more-label{
          margin: 0 0 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: .18em; text-transform: uppercase;
          color: var(--text-3, #8A8F98);
        }
        #projects .pj-more-grid{
          display: grid;
          /* one card fills the row; more experiments wrap into columns later */
          grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
          gap: clamp(14px, 1.5vw, 22px);
        }
        #projects .pc--more{ flex-direction: row; min-height: clamp(150px, 13vw, 186px); }
        #projects .pc--more .pc-media{ flex: 0 0 clamp(220px, 26%, 320px); }
        #projects .pc--more .pc-body{ flex: 1; justify-content: center; }

        /* ---- Tablet ---- */
        @media (max-width: 1023px){
          #projects .pc--featured{ grid-column: 1 / -1; grid-row: auto; }
          #projects .pc--tall{ grid-column: 1 / -1; grid-row: auto; flex-direction: row; }
          #projects .pc--tall .pc-media{ flex: 0 0 47%; }
          #projects .pc--tall .pc-body{ flex: 1; justify-content: center; }
          #projects .pc--tall .pc-media-inner{ aspect-ratio: 16 / 10; }
          #projects .pc--half{ grid-column: span 6; grid-row: auto; }
          #projects .pj-more-grid{ grid-template-columns: 1fr; }
        }

        /* ---- Mobile ---- */
        @media (max-width: 640px){
          #projects .pj-head{ flex-direction: column; align-items: flex-start; }
          #projects .pj-sub{ display: none; }
          #projects .pj-grid{ grid-template-columns: 1fr; }
          #projects .pc--featured,
          #projects .pc--tall,
          #projects .pc--half{ grid-column: 1 / -1; grid-row: auto; flex-direction: column; }
          #projects .pc--featured .pc-media,
          #projects .pc--tall .pc-media,
          #projects .pc--more .pc-media{ flex: none; }
          #projects .pc--featured .pc-media-inner,
          #projects .pc--tall .pc-media-inner{ aspect-ratio: 16 / 10; }
          #projects .pc--more{ flex-direction: column; }
        }

        @media (hover: none){
          #projects .pc:hover{ transform: none; }
        }
        @media (prefers-reduced-motion: reduce){
          #projects .pc,
          #projects .pc-title,
          #projects .pc-arrow,
          #projects .pc-cta,
          #projects .pc-media-inner img,
          #projects .pc-media-inner video{ transition: none; }
          #projects .pc:hover{ transform: none; }
          #projects .pc:hover .pc-media-inner img,
          #projects .pc:hover .pc-media-inner video{ transform: none; }
        }
      `}</style>
    </div>
  );
}

/* To turn on the autoplay demo clips: drop 5–8s, muted .mp4 files into
   src/components/assets/, import them like the cover images above, and set the
   project's `video` field. CardMedia handles play-on-enter/pause-on-leave and
   falls back to the still cover (or the branded preview) when `video` is unset.
   To give Draftfolio a real screenshot, set its `cover` and drop `preview`. */
