import React from "react";
import shoppersLogo from "../components/assets/Shoppers.jpg";
import stealthLogo from "../components/assets/stealthlogo.jpg";
import remaxLogo from "../components/assets/remaxlogo.png";

const EXPERIENCES = [
  {
    company: "Stealth Startup",
    role: "Full Stack Engineer Intern",
    dates: "Jan 2025 – Aug 2025",
    summary:
      "Worked on full-stack product development for a startup building tools in the marketing space, contributing across engineering, product functionality, and data-driven features.",
    logo: stealthLogo,
  },
  {
    company: "REMAX Real Estate Group",
    role: "Real Estate Data Analyst Intern",
    dates: "May 2023 – Aug 2023",
    summary:
      "Analyzed real estate data to support reporting, trends analysis, and business insights for brokerage operations.",
    logo: remaxLogo,
  },
  {
    company: "Shoppers Drug Mart",
    role: "Accounting Intern",
    dates: "May 2022 – Aug 2022",
    summary:
      "Supported accounting and financial operations in a fast-paced retail environment, assisting with reporting and day-to-day financial processes.",
    logo: shoppersLogo,
  },
];

export default function ExperienceTimeline() {
  return (
    <section id="experiences" className="exp-sec" aria-labelledby="exp-title">
      <div className="exp-wrap">
        <div className="exp-card" aria-labelledby="exp-title">
          <span className="exp-rail" aria-hidden="true" />

          <ol className="exp-list" aria-label="Timeline of experiences">
            {EXPERIENCES.map((e, i) => (
              <li key={e.company + i} className="exp-item">
                <span
                  className={`exp-dot ${i === 0 ? "is-active" : ""}`}
                  aria-hidden="true"
                />

                {e.logo ? (
                  <img
                    className="exp-logo"
                    src={e.logo}
                    alt={`${e.company} logo`}
                  />
                ) : (
                  <div className="exp-logo exp-logo--fallback" aria-hidden="true">
                    {e.company[0]}
                  </div>
                )}

                <div className="exp-content">
                  <div className="exp-head">
                    <h3 className="exp-company">{e.company}</h3>
                    <span className="exp-dates">{e.dates}</span>
                  </div>
                  <div className="exp-role">{e.role}</div>
                  <p className="exp-summary">{e.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}