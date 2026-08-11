// src/components/HikingAnimated.jsx
// Same blocky/gradient "scene" language as GymSceneAnimated.jsx:
// mountain silhouette + a walking figure with a trekking pole.

export default function HikingAnimated({ width = 210, height = 190 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 210 190"
      role="img"
      aria-labelledby="hikeTitle"
      className="hikescene"
    >
      <title id="hikeTitle">Animated hiker with mountains</title>

      <style>{`
        .hiker {
          transform-origin: 105px 120px;
          animation: hike-bob 0.95s ease-in-out infinite;
        }
        @keyframes hike-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .h-arm-front { transform-origin: 100px 108px; animation: hArmF .95s ease-in-out infinite; }
        .h-arm-back  { transform-origin: 110px 108px; animation: hArmB .95s ease-in-out infinite; }
        .h-leg-front { transform-origin: 103px 128px; animation: hLegF .95s ease-in-out infinite; }
        .h-leg-back  { transform-origin: 109px 128px; animation: hLegB .95s ease-in-out infinite; }
        @keyframes hArmF { 0%,100%{ transform: rotate(18deg);} 50%{ transform: rotate(-20deg);} }
        @keyframes hArmB { 0%,100%{ transform: rotate(-16deg);} 50%{ transform: rotate(18deg);} }
        @keyframes hLegF { 0%,100%{ transform: rotate(-18deg);} 50%{ transform: rotate(16deg);} }
        @keyframes hLegB { 0%,100%{ transform: rotate(16deg);}  50%{ transform: rotate(-18deg);} }
        .sun { animation: sun-pulse 3.6s ease-in-out infinite; transform-origin: 168px 34px; }
        @keyframes sun-pulse {
          0%, 100% { opacity: .7; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hiker, .h-arm-front, .h-arm-back, .h-leg-front, .h-leg-back, .sun { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="mtnBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3a63" />
          <stop offset="1" stopColor="#1c2440" />
        </linearGradient>
        <linearGradient id="mtnFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4d86" />
          <stop offset="1" stopColor="#232c4c" />
        </linearGradient>
        <filter id="hikeSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".26" />
        </filter>
      </defs>

      {/* sky floor line */}
      <rect x="0" y="150" width="210" height="40" fill="#141a29" opacity=".5" />

      {/* sun */}
      <circle className="sun" cx="168" cy="34" r="14" fill="#b18cff" opacity=".8" />

      {/* mountains */}
      <path d="M-10 150 L50 70 L90 110 L130 50 L220 150 Z" fill="url(#mtnBack)" />
      <path d="M-10 160 L40 100 L80 140 L120 90 L220 160 Z" fill="url(#mtnFront)" />

      {/* ground */}
      <ellipse cx="105" cy="168" rx="90" ry="12" fill="#000" opacity=".18" />

      {/* hiker */}
      <g className="hiker" filter="url(#hikeSoft)">
        {/* pack */}
        <rect x="112" y="96" width="10" height="16" rx="4" fill="#5f77ff" />
        {/* legs */}
        <g className="h-leg-back">
          <rect x="100" y="128" width="6" height="20" rx="3" fill="#2e3754" />
          <rect x="97" y="146" width="12" height="5" rx="2.5" fill="#2e3754" />
        </g>
        <g className="h-leg-front">
          <rect x="106" y="128" width="6" height="20" rx="3" fill="#6ea8ff" />
          <rect x="103" y="146" width="12" height="5" rx="2.5" fill="#6ea8ff" />
        </g>
        {/* torso + head */}
        <rect x="97" y="100" width="16" height="24" rx="7" fill="#8fa4ff" />
        <circle cx="105" cy="90" r="10" fill="#d8e2ff" />
        {/* arms + pole */}
        <g className="h-arm-back">
          <rect x="108" y="104" width="5" height="18" rx="2.5" fill="#2e3754" />
        </g>
        <g className="h-arm-front">
          <rect x="97" y="104" width="5" height="18" rx="2.5" fill="#5f77ff" />
          <rect x="90" y="118" width="3" height="34" rx="1.5" fill="#c8d2f2" />
        </g>
      </g>
    </svg>
  );
}
