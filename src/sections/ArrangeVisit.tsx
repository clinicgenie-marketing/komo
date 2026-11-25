/* ---------------------------------------------------------------------------
 * 09 Arrange your visit (storyboard frame 15)
 *
 * A still, soft sage booking block, at most one viewport below the header on
 * desktop: heading, intro, the "Choose your session" selector and the
 * primary Request a Visit together on the left; the editable message, Copy
 * Message, legal links and the "Still deciding?" paths on one solid, clear
 * field on the right. The ivory contour comes in from the right edge around
 * that field, its bend opening towards the CTA. Normal page flow.
 * Phones: one column, two sessions per row, and the message folded behind a
 * "Your message to Orchard" toggle (opened automatically if copying fails).
 *
 * Every visit action on the homepage points to #arrange-your-visit. A link
 * with `data-session` (Section 03) preselects that session; a general request
 * (header, Orchard in Section 07) keeps the current choice. `?session=` on the
 * page URL is honoured too, for links from other pages.
 *
 * Selecting a session only updates the local draft. WhatsApp opens only from
 * an explicit WhatsApp action. Copy Message copies the same draft that
 * Request a Visit sends; if the clipboard is unavailable, the draft is
 * selected in its field for manual copying.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Arrow } from "@/components/Arrow";
import { images } from "@/content/images";
import {
  STILL_DECIDING,
  arrangeVisit as copy,
  helpMessage,
  quoteMessage,
  sessionNames,
  visitMessage,
} from "@/content/arrangeVisit";
import {
  BOOKING_TERMS_HREF,
  PRIVACY_POLICY_HREF,
  VISIT_ANCHOR,
  VISIT_HREF,
  orchardWhatsAppHref,
} from "@/content/contact";

const CONTOUR_SRC = "/images/komo-contour.svg#lines";
const COMPACT_QUERY = "(max-width: 760px)";

function useCompact() {
  const [matches, setMatches] = useState(() => window.matchMedia(COMPACT_QUERY).matches);
  useEffect(() => {
    const list = window.matchMedia(COMPACT_QUERY);
    const onChange = () => setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);
  return matches;
}
const options = [...sessionNames, STILL_DECIDING];

/** A session name, or null for "Still deciding" / nothing chosen. */
const asSession = (choice: string | null) =>
  choice && sessionNames.includes(choice) ? choice : null;

