// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import LanyardBadge from "./components/LanyardBadge";
import CodingSetupAnimated from "./components/CodingSetupAnimated";
import HikingAnimated from "./components/HikingAnimated";
import PickleballAnimated from "./components/PickleballAnimated";

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
import { Analytics } from "@vercel/analytics/react";

import "./styles.css";

const fadeUp = (delay = 0, reduceMotion = false) => ({
  initial: { opacity: 0, y: reduceMotion ? 0 : 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
});

/* ---------- Ambient animated background (sits behind everything) ---------- */
// Fixed (not random-per-render) so particles don't jump around on re-render.
const AMBIENT_PARTICLES = [
  { x: 6, y: 12, size: 2, dur: 3.4, delay: 0 },
  { x: 14, y: 68, size: 3, dur: 4.1, delay: 0.6 },
  { x: 22, y: 30, size: 2, dur: 3.8, delay: 1.4 },
  { x: 31, y: 84, size: 3, dur: 4.6, delay: 0.2 },
  { x: 9, y: 46, size: 2, dur: 3.2, delay: 2.1 },
  { x: 40, y: 8, size: 3, dur: 4.3, delay: 1.1 },
  { x: 47, y: 55, size: 2, dur: 3.6, delay: 0.8 },
  { x: 55, y: 20, size: 3, dur: 4.8, delay: 1.8 },
  { x: 62, y: 72, size: 2, dur: 3.3, delay: 0.4 },
  { x: 68, y: 40, size: 3, dur: 4.2, delay: 2.4 },
  { x: 75, y: 90, size: 2, dur: 3.9, delay: 1.2 },
  { x: 81, y: 15, size: 3, dur: 4.5, delay: 0.9 },
  { x: 88, y: 60, size: 2, dur: 3.5, delay: 1.6 },
  { x: 93, y: 33, size: 3, dur: 4.7, delay: 0.3 },
  { x: 97, y: 78, size: 2, dur: 3.7, delay: 2.2 },
  { x: 25, y: 95, size: 2, dur: 4.0, delay: 1.5 },
  { x: 58, y: 4, size: 2, dur: 3.4, delay: 0.7 },
  { x: 85, y: 88, size: 3, dur: 4.4, delay: 1.9 },
];

function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <span className="ambient-blob ambient-blob--a" />
      <span className="ambient-blob ambient-blob--b" />
      <span className="ambient-blob ambient-blob--c" />
      <div className="ambient-particles">
        {AMBIENT_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="ambient-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              "--p-size": `${p.size}px`,
              "--p-dur": `${p.dur}s`,
              "--p-delay": `${p.delay}s`,
              "--p-max": 0.6 + (p.size - 2) * 0.2,
            }}
          />
        ))}
      </div>
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
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Analytics mode="production" />
    </>
  );
}

/* -------------------- HOME (now inline) -------------------- */
function HomePage() {
  const heroRef = React.useRef(null);
  const glowRef = React.useRef(null);
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
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Subtle cursor-reactive glow behind the name — plain DOM/CSS, not framer,
  // so it can never collide with the transform rules noted below.
  React.useEffect(() => {
    if (reduceMotion) return;
    const el = heroRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        const maxShift = 26;
        glow.style.transform = `translate(${dx * maxShift}px, ${dy * maxShift}px)`;
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
    };
  }, [reduceMotion]);

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero hero--with-stack" ref={heroRef}>
        <div className="hero__glow" ref={glowRef} aria-hidden="true" />
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
            Tech | Sports | Gym
          </motion.span>

          <motion.h1 className="hero__bigname" {...fadeUp(0.1, reduceMotion)}>
            <span className="hero__bigname-line">Sunishth</span>
            <span className="hero__bigname-line">Bhogal</span>
          </motion.h1>

          <motion.p className="hero__tagline" {...fadeUp(0.24, reduceMotion)}>
            Always looking to build something new.
          </motion.p>

          <motion.div className="hero__cta-row" {...fadeUp(0.36, reduceMotion)}>
            <button
              type="button"
              className="hero__cta hero__cta--primary"
              onClick={() => scrollToId("projects")}
            >
              View selected work
            </button>
            <Link to="/resume" className="hero__cta hero__cta--ghost">
              View resume
            </Link>
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
                UW Study Spots · 200+ monthly users <span aria-hidden>↗</span>
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