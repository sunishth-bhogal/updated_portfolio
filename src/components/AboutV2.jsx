// AboutV2.jsx
import React from "react";
import HeadshotForPortfolio from "./assets/Cross_arms.png";
import GymSceneAnimated from "./GymSceneAnimated";
import CreativeSpark from "./CreativeSpark";
import ReactAIBuilder from "./ReactAIBuilder";

export default function AboutV2() {
  return (
    <div className="aboutv2">
      <div className="container">
        <h2 className="aboutv2-title">
          A little bit <span className="aboutv2-grad">About Me</span>
        </h2>

        <div className="aboutv2-grid">
          {/* Big left image card */}
          <article className="about-card hero" tabIndex={0}>
            <div
              className="hero-media"
              style={{ "--hero": `url(${HeadshotForPortfolio})` }}
            >
              <h3 className="card-title overlay">I love to take on new challenges</h3>
            </div>
          </article>

          {/* Top-right: code blurb */}
          <article className="about-card code" tabIndex={0}>
            <h3 className="card-title">
              My expertise includes <br />
              Software, AI, Web &amp; Data
            </h3>
            <div className="code-preview">
              <pre className="codeblock">{`// Importing a single module
import moduleName from 'modulePath';`}</pre>
            </div>
          </article>

          {/* Bottom-right: health & lifting */}
          <article className="about-card stacks" tabIndex={0}>
            
            <h3 className="card-title small">
              I have a passion for weight-lifting, and I believe that health is wealth.
              Leading a healthy lifestyle not only helps my physical health but also my
              mental health.
            </h3>
            <img className="blob" src="/assets/about/blob.png" alt="" aria-hidden="true" />
            <div style={{ display:"grid", placeItems:"center", paddingTop: 12 }}>
  <GymSceneAnimated width={320} height={150} />
</div>
          </article>

          {/* Bottom-left: short blurb */}
          <article className="about-card blurb" tabIndex={0}>
            <h3 className="card-title">
              Innovative problem-solver passionate about building ideas that create real impact
            </h3>
            <p className="card-text">
              I love connecting with people and learning more about what the world needs.
              Outside work: lifting, outdoors, photos, and a bit of poetry.
            </p>

            <CreativeSpark size={180} color="#60a5fa" />
          </article>

          {/* Bottom-middle/right: “now” card */}
          <article className="about-card now" tabIndex={0}>
  <div className="eyebrow">The Insider</div>
  <h3 className="card-title">Currently building a React + AI project</h3>
  <p className="card-text">
    Exploring LLM tooling, lightweight analytics, and automation to save people time.
  </p>

  {/* new wrapper */}
  <div className="ai-wrap">
    <ReactAIBuilder size={200} />
  </div>
</article>
        </div>
      </div>
    </div>
  );
}
