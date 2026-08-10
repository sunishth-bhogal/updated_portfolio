import React from "react";
import shoppersLogo from "../components/assets/Shoppers.jpg";
import stealthLogo from "../components/assets/stealthlogo.jpg";
import remaxLogo from "../components/assets/remaxlogo.png";
import TDLogo from "../components/assets/TD.jpg";

const EXPERIENCES = [
  {
    company: "TD Bank",
    role: "Software Engineer Intern",
    dates: "Sep 2026 – Dec 2026",
    summary:
      "Incoming",
    logo: TDLogo,
  },
  {
    company: "Stealth Startup",
    role: "Full Stack Engineer Intern",
    dates: "Jan 2025 – Aug 2025",
    summary:
      "Early stage startup experience building a web application from scratch, contributing to both front-end and back-end development, and collaborating closely with the founding team.",
    logo: stealthLogo,
  },
  {
    company: "REMAX Real Estate Centre",
    role: "Full Stack Developer Intern",
    dates: "May 2023 – Aug 2023",
    summary:
      "Assisted in developing and maintaining web applications for real estate listings, implementing new features, and optimizing performance to enhance user experience.",
    logo: remaxLogo,
  },
  {
    company: "Shoppers Drug Mart",
    role: "Pharmacy Assistant",
    dates: "May 2022 – Aug 2022",
    summary:
      "Assisted pharmacists in preparing and dispensing medications, managing inventory, and providing customer service in a fast-paced retail pharmacy environment.",
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