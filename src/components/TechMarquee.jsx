// src/components/TechMarquee.jsx
import React, { useMemo } from "react";

import htmlIcon    from "../components/assets/html.jpg";
import reactIcon   from "../components/assets/react.jpg";
import mysqlIcon   from "../components/assets/mysql.jpg";
import gitIcon     from "../components/assets/git.jpg";
import azureIcon   from "../components/assets/azure.jpg";
import powerbiIcon from "../components/assets/powerbi.jpg";
import pythonIcon  from "../components/assets/python.jpg";
import excelIcon  from "../components/assets/Excel.jpg";
import RIcon  from "../components/assets/Rlogo.jpg";
import TableauIcon  from "../components/assets/Tableau.jpg";
import Tensorflow  from "../components/assets/Tensorflow.jpg";


export default function TechMarquee({
  direction = "left",
  className = "",
  speed = 30,     // seconds per loop
  height = 100,    // total strip height (px)
  icon = 32,      // icon size (px)
  gap = 64,       // space between items (px)
  padY = 10,      // vertical padding (px)
  font = 16       // label font size (px)
}) {
  const base = useMemo(
    () => [
      { label: "Python",  icon: pythonIcon },
      { label: "HTML",    icon: htmlIcon },
      { label: "React",   icon: reactIcon },
      { label: "MySQL",   icon: mysqlIcon },
      { label: "Git",     icon: gitIcon },
      { label: "Azure",   icon: azureIcon },
      { label: "PowerBI", icon: powerbiIcon },
      { label: "Excel", icon: excelIcon },
      { label: "R", icon: RIcon },
      { label: "Tableau", icon: TableauIcon },
      { label: "Tensorflow", icon: Tensorflow }
    ],
    []
  );

  // Wide enough row, then duplicate for seamless loop
  const REPEAT_ROW = 3; // bump to 4 for ultra-wide monitors
  const ROW = useMemo(
    () => Array.from({ length: REPEAT_ROW }).flatMap(() => base),
    [base]
  );

  return (
    <section
      className={`marquee-section ${className}`}
      aria-label="Technologies I use"
      style={{
        "--marquee-duration": `${speed}s`,
        "--marquee-height": `${height}px`,
        "--marquee-icon": `${icon}px`,
        "--marquee-gap": `${gap}px`,
        "--marquee-padY": `${padY}px`,
        "--marquee-font": `${font}px`,
      }}
    >
      <div className="marquee">
        <ul
          className={`marquee-track ${
            direction === "right" ? "dir-right" : "dir-left"
          }`}
        >
          {ROW.map((it, i) => (
            <li key={`a-${i}`} className="marquee-item">
              <img src={it.icon} alt="" aria-hidden="true" />
              <span>{it.label}</span>
            </li>
          ))}
          {ROW.map((it, i) => (
            <li key={`b-${i}`} className="marquee-item" aria-hidden="true">
              <img src={it.icon} alt="" aria-hidden="true" />
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
