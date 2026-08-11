// src/components/PickleballAnimated.jsx
// Same blocky/gradient "scene" language as GymSceneAnimated.jsx:
// a figure mid-swing with a paddle and ball.

export default function PickleballAnimated({ width = 210, height = 190 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 210 190"
      role="img"
      aria-labelledby="pbTitle"
      className="pbscene"
    >
      <title id="pbTitle">Animated pickleball swing</title>

      <style>{`
        .player {
          transform-origin: 95px 150px;
          animation: pb-hop 1.3s ease-in-out infinite;
        }
        @keyframes pb-hop {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .swing-arm {
          transform-origin: 108px 108px;
          animation: swing 1.3s ease-in-out infinite;
        }
        @keyframes swing {
          0%, 20%  { transform: rotate(38deg); }
          50%      { transform: rotate(-48deg); }
          80%, 100%{ transform: rotate(38deg); }
        }
        .pb-ball {
          animation: ball-arc 1.3s ease-in-out infinite;
        }
        @keyframes ball-arc {
          0%   { transform: translate(0, 0); opacity: 0; }
          45%  { opacity: 1; }
          55%  { transform: translate(34px, -22px); opacity: 1; }
          75%  { opacity: 0; }
          100% { transform: translate(34px, -22px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .player, .swing-arm, .pb-ball { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="paddleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fa4ff" />
          <stop offset="1" stopColor="#6c5ce7" />
        </linearGradient>
        <filter id="pbSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".26" />
        </filter>
      </defs>

      {/* court line */}
      <rect x="10" y="164" width="190" height="6" rx="3" fill="#2e3754" />
      <rect x="98" y="120" width="4" height="44" fill="#232b44" />
      <ellipse cx="95" cy="168" rx="70" ry="10" fill="#000" opacity=".16" />

      {/* player */}
      <g className="player" filter="url(#pbSoft)">
        {/* back leg + front leg (static wide stance) */}
        <rect x="82" y="132" width="6" height="26" rx="3" fill="#2e3754" />
        <rect x="78" y="158" width="12" height="5" rx="2.5" fill="#2e3754" />
        <rect x="98" y="132" width="6" height="26" rx="3" fill="#3b4562" />
        <rect x="94" y="158" width="12" height="5" rx="2.5" fill="#3b4562" />

        {/* torso + head */}
        <rect x="83" y="106" width="18" height="28" rx="8" fill="#8fa4ff" />
        <circle cx="92" cy="96" r="10" fill="#d8e2ff" />

        {/* off arm */}
        <rect x="78" y="110" width="5" height="16" rx="2.5" fill="#2e3754" />

        {/* swinging arm + paddle */}
        <g className="swing-arm">
          <rect x="100" y="94" width="6" height="26" rx="3" fill="#6ea8ff" />
          <g transform="translate(100,86)">
            <ellipse cx="8" cy="0" rx="12" ry="16" fill="url(#paddleGrad)" />
            <rect x="4" y="14" width="8" height="14" rx="3" fill="#3b4562" />
          </g>
        </g>
      </g>

      {/* ball */}
      <circle className="pb-ball" cx="118" cy="86" r="5" fill="#fff2c2" />
    </svg>
  );
}
