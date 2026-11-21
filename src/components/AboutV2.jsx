// AboutV2.jsx
import React from "react";
import HeadshotForPortfolio from "./assets/Cross_arms.png";

const FACTS = [
  { k: "Now", v: "Software Engineering Intern, TD · Toronto" },
  {
    k: "Studying",
    v: (
      <>
        Math at{" "}
        <a href="https://uwaterloo.ca" target="_blank" rel="noopener noreferrer">
          Waterloo
        </a>{" "}
        + BBA at{" "}
        <a href="https://wlu.ca" target="_blank" rel="noopener noreferrer">
          Laurier
        </a>
      </>
    ),
  },
  { k: "Off the clock", v: "Lifting, hiking, pickleball, taking photos" },
];

export default function AboutV2() {
  return (
    <div className="aboutv2">
      <div className="aboutv2-columns">
        <div className="aboutv2-copy">
          <p className="aboutv2-eyebrow">ABOUT</p>
          <h2 className="aboutv2-heading">
            I build things
            <br />
            people <span className="aboutv2-grad">connect with</span>
          </h2>

          <p className="aboutv2-p aboutv2-lede">
            I like clean interfaces, hard problems, and the moment a pile of scattered ideas turns
            into something people actually use.
          </p>

          <p className="aboutv2-p">
            I grew up building things, robots first and then software. Sports taught me how people
            think, compete and connect, so I try to build technology that's useful and human. That's
            how{" "}
            <a href="https://uwstudyspots.vercel.app/" target="_blank" rel="noopener noreferrer">
              UW Study Spots
            </a>{" "}
            started. It's now used by 200+ students a month at Waterloo.
          </p>

          <dl className="about-facts">
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="aboutv2-portrait">
          <div className="aboutv2-portrait-frame">
            <img src={HeadshotForPortfolio} alt="Sunishth Bhogal" />
          </div>
          <figcaption>SUNISHTH · BHOGAL</figcaption>
        </figure>
      </div>

      <div className="aboutv2-coords">
        43.4643° N, 80.5204° W &nbsp;/&nbsp; 43.6532° N, 79.3832° W
      </div>
    </div>
  );
}
