// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "../components/assets/SBLOGO.png";

export default function Navbar() {
  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "experiences", label: "Experience" },
      { id: "projects", label: "Projects" },
      { id: "create", label: "Creative Mind" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const centerLinks = useMemo(() => sections.filter((s) => s.id !== "contact"), [sections]);

  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false); // ✅ now used (mobile drawer)
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const lastY = useRef(0);
  const ticking = useRef(false);
  const revealRef = useRef(null);
  const observerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const HEADER_SEL = ".nav-header";

  const scrollTo = useCallback(
    (id) => {
      setOpen(false);
      const cleanId = id.startsWith("#") ? id.slice(1) : id;
      const header = document.querySelector(HEADER_SEL);
      const headerH = header ? header.getBoundingClientRect().height : 0;

      const doScroll = (el) => {
        if (!el) return;
        let scroller = el.parentElement;
        while (scroller) {
          const cs = getComputedStyle(scroller);
          const canScroll = /(auto|scroll)/.test(`${cs.overflow}${cs.overflowY}${cs.overflowX}`);
          if (canScroll && scroller.scrollHeight > scroller.clientHeight) break;
          scroller = scroller.parentElement;
        }
        if (!scroller) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else {
          const y =
            el.getBoundingClientRect().top -
            scroller.getBoundingClientRect().top +
            scroller.scrollTop -
            headerH -
            6;
          scroller.scrollTo({ top: y, behavior: "smooth" });
        }
      };

      const el = document.getElementById(cleanId);
      if (el) doScroll(el);
      else {
        navigate(`/#${cleanId}`);
        setTimeout(() => {
          const el2 = document.getElementById(cleanId);
          if (el2) doScroll(el2);
        }, 0);
      }
    },
    [navigate]
  );

  // Active link highlight — only on Home
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!isHome) {
      setActive(null);
      return;
    }

    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (els.length === 0) return;

    const header = document.querySelector(HEADER_SEL);
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const getTargetY = () => headerH + 120;

    const pickActive = () => {
      const ty = getTargetY();
      let bestId = null,
        bestDelta = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const overlaps = r.bottom > 0 && r.top < window.innerHeight;
        if (!overlaps) continue;
        const delta = Math.abs(r.top - ty);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestId = el.id;
        }
      }
      if (bestId && bestId !== active) setActive(bestId);
    };

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pickActive);
    };

    const io = new IntersectionObserver(() => onScrollOrResize(), {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: [0.25, 0.55, 0.85],
    });
    els.forEach((el) => io.observe(el));
    observerRef.current = io;

    pickActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      io.disconnect();
      observerRef.current = null;
    };
  }, [isHome, sections, active]);

  // Shadow on scroll + page progress
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
      const doc = document.documentElement;
      const h = doc.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Hide on scroll down; reveal on scroll up
  useEffect(() => {
    lastY.current = window.scrollY;
    const DELTA = 4;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (y <= 2) setVisible(true);
        else if (dy > DELTA) setVisible(false);
        else if (dy < -DELTA) setVisible(true);
        lastY.current = y < 0 ? 0 : y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal when cursor touches the very top edge
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const onEnter = () => setVisible(true);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("touchstart", onEnter, { passive: true });
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("touchstart", onEnter);
    };
  }, []);

  // ✅ these are now used
  const closeDrawer = useCallback(() => setOpen(false), []);
  const onOverlayKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(false);
      }
    },
    []
  );

  // Bonus: close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Bonus: ESC closes drawer even if focus isn't on overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* invisible reveal strip at the very top */}
      <div
        ref={revealRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 14,
          zIndex: 1002,
          pointerEvents: "auto",
          background: "transparent",
        }}
      />

      <header className={`nav-header ${scrolled ? "scrolled" : ""} ${visible ? "" : "is-hidden"}`}>
        <div className="nav-inner">
          {/* LEFT: Brand (LOGO) */}
          <a
            href="#home"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
            aria-label="Back to top"
          >
            <img src={Logo} alt="Sunishth Bhogal" className="brand-logo" />
          </a>

          {/* CENTER: desktop text-only links */}
          <nav className="nav-center" aria-label="Primary">
            {centerLinks.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`nav-link bare ${isHome && active === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* RIGHT: Contact (desktop) + mobile menu button */}
          <div className="nav-right">
            <button
              type="button"
              className={`nav-link bare nav-contact ${isHome && active === "contact" ? "active" : ""}`}
              onClick={() => scrollTo("contact")}
            >
              Contact
            </button>

            <button
              type="button"
              className="nav-menu-btn"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Page progress bar */}
        <div className="nav-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Spacer so content doesn't jump when header is fixed */}
      <div className="nav-spacer" />

      {/* ✅ Mobile Drawer + Overlay (uses open/closeDrawer/onOverlayKeyDown) */}
      <AnimatePresence>
        {open && (
          <div className="drawer-root" aria-hidden={!open}>
            <motion.div
              className="drawer-overlay"
              role="button"
              tabIndex={0}
              aria-label="Close menu overlay"
              onClick={closeDrawer}
              onKeyDown={onOverlayKeyDown}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            />
            <motion.aside
              id="mobile-drawer"
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: reduceMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : "100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="drawer-glow" aria-hidden="true" />
              <span className="drawer-grid" aria-hidden="true" />

              <div className="drawer-top">
                <img src={Logo} alt="" className="drawer-logo" />
                <button type="button" className="drawer-close" onClick={closeDrawer} aria-label="Close menu">
                  ✕
                </button>
              </div>

              <div className="drawer-scroll">
                <span className="drawer-eyebrow">Menu</span>
                <nav className="drawer-links" aria-label="Mobile">
                  {sections.map((s, i) => (
                    <motion.button
                      key={s.id}
                      type="button"
                      className={`sheet-link ${isHome && active === s.id ? "active" : ""}`}
                      onClick={() => scrollTo(s.id)}
                      initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.4,
                        delay: reduceMotion ? 0 : 0.12 + i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    >
                      <span className="sheet-link-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="sheet-link-label">{s.label}</span>
                      <span className="sheet-link-arrow" aria-hidden="true">↗</span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              <div className="drawer-footer">
                <a
                  className="drawer-social"
                  href="https://github.com/sunishth-bhogal"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  GitHub
                </a>
                <a
                  className="drawer-social"
                  href="https://www.linkedin.com/in/sunishth-bhogal-39a162222/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
                <a
                  className="drawer-social"
                  href="https://x.com/BhogalSunishth"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                >
                  X
                </a>
                <a className="drawer-social" href="mailto:sunishth.28@gmail.com" aria-label="Email">
                  Email
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ---- INLINE NAVBAR CSS (compact) ---- */}
      <style>{`
        :root{
          --nav-h: 60px;
          --nav-gap: clamp(16px, 2.6vw, 32px);
          --nav-pad-x: clamp(12px, 2vw, 24px);
          --accent-a: #6ca8ff;
          --accent-b: #b18cff;
        }

        .nav-header{
          position: fixed; inset: 0 0 auto 0; height: var(--nav-h);
          z-index: 1001;
          background: rgba(8,12,20,.55);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .nav-header.scrolled{ box-shadow: 0 1px 0 rgba(255,255,255,.06); }
        .nav-header.is-hidden{ transform: translateY(calc(-1 * var(--nav-h))); }

        .nav-inner{
          width: 100%;
          height: var(--nav-h);
          padding: 0 var(--nav-pad-x);
          display: grid;
          grid-template-columns: auto 1fr auto; /* logo | center | right */
          align-items: center;
        }

        .brand-link{ display:inline-flex; align-items:center; height:var(--nav-h); }
        .brand-logo{ height:26px; width:auto; display:block; border-radius:10px; }

        .nav-center{
          grid-column: 2;
          justify-self: center;
          display:inline-flex; align-items:stretch; gap: var(--nav-gap);
          height: var(--nav-h);
        }
        .nav-right{
          grid-column: 3; justify-self: end;
          display:inline-flex; align-items:stretch; height: var(--nav-h);
          gap: 8px;
        }

        .nav-link.bare{
          appearance:none; background:transparent; border:none;
          color: #e7eefc; opacity:.95;
          font-weight: 700;
          font-size: clamp(14px, 1vw, 16px);
          letter-spacing:.2px;
          padding: 0 14px;
          display: flex; align-items: center;
          height: var(--nav-h);
          position: relative;
          cursor: pointer;
        }
        .nav-link.bare:hover{ opacity: 1; }
        .nav-link.bare::after{
          content:""; position:absolute; left:14px; right:14px; bottom: 8px; height: 2px;
          background: linear-gradient(90deg, var(--accent-a), var(--accent-b));
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          opacity: 0;
          transition: transform .18s ease, opacity .18s ease;
        }
        .nav-link.bare:hover::after{ opacity:.5; transform: scaleX(.45); }
        .nav-link.bare.active::after{ opacity:1; transform: scaleX(1); }

        .nav-progress{
          position:absolute; left:0; right:0; bottom:0; height:2px;
          background: rgba(255,255,255,.06);
          overflow:hidden;
        }
        .nav-progress > span{
          display:block; height:100%; width:0%;
          background: linear-gradient(90deg, var(--accent-a), var(--accent-b));
          transition: width .15s ease;
        }

        .nav-spacer{ height: var(--nav-h); }

        /* Mobile menu button */
        .nav-menu-btn{
          display:none;
          appearance:none;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: #e7eefc;
          border-radius: 12px;
          height: calc(var(--nav-h) - 18px);
          margin: 9px 0;
          padding: 0 12px;
          font-size: 18px;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .nav-menu-btn:hover{ background: rgba(255,255,255,.10); transform: translateY(-1px); }

        /* Drawer */
        .drawer-root{
          position: fixed;
          inset: 0;
          z-index: 2000;
        }
        .drawer-overlay{
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.6);
          -webkit-backdrop-filter: blur(3px);
          backdrop-filter: blur(3px);
          cursor: pointer;
          outline: none;
        }
        .drawer{
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: min(88vw, 420px);
          background: linear-gradient(165deg, rgba(14,18,30,.96), rgba(9,12,20,.97));
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border-left: 1px solid rgba(255,255,255,.10);
          box-shadow: -20px 0 60px rgba(0,0,0,.5);
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
        }
        .drawer-glow{
          position: absolute;
          top: -140px;
          right: -120px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,168,255,.3), rgba(177,140,255,.16) 55%, transparent 72%);
          pointer-events: none;
          filter: blur(2px);
        }
        .drawer-grid{
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .5;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 28px 28px;
          -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent 70%);
          mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent 70%);
        }
        .drawer-top{
          position: relative;
          z-index: 1;
          display:flex;
          align-items:center;
          justify-content: space-between;
          padding: 18px 18px 14px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }
        .drawer-logo{ height: 28px; width:auto; border-radius: 10px; }
        .drawer-close{
          appearance:none;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: #e7eefc;
          border-radius: 999px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .drawer-close:hover{ background: rgba(255,255,255,.10); transform: rotate(90deg); }

        .drawer-scroll{
          position: relative;
          z-index: 1;
          overflow-y: auto;
          padding: 22px 20px 12px;
        }
        .drawer-eyebrow{
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: hsl(220 40% 55%);
          margin: 0 6px 14px;
        }
        .drawer-links{ position: relative; display: flex; flex-direction: column; gap: 2px; }
        .drawer .sheet-link{
          position: relative;
          display: flex;
          align-items: baseline;
          gap: 16px;
          width: 100%;
          text-align:left;
          appearance:none;
          background: transparent;
          color: #e7eefc;
          border: 1px solid transparent;
          border-radius: 14px;
          padding: 18px 16px;
          font-weight: 700;
          cursor: pointer;
          overflow: hidden;
          transition: background .2s ease, border-color .2s ease, padding-left .2s ease;
        }
        .drawer .sheet-link::before{
          content: "";
          position: absolute;
          left: 0; top: 12px; bottom: 12px;
          width: 3px;
          border-radius: 999px;
          background: linear-gradient(180deg, var(--accent-a), var(--accent-b));
          transform: scaleY(0);
          transition: transform .22s cubic-bezier(.16,1,.3,1);
        }
        .drawer .sheet-link:hover{
          background: rgba(255,255,255,.055);
          border-color: rgba(255,255,255,.10);
          padding-left: 20px;
        }
        .drawer .sheet-link.active{
          background: rgba(255,255,255,.07);
          border-color: rgba(255,255,255,.12);
        }
        .drawer .sheet-link.active::before{ transform: scaleY(1); }
        .sheet-link-index{
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .04em;
          color: hsl(220 70% 70%);
          opacity: .65;
          flex: 0 0 auto;
        }
        .sheet-link.active .sheet-link-index{ opacity: 1; }
        .sheet-link-label{
          font-size: clamp(20px, 5vw, 24px);
          font-weight: 800;
          letter-spacing: -.01em;
          flex: 1;
        }
        .sheet-link-arrow{
          font-size: 16px;
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: opacity .2s ease, transform .2s ease;
          color: hsl(220 80% 72%);
        }
        .drawer .sheet-link:hover .sheet-link-arrow,
        .drawer .sheet-link.active .sheet-link-arrow{
          opacity: 1;
          transform: translate(0, 0);
        }

        .drawer-footer{
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 18px 20px;
          border-top: 1px solid rgba(255,255,255,.10);
        }
        .drawer-social{
          appearance: none;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.04);
          color: hsl(220 20% 88%);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .drawer-social:hover{
          background: rgba(255,255,255,.09);
          border-color: rgba(255,255,255,.2);
          transform: translateY(-1px);
        }

        @media (max-width: 720px){
          :root{ --nav-h: 56px; --nav-gap: 14px; }
          .brand-logo{ height:24px; }
          .nav-link.bare{ font-size: 14px; padding: 0 10px; }
          .nav-link.bare::after{ left:10px; right:10px; bottom:7px; }

          /* Hide desktop nav; show menu button */
          .nav-center{ display:none; }
          .nav-contact{ display:none; }
          .nav-menu-btn{ display:inline-flex; align-items:center; }
        }
      `}</style>
    </>
  );
}
