/* ---------------------------------------------------------------------------
 * 02 What brings you in? Three salon mirrors (storyboard 02.1–02.4).
 *
 * After Section 01's scroll sequence the section overlaps the hero's last
 * viewport (see `.hero.is-scrubbed + .concerns` in index.css). Its one <h2>
 * is sticky to the hero's copy line, so Section 01 can reveal it in the space
 * the hero copy held, in the hero's rising ivory mist; it then holds while
 * the mist runs on into the ivory section and settles at its top in normal
 * flow.
 *
 * Each mirror: the glass (.mirror-card: photograph, ivory veil, a hover
 * sweep and the inset outline, arched and notched) and, above it, the
 * content in reading order: concern icon, first-person headline, supporting
 * copy, then the action link(s). The upper arch stays clear for the
 * photograph; the icon starts at the same height in every mirror and the
 * headline never moves, because the revealed copy and links always keep
 * their space.
 *
 * Reveal: mouse hover (with one soft highlight sweeping across the glass),
 * keyboard focus inside the mirror, the expand button in the lower-right
 * cut-out, or on touch a first tap anywhere on the mirror. Copy fades in
 * from ~150 ms, links from ~300 ms. The mirror stays open while the pointer
 * or focus is inside it. Opening is a preview only: just the explicit
 * actions (`matches`) set Section 03's matches. Hover effects live on
 * inner layers, so the 02 → 03 zoom (MirrorHandover), which moves and fades
 * the whole <li>, is untouched.
 *
 * Reduced motion: no overlap; the heading sits in normal page flow and every
 * mirror shows its details from the start, with no sweep.
 * ------------------------------------------------------------------------- */
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Arrow } from "@/components/Arrow";
import {
  CONCERNS_HEADING,
  CONCERNS_HEADING_ID,
  type Mirror,
  type MirrorAction,
  mirrors,
} from "@/content/concerns";
import { sessions } from "@/content/sessions";
import { chooseSessions, subscribeSessionMatches } from "@/lib/sessionMatch";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function MirrorActionLink({ action }: { action: MirrorAction }) {
  const { matches } = action;
  if (matches !== undefined) {
    return (
      <button type="button" className="mirror-action" onClick={() => chooseSessions(matches)}>
        {action.label} <Arrow />
      </button>
    );
  }
  // No destination yet (homepage only): shown as a link without an href.
  return (
    <a className="mirror-action" href={action.href}>
      {action.label} <Arrow />
    </a>
  );
}

function MirrorReflection({ mirror }: { mirror: Mirror }) {
  const session = sessions.find((item) => item.name === mirror.reflects);
  if (!session) return null;
  const image = mirror.image ?? session.image;
  const focus = (mirror.image ? mirror.focus : session.focus) ?? "50% 50%";
  return (
    <>
      <img
        className="mirror-reflection"
        src={image.src}
        alt=""
        style={{ objectPosition: focus }}
      />
      <div className="mirror-veil" aria-hidden="true" />
    </>
  );
}

