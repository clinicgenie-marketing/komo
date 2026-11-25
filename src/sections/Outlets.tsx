/* ---------------------------------------------------------------------------
 * 07 Visit KOMO (storyboard frame 13)
 *
 * One viewport-high scene: the open outlet panel on the left, three narrow
 * full-height tabs at the right edge (Orchard, Great World, Holland Village)
 * with vertical names on solid fields. Orchard is open on entry.
 *
 * Selecting a tab slides that outlet's panel out from the tab rail across the
 * viewing area, over the panel already open. One state (`layers`, whose top
 * entry is the selected outlet) drives the tab highlight, photograph, copy and
 * actions. Each selection adds a new layer on top, so rapid switching never
 * leaves a gap: earlier layers stay underneath until the newest has settled,
 * then they are dropped. Only the top layer is exposed (tabpanel); the others
 * are inert, so their links stay out of the tab order.
 *
 * The contour artwork is one wide composition. Every panel holds the same
 * composition, offset so it shows its own crop, and counter-moves while the
 * panel slides, so the lines stay still and the moving edge reveals them.
 *
 * The section is not pinned; vertical scrolling passes straight through.
 * Reduced motion: the selected panel replaces the previous one directly.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Arrow } from "@/components/Arrow";
import { OUTLETS_HEADING, outlets, type Outlet, type OutletId } from "@/content/outlets";

const CONTOUR_SRC = "/images/komo-contour.svg#lines";
const SLIDE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };

type Layer = { id: OutletId; key: number };

function OutletPanel({
  outlet,
  index,
  isTop,
  instant,
  panelId,
  labelledBy,
  onSettled,
}: {
  outlet: Outlet;
  index: number;
  isTop: boolean;
  instant: boolean;
  panelId: string;
  labelledBy: string;
  onSettled: () => void;
}) {
  // 0 = tucked behind the tab rail, 1 = fully open.
  const progress = useMotionValue(instant ? 1 : 0);
  const x = useTransform(progress, (p) => `${(1 - p) * 100}%`);
  const counterX = useTransform(progress, (p) => `${-(1 - p) * 100}%`);
  const settled = useRef(onSettled);
  settled.current = onSettled;

  useEffect(() => {
    if (instant) {
      settled.current();
      return;
    }
    const controls = animate(progress, 1, { ...SLIDE, onComplete: () => settled.current() });
    return () => controls.stop();
  }, [instant, progress]);

  return (
    <motion.div
      className={`outlet-panel outlet-panel--${outlet.id}`}
      style={{ x }}
      {...(isTop
        ? { id: panelId, role: "tabpanel", "aria-labelledby": labelledBy }
        : { "aria-hidden": true, inert: true })}
    >
      <div className="outlet-visual">
        {outlet.photo ? (
          <img className="outlet-photo" src={outlet.photo.src} alt={outlet.photo.alt} />
        ) : null}
        {/* Counter-moves with the slide so the lines hold still. */}
        <motion.div className="outlet-contour" style={{ x: counterX }} aria-hidden="true">
          <svg
            viewBox="0 0 600 400"
            preserveAspectRatio="xMinYMin slice"
            focusable="false"
            style={{ left: `${-index * 40}%` }}
          >
            <use href={CONTOUR_SRC} />
          </svg>
        </motion.div>
      </div>

      <div className="outlet-field">
        <h3>{outlet.name}</h3>
        <p>{outlet.text}</p>
        <ul className="outlet-actions">
          {outlet.actions.map((action) => (
            <li key={action.label}>
              <a
                className={action.primary ? "session-request" : "session-detail-link"}
                href={action.href}
                {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {action.label} <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Outlets() {
  const id = useId();
  const panelId = `${id}-panel`;
  const reduceMotion = useReducedMotion();
  const counter = useRef(0);
  const [layers, setLayers] = useState<Layer[]>([{ id: "orchard", key: 0 }]);
  const tabRefs = useRef<Partial<Record<OutletId, HTMLButtonElement | null>>>({});

  const selected = layers[layers.length - 1].id;

  const select = (outletId: OutletId) => {
    setLayers((current) =>
      current[current.length - 1].id === outletId
        ? current
        : [...current, { id: outletId, key: ++counter.current }],
    );
  };

  // Once the top layer has fully opened, the ones beneath are hidden: drop them.
  const settle = (key: number) =>
    setLayers((current) =>
      current[current.length - 1].key === key && current.length > 1
        ? [current[current.length - 1]]
        : current,
    );

  // APG tabs (vertical): arrows, Home and End move and select.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = outlets.findIndex((outlet) => outlet.id === selected);
    const last = outlets.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = index === last ? 0 : index + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    const outletId = outlets[next].id;
    select(outletId);
    tabRefs.current[outletId]?.focus();
  };

  return (
    <section id="visit" className="outlets" aria-labelledby={`${id}-heading`}>
      <div className="outlets-stage">
        {/* Reading order: heading, tabs, then the open panel. */}
        <h2 id={`${id}-heading`} className="outlets-heading">
          {OUTLETS_HEADING}
        </h2>

        <div
          className="outlet-tabs"
          role="tablist"
          aria-label="Outlets"
          aria-orientation="vertical"
        >
          {outlets.map((outlet) => (
            <button
              key={outlet.id}
              ref={(node) => {
                tabRefs.current[outlet.id] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${outlet.id}`}
              className={`outlet-tab outlet-tab--${outlet.id}`}
              aria-selected={selected === outlet.id}
              aria-controls={panelId}
              tabIndex={selected === outlet.id ? 0 : -1}
              onClick={() => select(outlet.id)}
              onKeyDown={onTabKey}
            >
              <span>{outlet.name}</span>
            </button>
          ))}
        </div>
        <div className="outlets-view">
          {layers.map((layer, position) => {
            const index = outlets.findIndex((outlet) => outlet.id === layer.id);
            return (
              <OutletPanel
                key={layer.key}
                outlet={outlets[index]}
                index={index}
                isTop={position === layers.length - 1}
                instant={layer.key === 0 || Boolean(reduceMotion)}
                panelId={panelId}
                labelledBy={`${id}-tab-${layer.id}`}
                onSettled={() => settle(layer.key)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
