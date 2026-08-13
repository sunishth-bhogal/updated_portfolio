// src/components/CurrentActivity.jsx
// Compact "Currently Playing / Currently Building" module — replaces the old
// hero CTA row + featured-project card. Two small connected panels:
//  - Spotify: real playlist metadata (cover art, name) via Spotify's public
//    oEmbed endpoint. No OAuth, so this deliberately does NOT claim a track
//    is playing live right now — it's the playlist, not a live now-playing
//    feed. True live playback would need an auth + token-refresh backend
//    this static site doesn't have.
//  - GitHub: real public contribution data via the jogruber contributions
//    API (a public, unauthenticated mirror of GitHub's own calendar — the
//    official GitHub API requires an auth token even for public data, which
//    can't be safely held in a client-only app). Streak/total are computed
//    from that real data, never hard-coded.
import React, { useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

const SPOTIFY_PLAYLIST_ID = "4syNTOmvG5Vpx9BF2ai0cF";
const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
const GITHUB_USERNAME = "sunishth-bhogal";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const WEEKS_TO_SHOW = 18;

// Playlists can have blank/whitespace-only titles (some Spotify users name
// them with invisible formatting marks on purpose) — strip those marks so
// an empty result is treated as genuinely empty, not rendered as blank text.
function cleanTitle(raw) {
  // Zero-width space/joiners + bidi formatting marks (LRM/RLM/LRE-PDF etc.).
  return (raw || "").replace(/[\u200b-\u200f\u202a-\u202e]/g, "").trim();
}

function useSpotifyPlaylist(playlistId) {
  const [state, setState] = useState({ status: "loading", title: "", thumbnail: null });

  useEffect(() => {
    let cancelled = false;
    fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${playlistId}`)
      .then((res) => {
        if (!res.ok) throw new Error("oEmbed request failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setState({ status: "ready", title: cleanTitle(json.title), thumbnail: json.thumbnail_url || null });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", title: "", thumbnail: null });
      });
    return () => {
      cancelled = true;
    };
  }, [playlistId]);

  return state;
}

// Consecutive-days-with-activity count, walking back from the most recent
// day in the dataset. If the most recent day happens to be today and has no
// contributions yet, that's not treated as a broken streak — the day just
// isn't over.
function computeStreak(days) {
  const todayStr = new Date().toISOString().slice(0, 10);
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.count > 0) {
      streak++;
    } else if (day.date === todayStr) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function useGithubContributions(username) {
  const [state, setState] = useState({ status: "loading", weeks: [], streak: 0, total: null });

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error("contributions request failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const days = Array.isArray(json.contributions) ? json.contributions : [];
        const streak = computeStreak(days);
        const recent = days.slice(-WEEKS_TO_SHOW * 7);
        // Pad the front so columns line up on real calendar weeks (Sun→Sat),
        // matching how GitHub's own graph is laid out.
        const firstDow = recent.length ? new Date(`${recent[0].date}T00:00:00`).getDay() : 0;
        const padded = Array(firstDow).fill(null).concat(recent);
        const weeks = [];
        for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
        setState({ status: "ready", weeks, streak, total: json.total?.lastYear ?? null });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, status: "error" }));
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}

function Equalizer({ active }) {
  return (
    <span className={`eq ${active ? "eq--active" : ""}`} aria-hidden="true">
      <span className="eq__bar" />
      <span className="eq__bar" />
      <span className="eq__bar" />
      <span className="eq__bar" />
    </span>
  );
}

function SpotifyPanel() {
  const { status, title, thumbnail } = useSpotifyPlaylist(SPOTIFY_PLAYLIST_ID);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const displayTitle = title || "Spotify Playlist";

  return (
    <a
      className="activity-panel activity-panel--spotify"
      href={SPOTIFY_PLAYLIST_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="activity-panel__art-wrap">
        {status === "ready" && thumbnail ? (
          <img className="activity-panel__art" src={thumbnail} alt="" loading="lazy" />
        ) : status === "loading" ? (
          <div className="activity-panel__art activity-panel__art--skeleton" aria-hidden="true" />
        ) : (
          <div className="activity-panel__art activity-panel__art--fallback" aria-hidden="true">
            ♪
          </div>
        )}
        <Equalizer active={!reduceMotion && hovered} />
      </div>

      <div className="activity-panel__body">
        <span className="activity-panel__label">Currently Playing</span>
        <span className="activity-panel__title">
          {status === "loading" ? "Loading playlist…" : status === "error" ? "My playlist" : displayTitle}
        </span>
        <span className="activity-panel__link">
          Open in Spotify <span aria-hidden="true">↗</span>
        </span>
      </div>
    </a>
  );
}

function GithubTooltip({ day, x, y }) {
  if (!day) return null;
  const label =
    day.count > 0
      ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
      : `No contributions on ${day.date}`;
  return (
    <span className="gh-tooltip" style={{ left: x, top: y }} role="tooltip">
      {label}
    </span>
  );
}

function GithubPanel() {
  const { status, weeks, streak, total } = useGithubContributions(GITHUB_USERNAME);
  const [tooltip, setTooltip] = useState(null);

  const showTooltip = useCallback((day, e) => {
    if (!day) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.closest(".gh-grid").getBoundingClientRect();
    setTooltip({
      day,
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top,
    });
  }, []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  return (
    <div className="activity-panel activity-panel--github">
      <div className="activity-panel__head">
        <span className="activity-panel__label">Building in public</span>
        <a
          className="activity-panel__link"
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{GITHUB_USERNAME} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {status === "loading" && <div className="gh-grid gh-grid--skeleton" aria-hidden="true" />}

      {status === "error" && (
        <div className="gh-fallback">
          <p>Couldn&apos;t load live contribution data right now.</p>
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            View GitHub profile <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

      {status === "ready" && (
        <a
          className="gh-grid"
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub contribution activity for ${GITHUB_USERNAME}, last ${WEEKS_TO_SHOW} weeks`}
        >
          {weeks.map((week, wi) => (
            <span className="gh-week" key={wi}>
              {week.map((day, di) =>
                day ? (
                  <span
                    key={di}
                    className="gh-day"
                    data-level={day.count > 0 ? day.level : 0}
                    onMouseEnter={(e) => showTooltip(day, e)}
                    onMouseLeave={hideTooltip}
                  />
                ) : (
                  <span key={di} className="gh-day gh-day--empty" aria-hidden="true" />
                )
              )}
            </span>
          ))}
          <GithubTooltip day={tooltip?.day} x={tooltip?.x} y={tooltip?.y} />
        </a>
      )}

      {status === "ready" && (total != null || streak > 0) && (
        <div className="activity-panel__foot">
          <span>
            {streak > 0 ? `${streak}-day streak · ` : ""}
            {total != null ? `${total} contributions this year` : ""}
          </span>
        </div>
      )}
    </div>
  );
}

