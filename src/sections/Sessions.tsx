/* ---------------------------------------------------------------------------
 * 03 Choose your session (storyboard frames 04–06)
 *
 * Pinned desktop scene, driven by one scrubbed GSAP timeline:
 *   intro  frame 04: sage field, still contour, centred rounded square "01/04"
 *   s0     frame 05: ivory details panel and photo frame open around the square,
 *          which settles on the divide as the counter; Signature is active
 *   s1–s3  frame 06: each next photograph is revealed up from the bottom of the
 *          frame; the details, actions and counter switch with it
 *   end    hold on Meridian, then the pin releases into the page
 * Every label is a snap point, so each session has a settled reading position.
 * One `active` index drives the counter, details, list and visit request.
 *
 * Flow layout (narrow, short, reduced motion, or copy that would be clipped):
 * the four sessions in reading order, each with photo, counter and actions.
 *
 * Handover from 02 Hero: the hero's contracted photo should finish exactly on
 * `.sessions-counter` at the `intro` label — centred in the stage below the
 * header, size var(--session-square), radius var(--session-square-radius) —
 * then cross-fade to the stone square reading "01/04".
 * ------------------------------------------------------------------------- */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import { VISIT_HREF } from "@/content/contact";
import { WaveCorner } from "@/components/WaveCorner";
import { images } from "@/content/images";
import { PIN_QUERY, STAGE_CHANGE_EVENT, headerHeight } from "@/lib/stage";
import { SESSIONS_HEADING, counterLabel, sessions, type Session } from "@/content/sessions";

gsap.registerPlugin(ScrollTrigger);

/** Timeline seconds each session rests, relative to a 1-second transition. */
const HOLD = 1;

const viewportKey = () =>
  `${window.innerWidth}x${window.innerHeight}@${getComputedStyle(document.documentElement).fontSize}`;

/** Screen-reader position, since the visual counter is aria-hidden. */
function SessionPosition({ index }: { index: number }) {
  return (
    <span className="visually-hidden">
      Session {index + 1} of {sessions.length}:{" "}
    </span>
  );
}

