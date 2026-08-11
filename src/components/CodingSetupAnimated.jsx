// src/components/CodingSetupAnimated.jsx
// Same blocky/gradient "scene" language as GymSceneAnimated.jsx:
// a desk + monitor with a figure typing.

export default function CodingSetupAnimated({ width = 210, height = 190 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 210 190"
      role="img"
      aria-labelledby="codeTitle"
      className="codescene"
    >
      <title id="codeTitle">Animated coder at a desk setup</title>

      <style>{`
        .screen-glow {
          animation: glow-pulse 2.6s ease-in-out infinite;
          transform-origin: 105px 62px;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: .55; }
          50%      { opacity: .95; }
        }
        .code-line {
          animation: line-flicker 3.2s steps(1) infinite;
        }
        @keyframes line-flicker {
          0%, 40%  { opacity: .9; }
          45%      { opacity: .3; }
          50%, 100%{ opacity: .9; }
        }
        .typist {
          transform-origin: 105px 130px;
          animation: type-bob 1.1s ease-in-out infinite;
        }
        @keyframes type-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
        .hand-l { transform-origin: 92px 120px; animation: tap-l .55s ease-in-out infinite; }
        .hand-r { transform-origin: 118px 120px; animation: tap-r .55s ease-in-out infinite .18s; }
        @keyframes tap-l { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
        @keyframes tap-r { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
        @media (prefers-reduced-motion: reduce) {
          .screen-glow, .code-line, .typist, .hand-l, .hand-r { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="deskTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2e3754" />
          <stop offset="1" stopColor="#232b44" />
        </linearGradient>
        <linearGradient id="screenBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2436" />
          <stop offset="1" stopColor="#141a29" />
        </linearGradient>
        <filter id="codeSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".26" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx="105" cy="176" rx="80" ry="10" fill="#000" opacity=".18" />

      {/* monitor stand + desk */}
      <rect x="98" y="94" width="14" height="16" rx="3" fill="#2e3754" />
      <rect x="18" y="108" width="174" height="12" rx="6" fill="url(#deskTop)" />
      <rect x="30" y="120" width="8" height="40" rx="3" fill="#232b44" />
      <rect x="172" y="120" width="8" height="40" rx="3" fill="#232b44" />

      {/* monitor */}
      <g filter="url(#codeSoft)">
        <rect x="55" y="30" width="100" height="66" rx="8" fill="url(#screenBg)" />
        <rect className="screen-glow" x="61" y="36" width="88" height="54" rx="5" fill="#101a2e" />
        <rect className="code-line" x="68" y="44" width="40" height="4" rx="2" fill="#6ca8ff" />
        <rect className="code-line" x="68" y="53" width="60" height="4" rx="2" fill="#8fa4ff" style={{ animationDelay: ".3s" }} />
        <rect className="code-line" x="68" y="62" width="30" height="4" rx="2" fill="#b18cff" style={{ animationDelay: ".6s" }} />
        <rect className="code-line" x="68" y="71" width="48" height="4" rx="2" fill="#6ca8ff" style={{ animationDelay: ".9s" }} />
      </g>

      {/* keyboard */}
      <rect x="80" y="104" width="50" height="8" rx="3" fill="#3b4562" />

      {/* typist */}
      <g className="typist" filter="url(#codeSoft)">
        <circle cx="105" cy="112" r="0" fill="none" />
        <rect x="93" y="118" width="24" height="26" rx="8" fill="#8fa4ff" />
        <circle cx="105" cy="104" r="11" fill="#d8e2ff" />
        <g className="hand-l">
          <rect x="86" y="112" width="6" height="14" rx="3" fill="#5f77ff" />
        </g>
        <g className="hand-r">
          <rect x="118" y="112" width="6" height="14" rx="3" fill="#6ea8ff" />
        </g>
      </g>
    </svg>
  );
}
