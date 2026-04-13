import React from "react";

export default function CreativeSpark({ size = 160, color = "#7dd3fc" }) {
  const id = React.useId(); // unique gradient ids per instance
  return (
    <svg
      className="creative-spark"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Creativity: ideas (lightbulb) turned into execution (pencil) with orbiting sparks"
    >
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="70%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft glow */}
      <circle cx="100" cy="90" r="74" fill={`url(#glow-${id})`} className="glow" />

      {/* floating group */}
      <g className="float">
        {/* bulb outline */}
        <path
          d="M100 28c-26 0-47 20.6-47 46.1 0 14.7 7 25.7 16.1 33.7 6.3 5.5 7.9 10.6 8.2 18.2h45.1c.2-7.6 1.9-12.7 8.2-18.2C140 99.9 147 88.8 147 74.1 147 48.6 126 28 100 28z"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* filament draws in */}
        <path
          className="draw"
          d="M78 95c6-8 14-12 22-12s16 4 22 12"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* bulb cap */}
        <rect x="78" y="127.5" width="44" height="10" rx="4" fill="#1f2a3a" stroke={color} strokeOpacity=".25"/>
        <rect x="78" y="139.5" width="44" height="10" rx="4" fill="#1f2a3a" stroke={color} strokeOpacity=".18"/>

        {/* pencil base (execution) */}
        <g transform="translate(88,150)">
          <rect width="24" height="14" rx="3" fill="#eab308" />
          <polygon points="12,14 24,14 30,22 18,22" fill="#a16207" />
          <polygon points="12,14 0,14 -6,22 6,22" fill="#fef08a" />
          <polygon points="30,22 18,22 21,26" fill="#0b0f1a" opacity=".9" />
          <polygon points="-6,22 6,22 3,26" fill="#0b0f1a" opacity=".9" />
        </g>

        {/* little spark lines */}
        <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <line className="spark" x1="100" y1="22" x2="100" y2="14" />
          <line className="spark" x1="66"  y1="34" x2="60"  y2="28" />
          <line className="spark" x1="134" y1="34" x2="140" y2="28" />
        </g>
      </g>

      {/* orbiting idea dots */}
      <g className="orbit fast" transform="translate(100 90)">
        <circle r="62" fill="none" />
        <circle cx="62" cy="0" r="3.2" fill="#fff" />
      </g>
      <g className="orbit" transform="translate(100 90)">
        <circle r="48" fill="none" />
        <circle cx="-48" cy="0" r="2.6" fill="#fff" />
      </g>
      <g className="orbit slow" transform="translate(100 90)">
        <circle r="36" fill="none" />
        <circle cx="0" cy="-36" r="2.2" fill="#fff" />
      </g>
    </svg>
  );
}
