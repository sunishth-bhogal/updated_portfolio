import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import TML from "../components/assets/TML.jpg";
import Stock from "../components/assets/Stock.jpg";
import Portfolio from "../components/assets/Portfolio.jpg";
import UWStudySpots from "../components/assets/UWStudySpots.jpg";

const PROJECTS = [
  {
    id: "uw-study-spots",
    category: "Software",
    title: "UW Study Spots",
    blurb:
      "Live study-space finder for University of Waterloo students with occupancy data, campus maps, and student-submitted reports.",
    cover: UWStudySpots,
    tags: ["Next.js", "TypeScript", "Supabase", "UX"],
    links: [
      { label: "Live Website", url: "https://uw-study-spots.vercel.app/" },
    ],
  },
  {
    id: "sitev3",
    category: "Software",
    title: "Personal Site",
    blurb: "Portfolio website showcasing my experience, projects, and background.",
    cover: Portfolio,
    tags: ["React", "Routing", "UX"],
    links: [
      { label: "Code", url: "https://github.com/sunishth-bhogal/Portfolio" },
    ],
  },
  {
    id: "xg",
    category: "Data",
    title: "NHL Predictions",
    blurb: "A model I built to predict outcomes for the rest of the NHL season.",
    cover: TML,
    tags: ["Python", "Pandas", "Modeling"],
    links: [
      { label: "Notebook", url: "https://github.com/sunishth-bhogal/NHL-Game-Predictor" },
      { label: "Report", url: "#" },
    ],
  },
  {
    id: "stock",
    category: "Data",
    title: "New Stock Movers",
    blurb: "A market-tracking project currently in progress.",
    cover: Stock,
    tags: ["Python", "Pandas", "Finance"],
    links: [
      { label: "Notebook", url: "#" },
      { label: "Report", url: "#" },
    ],
  },
];

export default function ProjectTabs() {
  const [activeId, setActiveId] = useState(null);
  const reduceMotion = useReducedMotion();

  const items = PROJECTS;
  const activeProject = PROJECTS.find((p) => p.id === activeId) || null;

  const [coverIndex, setCoverIndex] = useState(0);
  const goTo = (i) => {
    const n = items.length;
    setCoverIndex(((i % n) + n) % n);
  };
  const circularOffset = (i) => {
    const n = items.length;
    let offset = (i - coverIndex + n) % n;
    if (offset > n / 2) offset -= n;
    return offset;
  };

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId]);

  return (
    <section className="projects-sec" aria-labelledby="projects-title">
      <div className="projects-wrap">
        <motion.div
          className="coverflow-wrap"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="coverflow"
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(coverIndex - 1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(coverIndex + 1);
              }
            }}
          >
            <button
              type="button"
              className="coverflow-arrow coverflow-arrow--prev"
              onClick={() => goTo(coverIndex - 1)}
              disabled={items.length <= 1}
              aria-label="Previous project"
            >
              ‹
            </button>

            <div className="coverflow-track">
              {items.map((p, i) => {
                const offset = circularOffset(i);
                const abs = Math.abs(offset);
                const isActive = offset === 0;
                const hidden = abs > 3;
                return (
                  <div
                    key={p.id}
                    className={`coverflow-card ${isActive ? "is-active" : ""}`}
                    role="button"
                    tabIndex={hidden ? -1 : 0}
                    aria-hidden={hidden}
                    aria-label={isActive ? `Open ${p.title}` : `Show ${p.title}`}
                    style={{
                      transform: `translate(-50%, -50%) translateX(${offset * 58}%) translateZ(${
                        -abs * 120
                      }px) rotateY(${-offset * 26}deg) scale(${Math.max(0.72, 1 - abs * 0.13)})`,
                      opacity: hidden ? 0 : Math.max(0.22, 1 - abs * 0.3),
                      zIndex: 50 - abs,
                      pointerEvents: hidden ? "none" : "auto",
                    }}
                    onClick={() => (isActive ? setActiveId(p.id) : goTo(i))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        isActive ? setActiveId(p.id) : goTo(i);
                      }
                    }}
                  >
                    <motion.div className="card-media coverflow-media" layoutId={`project-media-${p.id}`}>
                      <img src={p.cover} alt={p.title} loading="lazy" />
                    </motion.div>
                    <div className="coverflow-card-face">
                      <span className="coverflow-index">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="coverflow-title">{p.title}</h3>
                      <span className="coverflow-open">
                        Open Project <span aria-hidden>↗</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="coverflow-arrow coverflow-arrow--next"
              onClick={() => goTo(coverIndex + 1)}
              disabled={items.length <= 1}
              aria-label="Next project"
            >
              ›
            </button>
          </div>

          <div className="coverflow-dots" role="tablist" aria-label="Select project">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className={`coverflow-dot ${i === coverIndex ? "is-active" : ""}`}
                aria-selected={i === coverIndex}
                aria-label={`Go to project ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                className="project-modal-close"
                aria-label="Close project details"
                onClick={() => setActiveId(null)}
              >
                ✕
              </button>

              <motion.div
                className="project-modal-media"
                layoutId={`project-media-${activeProject.id}`}
              >
                <img src={activeProject.cover} alt={activeProject.title} />
              </motion.div>

              <div className="project-modal-body">
                <h3 id="project-modal-title" className="project-modal-title">
                  {activeProject.title}
                </h3>
                <p className="project-modal-blurb">{activeProject.blurb}</p>

                {activeProject.tags?.length ? (
                  <div className="badge-row">
                    {activeProject.tags.map((t) => (
                      <span key={t} className="badge">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {activeProject.links?.length ? (
                  <div className="project-modal-links">
                    {activeProject.links.map((l) => (
                      <a
                        key={l.label}
                        className="btn-primary"
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}