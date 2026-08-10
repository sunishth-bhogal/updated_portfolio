// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
import Reveal from "./components/Reveal";
import { Analytics } from "@vercel/analytics/react";

import "./styles.css";

const fadeUp = (delay = 0, reduceMotion = false) => ({
  initial: { opacity: 0, y: reduceMotion ? 0 : 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
});

/* ---------- Ambient animated background (sits behind everything) ---------- */
function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <span className="ambient-blob ambient-blob--a" />
      <span className="ambient-blob ambient-blob--b" />
      <span className="ambient-blob ambient-blob--c" />
      <span className="ambient-grain" />
    </div>
  );
}
/* ---------------------------------------------------------------- */

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
      <AmbientBackground />
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
  const heroRef = React.useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero hero--with-stack" ref={heroRef}>
        {/* NOTE: only `opacity` is animated here — `.hero__content` relies on its
            own CSS `transform: translateY(-6vh)` to optically center the headline,
            and framer-motion's `style.y` would silently overwrite that transform. */}
        <motion.div className="hero__content" style={{ opacity: heroOpacity }}>
          <motion.h1 className="hero__title" {...fadeUp(0.1, reduceMotion)}>
            Hi, I’m Sunishth Bhogal!
          </motion.h1>

          <motion.p className="hero__subtitle" aria-live="polite" {...fadeUp(0.24, reduceMotion)}>
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
          </motion.p>
        </motion.div>

        {/* Same reasoning: `.hero__quick-links` needs its CSS `transform: translateX(-50%)`
            to stay centered, so only `opacity` is animated on it directly. The entrance
            slide-up + hover lift live on plain wrapper spans so the buttons' own CSS
            hover transform (see .hero__image-button:hover) is never clobbered by an
            inline style left behind by framer-motion. */}
        <motion.div className="hero__quick-links" style={{ opacity: heroOpacity }}>
          <motion.span {...fadeUp(0.38, reduceMotion)} style={{ display: "inline-block" }}>
            <a
              href="https://uwstudyspots.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__image-button"
              aria-label="Open UW Study Spots"
            >
              <img src="/uwstudyspots.png" alt="UW Study Spots" />
            </a>
          </motion.span>

          <motion.span {...fadeUp(0.5, reduceMotion)} style={{ display: "inline-block" }}>
            <Link
              to="/photos"
              className="hero__image-button"
              aria-label="Open Photos"
            >
              <img src="/taking_photo.jpg" alt="Photos" />
            </Link>
          </motion.span>
        </motion.div>

        <TechMarquee speed={26} direction="left" />
      </section>

      {/* MAIN */}
      <div className="main-band">
        {/* About */}
        <section id="about" className="section section-dark anchor-offset">
          <Reveal className="section__content">
            <AboutV2 />
          </Reveal>
        </section>

        {/* Professional Experience */}
        <section id="experiences" className="section section-dark anchor-offset">
          <div className="section__container">
            <Reveal as="h2" className="section__title" data-underline="true" y={16}>
              Professional Experience
            </Reveal>
            <Reveal className="section__content" delay={0.12}>
              <ExperienceTimeline />
            </Reveal>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section section-dark anchor-offset">
          <div className="section__container">
            <Reveal as="h2" className="section__title" data-underline="true" y={16}>
              Projects
            </Reveal>
            <Reveal className="section__content" delay={0.12}>
              <ProjectRails />
            </Reveal>
          </div>
        </section>

        {/* Create */}
        <section id="create" className="section section-dark anchor-offset">
          <div className="section__container">
            <Reveal as="h2" className="section__title" data-underline="true" y={16}>
              Creative Mind
            </Reveal>
            <Reveal className="section__content" delay={0.12}>
              <CreateShowcase />
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section-dark anchor-offset">
          <div className="section__container">
            <Reveal className="section__content">
              <Contacts />
            </Reveal>
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