// src/components/ScrollToTop.jsx
import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      // If there’s a #fragment, scroll to that element after paint
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ block: "start" });
        else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    } else {
      // New route: always start at top
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);

  return null;
}
