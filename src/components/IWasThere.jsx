// src/components/IWasThere.jsx
// A short personal chapter between the hero and About: Blue Jays ALCS Game 7,
// October 20, 2025. The page scrolls normally; the heading and video frame
// only fade in as they enter view.
//
// The broadcast clip is embedded from YouTube and is never downloaded or
// rehosted. Until a visitor clicks play we show YouTube's own thumbnail;
// clicking loads the official player with sound and its normal controls.
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const VIDEO_ID = "PNBV5WZKKiE";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

// A photo or ticket from that night goes here, e.g.
//   import ticket from "./assets/alcs-game7-ticket.jpg";
//   const MEMENTO = { src: ticket, alt: "My ticket from ALCS Game 7", caption: "ALCS Game 7, Rogers Centre" };
// Leave it null until there's a real one. Nothing is shown in its place.
const MEMENTO = null;

function useIsSmall() {
  const [small, setSmall] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

function YouTubePlayer() {
  const [playing, setPlaying] = React.useState(false);
  const params = "autoplay=1&rel=0&modestbranding=1&playsinline=1";

  return (
    <div className="iwt-player">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params}`}
          title="George Springer's go-ahead home run, ALCS Game 7, October 20, 2025 (YouTube)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="iwt-poster"
          onClick={() => setPlaying(true)}
          aria-label="Play the video of George Springer's home run, with sound"
        >
          <img
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="iwt-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
          <span className="iwt-poster-label">Play with sound</span>
        </button>
      )}
    </div>
  );
}

export default function IWasThere() {
  const reduce = useReducedMotion();
  const small = useIsSmall();
  const still = reduce || small; // no movement on small screens or reduced motion

  const reveal = (delay = 0, y = 28) => ({
    initial: { opacity: 0, y: still ? 0 : y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: still ? 0.2 : 0.8, delay: still ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="i-was-there" className="iwt" aria-labelledby="iwt-title">
      <div className="iwt-inner">
        <div className="iwt-top">
          <motion.p className="iwt-date" {...reveal(0, 12)}>
            <time dateTime="2025-10-20">October 20, 2025</time> · Toronto
          </motion.p>
          <a className="iwt-skip" href="#projects">
            Skip to my work <span aria-hidden="true">↓</span>
          </a>
        </div>

        <h2 id="iwt-title" className="iwt-title">
          <motion.span className="iwt-word" {...reveal(0.05)}>I</motion.span>{" "}
          <motion.span className="iwt-word" {...reveal(0.14)}>was</motion.span>{" "}
          <motion.span className="iwt-word" {...reveal(0.23)}>there</motion.span>
        </h2>

        <div className={`iwt-body${MEMENTO ? " has-memento" : ""}`}>
          <motion.div
            className="iwt-video"
            initial={{ opacity: 0, y: still ? 0 : 40, scale: still ? 1 : 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: still ? 0.2 : 0.9, delay: still ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <YouTubePlayer />
          </motion.div>

          {MEMENTO ? (
            <motion.figure className="iwt-memento" {...reveal(0.3)}>
              <img src={MEMENTO.src} alt={MEMENTO.alt} loading="lazy" />
              {MEMENTO.caption ? <figcaption>{MEMENTO.caption}</figcaption> : null}
            </motion.figure>
          ) : null}
        </div>

        <motion.div className="iwt-foot" {...reveal(0.1, 16)}>
          <p className="iwt-line">One of the best moments of my life.</p>
          <p className="iwt-context">
            ALCS Game 7, Blue Jays vs. Mariners. George Springer's go-ahead home run.{" "}
            <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer">
              Watch on YouTube <span aria-hidden="true">↗</span>
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
