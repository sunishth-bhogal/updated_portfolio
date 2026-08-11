import React from "react";

/**
 * ReactAIBuilder
 * A tiny animated figure for "Currently building a React + AI project".
 *
 * Props:
 *  - size: number (px) — overall width/height
 */
export default function ReactAIBuilder({ size = 240 }) {
  return (
    <figure
      className="ai-dev-anim"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        role="img"
        focusable="false"
        className="ai-dev-anim__svg"
      >
        <defs>
          {/* Soft glow for neon bits */}
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="screenGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0d1b2a" />
            <stop offset="100%" stopColor="#0a121f" />
          </linearGradient>
        </defs>

        {/* Subtle floating group */}
        <g className="ai-float">
          {/* Laptop base */}
          <g transform="translate(20,96)">
            <rect
              x="0"
              y="0"
              rx="8"
              ry="8"
              width="160"
              height="96"
              fill="#0f172a"
              stroke="rgba(255,255,255,.10)"
              strokeWidth="1"
              filter="url(#softGlow)"
            />
            {/* Screen area */}
            <rect
              x="12"
              y="10"
              rx="6"
              ry="6"
              width="136"
              height="70"
              fill="url(#screenGrad)"
              stroke="rgba(255,255,255,.10)"
            />

            {/* AI chip (pulsing) */}
            <g transform="translate(80,45)">
              {/* chip pins */}
              {[...Array(6)].map((_, i) => (
                <rect
                  key={`pin-t-${i}`}
                  x={-30 + i * 10}
                  y={-18}
                  width="2.6"
                  height="4.5"
                  fill="#7dd3fc"
                  opacity=".35"
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <rect
                  key={`pin-b-${i}`}
                  x={-30 + i * 10}
                  y={13}
                  width="2.6"
                  height="4.5"
                  fill="#a78bfa"
                  opacity=".35"
                />
              ))}
              <rect
                className="ai-chip"
                x="-28"
                y="-12"
                rx="6"
                ry="6"
                width="56"
                height="24"
                fill="#0b1220"
                stroke="#7dd3fc"
                strokeWidth="1.2"
              />
              {/* tiny "AI" text block */}
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="11"
                fill="#cde9ff"
                style={{ letterSpacing: ".06em" }}
              >
                AI
              </text>
            </g>

            {/* progress sparks */}
            <g className="ai-sparks">
              <circle cx="34" cy="32" r="1.8" fill="#60a5fa" />
              <circle cx="120" cy="58" r="1.4" fill="#22d3ee" />
              <circle cx="78" cy="26" r="1.6" fill="#a78bfa" />
            </g>
          </g>

          {/* Laptop hinge & deck */}
          <g transform="translate(20,188)">
            <rect x="0" y="0" width="160" height="6" rx="3" fill="#121a2c" />
            <rect
              x="-6"
              y="6"
              width="172"
              height="10"
              rx="5"
              fill="#0c1424"
              stroke="rgba(255,255,255,.06)"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* React atom orbiting the laptop */}
        <g className="react-orbit" transform="translate(100,88)">
          {/* nucleus */}
          <circle r="3" fill="#7dd3fc" />
          {/* three ellipses to mimic the React logo */}
          <g
            stroke="#7dd3fc"
            strokeWidth="1.5"
            fill="none"
            filter="url(#softGlow)"
          >
            <ellipse rx="22" ry="8" />
            <ellipse rx="22" ry="8" transform="rotate(60)" />
            <ellipse rx="22" ry="8" transform="rotate(-60)" />
          </g>
        </g>

        {/* Data dot orbiting along the atom (accent) */}
        <circle className="react-dot" r="2.6" fill="#22d3ee" />
      </svg>
    </figure>
  );
}
