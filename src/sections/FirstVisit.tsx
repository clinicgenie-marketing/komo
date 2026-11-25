/* ---------------------------------------------------------------------------
 * 05 What happens on a first visit? (storyboard frames 08–09)
 *
 * Mirror / Basin is a two-tab toggle (Mirror selected on entry). Each setting
 * keeps its copy, links and photographs together; only the toggle changes the
 * setting.
 *
 * The photographs sit on a shallow arc in a native horizontal scroller with
 * scroll snapping: touch swipes and trackpads scroll it natively (vertical
 * gestures keep scrolling the page), a mouse can drag it, and Previous / Next
 * buttons reach every photograph. Each slide's distance from the centre sets
 * its lift and tilt, so a photograph follows the curve and settles upright
 * as it reaches the centre. Nothing moves until the visitor interacts.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Arrow } from "@/components/Arrow";
import {
  FIRST_VISIT_HEADING,
  settingOrder,
  settings,
  type VisitPhoto,
  type VisitSetting,
} from "@/content/firstVisit";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------ Arc carousel ----------------------------- */

function ArcCarousel({
  photos,
  setting,
  label,
}: {
  photos: VisitPhoto[];
  setting: VisitSetting;
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const interacted = useRef(false);

  const slides = () =>
    Array.from(scrollerRef.current?.querySelectorAll<HTMLElement>(".arc-slide") ?? []);

  // Position every slide on the arc from its distance to the centre.
  const layoutArc = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const centre = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;
    slides().forEach((slide, index) => {
      const step = slide.offsetWidth + parseFloat(getComputedStyle(scroller).columnGap || "0");
      const raw = (slide.offsetLeft + slide.offsetWidth / 2 - centre) / step;
      const d = Math.max(-2.5, Math.min(2.5, raw));
      slide.style.setProperty("--d", d.toFixed(4));
      slide.style.setProperty("--d2", (d * d).toFixed(4));
      if (Math.abs(raw) < nearestDistance) {
        nearestDistance = Math.abs(raw);
        nearest = index;
      }
    });
    setActive(nearest);
  };

  const targetLeft = (index: number) => {
    const scroller = scrollerRef.current;
    const slide = slides()[index];
    if (!scroller || !slide) return 0;
    return slide.offsetLeft + slide.offsetWidth / 2 - scroller.clientWidth / 2;
  };

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(photos.length - 1, index));
    interacted.current = true;
    scroller.scrollTo({ left: targetLeft(clamped), behavior: reducedMotion() ? "auto" : "smooth" });
  };

  // A new setting starts at its first photograph, without moving the page.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = targetLeft(0);
    layoutArc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), layoutArc()));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const resize = new ResizeObserver(() => {
      scroller.scrollLeft = targetLeft(active);
      layoutArc();
    });
    resize.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Announce the photograph once the visitor has moved the carousel.
  useEffect(() => {
    if (!interacted.current) return;
    setAnnounce(`${label} photo ${active + 1} of ${photos.length}: ${photos[active].caption}`);
  }, [active, label, photos]);

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
    // Pick the nearest photograph (plus a nudge in the drag direction).
    layoutArc();
    const target = targetLeft(
      slides().reduce(
        (best, slide, index) =>
          Math.abs(parseFloat(slide.style.getPropertyValue("--d"))) <
          Math.abs(parseFloat(slides()[best].style.getPropertyValue("--d")))
            ? index
            : best,
        0,
      ),
    );
    scroller.scrollTo({ left: target, behavior: reducedMotion() ? "auto" : "smooth" });
    const restore = () => scroller.classList.remove("is-dragging");
    scroller.addEventListener("scrollend", restore, { once: true });
    window.setTimeout(restore, 700);
  };

  const counter = `${String(active + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  return (
    <div className="arc" aria-roledescription="carousel" aria-label={`${label} photographs`}>
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
            key={`${setting}-${photo.src}-${index}`}
            className="arc-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}: ${photo.caption}`}
          >
            <figure className="arc-card">
              <img src={photo.src} alt={photo.alt} draggable={false} loading="lazy" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          </div>
        ))}
      </div>

      <div className="arc-controls">
        <button
          type="button"
          className="arc-button arc-prev"
          onClick={() => goTo(active - 1)}
          // aria-disabled (not disabled) so focus stays on the button at an end.
          aria-disabled={active === 0}
          aria-label="Previous photograph"
        >
          <Arrow />
        </button>
        <button
          type="button"
          className="arc-button"
          onClick={() => goTo(active + 1)}
          aria-disabled={active === photos.length - 1}
          aria-label="Next photograph"
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
  const [setting, setSetting] = useState<VisitSetting>("mirror");
  const tabRefs = useRef<Record<VisitSetting, HTMLButtonElement | null>>({
    mirror: null,
    basin: null,
  });
  const id = useId();
  const panelId = `${id}-panel`;

  // APG tabs: arrow keys move between Mirror and Basin and select them.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = settingOrder.indexOf(setting);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % settingOrder.length;
    if (event.key === "ArrowLeft") next = (index - 1 + settingOrder.length) % settingOrder.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = settingOrder.length - 1;
    if (next === null) return;
    event.preventDefault();
    const key = settingOrder[next];
    setSetting(key);
    tabRefs.current[key]?.focus();
  };

  const current = settings[setting];

  return (
    <section id="first-visit" className="first-visit tone-dark" aria-labelledby={`${id}-heading`}>
      <div className="first-visit-head">
        <div className="first-visit-intro">
          <h2 id={`${id}-heading`}>{FIRST_VISIT_HEADING}</h2>
          <div className="visit-toggle" role="tablist" aria-label="Where in the visit">
            {settingOrder.map((key) => (
              <button
                key={key}
                ref={(node) => {
                  tabRefs.current[key] = node;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${key}`}
                aria-selected={setting === key}
                aria-controls={panelId}
                tabIndex={setting === key ? 0 : -1}
                onClick={() => setSetting(key)}
                onKeyDown={onTabKey}
              >
                {settings[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${setting}`}
        className="first-visit-panel"
      >
        {/* Both settings' copy share one cell, so switching never shifts the
            carousel below; only the selected one is visible. */}
        <div className="first-visit-copy">
          {settingOrder.map((key) => {
            const item = settings[key];
            const visibleLinks = item.links.filter((link) => link.href);
            return (
              <div
                key={key}
                className={`visit-copy${key === setting ? " is-active" : ""}`}
                aria-hidden={key !== setting}
                inert={key !== setting}
              >
                <p>
                  <strong>{item.title}</strong> {item.body}
                </p>
                {visibleLinks.length ? (
                  <ul className="visit-links">
                    {visibleLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          className="session-detail-link"
                          href={link.href ?? undefined}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label} <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
        <ArcCarousel photos={current.photos} setting={setting} label={current.label} />
      </div>
    </section>
  );
}
