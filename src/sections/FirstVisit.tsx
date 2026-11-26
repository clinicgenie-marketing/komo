/* ---------------------------------------------------------------------------
 * 04 What happens on a first visit? (storyboard 04.1–04.4)
 *
 * One six-card timeline on a shallow arc: 01–03 at the mirror, 04–06 at the
 * basin. Only the chapter heading sits centred above the carousel; both
 * headings share one grid cell, so the carousel never moves. Each card
 * carries its step number, photograph, step title, description and (for
 * Imaging) its links, so its content travels with it along the arc. The chapter follows the card at rest in the centre (after a
 * drag, swipe or arrow press comes to rest), so a partial drag never flickers
 * the copy: it crossfades to the basin the moment card 04 reaches the centre
 * and back the moment card 03 does.
 *
 * The page scroll drives the cards: the section pins once the carousel is
 * fully in view, and scrolling moves the cards sideways (GSAP ScrollTrigger,
 * snapping to the nearest card), then the page carries on. The cards also
 * sit in a horizontal scroller: sideways swipes and a mouse drag move them,
 * and Previous / Next reach every card; each lines the page up with the
 * card it lands on, so the two never disagree. Each
 * card's distance from the centre places it on a dome-shaped fan that
 * follows the cream rim curve below the section: the centre card upright
 * and highest, neighbours dropping and turning outward along that same
 * ellipse (layoutArc sets each card's drop and tilt). Only the centred card
 * shows its title and description, over the bottom of its photograph.
 * Card 06 is the wide treatment still.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import {
  FIRST_VISIT_HEADING,
  chapterOrder,
  chapters,
  visitPhotos,
  type VisitPhoto,
} from "@/content/firstVisit";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Page scroll per card while the section is pinned, as a share of the viewport height. */
const SCROLL_PER_CARD = 0.6;

/** How much deeper the card fan curves than the cream rim curve below it. */
const ARC_DEPTH = 3;

/* ------------------------------ Arc carousel ----------------------------- */

/** Touch-first devices get "Swipe to explore". */
const COARSE_POINTER = "(hover: none) and (pointer: coarse)";

