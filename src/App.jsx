// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import SwingingFigure from "./components/SwingingFigure";
import LanyardBadge from "./components/LanyardBadge";
import CodingSetupAnimated from "./components/CodingSetupAnimated";
import HikingAnimated from "./components/HikingAnimated";
import PickleballAnimated from "./components/PickleballAnimated";
import CurrentActivity from "./components/CurrentActivity";

import AboutV2 from "./components/AboutV2";
import ExperienceTimeline from "./components/ExperienceTimeline";
import CreateShowcase from "./components/CreateShowcase";
import ProjectRails from "./components/ProjectRails";
import Contacts from "./components/Contacts";

import PhotoWall from "./components/PhotoWall";
import DeepThoughtsSection from "./components/DeepThoughtsSection";
import ScrollToTop from "./components/ScrollToTop";
import MilestoneSection from "./components/MilestonesSection";
import ResumePage from "./pages/ResumePage";
import Reveal from "./components/Reveal";
import { NavInteractionProvider } from "./context/NavInteractionContext";
import { Analytics } from "@vercel/analytics/react";

import "./styles.css";

const fadeUp = (delay = 0, reduceMotion = false) => ({
  initial: { opacity: 0, y: reduceMotion ? 0 : 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
});

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
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <NavInteractionProvider>
      <CustomCursor />
      {isHome && <SwingingFigure />}
      <ScrollToTop />
      <Navbar />
      <ScrollManager />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<PhotoWall />} />
        <Route path="/deep" element={<DeepThoughtsSection />} />
        <Route path="/growth" element={<MilestoneSection />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Analytics mode="production" />
    </NavInteractionProvider>
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

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector(".nav-header");
    const headerH = header ? header.getBoundingClientRect().height : 0;
    // About's own top padding leaves a gap when landing right at the section
    // edge, so nudge it a bit further down — mirrors the same offset in Navbar.
    const extraOffset = id === "about" ? 80 : 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6 + extraOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero hero--with-stack" ref={heroRef}>
        <LanyardBadge />

        {/* NOTE: only `opacity` is animated here via framer — `.hero__content--left`
            controls its own `transform` in CSS, and framer-motion's `style.y` would
            silently overwrite that transform if it were animated here too. */}
        <motion.div className="hero__content hero__content--left" style={{ opacity: heroOpacity }}>
          <motion.span className="hero__badge" {...fadeUp(0, reduceMotion)}>
            <span className="hero__badge-dot" aria-hidden="true" />
            Incoming Software Engineer @ TD
          </motion.span>

          <motion.span className="hero__eyebrow" {...fadeUp(0.02, reduceMotion)}>
            Learner · Coder · Lifter
          </motion.span>

          <motion.h1 className="hero__bigname" {...fadeUp(0.1, reduceMotion)}>
            <span className="hero__bigname-line">Sunishth</span>
            <span className="hero__bigname-line">Bhogal</span>
          </motion.h1>

          <motion.p className="hero__tagline" {...fadeUp(0.24, reduceMotion)}>
            Always looking to build and learn.
          </motion.p>

          {/* align-self:stretch here too — this wrapper exists only to carry
              the fade-in animation, but being an unstyled block it would
              otherwise shrink-to-fit around CurrentActivity's own natural
              content width and silently cap it below the intended 580px. */}
          <motion.div style={{ alignSelf: "stretch" }} {...fadeUp(0.36, reduceMotion)}>
            <CurrentActivity />
          </motion.div>

          <motion.a
            className="hero__feature"
            href="https://uwstudyspots.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            {...fadeUp(0.48, reduceMotion)}
          >
            <img src="/uwstudyspots.png" alt="" className="hero__feature-thumb" />
            <span className="hero__feature-text">
              <span className="hero__feature-kicker">Featured project</span>
              <span className="hero__feature-title">
                UW Study Spots · 1000+ monthly users <span aria-hidden>↗</span>
              </span>
            </span>
          </motion.a>
        </motion.div>

        {/* One contained composition instead of scenes scattered across the whole
            section — arranged along a loose diagonal, hiking as the visual anchor. */}
        <div className="hero__visual">
          {/* Each scene's OWN position class controls its CSS `transform`
              (the hike one needs translate(-50%,-50%) to center itself) — 
              so the framer fade-in lives on a plain inner child instead of
              the positioned element, and the two `transform`s never fight. */}
          <div className="hero__scene hero__scene--code">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CodingSetupAnimated width={130} height={118} />
            </motion.div>
          </div>

          <div className="hero__scene hero__scene--hike">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <HikingAnimated width={170} height={154} />
            </motion.div>
          </div>

          <div className="hero__scene hero__scene--pickleball">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.64, ease: [0.16, 1, 0.3, 1] }}
            >
              <PickleballAnimated width={115} height={104} />
            </motion.div>
          </div>
        </div>

        <button
          type="button"
          className="hero__scroll-indicator"
          aria-label="Scroll to About section"
          onClick={() => scrollToId("about")}
        >
          <span>Scroll</span>
          <span className="hero__scroll-chevron" aria-hidden="true" />
        </button>
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
              Experience
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
              The Other Tabs
            </Reveal>
            <Reveal as="p" className="section__subtitle" y={12} delay={0.06}>
              Photos I take, thoughts I keep, and things I'm working toward.
            </Reveal>
            <Reveal className="section__content" delay={0.12}>
              <CreateShowcase />
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section-dark anchor-offset contact-sep">
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