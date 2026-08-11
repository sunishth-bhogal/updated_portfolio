// src/components/RockClimbAnimated.jsx
// Same blocky/gradient "scene" language as GymSceneAnimated.jsx:
// a climbing wall with holds + a figure mid-reach.

export default function RockClimbAnimated({ width = 200, height = 240 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 240"
      role="img"
      aria-labelledby="climbTitle"
      className="climbscene"
    >
      <title id="climbTitle">Animated rock climber</title>

      <style>{`
        .climber {
          transform-origin: 100px 140px;
          animation: climb-sway 3.4s ease-in-out infinite;
        }
        @keyframes climb-sway {
          0%, 100% { transform: translateY(0) rotate(-0.6deg); }
          50%      { transform: translateY(-5px) rotate(0.6deg); }
        }
        .arm-reach {
          transform-origin: 118px 118px;
          animation: reach 2.2s ease-in-out infinite;
        }
        @keyframes reach {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          40%      { transform: rotate(-14deg) translateY(-4px); }
          60%      { transform: rotate(-14deg) translateY(-4px); }
        }
        .arm-anchor {
          transform-origin: 84px 122px;
          animation: micro-shift 2.2s ease-in-out infinite;
        }
        @keyframes micro-shift {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(3deg); }
        }
        .leg-push {
          transform-origin: 96px 168px;
          animation: leg-push 2.2s ease-in-out infinite;
        }
        @keyframes leg-push {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-6deg); }
        }
        .chalk-puff {
          transform-origin: 128px 108px;
          animation: puff 2.2s ease-in-out infinite;
        }
        @keyframes puff {
          0%, 35%   { opacity: 0; transform: scale(.4); }
          45%       { opacity: .55; transform: scale(1); }
          65%, 100% { opacity: 0; transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .climber, .arm-reach, .arm-anchor, .leg-push, .chalk-puff { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="wallFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2436" />
          <stop offset="1" stopColor="#141a29" />
        </linearGradient>
        <linearGradient id="holdGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fa4ff" />
          <stop offset="1" stopColor="#6c5ce7" />
        </linearGradient>
        <linearGradient id="holdGradAlt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ca8ff" />
          <stop offset="1" stopColor="#4a6fd6" />
        </linearGradient>
        <filter id="climbSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".28" />
        </filter>
      </defs>

      {/* wall */}
      <rect x="14" y="10" width="172" height="220" rx="20" fill="url(#wallFace)" />

      {/* holds (static) */}
      <g filter="url(#climbSoft)">
        <ellipse cx="60" cy="60" rx="12" ry="8" fill="url(#holdGrad)" transform="rotate(-18 60 60)" />
        <ellipse cx="140" cy="72" rx="11" ry="7" fill="url(#holdGradAlt)" transform="rotate(20 140 72)" />
        <ellipse cx="122" cy="112" rx="10" ry="7" fill="url(#holdGrad)" transform="rotate(-10 122 112)" />
        <ellipse cx="78" cy="118" rx="10" ry="7" fill="url(#holdGradAlt)" transform="rotate(14 78 118)" />
        <ellipse cx="96" cy="172" rx="12" ry="8" fill="url(#holdGrad)" transform="rotate(-8 96 172)" />
        <ellipse cx="132" cy="196" rx="10" ry="7" fill="url(#holdGradAlt)" transform="rotate(16 132 196)" />
      </g>

      {/* climber */}
      <g className="climber" filter="url(#climbSoft)">
        {/* legs */}
        <g className="leg-push">
          <rect x="90" y="150" width="7" height="24" rx="3.5" fill="#2e3754" />
          <rect x="86" y="172" width="15" height="7" rx="3.5" fill="#2e3754" />
        </g>
        <rect x="102" y="152" width="7" height="22" rx="3.5" fill="#3b4562" />
        <rect x="100" y="172" width="15" height="7" rx="3.5" fill="#3b4562" />

        {/* torso + pelvis */}
        <rect x="92" y="122" width="9" height="10" rx="3" fill="#2e3754" />
        <rect x="88" y="98" width="17" height="26" rx="7" fill="#8fa4ff" />

        {/* head */}
        <circle cx="96" cy="88" r="10" fill="#d8e2ff" />

        {/* anchor arm (down-left hold) */}
        <g className="arm-anchor">
          <rect x="78" y="106" width="6" height="20" rx="3" fill="#5f77ff" />
        </g>

        {/* reaching arm (up-right hold) + chalk puff */}
        <g className="arm-reach">
          <rect x="104" y="98" width="6" height="22" rx="3" fill="#6ea8ff" />
        </g>
        <circle className="chalk-puff" cx="128" cy="108" r="7" fill="#fff" />
      </g>
    </svg>
  );
}
