import React from "react";

export default function ContactSplash({
  email = "sunishth.28@gmail.com",
  githubHref = "https://github.com/sunishth-bhogal",
  linkedinHref = "https://www.linkedin.com/in/sunishth-bhogal-39a162222/",
  xHref = "https://x.com/BhogalSunishth",
}) {
  const RIBBON_H = 52;

  const sectionStyle = {
    minHeight: `calc(100vh - ${RIBBON_H}px)`,
    display: "grid",
    placeItems: "center",
    padding: "clamp(24px, 6vw, 56px) 0 0",
    position: "relative",
    isolation: "isolate",
  };

  return (
    <section id="contact" className="contact-splash" style={sectionStyle}>
      <div className="cs-inner" style={{ textAlign: "center" }}>
        <h2
          className="cs-title"
          style={{
            marginTop: 0,
            marginBottom: "18px",
            lineHeight: 1,
          }}
        >
          Contact Me
        </h2>

        <nav
          className="cs-icons"
          aria-label="Contact links"
          style={{
            display: "flex",
            gap: "clamp(14px, 3.2vw, 26px)",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            className="cs-icon cs-github"
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={tileStyle("#0f1115", "#ffffff")}
          >
            <GitHubIcon />
          </a>

          <a
            className="cs-icon cs-email"
            href={`mailto:${email}`}
            aria-label="Email"
            style={tileStyle("#ff7e9b", "#111827")}
          >
            <MailIcon />
          </a>

          <a
            className="cs-icon cs-linkedin"
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={tileStyle("#2f83ff", "#081426")}
          >
            <LinkedInIcon />
          </a>

          <a
            className="cs-icon cs-x"
            href={xHref}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            style={tileStyle("#111111", "#ffffff")}
          >
            <XIcon />
          </a>
        </nav>
      </div>
    </section>
  );
}

const baseTile = {
  width: "clamp(72px, 10vw, 98px)",
  height: "clamp(72px, 10vw, 98px)",
  borderRadius: 20,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(120,140,170,.38)",
  boxShadow:
    "inset 0 -10px 18px rgba(0,0,0,.38), 0 12px 28px rgba(0,0,0,.28)",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
  textDecoration: "none",
};

function tileStyle(bg, fg) {
  return {
    ...baseTile,
    background: bg,
    color: fg,
  };
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="50" height="50" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.76.08-.75.08-.75 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.8.42-1.32.76-1.62-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="50" height="50" fill="none" aria-hidden="true">
      <path
        d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m3 7 9 6 9-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="50" height="50" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5Zm.02 6.5H2V22h3V10ZM9 10H6v12h3v-6.4c0-3.55 4-3.83 4 0V22h3v-7.62c0-6.04-6.5-5.82-7-2.85V10Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 4H20L8.5 20H4L15.5 4Z"
        fill="currentColor"
      />
    </svg>
  );
}