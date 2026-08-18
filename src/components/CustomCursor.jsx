import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [overMap, setOverMap] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dot = dotRef.current;
    if (!dot) return;

    // Skip on touch devices
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let rafId = null;
    let x = 0, y = 0;

    const render = () => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafId = null;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);                // show on first move
      if (rafId === null) rafId = requestAnimationFrame(render);
    };

    const onOver = (e) => {
      const isInteractive = e.target.closest(
        "a,button,[role='button'],input,textarea,select,label,.clickable"
      );
      setActive(Boolean(isInteractive));
      // Shrink over the interactive world map (Growth page) — countries are
      // small enough that the normal-size dot hides whatever's underneath it.
      setOverMap(Boolean(e.target.closest(".lip__map-wrap")));
    };

    const hide = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("blur", hide);
      document.removeEventListener("mouseleave", hide);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={dotRef}
      className={`custom-cursor ${visible ? "is-visible" : ""} ${active ? "is-active" : ""} ${
        overMap ? "is-over-map" : ""
      }`}
      aria-hidden="true"
    />,
    document.body
  );
}
