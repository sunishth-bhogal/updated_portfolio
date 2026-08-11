// src/components/PullUpAnimated.jsx
// Same blocky/gradient "scene" language as GymSceneAnimated.jsx:
// a bar with a figure doing pull-ups.

export default function PullUpAnimated({ width = 170, height = 220 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 170 220"
      role="img"
      aria-labelledby="pullupTitle"
      className="pullupscene"
    >
      <title id="pullupTitle">Animated figure doing pull-ups</title>

      <style>{`
        .puller {
          transform-origin: 85px 60px;
          animation: pull 1.6s ease-in-out infinite;
        }
        @keyframes pull {
          0%, 15%  { transform: translateY(0); }
          45%, 55% { transform: translateY(-26px); }
          85%, 100%{ transform: translateY(0); }
        }
        .arm-l { transform-origin: 68px 66px; animation: armPull 1.6s ease-in-out infinite; }
        .arm-r { transform-origin: 102px 66px; animation: armPull 1.6s ease-in-out infinite; }
        @keyframes armPull {
          0%, 15%  { transform: scaleY(1); }
          45%, 55% { transform: scaleY(.6); }
          85%, 100%{ transform: scaleY(1); }
        }
        .legs-swing { transform-origin: 85px 132px; animation: legSwing 1.6s ease-in-out infinite; }
        @keyframes legSwing {
          0%, 15%  { transform: rotate(0deg); }
          45%, 55% { transform: rotate(6deg); }
          85%, 100%{ transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .puller, .arm-l, .arm-r, .legs-swing { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8fa4ff" />
          <stop offset="1" stopColor="#5f77ff" />
        </linearGradient>
        <filter id="pullSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".26" />
        </filter>
      </defs>

      {/* rig */}
      <rect x="20" y="30" width="10" height="150" rx="4" fill="#2e3754" />
      <rect x="140" y="30" width="10" height="150" rx="4" fill="#2e3754" />
      <rect x="20" y="28" width="130" height="10" rx="5" fill="url(#barGrad)" />

      {/* floor shadow */}
      <ellipse cx="85" cy="196" rx="46" ry="8" fill="#000" opacity=".18" />

      {/* hands stay fixed on the bar */}
      <rect x="65" y="34" width="6" height="10" rx="2" fill="#3b4562" />
      <rect x="99" y="34" width="6" height="10" rx="2" fill="#3b4562" />

      {/* puller */}
      <g className="puller" filter="url(#pullSoft)">
        <g className="arm-l">
          <rect x="66" y="42" width="5" height="24" rx="2.5" fill="#5f77ff" />
        </g>
        <g className="arm-r">
          <rect x="99" y="42" width="5" height="24" rx="2.5" fill="#6ea8ff" />
        </g>

        <circle cx="85" cy="52" r="11" fill="#d8e2ff" />
        <rect x="74" y="64" width="22" height="30" rx="9" fill="#8fa4ff" />

        <g className="legs-swing">
          <rect x="77" y="94" width="6" height="26" rx="3" fill="#2e3754" />
          <rect x="87" y="94" width="6" height="26" rx="3" fill="#3b4562" />
          <rect x="75" y="118" width="10" height="6" rx="3" fill="#2e3754" />
          <rect x="85" y="118" width="10" height="6" rx="3" fill="#3b4562" />
        </g>
      </g>
    </svg>
  );
}
