// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import HeroStudio from "./components/HeroStudio";
import IWasThere from "./components/IWasThere";
import CurrentActivity from "./components/CurrentActivity";

import AboutV2 from "./components/AboutV2";
import ExperienceTimeline from "./components/ExperienceTimeline";
import CreateShowcase from "./components/CreateShowcase";
import ProjectRails from "./components/ProjectRails";
import Contacts from "./components/Contacts";

import PhotoWall from "./components/PhotoWall";
import DeepThoughtsSection from "./components/DeepThoughtsSection";
import ScrollRestoration from "./components/ScrollRestoration";
import MilestoneSection from "./components/MilestonesSection";
import ResumePage from "./pages/ResumePage";
import Reveal from "./components/Reveal";
import { NavInteractionProvider } from "./context/NavInteractionContext";
import { Analytics } from "@vercel/analytics/react";

import "./styles.css";
import "./studio.css";

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
    <NavInteractionProvider>
      <CustomCursor />
      <ScrollRestoration />
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

/* -------------------- HOME -------------------- */
function HomePage() {
  return (
    <>
      <HeroStudio />

      {/* A short personal chapter before the work */}
      <IWasThere />

      {/* MAIN */}
      <div className="main-band">
        {/* About */}
        <section id="about" className="section section-dark anchor-offset">
          <Reveal className="section__content">
            <AboutV2 />
          </Reveal>
        </section>

        {/* Projects come straight after About so the work stays prominent */}
        <section id="projects" className="section section-dark anchor-offset">
          <ProjectRails />
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

        {/* Lab */}
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

            <div className="elsewhere">
              <p className="elsewhere-label">Elsewhere, right now</p>
              <CurrentActivity />
            </div>
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