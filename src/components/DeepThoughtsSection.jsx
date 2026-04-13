import React, { useEffect, useRef, useState, useMemo } from "react";
import Compass from "../components/assets/Compass.jpg";
import Fear from "../components/assets/Fear.jpg";
import Life from "../components/assets/Life.jpg";

export default function DeepThoughtsSection({
  title = "Introspect",
  subtitle = "Our life is a manifestation of our thoughts. These are some thoughts I've had while introspecting.",
  thoughts: inputThoughts,
}) {
  useScopedStyles();

  const thoughts = useMemo(
    () =>
      inputThoughts ?? [
        {
          id: "stillness",
          tag: "Focus",
          date: "2025-09-25",
          minutes: 2,
          heading: "The Beauty of Simplicity",
          cover:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
          preview: "Beauty is within, not in what we’re endlessly chasing.",
          body: `Simplicity isn’t about owning less; it’s about seeing more. It’s the choice to notice what’s already here and be grateful for it.
      In our capitalistic world where growth matters, we get so caught up chasing the next that we forget to enjoy the moment we’re in. We mistake endless growth for endless time.
      Simplicity interrupts that loop. We get so stuck in an endless cycle that we forget to appreciate.
      To practice it, change your perspective: one task, one conversation, one breath. Put your attention where your feet are. Life feels spacious not because we have less, but because we’re finally present with what we have.`,
        },
        {
          id: "friction",
          tag: "Mindset",
          date: "2025-08-20",
          minutes: 4,
          heading: "Pick the harder option.",
          cover:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
          preview:
            "Opportunities don't knock on your door, your hard work opens a door to an opportunity",
          body: `As humans we like comfort and convenience. We throw on Google Maps, play the same songs, eat the same meals so we don’t learn a new recipe.
      What if we stepped out and learned it anyway? Even if it didn’t taste great, we’d learn and do better next time. Success comes from our choices; the harder option is often choosing ourselves—backed by self-belief and reps.
      Choosing the gym, choosing a hard skill, choosing yourself all lead to your future self.`,
        },
        {
          id: "compass",
          tag: "Direction",
          date: "2025-07-29",
          minutes: 2,
          heading: "Build a Compass, Not a Map",
          cover: Compass,
          preview: "Plans don't always work, but the ability to find the right path does.",
          body: `Address what needs to be done. Promise yourself this goal will be reached, regardless of how long it takes.
      The hardest part is starting. We often make plans and then change our minds. Mindset comes first, but obsession can become a trap—clinging to doors without handles. When your compass points elsewhere, follow it. If you get lost, it guides you back.
      Build the compass. It lets you walk through fog without waiting for perfect visibility.`,
        },
        {
          id: "craft",
          tag: "Mindset",
          date: "2025-07-02",
          minutes: 5,
          heading: "Our biggest fear is of 'Fear' itself",
          cover: Fear,
          preview: "Perfection is a stalling tactic. Ship version one and earn version two.",
          body: `Have you ever been scared of something, and then when you overcame that fear realized that it was always in your head. Whether that be a roller coaster, heights, or even a plane, if everyone else can do it why not me? Similarly we sometimes are scared of having a totally rational fears but we overcome it due to the fear of judgement, not being able to swim or even driving are possible fears that we overlook to avoid judgement.
      We get so stuck in the loop of thinking of what others will think, or what if we fail that we never get ourselves the chance to succeed. Everything is cringe till it works. So just do what you want to do, because the only person you are letting down is your future self. We get scared that we may lack the quality or the skills but Lebron James did not become Lebron James overnight he had to be obssesed with the idea of being the best and putting in the work.
      Quality grows fastest when results are seen, and it is noticed that improvements need to be made. Until we take that first step in delivering something that will help us improve, no improvement will be shown. The world is only our stage when we tend to push the distractions to the side and just try things. So overcome that fear of fear itself because it's all in our heads.`,
        },
        {
          id: "energy",
          tag: "Motivation",
          date: "2025-06-14",
          minutes: 3,
          heading: "The best thing about life is that it's not linear",
          cover: Life,
          preview: "When life pushes you down, life doesn't stop",
          body: `Sometimes when we fall, we forget that life gives us the opportunity to get right back up. We see the ones around us landing the internships we want, or going on the trips that we want to go and we automatically start to believe that we are behind. That's the great thing about being a young adult, for the first time in our lives we start to go on our own journies and taking different routes than our peers. Even though this may make us feel that we are behind, the great thing about it is that we can build our own path.
      We see other people starting to succeed and we automatically believe that we can't anymore, but the great thing about life is that its exponential. Lionel Messi won his first Ballon'dor at 21 but Karim Benzema did not win until he was 34. This does not mean that he gave up, it just meant better things were meant to come for him later, and there was some lesson that he needed to learn to be the best player he could before winning it.
      Life continues to give multiple second chances, it is our responsibility to find our purpose and keep working hard. When excellence shows up, success follows.`,
        },
        {
          id: "risk",
          tag: "Introspect",
          date: "2025-05-09",
          minutes: 3,
          heading: "Look Within",
          cover:
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
          preview: "True expansion comes from breaking ourselves down to nothing.",
          body: `I’m lost, I’ve hit rock bottom, where do I go my lord
      Everywhere I look, anyone I ask, I am told to keep moving forward
      Don’t look back, don’t dwell on your past, find a hobby to rely on im told
      But if the lord was in my past, and will be in my future then why do I sit here like the world is cold
      
      How do I find myself, how do i connect with this lord that I'm told will fix all my troubles
      I go to church, i pray, but i still find myself going through these struggles
      
      I delve into the depths of the internet's vast expanse,
      Seeking clues and signs, taking a chance.
      From mosque to temple, to church's hallowed pews,
      I journey, hoping to pay my dues.
      
      I say why god why, why is it me that continues to have these deepened pains,
      Is it something i did in my past life that i'm given all these battles
      Is it this darkened world to blame, that I feel I am stuck in these shackles.
      I seek advice and i'm told that god tests that ones that he loves most
      
      If I am so loved why I am so consumed by this darkness,
      I continue to keep looking for answers, here, there, everywhere, 
      But i’m struck by nothing, I’m struck by nothing
      All that searching but I forgot to look in one place
      And that was within
      `,
        },
      ],
    [inputThoughts]
  );

  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  const normalizeBody = (s = "") =>
    s.replace(/^[ \t]+/gm, "").replace(/\s{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();

  return (
    <section className="introspect">
      <div className="intro__hdr">
        <h2 className="intro__title">{title}</h2>
        <p className="intro__subtitle">{subtitle}</p>
      </div>

      <div className="intro__grid">
        {thoughts.map((t) => {
          const isOpen = openId === t.id;
          const bodyId = `card-body-${t.id}`;
          const btnId = `card-toggle-${t.id}`;

          return (
            // ✅ No aria-expanded on <article> (fixes ESLint warning)
            <article key={t.id} className={`card ${isOpen ? "is-open" : ""}`}>
              <button
                id={btnId}
                type="button"
                className="card__head"
                onClick={() => toggle(t.id)}
                aria-controls={bodyId}
                aria-expanded={isOpen}
              >
                <div className="cover" aria-hidden="true">
                  <img src={t.cover} alt="" />
                </div>

                <div className="chips">
                  <span className="chip chip--tag">{t.tag}</span>
                  <span className="chip chip--meta">{formatDate(t.date)}</span>
                  <span className="chip chip--meta">{t.minutes} min</span>
                </div>

                <h3 className="card__title">{t.heading}</h3>
                <p className="card__preview">{t.preview}</p>
                <span className="chev" aria-hidden="true">
                  ▸
                </span>
              </button>

              {/* Expand/collapse region */}
              <div
                id={bodyId}
                className="card__body"
                role="region"
                aria-labelledby={btnId}
              >
                <div className="body__inner">
                  <p className="body__text">{normalizeBody(t.body)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- helpers + scoped styles ---------------- */
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function useScopedStyles() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) return;
    const el = document.createElement("style");
    el.setAttribute("data-introspect", "");
    el.textContent = CSS_TEXT;
    document.head.appendChild(el);
    ref.current = el;
    return () => {
      if (ref.current) document.head.removeChild(ref.current);
    };
  }, []);
}

const CSS_TEXT = `
:root{
  --bg0: hsl(220 18% 8%);
  --bg1: hsl(220 18% 12%);
  --card: hsl(220 18% 14%);
  --border: hsl(220 18% 22% / .6);
  --txt1: hsl(210 30% 96%);
  --txt2: hsl(215 20% 78%);
  --muted: hsl(215 14% 64%);
  --brand: hsl(200 100% 62%);
  --brand-2: hsl(190 95% 62%);
  --radius: 18px;
  --shadow: 0 10px 30px hsl(220 50% 2% / .35);
}

.introspect{
  color: var(--txt1);
  background: radial-gradient(1200px 600px at 20% -10%, hsl(200 100% 20% / .18), transparent),
              radial-gradient(900px 500px at 80% -10%, hsl(190 100% 22% / .16), transparent),
              linear-gradient(180deg, var(--bg0), var(--bg1));
  border-radius: var(--radius);
  padding: clamp(16px, 3.2vw, 28px);
  box-shadow: var(--shadow);
}

.intro__hdr{ display:grid; gap:6px; margin-bottom: 12px; }
.intro__title{ font-size: clamp(28px, 3.4vw, 44px); font-weight: 900; letter-spacing: -0.02em; }
.intro__subtitle{ color: var(--txt2); }

.intro__grid{
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(14px, 2.2vw, 18px);
}
.card{
  grid-column: span 12;
  background: linear-gradient(180deg, var(--card), hsl(220 18% 13%));
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
}
@media (min-width: 780px){ .card{ grid-column: span 6; } }
@media (min-width: 1180px){ .card{ grid-column: span 4; } }

.card__head{
  all: unset;
  display: grid;
  gap: 10px;
  cursor: pointer;
  position: relative;
  padding-bottom: 12px;
}
.card__head:hover{ background: hsl(220 18% 18% / .35); }

.cover{ aspect-ratio: 16/9; overflow: hidden; }
.cover img{ width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform .35s ease; }
.card:hover .cover img{ transform: scale(1.1); }

.chips{ display:flex; gap:8px; padding: 12px 14px 0; }
.chip{
  font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 999px; color: white;
  background: hsl(220 18% 20%);
  border: 1px solid var(--border);
}
.chip--tag{ background: linear-gradient(90deg, var(--brand), var(--brand-2)); border-color: transparent; }
.chip--meta{ color: var(--txt2); }

.card__title{ padding: 0 14px; font-size: 18px; font-weight: 850; letter-spacing: -0.01em; }
.card__preview{
  padding: 0 14px;
  color: var(--muted);
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__preview:after{
  content:"";
  position:absolute; left:0; right:0; bottom:-2px; height:26px;
  background: linear-gradient(180deg, transparent, hsl(220 18% 13%));
}

.chev{
  position: absolute; right: 12px; top: 12px; font-size: 18px;
  transition: transform .25s ease;
}
.card.is-open .chev{ transform: rotate(90deg); }

/* ==== Expansion uses grid rows ==== */
.card__body{
  display: grid;
  grid-template-rows: 0fr;             /* collapsed */
  transition: grid-template-rows 320ms ease;
  border-top: 1px solid var(--border);
}
.card.is-open .card__body{
  grid-template-rows: 1fr;             /* expanded */
}
.body__inner{
  min-height: 0;
  overflow: auto;
  max-height: 52vh;
  padding: 12px 14px 16px;
}
.body__text{
  margin: 0;
  white-space: pre-line;
  line-height: 1.65;
  color: var(--txt1);
  overflow-wrap: anywhere;
  text-wrap: pretty;
}
`;
