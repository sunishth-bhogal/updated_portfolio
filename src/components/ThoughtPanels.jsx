import React from "react";
import { Link } from "react-router-dom";

export const THOUGHTS = [
  {
    slug: "learn-to-breathe",
    icon: "🌫️",
    title: "Learn to Breathe Between Things",
    excerpt: "Momentum isn’t progress. Sometimes the most forward thing you can do is pause.",
    date: "2025-08-19",
    tags: ["presence", "pace"],
  },
  {
    slug: "growth-hurts",
    icon: "🌱",
    title: "Growth Hurts (and That’s Honest)",
    excerpt: "If comfort is the metric, you’ll under-measure your life.",
    date: "2025-06-02",
    tags: ["discipline"],
  },
  {
    slug: "homesick-for-future",
    icon: "🛤️",
    title: "Homesick for a Future Self",
    excerpt: "I miss a version of me I haven’t met yet. That’s the pull of direction.",
    date: "2025-04-10",
    tags: ["identity", "becoming"],
  },
];

export default function ThoughtPanels() {
  return (
    <section className="thoughts-sec">
      <div className="thoughts-head">
        <h2 className="thoughts-title">Deep Thoughts</h2>
        <p className="thoughts-sub">Short reads I revisit when I need perspective.</p>
      </div>

      <div className="thoughts-grid">
        {THOUGHTS.map(t => (
          <Link key={t.slug} to={`/thoughts/${t.slug}`} className="thought-card" aria-label={t.title}>
            <div className="thought-icon" aria-hidden>{t.icon}</div>
            <h3 className="thought-h3">{t.title}</h3>
            <p className="thought-excerpt">{t.excerpt}</p>
            <div className="thought-meta">
              <time dateTime={t.date}>{new Date(t.date).toLocaleDateString()}</time>
              <span>•</span>
              <ul className="thought-tags">
                {t.tags.map(tag => <li key={tag}>#{tag}</li>)}
              </ul>
            </div>
            <span className="cta cta--sm">Read</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
