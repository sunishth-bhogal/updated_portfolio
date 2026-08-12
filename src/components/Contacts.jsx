import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ContactSplash({
  email = "sunishth.28@gmail.com",
  githubHref = "https://github.com/sunishth-bhogal",
  linkedinHref = "https://www.linkedin.com/in/sunishth-bhogal-39a162222/",
  xHref = "https://x.com/BhogalSunishth",
}) {
  const reduceMotion = useReducedMotion();

  const links = [
    { label: "Email", href: `mailto:${email}`, external: false },
    { label: "GitHub", href: githubHref, external: true },
    { label: "LinkedIn", href: linkedinHref, external: true },
    { label: "X", href: xHref, external: true },
  ];

  return (
    <div className="cs2">
      <div className="cs2-inner">
        <motion.h2
          className="cs2-title"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          Have an interesting problem?
        </motion.h2>
        <motion.p
          className="cs2-sub"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Let's build something people actually use.
        </motion.p>

        <motion.nav
          className="cs2-links"
          aria-label="Contact links"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {links.map((l, i) => (
            <React.Fragment key={l.label}>
              {i > 0 && <span className="cs2-dot" aria-hidden="true" />}
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
                className="cs2-link"
              >
                {l.label} <i>↗</i>
              </a>
            </React.Fragment>
          ))}
        </motion.nav>
      </div>

      <style>{`
        .cs2{
          padding: clamp(40px, 8vw, 88px) 0 clamp(56px, 9vw, 100px);
          text-align: center;
        }
        .cs2-inner{ width: min(720px, 92vw); margin: 0 auto; }
        .cs2-title{
          margin: 0 0 10px;
          font-weight: 800;
          font-size: clamp(28px, 4.4vw, 44px);
          letter-spacing: -0.02em;
          color: var(--text-1);
        }
        .cs2-sub{
          margin: 0 0 clamp(28px, 4vw, 40px);
          font-size: clamp(15px, 1.6vw, 18px);
          color: var(--text-2);
        }
        .cs2-links{
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap;
          gap: clamp(10px, 2vw, 18px);
        }
        .cs2-dot{
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--text-3);
          display: inline-block;
        }
        .cs2-link{
          font-size: clamp(15px, 1.6vw, 17px);
          font-weight: 700;
          color: var(--text-1);
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 2px;
          border-bottom: 1px solid transparent;
          transition: border-color .18s ease, color .18s ease;
        }
        .cs2-link i{ font-style: normal; font-size: 13px; transition: transform .18s ease; display: inline-block; }
        .cs2-link:hover{ color: var(--accent); border-color: var(--accent); }
        .cs2-link:hover i{ transform: translate(2px, -2px); }
      `}</style>
    </div>
  );
}
