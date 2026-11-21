// src/components/ProjectRails.jsx
// Projects: three lead projects as wide case cards (visual, problem, what I
// built, outcome) that expand in place for the full write-up, then the rest
// in a smaller grid. Outcomes here only state what is verifiable from the
// project itself or the owner's own figures. Never add user counts that
// aren't real.
import React from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { LEAD_PROJECTS, ProjectVisual } from "./ProjectVisuals";

const MORE = [
  {
    id: "founder-ai",
    title: "Founder AI Assistant",
    blurb:
      "An AI workspace that organizes founder notes, analyzes customer feedback, and turns that context into product and business recommendations.",
    tags: ["Next.js", "TypeScript", "OpenAI", "Postgres"],
    status: "In progress",
    url: null,
  },
  {
    id: "stock",
    title: "Stock News Impact",
    blurb: "Tracking how news moves individual stocks.",
    tags: ["Python", "Pandas", "Finance"],
    status: "In progress",
    url: null,
  },
  {
    id: "sitev3",
    title: "Personal Site, v1",
    blurb: "The first version of this portfolio: experience, projects and background.",
    tags: ["React", "Routing", "UX"],
    status: null,
    url: "https://github.com/sunishth-bhogal/Portfolio",
  },
];

const EASE = [0.16, 1, 0.3, 1];

function LeadCard({ p, index, reduce }) {
  const [open, setOpen] = React.useState(false);
  const flip = index % 2 === 1;
  const detailsId = `pj-details-${p.id}`;

  return (
    <motion.article
      layout={reduce ? false : "position"}
      className={`pjl${flip ? " pjl--flip" : ""}${open ? " is-open" : ""}`}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
      aria-labelledby={`pj-title-${p.id}`}
    >
      <motion.div layout={reduce ? false : "position"} className="pjl-visual">
        <ProjectVisual id={p.id} variant="map" />
      </motion.div>

      <motion.div layout={reduce ? false : "position"} className="pjl-body">
        <p className="pjl-kicker">
          <span className="pjl-num">{String(index + 1).padStart(2, "0")}</span> {p.kind}
        </p>
        <h3 id={`pj-title-${p.id}`} className="pjl-title">
          {p.title}
        </h3>
        <p className="pjl-tagline">{p.tagline}</p>

        <dl className="pjl-facts">
          <div>
            <dt>Problem</dt>
            <dd>{p.problem}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{p.outcome}</dd>
          </div>
        </dl>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={detailsId}
              key="details"
              className="pjl-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            >
              <dl className="pjl-facts">
                <div>
                  <dt>What I built</dt>
                  <dd>{p.built}</dd>
                </div>
              </dl>
              <ul className="pjl-stack" aria-label="Tech stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="pjl-actions">
          <button
            type="button"
            className="pjl-toggle"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Less" : "How I built it"}
            <span className="pjl-toggle-icon" aria-hidden="true">
              {open ? "−" : "+"}
            </span>
          </button>
          {p.url ? (
            <a className="pjl-link" href={p.url} target="_blank" rel="noopener noreferrer">
              {p.urlLabel} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <a className="pjl-link pjl-link--quiet" href={p.repo} target="_blank" rel="noopener noreferrer">
            Code <span aria-hidden="true">↗</span>
          </a>
        </div>
      </motion.div>
    </motion.article>
  );
}

function SmallCard({ p, i, reduce }) {
  const Tag = p.url ? motion.a : motion.div;
  const linkProps = p.url ? { href: p.url, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag
      {...linkProps}
      className={`pjs${p.url ? " is-link" : ""}`}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.06, ease: EASE }}
    >
      <div className="pjs-head">
        <h3 className="pjs-title">{p.title}</h3>
        {p.url ? (
          <span className="pjs-arrow" aria-hidden="true">↗</span>
        ) : (
          <span className="pjs-status">{p.status}</span>
        )}
      </div>
      <p className="pjs-blurb">{p.blurb}</p>
      <ul className="pjs-tags" aria-label="Tech stack">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Tag>
  );
}

export default function ProjectRails() {
  const reduce = useReducedMotion();
  return (
    <div className="pj2">
      <div className="pj2-head">
        <div>
          <p className="pj2-eyebrow">Selected work</p>
          <h2 className="pj2-title">Projects</h2>
        </div>
        <p className="pj2-sub">
          Products I've built across student life, finance and sports analytics, and what each one
          actually does.
        </p>
      </div>

      <LayoutGroup>
        <div className="pj2-lead">
          {LEAD_PROJECTS.map((p, i) => (
            <LeadCard key={p.id} p={p} index={i} reduce={reduce} />
          ))}
        </div>
      </LayoutGroup>

      <div className="pj2-more">
        <p className="pj2-more-label">More projects</p>
        <div className="pj2-more-grid">
          {MORE.map((p, i) => (
            <SmallCard key={p.id} p={p} i={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </div>
  );
}
