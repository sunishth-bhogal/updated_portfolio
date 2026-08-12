import React, { useEffect, useRef, useState, useMemo } from "react";

export default function DeepThoughtsSection({
  title = "Notes to Myself",
  subtitle = "Ideas about building, growing and figuring things out.",
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

  const tags = useMemo(() => ["All", ...new Set(thoughts.map((t) => t.tag))], [thoughts]);
  const [activeTag, setActiveTag] = useState("All");
  const filtered = useMemo(
    () => (activeTag === "All" ? thoughts : thoughts.filter((t) => t.tag === activeTag)),
    [thoughts, activeTag]
  );

  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  const normalizeBody = (s = "") =>
    s.replace(/^[ \t]+/gm, "").replace(/\s{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();

  const [featured, ...rest] = filtered;

  return (
    <section className="notebook">
      <div className="nb-grid">
        <aside className="nb-intro">
          <span className="nb-eyebrow">NOTES TO MYSELF</span>
          <p className="nb-subtitle">{subtitle}</p>

          <div className="nb-filters" role="group" aria-label="Filter notes by topic">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`nb-filter ${activeTag === tag ? "is-active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </aside>

        <div className="nb-entries">
          <div className="nb-count">{String(thoughts.length).padStart(2, "0")} NOTES</div>

          {featured && (
            <NoteRow
              note={featured}
              index={1}
              featured
              isOpen={openId === featured.id}
              onToggle={() => toggle(featured.id)}
              normalizeBody={normalizeBody}
            />
          )}

          {rest.map((t, i) => (
            <NoteRow
              key={t.id}
              note={t}
              index={i + 2}
              isOpen={openId === t.id}
              onToggle={() => toggle(t.id)}
              normalizeBody={normalizeBody}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NoteRow({ note, index, featured, isOpen, onToggle, normalizeBody }) {
  const num = String(index).padStart(2, "0");
  const btnId = `note-toggle-${note.id}`;
  const bodyId = `note-body-${note.id}`;

  return (
    <article className={`note ${featured ? "note--featured" : ""} ${isOpen ? "is-open" : ""}`}>
      <button
        id={btnId}
        type="button"
        className="note__head"
        onClick={onToggle}
        aria-controls={bodyId}
        aria-expanded={isOpen}
      >
        <span className="note__num">{num}</span>

        <span className="note__main">
          <span className="note__top-row">
            <span className="note__tag">{note.tag}</span>
            <span className="note__minutes">{note.minutes} MIN READ</span>
          </span>

          <span className="note__heading">{note.heading}</span>
          <span className="note__preview">{note.preview}</span>

          {featured && (
            <span className="note__footer">
              <span className="note__cta">Read note ↗</span>
              <span className="note__date">{formatDateShort(note.date)}</span>
            </span>
          )}
        </span>

        <span className="note__arrow" aria-hidden="true">
          →
        </span>
      </button>

      <div id={bodyId} className="note__body" role="region" aria-labelledby={btnId}>
        <div className="note__body-inner">
          <p className="note__text">{normalizeBody(note.body)}</p>
        </div>
      </div>
    </article>
  );
}

function formatDateShort(iso) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}.${mm}.${yy}`;
  } catch {
    return iso;
  }
}

/* ---------------- scoped styles ---------------- */
function useScopedStyles() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) return;
    const el = document.createElement("style");
    el.setAttribute("data-notebook", "");
    el.textContent = CSS_TEXT;
    document.head.appendChild(el);
    ref.current = el;
    return () => {
      if (ref.current) document.head.removeChild(ref.current);
    };
  }, []);
}

const CSS_TEXT = `
.notebook{
  background: var(--bg-1);
  padding: clamp(64px, 9vw, 96px) clamp(20px, 6vw, 60px) clamp(60px, 8vw, 100px);
  min-height: 100vh;
}

.nb-grid{
  max-width: 1360px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: clamp(40px, 8vw, 88px);
}
@media (max-width: 860px){
  .nb-grid{ grid-template-columns: 1fr; gap: 32px; }
}

.nb-intro{
  position: sticky;
  top: clamp(90px, 12vh, 140px);
  align-self: start;
}
@media (max-width: 860px){ .nb-intro{ position: static; } }

.nb-eyebrow{
  display: block;
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12.5px; font-weight: 700; letter-spacing: .12em;
  color: var(--accent);
  margin-bottom: 12px;
}
.nb-subtitle{
  margin: 0 0 24px;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  letter-spacing: -.01em;
  color: var(--text-1);
  max-width: 32ch;
}

.nb-filters{ display: flex; flex-wrap: wrap; gap: 6px; }
.nb-filter{
  appearance: none; cursor: pointer;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--line); background: transparent; color: var(--text-2);
  font-size: 12px; font-weight: 700; letter-spacing: .02em;
  transition: border-color .18s ease, color .18s ease, background .18s ease;
}
.nb-filter:hover{ border-color: rgba(37,99,235,.35); color: var(--text-1); }
.nb-filter.is-active{ background: var(--accent); border-color: var(--accent); color: #fff; }

.nb-entries{ max-width: 68ch; }
.nb-count{
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px; font-weight: 700; letter-spacing: .1em;
  color: var(--text-3);
  margin-bottom: 8px;
}

.note{ border-top: 1px solid var(--line); }
.note:last-child{ border-bottom: 1px solid var(--line); }

.note__head{
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: clamp(20px, 3vw, 28px) 4px;
  cursor: pointer;
}

.note__num{
  flex: 0 0 auto;
  width: 30px; height: 30px;
  display: grid; place-items: center;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px; font-weight: 700;
  color: var(--text-2);
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.note__head:hover .note__num, .note.is-open .note__num{
  background: var(--accent); border-color: var(--accent); color: #fff;
}

.note__main{ flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: left; }
.note__top-row{ display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.note__tag{
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--accent);
}
.note__minutes{
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px; color: var(--text-3);
}

.note--featured .note__heading{ font-size: clamp(22px, 2.6vw, 28px); }
.note__heading{
  font-size: 17px; font-weight: 800; letter-spacing: -.01em;
  color: var(--text-1);
  margin-bottom: 4px;
}
.note__preview{
  font-size: 14px; color: var(--text-2); line-height: 1.5;
  transition: color .2s ease;
}
.note__head:hover .note__preview{
  color: var(--text-1);
  text-decoration: underline;
  text-decoration-color: rgba(37,99,235,.4);
  text-underline-offset: 3px;
}

.note__footer{
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 16px;
}
.note__cta{ font-size: 12.5px; font-weight: 700; color: var(--accent); }
.note__date{
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px; color: var(--text-3);
}

.note__arrow{
  flex: 0 0 auto;
  font-size: 15px;
  color: var(--text-3);
  transform: translateX(0);
  transition: transform .2s ease, color .2s ease;
}
.note__head:hover .note__arrow{ transform: translateX(3px); color: var(--accent); }
.note.is-open .note__arrow{ transform: rotate(90deg); color: var(--accent); }

/* expand in place — no inner scroll, natural height */
.note__body{
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms ease;
}
.note.is-open .note__body{ grid-template-rows: 1fr; }
.note__body-inner{ min-height: 0; overflow: hidden; }
.note__text{
  margin: 0;
  padding: 0 4px clamp(20px, 3vw, 28px) 46px;
  white-space: pre-line;
  line-height: 1.75;
  color: var(--text-2);
  max-width: 65ch;
}
`;