function SessionActions({ session }: { session: Session }) {
  const { detail } = session;
  return (
    <div className="session-actions">
      <a className="session-request" href={VISIT_HREF} data-session={session.name}>
        Request a Visit <Arrow />
      </a>
      {detail.href ? (
        <a
          className="session-detail-link"
          href={detail.href}
          {...(detail.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {detail.label}
        </a>
      ) : null}
    </div>
  );
}

/* ----------------------------- Flow layout ------------------------------ */

function FlowSessions() {
  return (
    <div className="sessions-flow">
      <h2 id="sessions-heading">{SESSIONS_HEADING}</h2>
      <ol className="sessions-flow-list">
        {sessions.map((session, index) => (
          <li key={session.name}>
            <article className="session-card" aria-labelledby={`session-${index}`}>
              <img
                className="session-card-photo"
                src={session.image.src}
                alt={session.image.alt}
                loading="lazy"
              />
              <span className="sessions-counter-pill" aria-hidden="true">
                {counterLabel(index)}
              </span>
              <h3 id={`session-${index}`}>
                <SessionPosition index={index} />
                {session.name}
              </h3>
              <p>{session.description}</p>
              {session.minutes ? (
                <p className="session-time">Treatment time · {session.minutes} minutes</p>
              ) : null}
              <SessionActions session={session} />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------- Pinned layout ----------------------------- */

function PinnedSessions({ onClipped }: { onClipped: () => void }) {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const scrollToSession = (index: number, smooth = true) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    window.scrollTo({
      top: trigger.labelToScroll(`s${index}`),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const left = leftRef.current;
    if (!stage || !left) return;

    // Copy or controls would be clipped at this size (short window, large
    // text): fall back to the flow layout instead of pinning.
    if (left.scrollHeight > left.clientHeight + 1) {
      onClipped();
      return;
    }

    const ctx = gsap.context(() => {
      const photos = gsap.utils.toArray<HTMLElement>(".sessions-photo", stage);
      const right = stage.querySelector<HTMLElement>(".sessions-right");
      const counter = stage.querySelector<HTMLElement>(".sessions-counter");
      const details = stage.querySelector<HTMLElement>(".sessions-details");
      const list = stage.querySelector<HTMLElement>(".sessions-list");
      const handoverPhoto = stage.querySelector<HTMLElement>(".sessions-counter-photo");

      gsap.set(left, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(right, { clipPath: "inset(0% 0% 0% 100%)" });
      gsap.set(photos.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      // Opacity only (not visibility): the list must stay in the tab order at
      // the intro frame so keyboard users can reach every session.
      gsap.set([details, list], { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.addLabel("intro")
        // Frame 04: the hero's photo, contracted into this square, gives way to
        // the stone square and its 01/04.
        .to(handoverPhoto, { opacity: 0, duration: 0.6, ease: "power1.inOut" })
        .to({}, { duration: 0.3 })
        // Frame 04 → 05: the panels open around the square, which settles on the divide.
        .to(left, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, "open")
        .to(right, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, "open")
        .to(
          counter,
          {
            width: "5.75rem",
            height: "2.25rem",
            borderRadius: "1.125rem",
            // Dark green pill on the cream stage.
            backgroundColor: "#34463a",
            color: "#f4f0e7",
            fontSize: "0.8125rem",
            top: "58%",
            duration: 1,
            ease: "power2.inOut",
          },
          "open",
        )
        .to([list, details], { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, "open+=0.55")
        // Each session holds still for as long as its transition takes: that
        // hold is its settled reading position. Labels sit mid-hold, so list
        // buttons and #sessions land on a fully settled frame.
        .to({}, { duration: HOLD / 2 })
        .addLabel("s0")
        .to({}, { duration: HOLD / 2 });

      // Frame 06: each photograph rises into the frame over the one before.
      photos.slice(1).forEach((photo, index) => {
        tl.to(photo, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power1.inOut" })
          .to({}, { duration: HOLD / 2 })
          .addLabel(`s${index + 1}`)
          .to({}, { duration: HOLD / 2 });
      });
      tl.addLabel("end");

      // The active session switches halfway through its photograph's reveal.
      const switchAt = sessions.map((_, index) =>
        index === 0 ? -Infinity : tl.labels[`s${index}`] - HOLD / 2 - 0.5,
      );
      const sync = () => {
        const time = tl.time();
        let next = 0;
        switchAt.forEach((at, index) => {
          if (time >= at) next = index;
        });
        setActive(next);
      };
      // Sync from the timeline itself: with scrub it catches up after the
      // scroll event, so ScrollTrigger's onUpdate would read a stale time on
      // large jumps (links, End key, scrollbar drags).
      tl.eventCallback("onUpdate", sync);

      triggerRef.current = ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        pin: true,
        start: () => `top top+=${headerHeight()}`,
        // ~0.6 viewport of scroll per timeline second.
        end: () => `+=${window.innerHeight * 0.6 * tl.duration()}`,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // No snapping: snap tweens reverse ScrollTrigger's direction and pull
        // slow, notch-by-notch scrolling backwards. Hold zones give each
        // session its settled position under native scroll instead.
        onRefresh: sync,
      });

      // Keyboard focus arriving before the panels have opened jumps to Signature,
      // so no focused control is hidden behind the intro frame.
      const onFocusIn = () => {
        if (tl.time() < tl.labels.s0 - 0.01) scrollToSession(0, false);
      };
      stage.addEventListener("focusin", onFocusIn);

      // "Compare the Sessions" (and any #sessions link) settles on Signature.
      const onAnchorClick = (event: MouseEvent) => {
        const link = (event.target as Element | null)?.closest?.('a[href="#sessions"]');
        if (!link) return;
        event.preventDefault();
        history.pushState(null, "", "#sessions");
        scrollToSession(0);
      };
      document.addEventListener("click", onAnchorClick);
      const onHashChange = () => {
        if (location.hash === "#sessions") scrollToSession(0);
      };
      window.addEventListener("hashchange", onHashChange);

      const refresh = () => ScrollTrigger.refresh();
      photos.forEach((photo) => {
        const img = photo as HTMLImageElement;
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
      document.fonts?.ready.then(refresh);
      // Arriving on /#sessions: wait until the page has loaded and the pin has
      // been measured, then settle on Signature.
      if (location.hash === "#sessions") {
        const settle = () => {
          ScrollTrigger.refresh();
          scrollToSession(0, false);
        };
        if (document.readyState === "complete") window.setTimeout(settle, 60);
        else window.addEventListener("load", () => window.setTimeout(settle, 60), { once: true });
      }

      return () => {
        stage.removeEventListener("focusin", onFocusIn);
        document.removeEventListener("click", onAnchorClick);
        window.removeEventListener("hashchange", onHashChange);
      };
    }, stage);

    return () => {
      ctx.revert();
      triggerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sessions-stage" ref={stageRef}>
      <div className="stage-contour" aria-hidden="true">
        <WaveCorner />
      </div>

      <div className="sessions-left" ref={leftRef}>
        <h2 id="sessions-heading">{SESSIONS_HEADING}</h2>

        <ol className="sessions-list" aria-label="Sessions">
          {sessions.map((session, index) => (
            <li key={session.name}>
              <button
                type="button"
                aria-current={index === active ? "step" : undefined}
                onClick={() => scrollToSession(index)}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {session.short}
              </button>
            </li>
          ))}
        </ol>

        <div className="sessions-details">
          {sessions.map((session, index) => (
            <div
              key={session.name}
              className={`session-detail${index === active ? " is-active" : ""}`}
              inert={index !== active}
              aria-hidden={index !== active}
            >
              <h3>
                <SessionPosition index={index} />
                {session.name}
              </h3>
              <p>{session.description}</p>
              {session.minutes ? (
                <p className="session-time">Treatment time · {session.minutes} minutes</p>
              ) : null}
              <SessionActions session={session} />
            </div>
          ))}
        </div>
      </div>

      <div className="sessions-right">
        {sessions.map((session, index) => (
          <img
            key={session.name}
            className="sessions-photo"
            src={session.image.src}
            alt={session.image.alt}
            aria-hidden={index !== active}
            style={{ zIndex: index + 1 }}
          />
        ))}
      </div>

      <div className="sessions-counter" aria-hidden="true">
        {counterLabel(active)}
        {/* Same photo and crop as the hero's contracted square (02 → 03). */}
        <img className="sessions-counter-photo" src={images.hero.second.src} alt="" />
      </div>
    </div>
  );
}

/* ------------------------------- Section -------------------------------- */

export function Sessions() {
  const [canPin, setCanPin] = useState(() => window.matchMedia(PIN_QUERY).matches);
  const [vpKey, setVpKey] = useState(viewportKey);
  const [clippedAt, setClippedAt] = useState<string | null>(null);

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const onChange = () => setCanPin(query.matches);
    query.addEventListener("change", onChange);
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVpKey(viewportKey()), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      query.removeEventListener("change", onChange);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);

  const pinned = canPin && clippedAt !== vpKey;

  // Let the hero know when 03 switches between pinned and flow, so it can
  // rebuild its ending (skip the first render; the hero reads it on mount).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.dispatchEvent(new Event(STAGE_CHANGE_EVENT));
  }, [pinned]);

  return (
    <section
      id="sessions"
      className={`sessions tone-light ${pinned ? "is-pinned" : "is-flow"}`}
      aria-labelledby="sessions-heading"
    >
      {pinned ? (
        // Remount per viewport so the clipping check and timeline are rebuilt.
        <PinnedSessions key={vpKey} onClipped={() => setClippedAt(vpKey)} />
      ) : (
        <FlowSessions />
      )}
    </section>
  );
}
