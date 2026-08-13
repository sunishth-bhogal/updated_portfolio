// src/components/LanyardBadge.jsx
// An interactive hanging ID badge. The strap, ring, and card all live inside
// one `.lanyard__pivot` wrapper that rotates around its top edge — so
// dragging the card swings the *whole* assembly together, like a real
// lanyard pinned at a single point, rather than just the card in isolation.
// Rotation is driven entirely by framer-motion (idle sway via an imperative
// `animate()` loop, drag via `onPan`) so nothing here ever fights a CSS
// `transform` the way some other pieces of this hero learned the hard way.

import React from "react";
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";
import Logo from "./assets/SBLOGO.png";
import { useNavInteraction } from "../context/NavInteractionContext";

const IDLE_KEYFRAMES = [0, 4, -4, 3, -3, 0];
// Kept tiny on purpose — the badge should acknowledge the hovered nav link,
// not perform for it.
const HOVER_TILT = (index) => index * 0.7 - 1.5;

export default function LanyardBadge() {
  const reduceMotion = useReducedMotion();
  const rotate = useMotionValue(0);
  const idleControls = React.useRef(null);
  const { hoverIndex, swing } = useNavInteraction();

  const startIdle = React.useCallback(() => {
    if (reduceMotion) return;
    idleControls.current = animate(rotate, IDLE_KEYFRAMES, {
      duration: 4.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    });
  }, [reduceMotion, rotate]);

  React.useEffect(() => {
    startIdle();
    return () => idleControls.current && idleControls.current.stop();
  }, [startIdle]);

  // The nav's currently-hovered link (if any) gently tilts the badge toward
  // it; leaving the nav lets it fall back to its idle sway.
  React.useEffect(() => {
    if (reduceMotion) return;
    if (hoverIndex == null) {
      animate(rotate, 0, {
        type: "spring",
        stiffness: 180,
        damping: 14,
        onComplete: startIdle,
      });
      return;
    }
    if (idleControls.current) {
      idleControls.current.stop();
      idleControls.current = null;
    }
    animate(rotate, HOVER_TILT(hoverIndex), { type: "spring", stiffness: 180, damping: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIndex, reduceMotion]);

  // A click swings the badge through the hovered link's direction before
  // settling — a small physical "acknowledgment" of the navigation.
  React.useEffect(() => {
    if (!swing || reduceMotion) return;
    if (idleControls.current) {
      idleControls.current.stop();
      idleControls.current = null;
    }
    const base = HOVER_TILT(swing.index);
    const overshoot = base + (base >= 0 ? 14 : -14);
    animate(rotate, [rotate.get(), overshoot, base], {
      duration: 0.6,
      times: [0, 0.4, 1],
      ease: ["easeOut", "easeInOut"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swing, reduceMotion]);

  const handlePan = (_e, info) => {
    if (idleControls.current) idleControls.current.stop();
    // Negated: CSS `rotate` is clockwise-positive in a Y-down coordinate
    // system, so a positive rotation on a top-pinned pivot swings a hanging
    // element LEFT, not right — this flips it back to matching the drag.
    const next = Math.max(-28, Math.min(28, -info.offset.x / 3));
    rotate.set(next);
  };

  const handlePanEnd = () => {
    animate(rotate, 0, {
      type: "spring",
      stiffness: 260,
      damping: 9,
      onComplete: startIdle,
    });
  };

  return (
    <div className="lanyard" aria-hidden="true">
      <motion.div className="lanyard__pivot" style={{ rotate }}>
        <div className="lanyard__strap">
          <span className="lanyard__strap-label">SUNISHTH BHOGAL · SUNISHTH BHOGAL ·</span>
        </div>
        <div className="lanyard__ring" />

        <motion.div
          className="lanyard__card"
          onPan={reduceMotion ? undefined : handlePan}
          onPanEnd={reduceMotion ? undefined : handlePanEnd}
        >
          <div className="lanyard__monogram">SB</div>
          <div className="lanyard__name">Sunishth Bhogal</div>
          <div className="lanyard__title">SOFTWARE ENGINEER</div>
          <img src={Logo} alt="" className="lanyard__logo" />
        </motion.div>
      </motion.div>
    </div>
  );
}
