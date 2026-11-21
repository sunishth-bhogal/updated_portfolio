// src/components/HeroStudio.jsx
// Two-column hero: the headline and actions on the left, one framed
// interactive product preview on the right. The entrance is a short sequence
// (headline, copy, actions, then the preview) and has no loading screen.
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LEAD_PROJECTS, ProjectVisual } from "./ProjectVisuals";

const EASE = [0.16, 1, 0.3, 1];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector(".nav-header");
  const headerH = header ? header.getBoundingClientRect().height : 0;
  const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

export default function HeroStudio() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(LEAD_PROJECTS[0].id);
  const tabRefs = React.useRef([]);
  const project = LEAD_PROJECTS.find((p) => p.id === active);

  const rise = (delay) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: EASE },
  });

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e, i) => {
    const n = LEAD_PROJECTS.length;
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(LEAD_PROJECTS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="home" className="sh" aria-labelledby="sh-title">
      <div className="sh-inner">
        <div className="sh-copy">
          <motion.p className="sh-eyebrow" {...rise(0)}>
            Sunishth Bhogal · Software engineer
          </motion.p>

          <h1 id="sh-title" className="sh-title">
            <motion.span className="sh-title-line" {...rise(0.05)}>
              Ideas into
            </motion.span>
            <motion.span className="sh-title-line" {...rise(0.13)}>
              things people <em>use.</em>
            </motion.span>
          </h1>

          <motion.p className="sh-intro" {...rise(0.26)}>
            I'm a software engineering intern at TD, studying Math at the University of Waterloo
            and a BBA at Wilfrid Laurier. I build products end to end, from the data model to the
            interface, and I'm happiest once real people start using them.
          </motion.p>

          <motion.div className="sh-actions" {...rise(0.36)}>
            <a
              className="sh-btn sh-btn--primary"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
            >
              Explore work <span aria-hidden="true">↓</span>
            </a>
            <a
              className="sh-btn sh-btn--ghost"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
            >
              Get in touch
            </a>
          </motion.div>

          {/* Signature: the Waterloo ↔ Toronto route this all happens along */}
          <motion.p className="sh-route" {...rise(0.44)}>
            <span className="sh-route-city">
              Waterloo <small>43.46° N</small>
            </span>
            <svg className="sh-route-line" viewBox="0 0 120 12" aria-hidden="true">
              <line x1="4" y1="6" x2="116" y2="6" />
              <circle cx="4" cy="6" r="3" />
              <circle cx="116" cy="6" r="3" />
            </svg>
            <span className="sh-route-city">
              Toronto <small>43.65° N</small>
            </span>
          </motion.p>
        </div>

        <motion.div
          className="sh-preview"
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.5, ease: EASE }}
        >
          <div className="sh-tabs" role="tablist" aria-label="Featured projects">
            {LEAD_PROJECTS.map((p, i) => {
              const selected = p.id === active;
              return (
                <button
                  key={p.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`sh-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls="sh-panel"
                  tabIndex={selected ? 0 : -1}
                  className={`sh-tab${selected ? " is-active" : ""}`}
                  onClick={() => setActive(p.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {selected ? (
                    <motion.span
                      layoutId="sh-tab-pill"
                      className="sh-tab-pill"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                  <span className="sh-tab-label">{p.title}</span>
                </button>
              );
            })}
          </div>

          <div
            id="sh-panel"
            className="sh-panel"
            role="tabpanel"
            aria-labelledby={`sh-tab-${active}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="sh-panel-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
              >
                <ProjectVisual id={project.id} />
                <div className="sh-caption">
                  <div>
                    <p className="sh-caption-kind">{project.kind}</p>
                    <p className="sh-caption-tag">{project.tagline}</p>
                  </div>
                  <a
                    className="sh-caption-link"
                    href={project.url || project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.url ? "Live site" : "GitHub"} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
