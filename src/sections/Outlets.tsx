/* ---------------------------------------------------------------------------
 * 06 Visit KOMO
 *
 * "Visit KOMO" centred above one full-width outlet photograph, with the
 * location selector (Orchard, Great World, Holland Village) in one row on
 * warm ivory directly beneath it. Orchard is selected on arrival. A shallow
 * ivory curve rises from the selector into the photograph above the active
 * outlet; selecting another outlet moves the curve to it and crossfades to
 * that outlet's photograph inside the same frame, while the details and
 * actions below update together. The frame and the selector have fixed
 * sizes, so nothing on the page moves.
 *
 * The section scrolls normally (no pinning). Keyboard: APG tabs, with arrow
 * keys, Home and End. Reduced motion: every change is immediate.
 * ------------------------------------------------------------------------- */
import { useId, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { Arrow } from "@/components/Arrow";
import { OUTLETS_HEADING, outlets, type OutletId } from "@/content/outlets";
import { setActiveOutlet, useActiveOutlet } from "@/lib/outletChoice";

export function Outlets() {
  const id = useId();
  const panelId = `${id}-panel`;
  // Shared with Section 08, which shows the selected outlet's own action.
  const selected = useActiveOutlet();
  const setSelected = setActiveOutlet;
  const tabRefs = useRef<Partial<Record<OutletId, HTMLButtonElement | null>>>({});
  const index = outlets.findIndex((outlet) => outlet.id === selected);

  // APG tabs (horizontal): arrows, Home and End move and select.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = outlets.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    const outletId = outlets[next].id;
    setSelected(outletId);
    tabRefs.current[outletId]?.focus();
  };

  return (
    <section
      id="visit"
      className="outlets"
      aria-labelledby={`${id}-heading`}
      style={{ "--active": index, "--count": outlets.length } as CSSProperties}
    >
      <h2 id={`${id}-heading`} className="outlets-heading">
        {OUTLETS_HEADING}
      </h2>

      {/* One frame; every outlet's photograph (or field) sits in it and the
          selected one fades in over the others. */}
      <div className="outlet-frame">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className={`outlet-view outlet-view--${outlet.id}`}
            data-active={outlet.id === selected || undefined}
            aria-hidden={outlet.id !== selected}
          >
            {outlet.photo ? (
              <img
                src={outlet.photo.src}
                alt={outlet.photo.alt}
                loading={outlet.id === "orchard" ? undefined : "lazy"}
              />
            ) : (
              <span className="outlet-view-name">{outlet.name}</span>
            )}
          </div>
        ))}
        {/* The shallow curve rising into the photograph above the active
            outlet. */}
        <span className="outlet-rim" aria-hidden="true" />
      </div>

      <div className="outlet-tabs" role="tablist" aria-label="Outlets">
        {outlets.map((outlet) => (
          <button
            key={outlet.id}
            ref={(node) => {
              tabRefs.current[outlet.id] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${outlet.id}`}
            className="outlet-tab"
            aria-selected={selected === outlet.id}
            aria-controls={panelId}
            tabIndex={selected === outlet.id ? 0 : -1}
            onClick={() => setSelected(outlet.id)}
            onKeyDown={onTabKey}
          >
            {outlet.name}
          </button>
        ))}
      </div>

      {/* All three share one cell sized by the tallest, so a change never
          moves the page; only the selected one is shown and exposed. */}
      <div className="outlet-details">
        {outlets.map((outlet) => {
          const active = outlet.id === selected;
          return (
            <div
              key={outlet.id}
              className="outlet-detail"
              data-active={active || undefined}
              {...(active
                ? { id: panelId, role: "tabpanel", "aria-labelledby": `${id}-tab-${outlet.id}` }
                : { "aria-hidden": true, inert: true })}
            >
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
          );
        })}
      </div>
    </section>
  );
}