export default function CurrentActivity() {
  return (
    <>
      <div className="activity-module">
        <SpotifyPanel />
        <GithubPanel />
      </div>

      <style>{`
        .activity-module{
          display: flex;
          gap: clamp(12px, 1.6vw, 18px);
          margin-top: clamp(18px, 2.6vw, 26px);
          /* Not width:100% — the parent (.hero__content--left) is itself
             width:auto (shrink-to-fit), so a percentage width here has no
             definite value to resolve against and silently falls back to
             this element's own content size instead. align-self:stretch
             fills the flex line's cross size directly, sidestepping that
             ambiguity entirely. */
          align-self: stretch;
          max-width: 580px;
        }
        @media (max-width: 640px){
          .activity-module{ flex-direction: column; max-width: 420px; }
        }

        .activity-panel{
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-radius: 16px;
          border: 1px solid rgba(17,24,39,.1);
          background: rgba(17,24,39,.03);
          padding: 14px;
          text-decoration: none;
          color: inherit;
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }
        a.activity-panel:hover, a.activity-panel:focus-visible{
          background: rgba(17,24,39,.05);
          border-color: hsl(220 60% 60% / .35);
          transform: translateY(-2px);
        }

        .activity-panel__label{
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--text-2, #5F6672);
        }

        .activity-panel__head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }

        /* Spotify and GitHub sit on one equal-height row (default flex
           stretch); Spotify just gets a bigger share of the width. */
        .activity-panel--spotify{ flex-grow: 1.25; }
        .activity-panel--github{ flex-grow: 1; }
        .activity-panel--spotify{
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }
        .activity-panel__art-wrap{ position: relative; flex: 0 0 auto; }
        .activity-panel__art{
          width: 58px; height: 58px;
          border-radius: 10px;
          object-fit: cover;
          display: block;
          background: var(--panel, #fff);
        }
        .activity-panel__art--skeleton{
          background: linear-gradient(90deg, rgba(17,24,39,.06), rgba(17,24,39,.13), rgba(17,24,39,.06));
          background-size: 200% 100%;
          animation: activity-shimmer 1.6s ease-in-out infinite;
        }
        .activity-panel__art--fallback{
          display:flex; align-items:center; justify-content:center;
          background: var(--panel, #fff);
          color: var(--text-3, #8A8F98);
          font-size: 22px;
        }
        @keyframes activity-shimmer{ 0%{ background-position: 200% 0; } 100%{ background-position: -200% 0; } }

        .activity-panel__body{ display:flex; flex-direction:column; gap:3px; min-width:0; }
        .activity-panel__title{
          font-size: 13.5px; font-weight: 700; color: var(--text-1, #111827);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .activity-panel__link{
          font-size: 11.5px; font-weight: 600; color: var(--accent, #2563EB);
        }
        .activity-panel--spotify .activity-panel__link{
          opacity: 0;
          transform: translateY(2px);
          transition: opacity .18s ease, transform .18s ease;
        }
        .activity-panel--spotify:hover .activity-panel__link,
        .activity-panel--spotify:focus-visible .activity-panel__link{
          opacity: 1;
          transform: translateY(0);
        }
        @media (hover: none){
          .activity-panel--spotify .activity-panel__link{ opacity: 1; transform: none; }
        }

        /* Decorative equalizer — purely stylistic accent on the playlist
           cover, not tied to real playback state. */
        .eq{
          position: absolute;
          right: -4px; bottom: -4px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          width: 20px; height: 16px;
          padding: 3px;
          border-radius: 6px;
          background: var(--accent, #2563EB);
          box-shadow: 0 2px 8px rgba(37,99,235,.35);
        }
        .eq__bar{
          flex: 1;
          background: #fff;
          border-radius: 1px;
          height: 30%;
        }
        .eq--active .eq__bar{ animation: eq-bounce 0.9s ease-in-out infinite; }
        .eq__bar:nth-child(1){ animation-delay: 0s; }
        .eq__bar:nth-child(2){ animation-delay: .15s; }
        .eq__bar:nth-child(3){ animation-delay: .3s; }
        .eq__bar:nth-child(4){ animation-delay: .1s; }
        @keyframes eq-bounce{
          0%, 100% { height: 25%; }
          50% { height: 100%; }
        }
        @media (prefers-reduced-motion: reduce){
          .eq--active .eq__bar{ animation: none; height: 55%; }
        }

        /* GitHub panel */
        .gh-grid{
          position: relative;
          display: flex;
          gap: 2px;
          padding: 2px 0;
          text-decoration: none;
          align-self: flex-start;
          max-width: 100%;
        }
        .gh-grid--skeleton{
          width: 100%; height: 72px;
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(17,24,39,.05), rgba(17,24,39,.1), rgba(17,24,39,.05));
          background-size: 200% 100%;
          animation: activity-shimmer 1.6s ease-in-out infinite;
        }
        .gh-week{ display:flex; flex-direction:column; gap:2px; flex: 0 0 auto; }
        .gh-day{
          width: 7px; height: 7px;
          border-radius: 2px;
          background: rgba(17,24,39,.06);
          flex: 0 0 auto;
        }
        .gh-day--empty{ background: transparent; }
        .gh-day[data-level="1"]{ background: color-mix(in srgb, var(--accent, #2563EB) 28%, var(--panel, #fff)); }
        .gh-day[data-level="2"]{ background: color-mix(in srgb, var(--accent, #2563EB) 52%, var(--panel, #fff)); }
        .gh-day[data-level="3"]{ background: color-mix(in srgb, var(--accent, #2563EB) 74%, var(--panel, #fff)); }
        .gh-day[data-level="4"]{ background: var(--accent, #2563EB); }
        .gh-day:not(.gh-day--empty):hover{ outline: 1.5px solid var(--text-1, #111827); outline-offset: 1px; }

        .gh-tooltip{
          position: absolute;
          transform: translate(-50%, calc(-100% - 8px));
          background: var(--text-1, #111827);
          color: var(--bg-1, #F6F4EF);
          font-size: 11px; font-weight: 600;
          white-space: nowrap;
          padding: 5px 8px;
          border-radius: 6px;
          pointer-events: none;
          z-index: 2;
        }

        .gh-fallback{
          font-size: 12.5px; color: var(--text-2, #5F6672);
          display:flex; flex-direction:column; gap:4px;
        }
        .gh-fallback a{ color: var(--accent, #2563EB); font-weight:600; }

        .activity-panel__foot{
          display:flex; flex-wrap:wrap; align-items:center; gap:5px 10px;
          font-size: 11px; color: var(--text-2, #5F6672);
          margin-top: 2px;
        }
        .activity-panel__foot a{ color: var(--accent, #2563EB); font-weight:600; text-decoration:none; }
        .activity-panel__foot a:hover{ text-decoration: underline; }
      `}</style>
    </>
  );
}
