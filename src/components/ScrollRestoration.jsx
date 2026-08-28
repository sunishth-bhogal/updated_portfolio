// src/components/ScrollRestoration.jsx
import { useLocation, useNavigationType } from "react-router-dom";
import { useLayoutEffect } from "react";

// Remembers where each history entry was scrolled to, keyed by the router's
// per-entry location.key. Module-level so it survives route swaps for the
// whole browsing session (a back/forward returns to the SAME key).
const positions = new Map();

// Restores scroll position on back/forward, instead of always jumping to the
// top. So leaving Home to open a tab and hitting the browser back button drops
// you right where you were, not at the top of the page.
//
// Note: hash navigations (e.g. /#projects) are intentionally left alone here —
// ScrollManager owns those, scrolling to the target element with a header
// offset. This component only decides "restore vs. top" for plain routes.
export default function ScrollRestoration() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const key = location.key;

  // We own restoration, so keep the browser from also trying (and fighting us).
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Record the scroll position for the current history entry: continuously as
  // the user scrolls, and — crucially — once more in cleanup, right as we leave
  // this entry (that runs while the old scroll is still current, so it captures
  // where the user actually was). We deliberately do NOT record on setup: on a
  // back navigation the entry re-mounts at scroll 0 before restoration runs, so
  // recording then would clobber the saved position with 0.
  useLayoutEffect(() => {
    const record = () => positions.set(key, window.scrollY);
    window.addEventListener("scroll", record, { passive: true });
    return () => {
      record();
      window.removeEventListener("scroll", record);
    };
  }, [key]);

  // Decide where to land whenever the entry changes.
  useLayoutEffect(() => {
    if (location.hash) return; // ScrollManager handles hash targets

    if (navType === "POP" && positions.has(key)) {
      const y = positions.get(key);
      window.scrollTo(0, y);
      // Re-apply after paint in case content mounted taller than one frame.
      requestAnimationFrame(() => window.scrollTo(0, y));
    } else {
      // Fresh forward navigation (PUSH/REPLACE): start at the top.
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
