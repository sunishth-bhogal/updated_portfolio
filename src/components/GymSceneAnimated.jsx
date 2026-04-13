// src/components/GymSceneAnimated.jsx
// A compact SVG “scene”: 3D-ish dumbbell + animated runner.
// Props let you scale or hide either piece.

export default function GymSceneAnimated({
    width = 360,
    height = 160,
    showRunner = true,
    showDumbbell = true,
  }) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 160"
        role="img"
        aria-labelledby="gymTitle"
        className="gymscene"
      >
        <title id="gymTitle">Animated dumbbell and runner</title>
  
        {/* ---------- styles & keyframes ---------- */}
        <style>{`
          .floor {
            opacity:.18;
            filter: drop-shadow(0 6px 6px rgba(0,0,0,.18));
          }
  
          /* DUMBBELL */
          .db {
            transform-origin: 250px 95px;             /* around bar center */
            animation: db-bob 2.6s ease-in-out infinite;
          }
          @keyframes db-bob {
            0%,100% { transform: translateY(0) rotate(0.4deg); }
            50%     { transform: translateY(-6px) rotate(-0.4deg); }
          }
          .gloss { mix-blend-mode:screen; opacity:.65; }
          .edge  { opacity:.35; }
  
          /* RUNNER */
          .runner {
            transform-origin: 70px 88px;              /* pelvis anchor */
            animation: run-bob 0.9s ease-in-out infinite;
          }
          @keyframes run-bob {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(-4px); }
          }
          .arm-front  { transform-origin: 66px 84px; animation: armF 0.9s ease-in-out infinite; }
          .arm-back   { transform-origin: 66px 84px; animation: armB 0.9s ease-in-out infinite; }
          .leg-front  { transform-origin: 70px 98px; animation: legF 0.9s ease-in-out infinite; }
          .leg-back   { transform-origin: 70px 98px; animation: legB 0.9s ease-in-out infinite; }
  
          @keyframes armF { 0%,100%{ transform: rotate(28deg);} 50%{ transform: rotate(-28deg);} }
          @keyframes armB { 0%,100%{ transform: rotate(-24deg);} 50%{ transform: rotate(24deg);} }
          @keyframes legF { 0%,100%{ transform: rotate(-26deg);} 50%{ transform: rotate(24deg);} }
          @keyframes legB { 0%,100%{ transform: rotate(22deg);}  50%{ transform: rotate(-22deg);} }
  
          .speed-dots line {
            stroke: rgba(255,255,255,.22);
            stroke-width: 2;
            stroke-linecap: round;
            animation: dash 1.2s linear infinite;
          }
          @keyframes dash {
            0% { transform: translateX(0); opacity:.0; }
            10%{ opacity:.7; }
            100% { transform: translateX(-40px); opacity:0; }
          }
        `}</style>
  
        {/* ---------- gradients & filters ---------- */}
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E7ECFF"/>
            <stop offset="1" stopColor="#AEBBDF"/>
          </linearGradient>
  
          {/* outer plate rim (cool blue) */}
          <linearGradient id="plateRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#96B0FF"/>
            <stop offset="1" stopColor="#5F77FF"/>
          </linearGradient>
  
          {/* inner plate face (dark / 3D face) */}
          <linearGradient id="plateFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2A3147"/>
            <stop offset="1" stopColor="#1D2438"/>
          </linearGradient>
  
          {/* grip/knurl */}
          <linearGradient id="grip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3B4562"/>
            <stop offset="1" stopColor="#2B344D"/>
          </linearGradient>
  
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity=".22"/>
          </filter>
        </defs>
  
        {/* floor shadow for whole scene */}
        <ellipse cx="180" cy="120" rx="130" ry="18" className="floor" fill="#000"/>
  
        {/* ---------- RUNNER (left) ---------- */}
        {showRunner && (
          <g className="runner" filter="url(#soft)">
            {/* speed lines */}
            <g className="speed-dots">
              <line x1="110" y1="86" x2="138" y2="86" />
              <line x1="110" y1="102" x2="140" y2="102" style={{animationDelay:"0.15s"}}/>
              <line x1="110" y1="118" x2="130" y2="118" style={{animationDelay:"0.3s"}}/>
            </g>
  
            {/* body core */}
            <circle cx="66" cy="72" r="8" fill="#D8E2FF"/>               {/* head */}
            <rect   x="60" y="78" width="12" height="18" rx="4" fill="#8FA4FF"/>  {/* torso */}
            <rect   x="62" y="96" width="8"  height="8"  rx="2" fill="#3B4360"/>   {/* pelvis */}
  
            {/* arms */}
            <g className="arm-back">
              <rect x="58" y="84" width="4" height="16" rx="2" fill="#2E3754"/>
            </g>
            <g className="arm-front">
              <rect x="70" y="84" width="4" height="16" rx="2" fill="#5F77FF"/>
            </g>
  
            {/* legs */}
            <g className="leg-back">
              <rect x="60" y="98" width="4" height="18" rx="2" fill="#2E3754"/>
              <rect x="58" y="114" width="10" height="4" rx="2" fill="#2E3754"/>
            </g>
            <g className="leg-front">
              <rect x="70" y="98" width="4" height="18" rx="2" fill="#6EA8FF"/>
              <rect x="68" y="114" width="10" height="4" rx="2" fill="#6EA8FF"/>
            </g>
          </g>
        )}
  
        {/* ---------- DUMBBELL (right) ---------- */}
        {showDumbbell && (
          <g className="db" filter="url(#soft)">
            {/* ground shadow just for the dumbbell */}
            <ellipse cx="250" cy="126" rx="90" ry="14" className="floor" fill="#000"/>
  
            {/* BAR */}
            <rect x="182" y="92" width="136" height="12" rx="6" fill="url(#bar)"/>
            {/* Grip (knurl) with X pattern */}
            <rect x="238" y="86" width="24" height="24" rx="6" fill="url(#grip)"/>
            <path d="M240 90 l20 16 M240 106 l20 -16" stroke="#8DA0D8" strokeWidth="2" opacity=".85"/>
  
            {/* LEFT stack (3D) */}
            {/* back-face (darker, slightly offset) */}
            <g transform="translate(0,2)" opacity=".55">
              <rect x="186" y="78" width="8"  height="40" rx="4" fill="url(#plateFace)"/>
              <rect x="195" y="72" width="12" height="52" rx="6" fill="url(#plateFace)"/>
              <rect x="209" y="78" width="6"  height="40" rx="3" fill="url(#plateFace)"/>
            </g>
            {/* front-face rim + face */}
            <rect x="186" y="78" width="8"  height="40" rx="4" fill="url(#plateRim)"/>
            <rect x="195" y="72" width="12" height="52" rx="6" fill="url(#plateRim)"/>
            <rect x="209" y="78" width="6"  height="40" rx="3" fill="url(#plateRim)"/>
            {/* inner faces */}
            <rect x="196.5" y="74" width="9" height="48" rx="5" fill="url(#plateFace)"/>
            {/* highlight sweep */}
            <rect x="200" y="72" width="4" height="52" rx="2" className="gloss" fill="#fff"/>
  
            {/* RIGHT stack (mirror) */}
            <g transform="translate(0,2)" opacity=".55">
              <rect x="306" y="78" width="8"  height="40" rx="4" fill="url(#plateFace)"/>
              <rect x="292" y="72" width="12" height="52" rx="6" fill="url(#plateFace)"/>
              <rect x="288" y="78" width="6"  height="40" rx="3" fill="url(#plateFace)"/>
            </g>
            <rect x="306" y="78" width="8"  height="40" rx="4" fill="url(#plateRim)"/>
            <rect x="292" y="72" width="12" height="52" rx="6" fill="url(#plateRim)"/>
            <rect x="288" y="78" width="6"  height="40" rx="3" fill="url(#plateRim)"/>
            <rect x="294.5" y="74" width="9" height="48" rx="5" fill="url(#plateFace)"/>
            <rect x="296" y="72" width="4" height="52" rx="2" className="gloss" fill="#fff"/>
  
            {/* thin edge strokes for extra “3D” pop */}
            <rect x="195" y="72" width="12" height="52" rx="6" fill="none" stroke="#0B0F1A" className="edge"/>
            <rect x="292" y="72" width="12" height="52" rx="6" fill="none" stroke="#0B0F1A" className="edge"/>
          </g>
        )}
      </svg>
    );
  }
  