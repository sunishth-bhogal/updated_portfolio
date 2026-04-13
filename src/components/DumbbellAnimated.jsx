export default function DumbbellAnimated({
    width = 140,
    height = 80,
  }) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 280 160"
        role="img"
        aria-labelledby="dbbellTitle"
        className="dbbell"
      >
        <title id="dbbellTitle">Animated dumbbell</title>
  
        {/* --- Styles & animation --- */}
        <style>{`
          .dbbell-ghost { opacity: .12; }
          .dbbell-group {
            transform-origin: 140px 80px;
            animation: dbbell-bob 2.6s ease-in-out infinite;
          }
          .dbbell-shine {
            animation: dbbell-shine 2.6s ease-in-out infinite;
            mix-blend-mode: screen;
          }
          @keyframes dbbell-bob {
            0%, 100% { transform: translateY(0px) rotate(0.3deg); }
            50%      { transform: translateY(-6px) rotate(-0.3deg); }
          }
          @keyframes dbbell-shine {
            0%   { opacity: 0; transform: translateX(-40px); }
            35%  { opacity: .75; }
            70%  { opacity: 0; transform: translateX(40px); }
            100% { opacity: 0; }
          }
        `}</style>
  
        {/* --- Gradients --- */}
        <defs>
          <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="#9fb7ff" />
            <stop offset="100%" stopColor="#5f77ff" />
          </linearGradient>
          <linearGradient id="plateDark" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"  stopColor="#303b5a" />
            <stop offset="100%" stopColor="#1e263b" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="#c9d4ff" />
            <stop offset="100%" stopColor="#9aa8d9" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-40%" width="140%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".25" />
          </filter>
        </defs>
  
        {/* subtle ground shadow */}
        <ellipse cx="140" cy="128" rx="110" ry="16" className="dbbell-ghost" fill="#000" />
  
        {/* Dumbbell */}
        <g className="dbbell-group" filter="url(#softShadow)">
          {/* Bar */}
          <rect x="70" y="72" width="140" height="16" rx="6" fill="url(#barGrad)" />
  
          {/* Knurl/Grip */}
          <rect x="120" y="66" width="40" height="28" rx="8" fill="#2a3147" />
          <path d="M122 70 l36 20 M122 90 l36 -20" stroke="#65739d" strokeWidth="2" opacity=".75" />
  
          {/* Left plates */}
          <g>
            <rect x="36" y="58" width="18" height="48" rx="6" fill="url(#plateDark)" />
            <rect x="52" y="50" width="20" height="64" rx="8" fill="url(#plate)" />
            <rect x="66" y="56" width="10" height="52" rx="6" fill="url(#plateDark)" />
          </g>
  
          {/* Right plates */}
          <g>
            <rect x="226" y="58" width="18" height="48" rx="6" fill="url(#plateDark)" />
            <rect x="208" y="50" width="20" height="64" rx="8" fill="url(#plate)" />
            <rect x="204" y="56" width="10" height="52" rx="6" fill="url(#plateDark)" />
          </g>
  
          {/* Shine sweep across the plates */}
          <g className="dbbell-shine">
            <rect x="44" y="48" width="6" height="68" rx="3" fill="#fff" opacity=".5" />
            <rect x="230" y="48" width="6" height="68" rx="3" fill="#fff" opacity=".5" />
          </g>
        </g>
      </svg>
    );
  }
  