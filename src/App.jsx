// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";

import TypewriterText from "./components/Typewriter";
import TechMarquee from "./components/TechMarquee";

import AboutV2 from "./components/AboutV2";
import ExperienceTimeline from "./components/ExperienceTimeline";
import CreateShowcase from "./components/CreateShowcase";
import ProjectRails from "./components/ProjectRails";
import Contacts from "./components/Contacts";

import PhotoWall from "./components/PhotoWall";
import DeepThoughtsSection from "./components/DeepThoughtsSection";
import ScrollToTop from "./components/ScrollToTop";
import MilestoneSection from "./components/MilestonesSection";
import { Analytics } from "@vercel/analytics/react";

import "./styles.css";

/* ---------- Scroll to hash targets (keeps SPA smooth) ---------- */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!hash) return;

    const header = document.querySelector(".nav-header");
    const headerH = header ? header.getBoundingClientRect().height : 0;

    let tries = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (tries++ < 12) {
        requestAnimationFrame(tryScroll);
      }
    };
    requestAnimationFrame(tryScroll);
  }, [pathname, hash]);

  return null;
}
/* ---------------------------------------------------------------- */

export default function App() {
  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <ScrollManager />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<PhotoWall />} />
        <Route path="/deep" element={<DeepThoughtsSection />} />
        <Route path="/growth" element={<MilestoneSection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Analytics mode="production" />
    </>
  );
}

/* -------------------- HOME (now inline) -------------------- */
function HomePage() {
  return (
    <>
      {/* HERO */}
      <section id="home" className="hero hero--with-stack">
        <div className="hero__content">
          <h1 className="hero__title">Hi, I’m Sunishth Bhogal!</h1>

          <p className="hero__subtitle" aria-live="polite">
            <TypewriterText
              words={[
                "Honours Mathematics Student @ UWaterloo",
                "Honours BBA Student @ WLU",
                "A Software Engineer",
                "A Stats Enthusiast",
                "Figuring things out",
                "A Creator",
                "A Difference Maker",
                "Building...",
              ]}
              typeSpeed={70}
              deleteSpeed={45}
              delayBetween={1100}
              loop
            />
            <span className="cursor"></span>
          </p>
        </div>

        <div className="hero__quick-links">
          <a
            href="https://uwstudyspots.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero__image-button"
            aria-label="Open UW Study Spots"
          >
            <img src="/uwstudyspots.png" alt="UW Study Spots" />
          </a>

          <Link
            to="/photos"
            className="hero__image-button"
            aria-label="Open Photos"
          >
            <img src="/taking_photo.jpg" alt="Photos" />
          </Link>
        </div>

        <TechMarquee speed={26} direction="left" />
      </section>

      {/* MAIN */}
      <div className="main-band">
        {/* About */}
        <section id="about" className="section section-dark anchor-offset">
          <div className="section__content">
            <AboutV2 />
          </div>
        </section>

        {/* Professional Experience */}
        <section id="experiences" className="section section-dark anchor-offset">
          <div className="section__container">
            <h2 className="section__title" data-underline="true">
              Professional Experience
            </h2>
            <div className="section__content">
              <ExperienceTimeline />
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section section-dark anchor-offset">
          <div className="section__container">
            <h2 className="section__title" data-underline="true">
              Projects
            </h2>
            <div className="section__content">
              <ProjectRails />
            </div>
          </div>
        </section>

        {/* Create */}
        <section id="create" className="section section-dark anchor-offset">
          <div className="section__container">
            <h2 className="section__title" data-underline="true">
              Creative Mind
            </h2>
            <div className="section__content">
              <CreateShowcase />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section-dark anchor-offset">
          <div className="section__container">
            <div className="section__content">
              <Contacts />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
/* ---------------------------------------------------------- */

function NotFound() {
  return (
    <main className="section section-dark">
      <div className="section__container">
        <h2 className="section__title">Page not found</h2>
        <p>
          <Link to="/">Go back home</Link>
        </p>
      </div>
    </main>
  );
}