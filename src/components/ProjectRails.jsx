import React, { useMemo, useState, useRef, useEffect } from "react";
import TML from "../components/assets/TML.jpg";
import Stock from "../components/assets/Stock.jpg";
import Portfolio from "../components/assets/Portfolio.jpg";
import UWStudySpots from "../components/assets/UWStudySpots.jpg";

const CATEGORIES = ["All Projects", "Software", "Data"];

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
  const [cat, setCat] = useState("All Projects");

  const grouped = useMemo(() => {
    const map = new Map(CATEGORIES.map((c) => [c, []]));
    PROJECTS.forEach((p) => {
      if (map.has(p.category)) map.get(p.category).push(p);
    });
    map.set("All Projects", PROJECTS);
    return map;
  }, []);

  const rowRef = useRef(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const row = rowRef.current;
    const btn = row?.querySelector(`button[data-cat="${cat}"]`);
    if (!btn || !row) return;
    const { left, width } = btn.getBoundingClientRect();
    const { left: rowLeft } = row.getBoundingClientRect();
    setUnderline({ left: left - rowLeft, width });
  }, [cat]);

  const items = grouped.get(cat) || [];

  return (
    <section className="projects-sec" aria-labelledby="projects-title">
      <div className="projects-wrap">
        <header className="projects-head">
          <p className="projects-sub">
            <br />
            <br />
            A collection of projects that showcase my work in software, data, and
            AI. Each project represents a unique challenge, solution, and area of
            interest.
          </p>

          <div
            className="pills-row"
            role="tablist"
            aria-label="Project filters"
            ref={rowRef}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                data-cat={c}
                aria-selected={cat === c}
                className={`pill ${cat === c ? "is-active" : ""}`}
                onClick={() => setCat(c)}
              >
                <span className="pill-ico" aria-hidden="true">
                  {c === "All Projects" ? "🌐" : c === "Software" ? "🛠️" : "💾"}
                </span>
                {c}
                <span className="pill-count">{(grouped.get(c) || []).length}</span>
              </button>
            ))}
            <span
              className="pill-underline"
              style={{
                transform: `translateX(${underline.left}px)`,
                width: underline.width,
              }}
            />
          </div>
        </header>

        <div className="cards-grid" role="list">
          {items.map((p) => (
            <article key={p.id} role="listitem" className="card-soft">
              <div className="card-inner">
                <div className="card-top">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-blurb">{p.blurb}</p>

                  {p.links?.[0] && (
                    <a
                      className="btn-primary"
                      href={p.links[0].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.links[0].label} <span aria-hidden>↗</span>
                    </a>
                  )}

                  {p.tags?.length ? (
                    <div className="badge-row">
                      {p.tags.map((t) => (
                        <span key={t} className="badge">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="card-media">
                  <img src={p.cover} alt={p.title} loading="lazy" />
                </div>

                {p.links?.length > 1 && (
                  <div className="card-links">
                    {p.links.slice(1).map((l) => (
                      <a
                        key={l.label}
                        className="link-soft"
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}