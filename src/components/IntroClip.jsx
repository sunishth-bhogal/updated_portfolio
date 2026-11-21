// src/components/IntroClip.jsx
// Full-screen intro on arrival: plays 0:45–1:00 of the George Springer ALCS
// Game 7 home run (YouTube embed, never downloaded or rehosted), then fades
// into the homepage.
//
// - Browsers only allow autoplay when muted, so it starts muted with a
//   clear "Unmute" button.
// - Shown once per browser session; skipped entirely for visitors who prefer
//   reduced motion.
// - Skip button (focused on open) and Escape both dismiss it. If the video
//   can't autoplay (e.g. low-power mode) the intro gets out of the way.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_ID = "PNBV5WZKKiE";
const START = 45;
const END = 60;
const SEEN_KEY = "sb-intro-seen";

function shouldShow() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

export default function IntroClip() {
  const [open, setOpen] = React.useState(shouldShow);
  const [muted, setMuted] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const iframeRef = React.useRef(null);
  const skipRef = React.useRef(null);

  const close = React.useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage can be unavailable; the intro just shows again next time */
    }
  }, []);

  const send = (func, args = []) => {
    const w = iframeRef.current && iframeRef.current.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  // Lock page scroll while the intro covers the screen; Escape skips it.
  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    skipRef.current && skipRef.current.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Listen to the YouTube player: close when the segment ends; bail out if it
  // never starts playing.
  React.useEffect(() => {
    if (!open) return undefined;
    let started = false;
    const onMsg = (e) => {
      if (typeof e.origin !== "string" || !e.origin.includes("youtube")) return;
      let data;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const state =
        data && (data.event === "onStateChange" ? data.info : data.info && data.info.playerState);
      if (state === 1 && !started) {
        started = true;
        setPlaying(true);
      }
      if (state === 0) close();
    };
    window.addEventListener("message", onMsg);
    const noStart = setTimeout(() => !started && close(), 7000);
    const hardStop = setTimeout(close, (END - START + 8) * 1000);
    return () => {
      window.removeEventListener("message", onMsg);
      clearTimeout(noStart);
      clearTimeout(hardStop);
    };
  }, [open, close]);

  const onLoad = () => {
    // Ask the player to report state changes back to this page.
    const w = iframeRef.current && iframeRef.current.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: "listening", id: "sb-intro" }), "*");
  };

  const toggleSound = () => {
    if (muted) {
      send("unMute");
      send("setVolume", [100]);
    } else {
      send("mute");
    }
    setMuted((m) => !m);
  };

  const origin = typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";
  const src =
    `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&start=${START}&end=${END}` +
    `&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${origin}`;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Intro: George Springer's go-ahead home run, ALCS Game 7"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="intro-video" aria-hidden="true">
            <iframe
              ref={iframeRef}
              src={src}
              title="George Springer's go-ahead home run (YouTube)"
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
              onLoad={onLoad}
            />
          </div>
          <div className="intro-shade" aria-hidden="true" />

          <div className="intro-ui">
            <p className="intro-date">
              <time dateTime="2025-10-20">October 20, 2025</time> · Toronto · I was there
            </p>
            <div className="intro-actions">
              <button type="button" className="intro-btn" onClick={toggleSound}>
                {muted ? "Unmute" : "Mute"}
              </button>
              <button ref={skipRef} type="button" className="intro-btn intro-btn--solid" onClick={close}>
                Skip intro <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <span className="intro-progress" aria-hidden="true">
            <span className={playing ? "is-running" : ""} style={{ animationDuration: `${END - START}s` }} />
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