function ArcCarousel({
  photos,
  onSettle,
}: {
  photos: VisitPhoto[];
  /** The card at rest in the centre, once a drag, swipe or arrow press ends. */
  onSettle: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [coarse, setCoarse] = useState(() => window.matchMedia(COARSE_POINTER).matches);
  const interacted = useRef(false);
  const dragging = useRef(false);
  const nearestRef = useRef(0);
  const onSettleRef = useRef(onSettle);
  onSettleRef.current = onSettle;

  const slides = () =>
    Array.from(scrollerRef.current?.querySelectorAll<HTMLElement>(".arc-slide") ?? []);

  // Position every slide on the arc from its distance to the centre.
  const layoutArc = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const centre = scroller.scrollLeft + scroller.clientWidth / 2;
    // The cards follow the cream rim curve below the section: the same
    // ellipse width (124% across; see .range.has-rim::before), deepened by
    // ARC_DEPTH so the fan reads as a clear curve echoing the rim.
    const a = scroller.clientWidth * 0.62;
    const b = Math.min(84, Math.max(36, window.innerWidth * 0.06)) * ARC_DEPTH;
    const gap = parseFloat(getComputedStyle(scroller).columnGap || "0");
    let nearest = 0;
    let nearestDistance = Infinity;
    slides().forEach((slide, index) => {
      const step = slide.offsetWidth + gap;
      const offset = slide.offsetLeft + slide.offsetWidth / 2 - centre;
      const raw = offset / step;
      const d = Math.max(-3, Math.min(3, raw));
      const x = Math.max(-a * 0.995, Math.min(a * 0.995, offset));
      const root = Math.sqrt(1 - (x / a) ** 2);
      // Drop below the curve's crest, and the curve's slope there.
      const drop = b * (1 - root);
      const tilt = (Math.atan((b * x) / (a * a * root)) * 180) / Math.PI;
      slide.style.setProperty("--d", d.toFixed(4));
      slide.style.setProperty("--arc-drop", `${drop.toFixed(2)}px`);
      slide.style.setProperty("--arc-rot", `${tilt.toFixed(3)}deg`);
      // The centre card stacks on top where neighbours meet on the fan.
      slide.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      if (Math.abs(raw) < nearestDistance) {
        nearestDistance = Math.abs(raw);
        nearest = index;
      }
    });
    nearestRef.current = nearest;
    setActive(nearest);
    // A card counts as arrived the moment it reaches the centre (within 4% of
    // a card step), not when the scroll has fully stopped, so the chapter
    // heading changes exactly as card 04 (or 03, going back) lands in place.
    // While a mouse drag is held, cards only passing through don't count.
    if (nearestDistance < 0.04 && !dragging.current) onSettleRef.current(nearest);
  };

  const targetLeft = (index: number) => {
    const scroller = scrollerRef.current;
    const slide = slides()[index];
    if (!scroller || !slide) return 0;
    return slide.offsetLeft + slide.offsetWidth / 2 - scroller.clientWidth / 2;
  };

  // The pinned scroll range that drives the carousel (see the effect below).
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // When the page scroll last moved the cards (so a settle doesn't fight it).
  const drivenAt = useRef(0);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(photos.length - 1, index));
    interacted.current = true;
    const behavior = reducedMotion() ? "auto" : "smooth";
    const trigger = triggerRef.current;
    if (trigger) {
      // The cards follow the page: move the page to that card's position.
      const top = trigger.start + ((trigger.end - trigger.start) * clamped) / (photos.length - 1);
      if (Math.abs(window.scrollY - top) > 1) {
        window.scrollTo({ top, behavior });
        return;
      }
    }
    scroller.scrollTo({ left: targetLeft(clamped), behavior });
  };

  // Scroll-driven: once the carousel is fully in view the section pins, and
  // scrolling the page moves the cards sideways, 01 → 06 in their usual
  // order (back up, 06 → 01). After the last card the page carries on. The
  // scroll snaps to the nearest card when it comes to rest.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const section = scroller?.closest<HTMLElement>("section");
    const panel = scroller?.closest<HTMLElement>(".first-visit-panel");
    if (!scroller || !section || !panel) return;
    const last = photos.length - 1;
    // The page drives the position; native snapping would fight it.
    scroller.style.scrollSnapType = "none";
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: section,
      // Pin as low as possible, so the cream rim curve below the section
      // shows at the screen's foot: ideally the section's foot just below
      // the screen's, but never with the heading tucked under the header.
      // If even that leaves the controls off screen (a very short screen),
      // pin with the carousel's top just under the header instead.
      start: () => {
        const vh = window.innerHeight;
        const header = document.querySelector("header")?.offsetHeight ?? 0;
        const h2 = section.querySelector("h2");
        const heading = h2
          ? h2.getBoundingClientRect().top - section.getBoundingClientRect().top
          : 0;
        const footPad = parseFloat(getComputedStyle(section).paddingBottom) || 0;
        const ideal = vh + 10 - section.offsetHeight;
        const lowest = header + 8 - heading;
        const top = Math.max(ideal, lowest);
        const controlsFoot = top + section.offsetHeight - footPad;
        const at = controlsFoot > vh - 8 ? header - panel.offsetTop : Math.round(top);
        // Written as an offset from the viewport's top ("top top-=32").
        return `top top${at < 0 ? "-=" : "+="}${Math.abs(at)}`;
      },
      end: () => `+=${last * window.innerHeight * SCROLL_PER_CARD}`,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / last,
        duration: { min: 0.15, max: 0.45 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        if (dragging.current) return;
        drivenAt.current = performance.now();
        const from = targetLeft(0);
        scroller.scrollLeft = from + (targetLeft(last) - from) * self.progress;
      },
    });
    triggerRef.current = trigger;
    ScrollTrigger.refresh();

    // The pin's scroll room pushes Section 05 (the products, with its cream
    // basin-rim curve) a long way down, so the curve would vanish for the
    // whole hold. The section draws its own copy at its foot (.first-visit
    // ::after), shaped exactly as ProductRange shapes the real rim: --rim
    // runs 1 → 0 as the edge travels from the screen's foot to its top. Once
    // the pin has finished, the real section sits right there and takes over.
    const range = section.nextElementSibling?.matches(".range")
      ? section.nextElementSibling
      : document.querySelector(".range");
    if (range) section.style.setProperty("--fv-rim-bg", getComputedStyle(range).backgroundColor);
    let frame = 0;
    const updateRim = () => {
      frame = 0;
      const bottom = section.getBoundingClientRect().bottom;
      const rim = Math.min(1, Math.max(0, bottom / window.innerHeight));
      section.style.setProperty("--fv-rim", rim.toFixed(4));
      // No rim at all when Section 05 draws none (reduced motion).
      const hasRim = !!range?.classList.contains("has-rim");
      section.toggleAttribute("data-rim-handed-over", !hasRim || trigger.progress >= 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateRim);
    };
    updateRim();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      section.style.removeProperty("--fv-rim");
      section.style.removeProperty("--fv-rim-bg");
      section.removeAttribute("data-rim-handed-over");
      trigger.kill();
      triggerRef.current = null;
      scroller.style.scrollSnapType = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length]);

  // Open on card 01, with part of card 02 in view.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = targetLeft(0);
    layoutArc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = window.matchMedia(COARSE_POINTER);
    const onChange = () => setCoarse(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    // Settled: no scrolling for a moment and no drag in progress (scrollend
    // where supported, a short quiet period everywhere else).
    let quiet = 0;
    const settle = () => {
      window.clearTimeout(quiet);
      if (dragging.current) return;
      layoutArc();
      onSettle(nearestRef.current);
      // Moved sideways by a swipe (not by the page): line the page up with
      // the nearest card, which brings that card to the centre.
      if (triggerRef.current && performance.now() - drivenAt.current > 400) {
        goTo(nearestRef.current);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), layoutArc()));
      window.clearTimeout(quiet);
      quiet = window.setTimeout(settle, 160);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("scrollend", settle);
    const resize = new ResizeObserver(() => {
      scroller.scrollLeft = targetLeft(active);
      layoutArc();
    });
    resize.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", settle);
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(quiet);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Announce the photograph once the visitor has moved the carousel.
  useEffect(() => {
    if (!interacted.current) return;
    setAnnounce(`Step ${active + 1} of ${photos.length}: ${photos[active].caption}`);
  }, [active, photos]);

  // Mouse drag (touch and trackpads use native scrolling). Snapping is paused
  // while dragging, then the nearest photograph glides to the centre.
  const drag = useRef<{ x: number; left: number; id: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const scroller = event.currentTarget;
    drag.current = { x: event.clientX, left: scroller.scrollLeft, id: event.pointerId };
    scroller.setPointerCapture(event.pointerId);
    scroller.classList.add("is-dragging");
    interacted.current = true;
    dragging.current = true;
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const scroller = event.currentTarget;
    scroller.releasePointerCapture(drag.current.id);
    drag.current = null;
    dragging.current = false;
    // Pick the nearest photograph (plus a nudge in the drag direction).
    layoutArc();
    const nearest = slides().reduce(
      (best, slide, index) =>
        Math.abs(parseFloat(slide.style.getPropertyValue("--d"))) <
        Math.abs(parseFloat(slides()[best].style.getPropertyValue("--d")))
          ? index
          : best,
      0,
    );
    goTo(nearest);
    // goTo may move the page instead of the cards; make sure the cards
    // glide back to the centre either way.
    scroller.scrollTo({ left: targetLeft(nearest), behavior: reducedMotion() ? "auto" : "smooth" });
    const restore = () => scroller.classList.remove("is-dragging");
    scroller.addEventListener("scrollend", restore, { once: true });
    window.setTimeout(restore, 700);
  };

  const counter = `${String(active + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  return (
    <div className="arc" aria-roledescription="carousel" aria-label="First visit, step by step">
      <div
        className="arc-scroller"
        ref={scrollerRef}
        // Previous / Next are the keyboard route; keep the bare scroller out of
        // the tab order (Chrome would otherwise add it without a name).
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {photos.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            // The centred card shows its title and description over the photo.
            className={`arc-slide${index === active ? " is-active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}: ${photo.caption}`}
          >
            <article className="arc-card">
              <div className="arc-photo">
                <img src={photo.src} alt={photo.alt} draggable={false} loading="lazy" />
                <span className="arc-step" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="arc-text">
                <h4>{photo.caption}</h4>
                <p>{photo.body}</p>
                {photo.links?.length ? (
                  <ul className="arc-links">
                    {photo.links.map((link) => (
                      <li key={link.label}>
                        {/* No destination yet (homepage only). */}
                        <a className="session-detail-link">
                          {link.label} <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="arc-controls">
        <span className="arc-hint">{coarse ? "Swipe to explore" : "Drag to explore"}</span>
        <button
          type="button"
          className="arc-button arc-prev"
          onClick={() => goTo(active - 1)}
          // aria-disabled (not disabled) so focus stays on the button at an end.
          aria-disabled={active === 0}
          aria-label="Previous step"
        >
          <Arrow />
        </button>
        <button
          type="button"
          className="arc-button"
          onClick={() => goTo(active + 1)}
          aria-disabled={active === photos.length - 1}
          aria-label="Next step"
        >
          <Arrow />
        </button>
        <span className="arc-counter" aria-hidden="true">
          {counter}
        </span>
        <span className="visually-hidden" aria-live="polite">
          {announce}
        </span>
      </div>
    </div>
  );
}

/* --------------------------------- Section -------------------------------- */

export function FirstVisit() {
  // The chapter of the settled card (01–03 mirror, 04–06 basin).
  const [settled, setSettled] = useState(0);
  const chapter = visitPhotos[settled].chapter;
  const id = useId();

  return (
    <section id="first-visit" className="first-visit tone-dark" aria-labelledby={`${id}-heading`}>
      <div className="first-visit-head">
        <h2 id={`${id}-heading`}>{FIRST_VISIT_HEADING}</h2>
      </div>

      <div className="first-visit-panel">
        {/* Both headings share one cell, so a change never moves the
            carousel; only the settled card's chapter is shown. */}
        <div className="first-visit-copy" aria-live="polite">
          {chapterOrder.map((key) => (
            <h3
              key={key}
              className={`visit-copy${key === chapter ? " is-active" : ""}`}
              aria-hidden={key !== chapter}
            >
              {chapters[key].title}
            </h3>
          ))}
        </div>
        <ArcCarousel photos={visitPhotos} onSettle={setSettled} />
      </div>
    </section>
  );
}
