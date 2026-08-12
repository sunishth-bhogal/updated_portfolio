// AboutV2.jsx
import React from "react";
import HeadshotForPortfolio from "./assets/Cross_arms.png";

export default function AboutV2() {
  return (
    <div className="aboutv2">
      <div className="aboutv2-layout">
        <span className="aboutv2-eyebrow">02 / ABOUT</span>

        <div className="aboutv2-columns">
          <div className="aboutv2-copy">
            <h2 className="aboutv2-heading">
              I like turning ideas
              <br />
              into <span className="aboutv2-grad">something real</span>
            </h2>

            <p className="aboutv2-p">
              I'm Sunishth Bhogal, studying Math at the{" "}
              <a href="https://uwaterloo.ca" target="_blank" rel="noopener noreferrer">
                University of Waterloo
              </a>{" "}
              alongside a BBA at{" "}
              <a href="https://wlu.ca" target="_blank" rel="noopener noreferrer">
                Wilfrid Laurier University
              </a>
              . I like clean
              interfaces, hard problems, and the moment a pile of scattered
              ideas turns into something people actually use.
            </p>

            <p className="aboutv2-p">Currently: Incoming Software Engineer @ TD.</p>

            <p className="aboutv2-p">
              My story started outside of code — sports and the gym taught me
              discipline long before I ever wrote a line of it. Somewhere
              between the reps and the late nights I started building things,
              like{" "}
              <a
                href="https://uwstudyspots.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                UW Study Spots
              </a>
              , now used by 200+ students a month at Waterloo. I've liked
              turning problems into products ever since.
            </p>
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
    </div>
  );
}
