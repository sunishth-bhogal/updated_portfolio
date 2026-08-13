// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import Logo from "../components/assets/SBLOGO.png";
import { useNavInteraction } from "../context/NavInteractionContext";

function torontoTime() {
  return new Date().toLocaleTimeString("en-CA", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// A button that leans a few px toward the cursor while it's inside — reset
// with a spring the moment the cursor leaves. Skips the offset entirely
// under reduced motion.
function MagneticButton({ className, onClick, children }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const onMouseMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export default function Navbar() {
  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "experiences", label: "Experience" },
      { id: "projects", label: "Projects" },
      { id: "create", label: "Lab" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const centerLinks = useMemo(() => sections.filter((s) => s.id !== "contact"), [sections]);
  const { setHoverIndex, triggerSwing } = useNavInteraction();

  const [clock, setClock] = useState(torontoTime);
  useEffect(() => {
    const id = setInterval(() => setClock(torontoTime()), 30000);
    return () => clearInterval(id);
  }, []);

  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false); // ✅ now used (mobile drawer)
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

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
      // A few sections have their own top padding baked in, so landing right
      // at the section's edge leaves an awkward empty gap before the actual
      // content — nudge those a bit further down so the heading lands closer
      // to the header instead of the section boundary.
      const extraOffset = cleanId === "about" ? 80 : 0;

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
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 6 + extraOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else {
          const y =
            el.getBoundingClientRect().top -
            scroller.getBoundingClientRect().top +
            scroller.scrollTop -
            headerH -
            6 +
            extraOffset;
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

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
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
        <div className="nav-dock">
          {/* LEFT: brand + year + live Toronto time */}
          <div className="nav-group nav-group--left">
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
              <span className="brand-suffix">/26</span>
            </a>
            <span className="nav-clock">TORONTO · {clock}</span>
          </div>

          {/* CENTER: numbered utility-bar links */}
          <nav className="nav-center" aria-label="Primary">
            {centerLinks.map((s, i) => {
              const isActive = isHome && active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => {
                    triggerSwing(i);
                    scrollTo(s.id);
                  }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onFocus={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onBlur={() => setHoverIndex(null)}
                >
                  {isActive && (
                    <motion.span
                      className="nav-link-bg"
                      layoutId="nav-active-bg"
                      transition={
                        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nav-label">{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: availability + CTA (desktop) + mobile menu button */}
          <div className="nav-group nav-group--right">
            <span className="nav-status">
              <span className="nav-status-dot" aria-hidden="true" />
              <span className="nav-status-label">AVAILABLE</span>
            </span>

            <MagneticButton className="nav-cta" onClick={() => scrollTo("contact")}>
              LET&apos;S TALK <span aria-hidden="true">↗</span>
            </MagneticButton>

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
          --nav-h: 70px;
          /* Resting state: full-width bar flush with the top of the page. */
          --nav-top-gap: 0px;
          --nav-margin-x: 0px;
          --nav-max-w: none;
          --nav-radius: 0px;
          --nav-border-color: transparent;
          --nav-shadow: none;
          --nav-bg: rgba(246,244,239,.92);
          --nav-pad-x: clamp(18px, 2vw, 28px);
          --nav-gap: clamp(8px, 1vw, 12px);
          --accent-a: #2563EB;
          --accent-b: #2563EB;
          --nav-mono: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          --nav-sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        /* Scrolled state: the same bar collapses into a smaller, centered,
           floating capsule. Both states use the exact same box-sizing:
           border-box + calc(100% - 2*margin) + max-width sizing mechanism —
           only these custom properties change — so there's no dependency on
           the browser correctly guessing an intrinsic content width (that
           approach caused real bugs earlier). */
        .nav-header.scrolled{
          --nav-top-gap: clamp(16px, 2.2vw, 24px);
          --nav-margin-x: clamp(24px, 3vw, 32px);
          --nav-max-w: 1380px;
          --nav-radius: 26px;
          --nav-border-color: var(--line, #DDDAD3);
          --nav-shadow: 0 16px 36px rgba(17,24,39,.12);
          --nav-bg: rgba(255,255,255,.97);
        }

        .nav-header{
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1001;
          padding-top: var(--nav-top-gap);
          pointer-events: none;
          transition: transform .25s ease, padding-top .3s ease;
        }
        .nav-header.is-hidden{ transform: translateY(calc(-1 * (var(--nav-h) + var(--nav-top-gap) + 20px))); }

        .nav-dock{
          pointer-events: auto;
          position: relative;
          box-sizing: border-box;
          width: calc(100% - (2 * var(--nav-margin-x)));
          max-width: var(--nav-max-w);
          margin: 0 auto;
          height: var(--nav-h);
          padding: 0 var(--nav-pad-x);
          display: flex;
          align-items: center;
          justify-content: space-between; /* left/right groups only — center is positioned independently below */
          border-radius: var(--nav-radius);
          border: 1px solid var(--nav-border-color);
          background: var(--nav-bg);
          box-shadow: var(--nav-shadow);
          transition: max-width .3s ease, margin .3s ease, border-radius .3s ease,
                      border-color .3s ease, box-shadow .3s ease, background .3s ease;
        }

        .nav-group{ display: flex; align-items: center; min-width: 0; }
        .nav-group--left{ gap: 16px; }
        .nav-group--right{ gap: 14px; }

        .brand-link{ display:inline-flex; align-items:baseline; gap: 4px; flex: 0 0 auto; }
        .brand-logo{ height:26px; width:auto; display:block; border-radius:8px; align-self: center; }
        .brand-suffix{
          font-family: var(--nav-mono);
          font-size: 11px; font-weight: 600;
          color: var(--text-3, #8A8F98);
          letter-spacing: .02em;
        }

        .nav-clock{
          font-family: var(--nav-mono);
          font-size: 11.5px;
          color: var(--text-3, #8A8F98);
          letter-spacing: .02em;
          white-space: nowrap;
          padding-left: 14px;
          border-left: 1px solid var(--line, #DDDAD3);
        }

        /* CENTER — plain numbered link row, pinned to the true midpoint of
           the capsule via absolute positioning rather than a grid 1fr
           track. The left and right groups are different widths (logo+time
           vs. status+CTA), and a 1fr-track-centered middle column drifts
           toward whichever side is narrower — this keeps it exactly
           centered regardless of that asymmetry. The active tab's highlight
           is a framer-motion layoutId element (see .nav-link-bg below), so
           this strip itself needs no track/border trickery to look right.
           Scoped as .nav-dock .nav-center (not just .nav-center) and
           translate explicitly reset: the global stylesheet has an older,
           unrelated .nav-center rule elsewhere that sets both
           transform:translateX(-50%) and a separate translate:0 -50%.
           translate is its own CSS property that composes with transform
           rather than being overridden by it, so that stray rule was
           stacking an extra -50% vertical shift on top of this one, which
           is what pushed the links up out of the middle of the bar. */
        .nav-dock .nav-center{
          position: absolute;
          left: 50%;
          top: 50%;
          translate: none;
          transform: translate(-50%, -50%);
          display:flex; align-items:center; flex-wrap: nowrap; gap: var(--nav-gap);
        }

        .nav-link{
          appearance:none; background:transparent; border:none;
          color: var(--text-2, #5F6672);
          font-weight: 600;
          font-size: 13.5px;
          padding: 10px 14px;
          display: flex; align-items: center; gap: 7px;
          position: relative;
          cursor: pointer;
          border-radius: 999px;
          white-space: nowrap;
          transition: color .15s ease;
        }
        .nav-link:hover{ color: var(--text-1, #111827); }

        .nav-label{ font-family: var(--nav-sans); position: relative; z-index: 1; }

        .nav-index{
          color: var(--accent-a);
          font-family: var(--nav-mono);
          font-size: 10px;
          opacity: .75;
          position: relative;
          z-index: 1;
        }

        /* Shared layoutId element — framer-motion animates this single node
           between whichever button currently renders it, producing the
           sliding "active tab" effect. Sized by inset, so it can never
           escape the link's own padding box (no more dropping below the
           navbar). */
        .nav-link-bg{
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--text-1, #111827);
          z-index: 0;
        }
        .nav-link.active{ color: var(--bg-1, #F6F4EF); }
        .nav-link.active .nav-index{ color: #8FB4FF; opacity: 1; }

        .nav-status{
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--nav-mono);
          font-size: 11px; font-weight: 600;
          letter-spacing: .04em;
          color: var(--text-2, #5F6672);
          white-space: nowrap;
        }
        .nav-status-dot{
          width: 7px; height: 7px; border-radius: 50%;
          background: #16A34A;
          box-shadow: 0 0 0 0 rgba(22,163,74,.5);
          animation: nav-pulse 2.2s ease-out infinite;
          flex: 0 0 auto;
        }
        @keyframes nav-pulse{
          0%{ box-shadow: 0 0 0 0 rgba(22,163,74,.45); }
          70%{ box-shadow: 0 0 0 6px rgba(22,163,74,0); }
          100%{ box-shadow: 0 0 0 0 rgba(22,163,74,0); }
        }
        @media (prefers-reduced-motion: reduce){
          .nav-status-dot{ animation: none; }
        }

        .nav-cta{
          appearance: none; border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--accent-a);
          color: #fff;
          font-family: var(--nav-mono);
          font-size: 12px; font-weight: 600;
          letter-spacing: .03em;
          padding: 10px 16px;
          border-radius: 999px;
          white-space: nowrap;
          flex: 0 0 auto;
          transition: background .2s ease, box-shadow .2s ease;
        }
        .nav-cta:hover{ background: #1d4fd1; box-shadow: 0 6px 18px rgba(37,99,235,.28); }

        /* Reserve space for the fixed, floating capsule + its top gap so
           page content is never covered. */
        /* Matches the resting (flush, no top-gap) state — the only one that
           matters for preventing an initial content jump under the fixed
           header; once scrolled, the header just floats over content that's
           already scrolled past this point. */
        .nav-spacer{ height: var(--nav-h); }

        /* Mobile menu button */
        .nav-menu-btn{
          display:none;
          appearance:none;
          border: 1px solid rgba(17,24,39,.14);
          background: rgba(17,24,39,.04);
          color: var(--text-1, #111827);
          border-radius: 12px;
          height: 38px;
          width: 38px;
          padding: 0;
          font-size: 18px;
          cursor: pointer;
          flex: 0 0 auto;
          transition: background .2s ease, transform .2s ease;
        }
        .nav-menu-btn:hover{ background: rgba(17,24,39,.08); transform: translateY(-1px); }

        /* Drawer */
        .drawer-root{
          position: fixed;
          inset: 0;
          z-index: 2000;
        }
        .drawer-overlay{
          position: absolute;
          inset: 0;
          background: rgba(17,24,39,.45);
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
          background: #FFFFFF;
          border-left: 1px solid var(--line, #DDDAD3);
          box-shadow: -20px 0 60px rgba(17,24,39,.12);
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
          background: radial-gradient(circle, rgba(37,99,235,.14), transparent 72%);
          pointer-events: none;
          filter: blur(2px);
        }
        .drawer-grid{
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .5;
          background-image:
            linear-gradient(rgba(17,24,39,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17,24,39,.035) 1px, transparent 1px);
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
          border-bottom: 1px solid var(--line, #DDDAD3);
        }
        .drawer-logo{ height: 28px; width:auto; border-radius: 10px; }
        .drawer-close{
          appearance:none;
          border: 1px solid rgba(17,24,39,.14);
          background: rgba(17,24,39,.04);
          color: var(--text-1, #111827);
          border-radius: 999px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .drawer-close:hover{ background: rgba(17,24,39,.08); transform: rotate(90deg); }

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
          color: var(--text-2, #5F6672);
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
          color: var(--text-1, #111827);
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
          background: var(--accent-a);
          transform: scaleY(0);
          transition: transform .22s cubic-bezier(.16,1,.3,1);
        }
        .drawer .sheet-link:hover{
          background: rgba(17,24,39,.04);
          border-color: rgba(17,24,39,.08);
          padding-left: 20px;
        }
        .drawer .sheet-link.active{
          background: rgba(37,99,235,.08);
          border-color: rgba(37,99,235,.14);
        }
        .drawer .sheet-link.active::before{ transform: scaleY(1); }
        .sheet-link-index{
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .04em;
          color: var(--accent, #2563EB);
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
          color: var(--accent, #2563EB);
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
          border-top: 1px solid var(--line, #DDDAD3);
        }
        .drawer-social{
          appearance: none;
          border: 1px solid rgba(17,24,39,.12);
          background: rgba(17,24,39,.03);
          color: var(--text-1, #111827);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .drawer-social:hover{
          background: rgba(17,24,39,.06);
          border-color: rgba(17,24,39,.2);
          transform: translateY(-1px);
        }

        /* Tablet: the Toronto/time detail goes first as room gets tight —
           the outer margin/padding also shrink with viewport width (they're
           clamp()s), so the "AVAILABLE" word has to go in this same tier
           too, not a lower one, or there's a gap where things still wrap. */
        @media (max-width: 980px){
          .nav-clock{ display:none; border-left:none; padding-left:0; }
          .nav-status-label{ display:none; }
          .nav-link{ padding: 10px 11px; }
          .nav-dock .nav-center{ gap: 2px; }
        }

        /* Mobile: keep logo, availability dot, CTA and the menu button —
           numbered links move into the drawer below. */
        @media (max-width: 720px){
          :root{ --nav-h: 60px; --nav-margin-x: 14px; --nav-pad-x: 14px; --nav-radius: 20px; }
          .brand-logo{ height:24px; }
          .brand-suffix{ display:none; }

          .nav-dock .nav-center{ display:none; }
          .nav-cta{ padding: 9px 14px; font-size: 11px; }
          .nav-menu-btn{ display:inline-flex; align-items:center; justify-content:center; }
        }
      `}</style>
    </>
  );
}
