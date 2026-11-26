/* ---------------------------------------------------------------------------
 * 03 Choose your session (storyboard 03.1–03.6)
 *
 * An edge-to-edge strip of four equal panels (Signature, Advanced,
 * Waterfall, Meridian), no gaps: 25% of the width each on desktop, a 2 × 2
 * grid on phones. At rest each panel shows only its photograph and title,
 * lower left over a soft gradient. Opening a panel (mouse hover, keyboard
 * focus inside it, or a tap on it) deepens the gradient and lifts the title
 * just enough for the summary, copy and actions to fade in beneath it,
 * inside the panel's own footprint, so the strip never moves. It stays open
 * while the pointer or focus is anywhere inside; a tap on the photograph
 * again closes it. The title is a disclosure button stretched over the
 * panel, so the first tap opens it and the links take separate taps.
 *
 * Arrival: a scroll-driven zoom through the chosen mirror's reflection lands
 * on its session panel (MirrorHandover). The colour state is already applied.
 *
 * Section 02's explicit choice (src/lib/sessionMatch.ts) keeps its matches in
 * KOMO colour and turns every other panel fully greyscale; all stay usable.
 * No choice: all four in colour. Only "Request …" preselects a
 * session for booking (Section 09), where it can still be changed.
 *
 * Reduced motion: no zoom, and panels switch state without transitions.
 * ------------------------------------------------------------------------- */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import { quoteMessage } from "@/content/arrangeVisit";
import { VISIT_HREF, orchardWhatsAppHref } from "@/content/contact";
import {
  SESSIONS_HEADING,
  quotePanel,
  requestLabel,
  sessions,
  type Session,
} from "@/content/sessions";
import { headerHeight } from "@/lib/stage";
import { MirrorHandover } from "@/sections/MirrorHandover";
import { SHOW_SESSIONS_EVENT, isMuted, useSessionMatches } from "@/lib/sessionMatch";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotionQuery() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function SessionPanel({
  session,
  index,
  muted,
  matched,
}: {
  session: Session;
  index: number;
  muted: boolean;
  matched: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || focused || pinned;
  const revealId = `session-${index}-details`;

  return (
    <li
      className="session-panel"
      data-open={open || undefined}
      data-muted={muted || undefined}
      // Mouse only: touch opens with the first tap instead.
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      // Keyboard focus reveals the panel from its title.
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocused(false);
        setPinned(false);
      }}
    >
      <img
        className="session-photo"
        src={session.image.src}
        alt={session.image.alt}
        loading="lazy"
        style={session.focus ? { objectPosition: session.focus } : undefined}
      />
      <div className="session-shade" aria-hidden="true" />
      <div className="session-content">
        <h3 className="session-name">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={revealId}
            onClick={() => {
              // Opened on purpose (tap, click or keyboard): close it.
              // Opened only by hover: keep it open after the pointer leaves.
              if (pinned || focused) {
                setPinned(false);
                setFocused(false);
              } else {
                setPinned(true);
              }
            }}
          >
            {session.name}
            {matched ? (
              <span className="visually-hidden"> (a match for what brings you in)</span>
            ) : null}
          </button>
        </h3>
        <div className="session-reveal" id={revealId}>
          <div className="session-reveal-inner">
            <p className="session-summary">{session.summary}</p>
            <p className="session-body">{session.body}</p>
            {session.minutes ? (
              <p className="session-time">Treatment time · {session.minutes} minutes</p>
            ) : null}
            {session.award ? (
              <p className="session-award">
                {session.award.text} {/* No destination yet (homepage only). */}
                <a href={session.award.href ?? undefined}>{session.award.label}</a>
              </p>
            ) : null}
            <div className="session-actions">
              {/* Carries this session into the booking block (Section 09). */}
              <a className="session-request" href={VISIT_HREF} data-session={session.name}>
                {requestLabel(session)}
              </a>
              {/* Detail pages are not part of this build: shown without a link. */}
              <a className="session-detail-link">{session.explore.label}</a>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Sessions() {
  const matches = useSessionMatches();
  const still = useReducedMotionQuery();
  const stripRef = useRef<HTMLUListElement>(null);

  // Section 02's explicit choice: travel through the mirror zoom to the
  // strip (the scroll drives it), then give keyboard focus to the heading.
  // Reduced motion: straight to the completed comparison.
  useEffect(() => {
    const onShow = () => {
      const strip = stripRef.current;
      const heading = document.getElementById("sessions-heading");
      if (!strip) return;
      const top = strip.getBoundingClientRect().top + window.scrollY;
      const focus = () => heading?.focus({ preventScroll: true });
      if (window.matchMedia(REDUCED_MOTION).matches) {
        window.scrollTo({ top: top - headerHeight() });
        focus();
        return;
      }
      gsap.to(window, {
        scrollTo: { y: top, autoKill: true },
        duration: 2.4,
        ease: "power1.inOut",
        onComplete: focus,
      });
    };
    window.addEventListener(SHOW_SESSIONS_EVENT, onShow);
    return () => window.removeEventListener(SHOW_SESSIONS_EVENT, onShow);
  }, []);

  // Keyboard focus arriving mid-handover: finish it first.
  const onFocus = () => {
    const strip = stripRef.current;
    if (still || !strip) return;
    const top = strip.getBoundingClientRect().top;
    if (top > 1) window.scrollTo({ top: window.scrollY + top });
  };

  return (
    // data-header-solid: the header stays a solid bar over these photographs.
    <section
      id="sessions"
      className="sessions"
      aria-labelledby="sessions-heading"
      data-header-solid
    >
      <h2 id="sessions-heading" className="sessions-heading" tabIndex={-1}>
        {SESSIONS_HEADING}
      </h2>

      {/* Scroll room for the mirror zoom, which covers the screen meanwhile. */}
      {still ? null : <div className="handover-spacer" aria-hidden="true" />}

      <ul
        className="sessions-strip"
        ref={stripRef}
        onFocus={onFocus}
        data-still={still || undefined}
      >
        {sessions.map((session, index) => (
          <SessionPanel
            key={session.name}
            session={session}
            index={index}
            muted={isMuted(session.name, matches)}
            matched={Boolean(matches?.includes(session.name))}
          />
        ))}
      </ul>

      <MirrorHandover still={still} />

      {/* A soft outer container holding one white panel: heading, the
          short line and the quote action in one row. */}
      <aside className="sessions-quote" aria-labelledby="sessions-quote-heading">
        <div className="quote-row">
          <h3 id="sessions-quote-heading">{quotePanel.heading}</h3>
          <p>{quotePanel.body}</p>
          <a
            className="arrange-button arrange-button--outline"
            href={orchardWhatsAppHref(quoteMessage(null))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {quotePanel.action} <Arrow />
          </a>
        </div>
      </aside>
    </section>
  );
}
