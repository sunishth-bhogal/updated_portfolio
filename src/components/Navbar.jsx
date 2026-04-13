// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/assets/SBLOGO.png";

export default function Navbar() {
  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "experiences", label: "Experiences" },
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
      {open && (
        <div className="drawer-root" aria-hidden={!open}>
          <div
            className="drawer-overlay"
            role="button"
            tabIndex={0}
            aria-label="Close menu overlay"
            onClick={closeDrawer}
            onKeyDown={onOverlayKeyDown}
          />
          <aside
            id="mobile-drawer"
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="drawer-top">
              <img src={Logo} alt="" className="drawer-logo" />
              <button type="button" className="drawer-close" onClick={closeDrawer} aria-label="Close menu">
                ✕
              </button>
            </div>

            <nav className="drawer-links" aria-label="Mobile">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sheet-link ${isHome && active === s.id ? "active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

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
        }
        .nav-menu-btn:hover{ background: rgba(255,255,255,.10); }

        /* Drawer */
        .drawer-root{
          position: fixed;
          inset: 0;
          z-index: 2000;
        }
        .drawer-overlay{
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.55);
          cursor: pointer;
          outline: none;
        }
        .drawer{
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: min(82vw, 360px);
          background: rgba(10,14,24,.92);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          border-left: 1px solid rgba(255,255,255,.10);
          box-shadow: -12px 0 40px rgba(0,0,0,.35);
          display: grid;
          grid-template-rows: auto 1fr;
          animation: drawerIn .18s ease-out;
        }
        @keyframes drawerIn{
          from { transform: translateX(12px); opacity: .7; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .drawer-top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          padding: 14px 14px 10px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }
        .drawer-logo{ height: 26px; width:auto; border-radius: 10px; }
        .drawer-close{
          appearance:none;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: #e7eefc;
          border-radius: 12px;
          padding: 8px 10px;
          cursor: pointer;
        }
        .drawer-close:hover{ background: rgba(255,255,255,.10); }

        .drawer-links{ padding: 10px 0; }
        .drawer .sheet-link{
          display:block; width: calc(100% - 24px);
          margin: 6px 12px;
          text-align:left;
          appearance:none;
          background: transparent;
          color: #e7eefc;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 12px 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }
        .drawer .sheet-link:hover{
          background: rgba(255,255,255,.06);
          border-color: rgba(255,255,255,.10);
        }
        .drawer .sheet-link.active{
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.12);
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