function MirrorCard({ mirror, still }: { mirror: Mirror; still: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(still);
  const open = still || pinned || hovered || focused;
  const detailsId = `mirror-${mirror.id}-details`;
  return (
    <li
      className="mirror"
      data-open={open || undefined}
      data-hover={(hovered && !still) || undefined}
      data-still={still || undefined}
      // Mouse only: touch opens with a first tap instead. Opens on real
      // pointer movement, not on enter: scrolling carries the mirrors under a
      // resting pointer (the middle one, under a centred cursor), which would
      // open it unseen mid-scroll so the reveal never plays on arrival.
      onPointerMove={(event) => event.pointerType === "mouse" && !hovered && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      // Touch (or a click before any hover): a first tap anywhere on the
      // mirror opens it; the links only take taps once they are shown.
      onClick={(event) => {
        if (open || (event.target as Element).closest("a, button")) return;
        setPinned(true);
      }}
      // Keyboard focus inside the mirror keeps it open.
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {/* The glass: arched, notched, clipped. The handover zoom
          (MirrorHandover) starts from its reflection. */}
      <div className="mirror-card mirror-face">
        <MirrorReflection mirror={mirror} />
        <span className="mirror-sweep" aria-hidden="true" />
      </div>

      <div className="mirror-content">
        <img className="mirror-icon" src={mirror.icon} alt="" width={36} height={36} />
        <h3 className="mirror-label">{mirror.label}</h3>
        {/* In the lower-right cut-out; before the details in tab order, so
            Tab goes button → links. */}
        <button
          type="button"
          className="mirror-toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`More about: ${mirror.label}`}
          onClick={() => {
            if (still) return;
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
          <Plus aria-hidden="true" className="mirror-toggle-icon" />
        </button>
        <div className="mirror-details" id={detailsId}>
          <div className="mirror-details-inner">
            <p className="mirror-copy">{mirror.body}</p>
            <div className="mirror-actions">
              {mirror.actions.map((action) => (
                <MirrorActionLink key={action.label} action={action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Scroll lock: once the section fills the screen (its foot at the viewport's
 * foot), scrolling further down stops until the visitor clicks an option:
 * one of the three concerns, or an action inside one. That unlocks for good.
 * Scrolling up always works.
 *
 * A few ways past it skip the lock only while the visitor is below the
 * section: following an in-page link (header menu, booking), keyboard focus
 * moving to something further down, or arriving below it (a #link, scroll
 * restoration). Back above the section, the lock is armed again until an
 * option is clicked.
 */
function useScrollLock(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let chosen = false;
    let skipped = false;
    let lastY: number | null = null;
    const lockY = () =>
      section.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    const locked = () => !chosen && !skipped;
    const atLock = () => locked() && window.scrollY >= lockY() - 1;

    const choose = () => {
      chosen = true;
    };
    const skip = () => {
      skipped = true;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const limit = lockY();
      // Above the section again: a skip no longer applies.
      if (skipped && y < limit - 2) skipped = false;
      // The first reading (often scroll restoration) only records where we
      // are; after that, a scroll that crosses the lock from above is held.
      if (lastY !== null && locked() && lastY <= limit + 2 && y > limit + 1) {
        window.scrollTo({ top: limit, behavior: "instant" });
      } else if (lastY === null && y > limit + 2) {
        skipped = true;
      }
      lastY = window.scrollY;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0 && atLock()) event.preventDefault();
    };
    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      // Finger moving up = page scrolling down.
      if (y < touchY && atLock()) event.preventDefault();
    };
    const DOWN_KEYS = new Set(["ArrowDown", "PageDown", "End", " ", "Spacebar"]);
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable], [role=listbox]")) return;
      if (DOWN_KEYS.has(event.key) && !event.shiftKey && atLock()) event.preventDefault();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      // An option: a concern (its label) or an action inside a mirror.
      if (target?.closest(".mirror, .mirror-action")) {
        if (section.contains(target)) choose();
        return;
      }
      const link = target?.closest?.("a[href^='#']");
      if (link && !section.contains(link)) skip();
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      if (
        !section.contains(target) &&
        section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        skip();
      }
    };
    const unsubscribe = subscribeSessionMatches(choose);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", skip);
    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("hashchange", skip);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn);
      unsubscribe();
    };
  }, [sectionRef]);
}

export function Concerns() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollLock(sectionRef);

  const [still, setStill] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setStill(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      id="concerns"
      ref={sectionRef}
      className="concerns"
      aria-labelledby={CONCERNS_HEADING_ID}
      // The header stays a solid bar over the misted mirror photographs.
      data-header-solid
    >
      <div className="concerns-ivory" aria-hidden="true" />
      {/* Covers the hero's last viewport while the heading is revealed. */}
      <div className="concerns-overlap" aria-hidden="true" />
      <h2 className="concerns-heading" id={CONCERNS_HEADING_ID}>
        {CONCERNS_HEADING}
      </h2>
      <ul className="mirrors">
        {mirrors.map((mirror) => (
          <MirrorCard key={mirror.id} mirror={mirror} still={still} />
        ))}
      </ul>
    </section>
  );
}
