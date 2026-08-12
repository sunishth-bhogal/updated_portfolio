// src/components/SwingingFigure.jsx
// A small fixed-position character that swings side to side while the page
// is scrolling, then settles into a "clinging to the wall" pose against the
// nearest screen edge once scrolling stops. Not a depiction of any
// copyrighted character — just an original figure in the same flat,
// blocky style as the site's other illustrations (HikingAnimated etc.).
//
// Two distinct poses are swapped rather than rotating one pose 90° — a
// "hanging" figure rotated onto its side reads as an unreadable blob with a
// line jutting out sideways, so the wall state uses its own spread-limb
// "gripping" artwork instead.

import React from "react";
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";

const EDGE_MARGIN = 24;
const FIGURE_W = 56;
const IDLE_DELAY = 550;

const RED = "#D7263D";
const BLACK = "#161616";

function Mask({ cx, cy }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="10" fill={BLACK} />
      <ellipse cx={cx - 5} cy={cy - 2} rx="4.6" ry="2.8" fill="#fff" transform={`rotate(-18 ${cx - 5} ${cy - 2})`} />
      <ellipse cx={cx + 5} cy={cy - 2} rx="4.6" ry="2.8" fill="#fff" transform={`rotate(18 ${cx + 5} ${cy - 2})`} />
    </>
  );
}

function ClingPose() {
  return (
    <svg width={FIGURE_W} height="60" viewBox="0 0 56 60">
      {/* Each limb + its hand/foot cap is one <g> sharing a single rotate
          transform, so the cap is placed in the rect's own local coordinate
          space (at its natural far end) instead of hand-computing rotated
          page coordinates — much less error-prone than rotating each piece
          separately with guessed offsets. */}
      <g transform="rotate(-32 8 6)">
        <rect x="4" y="6" width="8" height="20" rx="4" fill={RED} />
        <circle cx="8" cy="26" r="4.2" fill={BLACK} />
      </g>
      <g transform="rotate(32 48 6)">
        <rect x="44" y="6" width="8" height="20" rx="4" fill={RED} />
        <circle cx="48" cy="26" r="4.2" fill={BLACK} />
      </g>
      <g transform="rotate(30 8 34)">
        <rect x="4" y="34" width="8" height="20" rx="4" fill={RED} />
        <rect x="2" y="50.25" width="12" height="7.5" rx="3.2" fill={BLACK} />
      </g>
      <g transform="rotate(-30 48 34)">
        <rect x="44" y="34" width="8" height="20" rx="4" fill={RED} />
        <rect x="42" y="50.25" width="12" height="7.5" rx="3.2" fill={BLACK} />
      </g>

      <rect x="18" y="26" width="20" height="22" rx="8" fill={RED} />
      <path d="M29 28 H35 V46 H29 Z" fill={BLACK} opacity=".92" />
      <Mask cx={28} cy={14} />
    </svg>
  );
}

function HangPose() {
  return (
    <svg width={FIGURE_W} height="88" viewBox="0 0 56 88">
      <line x1="28" y1="0" x2="28" y2="18" stroke="#3a3a3a" strokeWidth="1.5" />

      {/* arms reaching up to the line — pivot sits at the hand end (near the
          line) so the shoulder end swings to meet the torso */}
      <g transform="rotate(-26 14.75 17)">
        <rect x="11" y="17" width="7.5" height="23" rx="3.7" fill={RED} />
        <circle cx="14.75" cy="15" r="4.3" fill={BLACK} />
      </g>
      <g transform="rotate(26 41.25 17)">
        <rect x="37.5" y="17" width="7.5" height="23" rx="3.7" fill={RED} />
        <circle cx="41.25" cy="15" r="4.3" fill={BLACK} />
      </g>

      {/* bent legs — pivot at the hip end, foot cap at the natural far end */}
      <g transform="rotate(-8 20.75 64)">
        <rect x="17" y="64" width="7.5" height="21" rx="3.7" fill={RED} />
        <rect x="14.75" y="82" width="12" height="7.5" rx="3.2" fill={BLACK} />
      </g>
      <g transform="rotate(8 35.25 64)">
        <rect x="31.5" y="64" width="7.5" height="21" rx="3.7" fill={RED} />
        <rect x="29.25" y="82" width="12" height="7.5" rx="3.2" fill={BLACK} />
      </g>

      <rect x="18" y="39" width="20" height="27" rx="9" fill={RED} />
      <path d="M29 41 H36 V63 H29 Z" fill={BLACK} opacity=".92" />
      <Mask cx={28} cy={28} />
    </svg>
  );
}

export default function SwingingFigure() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const [pose, setPose] = React.useState("cling");
  const swingLoop = React.useRef(null);
  const idleTimer = React.useRef(null);
  const modeRef = React.useRef("wall"); // 'wall' | 'swing'
  const lastYRef = React.useRef(0);

  const wallX = React.useCallback((side) => {
    const vw = window.innerWidth;
    return side === "right" ? vw - EDGE_MARGIN - FIGURE_W : EDGE_MARGIN;
  }, []);

  const nearestWallSide = React.useCallback(() => {
    const vw = window.innerWidth;
    return x.get() > vw / 2 ? "right" : "left";
  }, [x]);

  const goToWall = React.useCallback(() => {
    modeRef.current = "wall";
    if (swingLoop.current) {
      swingLoop.current.stop();
      swingLoop.current = null;
    }
    const side = nearestWallSide();
    const target = wallX(side);
    animate(x, target, {
      type: "spring",
      stiffness: 170,
      damping: 20,
      onComplete: () => setPose("cling"),
    });
    animate(rotate, 0, { type: "spring", stiffness: 170, damping: 18 });
  }, [nearestWallSide, wallX, x, rotate]);

  const startSwinging = React.useCallback(() => {
    if (modeRef.current === "swing") return;
    modeRef.current = "swing";
    setPose("hang");
    if (swingLoop.current) {
      swingLoop.current.stop();
      swingLoop.current = null;
    }
    const vw = window.innerWidth;
    const left = EDGE_MARGIN + 50;
    const right = vw - EDGE_MARGIN - FIGURE_W - 50;
    const startSide = nearestWallSide();
    const xKeyframes =
      startSide === "right" ? [x.get(), left, right, left, right] : [x.get(), right, left, right, left];

    animate(x, xKeyframes, { duration: 5.2, repeat: Infinity, ease: "easeInOut" });
    swingLoop.current = animate(rotate, [rotate.get(), -20, 20, -20, 20], {
      duration: 5.2,
      repeat: Infinity,
      ease: "easeInOut",
    });
  }, [nearestWallSide, x, rotate]);

  React.useEffect(() => {
    if (reduceMotion) return undefined;

    x.set(wallX("right"));
    rotate.set(0);
    idleTimer.current = setTimeout(goToWall, 300);
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastYRef.current) > 1) {
        startSwinging();
      }
      lastYRef.current = y;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(goToWall, IDLE_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer.current);
      if (swingLoop.current) swingLoop.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div className="swinger" aria-hidden="true" style={{ x, rotate }}>
      {pose === "hang" ? <HangPose /> : <ClingPose />}
    </motion.div>
  );
}
