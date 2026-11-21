// src/components/HeroMoment.jsx
// Right side of the hero: one cinematic card for George Springer's go-ahead
// home run in ALCS Game 7 (October 20, 2025), which I was at.
//
// - The still is YouTube's own thumbnail; the clip is embedded from YouTube,
//   never downloaded or rehosted.
// - Clicking expands the card (shared layout animation) into a large player
//   with YouTube's controls. It starts at the home run and is muted, so no
//   sound ever autoplays; viewers unmute with YouTube's own control.
// - Escape, the close button or clicking the backdrop collapse it again.
// - MotionConfig reducedMotion="user" turns the expand/collapse into an
//   instant swap for visitors who prefer reduced motion.
import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

const VIDEO_ID = "PNBV5WZKKiE";
const START = 45; // the swing
const STILL_HI = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const STILL_LO = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;
const EASE = [0.16, 1, 0.3, 1];

function Still({ className = "" }) {
  const [src, setSrc] = React.useState(STILL_HI);
  return (
    <img
      className={`hm-still ${className}`}
      src={src}
      alt=""
      decoding="async"
      onError={() => setSrc(STILL_LO)}
    />
  );
}

export default function HeroMoment() {
  const [open, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false); // iframe mounts after the expand finishes
  const cardRef = React.useRef(null);
  const closeRef = React.useRef(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setReady(false);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 50);
    // Mount the player even if no layout animation runs (e.g. reduced motion).
    const t2 = setTimeout(() => setReady(true), 700);
    return () => {
      clearTimeout(t2);
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, close]);

  const src =
    `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&start=${START}` +
    `&rel=0&modestbranding=1&playsinline=1`;

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.55, ease: EASE }}>
      <motion.div
        className="hero__moment"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
      >
        <button
          ref={cardRef}
          type="button"
          className="hm-card"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="The moments we live for. Play George Springer's go-ahead home run from ALCS Game 7, which I was at."
        >
          {/* the frame that morphs into the player */}
          {!open ? (
            <motion.span layoutId="hm-frame" className="hm-frame">
              <Still />
              <span className="hm-grade" aria-hidden="true" />
            </motion.span>
          ) : (
            <span className="hm-frame hm-frame--placeholder" aria-hidden="true" />
          )}

          <span className="hm-copy">
            <span className="hm-caption">
              I was there · <time dateTime="2025-10-20">October 20, 2025</time> · Toronto
            </span>
            <span className="hm-headline">The moments we live for.</span>
          </span>

          <span className="hm-play" aria-hidden="true">
            <span className="hm-play-dot">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
            Watch the moment
          </span>
        </button>
      </motion.div>

      <AnimatePresence
        onExitComplete={() => cardRef.current && cardRef.current.focus()}
      >
        {open ? (
          <motion.div
            key="hm-modal"
            className="hm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="George Springer's go-ahead home run, ALCS Game 7, October 20, 2025"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hm-backdrop" onClick={close} aria-hidden="true" />
            <div className="hm-stage">
              <motion.div
                layoutId="hm-frame"
                className="hm-frame hm-frame--open"
                onLayoutAnimationComplete={() => setReady(true)}
              >
                {ready ? (
                  <iframe
                    src={src}
                    title="George Springer's go-ahead home run, ALCS Game 7 (YouTube)"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Still />
                    <span className="hm-grade" aria-hidden="true" />
                  </>
                )}
              </motion.div>
              <div className="hm-bar">
                <p className="hm-bar-caption">
                  I was there · October 20, 2025 · Toronto
                </p>
                <button ref={closeRef} type="button" className="hm-close" onClick={close}>
                  Close <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