export function ArrangeVisit() {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [draft, setDraft] = useState(() => visitMessage(null));
  const edited = useRef(false);
  const [status, setStatus] = useState("");
  // Phones fold the message away to keep the section short; desktop shows it.
  const compact = useCompact();
  const [messageOpen, setMessageOpen] = useState(false);

  // Selecting a session updates the draft. If the visitor has edited it, only
  // the session name is swapped so their wording (e.g. a preferred day) stays.
  const choiceRef = useRef<string | null>(null);
  const draftValue = useRef(draft);
  draftValue.current = draft;
  const choose = (next: string | null) => {
    const before = asSession(choiceRef.current);
    const after = asSession(next);
    choiceRef.current = next;
    const current = draftValue.current;
    let updated: string;
    if (edited.current && before && after && current.includes(before)) {
      updated = current.replace(before, after);
    } else {
      updated = visitMessage(after);
      edited.current = false;
    }
    draftValue.current = updated;
    setChoice(next);
    setDraft(updated);
    setStatus("");
  };

  // Arrival from any visit action, or a ?session= link from another page.
  useEffect(() => {
    const focusSelector = () => {
      const target =
        sectionRef.current?.querySelector<HTMLInputElement>("input[type=radio]:checked") ??
        sectionRef.current?.querySelector<HTMLInputElement>("input[type=radio]");
      target?.focus({ preventScroll: true });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>(
        `a[href="${VISIT_HREF}"]`,
      );
      if (!link) return;
      const session = link.dataset.session;
      if (session && sessionNames.includes(session)) choose(session);
      // Let the browser jump (scroll-padding-top clears the sticky header),
      // then put keyboard focus on the selector.
      requestAnimationFrame(() => requestAnimationFrame(focusSelector));
    };
    document.addEventListener("click", onClick);

    const fromUrl = new URLSearchParams(location.search).get("session");
    if (fromUrl && sessionNames.includes(fromUrl)) choose(fromUrl);

    // Landing on /#arrange-your-visit: pinned sections above add height after
    // load, so jump again once the page has settled.
    let timer = 0;
    const settleHash = () => {
      timer = window.setTimeout(() => {
        if (location.hash === VISIT_HREF) {
          document.getElementById(VISIT_ANCHOR)?.scrollIntoView();
          focusSelector();
        }
      }, 400);
    };
    if (location.hash === VISIT_HREF) {
      if (document.readyState === "complete") settleHash();
      else window.addEventListener("load", settleHash, { once: true });
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", settleHash);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Message copied.");
    } catch {
      // Show the message (folded away on phones) and select it.
      flushSync(() => setMessageOpen(true));
      const field = draftRef.current;
      field?.focus();
      field?.select();
      setStatus("Copying didn’t work. The message is selected so you can copy it yourself.");
    }
  };

  const session = asSession(choice);
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <section
      id={VISIT_ANCHOR}
      ref={sectionRef}
      className="arrange"
      aria-labelledby={`${id}-heading`}
    >
      <div className="arrange-inner">
        <div className="arrange-field">
          <h2 id={`${id}-heading`}>{copy.heading}</h2>
          <p className="arrange-lead">
            <strong>{copy.chosenLead}</strong> {copy.chosenBody}
          </p>

          <fieldset className="arrange-sessions">
            <legend>{copy.selectorLabel}</legend>
            {options.map((option) => (
              <label key={option} className={option === STILL_DECIDING ? "is-deciding" : undefined}>
                <input
                  type="radio"
                  name={`${id}-session`}
                  value={option}
                  checked={choice === option}
                  onChange={() => choose(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>

          <a
            className="session-request arrange-request"
            href={orchardWhatsAppHref(draft)}
            data-message="visit"
            {...external}
          >
            {copy.request} <Arrow />
          </a>
        </div>

        {/* Right half: a hair-care photograph under an 80% sage veil, the
            still contour, and the message panel on a clear field above. */}
        <div className="arrange-media">
          <img className="arrange-photo" src={images.arrange.procedure.src} alt="" />
          <div className="arrange-veil" aria-hidden="true" />
          <div className="arrange-contour" aria-hidden="true">
            <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" focusable="false">
              <use href={CONTOUR_SRC} />
            </svg>
          </div>
          <div className="arrange-side">
            <div className="arrange-draft">
              {compact ? (
                <button
                  type="button"
                  className="arrange-draft-toggle"
                  id={`${id}-draft-label`}
                  aria-expanded={messageOpen}
                  aria-controls={`${id}-draft-region`}
                  onClick={() => setMessageOpen((open) => !open)}
                >
                  Your message to Orchard
                  <span className="faq-icon" aria-hidden="true" />
                </button>
              ) : (
                <label htmlFor={`${id}-draft`} id={`${id}-draft-label`}>
                  Your message to Orchard
                </label>
              )}
              <div id={`${id}-draft-region`} hidden={compact && !messageOpen}>
                <textarea
                  aria-labelledby={`${id}-draft-label`}
                  id={`${id}-draft`}
                  ref={draftRef}
                  rows={4}
                  value={draft}
                  onChange={(event) => {
                    edited.current = true;
                    setDraft(event.target.value);
                    setStatus("");
                  }}
                />
              </div>
              <ul className="arrange-meta">
                <li>
                  <button type="button" className="session-detail-link" onClick={copyDraft}>
                    {copy.copy}
                  </button>
                </li>
                <li>
                  <a className="session-detail-link" href={PRIVACY_POLICY_HREF}>
                    {copy.privacy}
                  </a>
                </li>
                <li>
                  <a className="session-detail-link" href={BOOKING_TERMS_HREF}>
                    {copy.terms}
                  </a>
                </li>
              </ul>
              <p className="arrange-status" role="status">
                {status}
              </p>
            </div>

            <div className="arrange-deciding">
              <p>
                <strong>{copy.decidingLead}</strong> {copy.decidingBody}
              </p>
              <ul className="arrange-paths">
                <li>
                  <a
                    className="session-detail-link"
                    href={orchardWhatsAppHref(helpMessage())}
                    data-message="help"
                    {...external}
                  >
                    {copy.help} <Arrow />
                  </a>
                </li>
                <li>
                  <a
                    className="session-detail-link"
                    href={orchardWhatsAppHref(quoteMessage(session))}
                    data-message="quote"
                    {...external}
                  >
                    {copy.quote} <Arrow />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
