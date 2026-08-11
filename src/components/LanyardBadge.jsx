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

const IDLE_KEYFRAMES = [0, 4, -4, 3, -3, 0];

export default function LanyardBadge() {
  const reduceMotion = useReducedMotion();
  const rotate = useMotionValue(0);
  const idleControls = React.useRef(null);

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
