/* ---------------------------------------------------------------------------
 * 08 Arrange your visit
 *
 * On warm ivory, continuing Section 07, at the same page margins: the
 * invitation on the left and the booking controls on the right (stacked on
 * phones). Normal page flow; the footer follows directly beneath.
 *
 * Orchard (default): a session dropdown ("Choose a session" placeholder,
 * Signature, Advanced, Waterfall, Meridian, Help me choose), the editable
 * WhatsApp message it drafts (with Copy Message), "Message Orchard on
 * WhatsApp" with the privacy and booking terms beside it, and "Ask for a
 * single-visit quote". The message follows the selection: a general visit
 * request at the placeholder, a request for the chosen session, or a request
 * for guidance with Help me choose. If the visitor has edited it, only the
 * session name is swapped so their wording (e.g. a preferred day) stays.
 *
 * Great World / Holland Village (the outlet active in Section 06): that
 * outlet's "Ask About … Opening Details" action, with "Arrange a visit at
 * Orchard" to switch to the Orchard controls.
 *
 * Arrival: a visit link carrying `data-session` (Section 03's "Request …")
 * opens the Orchard controls with that session selected; any
 * other visit link (the header, Section 06's Orchard action) opens them at
 * the placeholder. Section 02's matches never preselect. A
 * `?session=` URL parameter is honoured for links from other pages.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { WhatsAppMark } from "@/components/WhatsAppMark";
import { Arrow } from "@/components/Arrow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HELP_ME_CHOOSE,
  arrangeVisit as copy,
  helpMessage,
  quoteMessage,
  sessionNames,
  sessionOptions,
  visitMessage,
} from "@/content/arrangeVisit";
import {
  BOOKING_TERMS_HREF,
  PRIVACY_POLICY_HREF,
  VISIT_ANCHOR,
  VISIT_HREF,
  orchardWhatsAppHref,
} from "@/content/contact";
import { outlets } from "@/content/outlets";
import { setActiveOutlet, useActiveOutlet } from "@/lib/outletChoice";

const isOption = (value: string | null | undefined): value is string =>
  Boolean(value) && sessionOptions.some((option) => option.value === value);

/** A session name, or null for the placeholder / Help me choose. */
const asSession = (choice: string) => (sessionNames.includes(choice) ? choice : null);

const draftFor = (choice: string) =>
  choice === HELP_ME_CHOOSE ? helpMessage() : visitMessage(asSession(choice));

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ArrangeVisit() {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const outlet = useActiveOutlet();
  // "" is the placeholder.
  const [choice, setChoice] = useState("");
  const [draft, setDraft] = useState(() => draftFor(""));
  const [status, setStatus] = useState("");
  const edited = useRef(false);
  const choiceRef = useRef(choice);
  const draftValue = useRef(draft);
  draftValue.current = draft;

  const choose = (next: string) => {
    const before = asSession(choiceRef.current);
    const after = asSession(next);
    choiceRef.current = next;
    const current = draftValue.current;
    let updated: string;
    if (edited.current && before && after && current.includes(before)) {
      updated = current.replace(before, after);
    } else {
      updated = draftFor(next);
      edited.current = false;
    }
    draftValue.current = updated;
    setChoice(next);
    setDraft(updated);
    setStatus("");
  };
  const chooseRef = useRef(choose);
  chooseRef.current = choose;

  // Arrival from a visit link anywhere on the page, or ?session= from
  // another page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>(
        `a[href="${VISIT_HREF}"]`,
      );
      if (!link) return;
      // Every visit request is an Orchard request.
      setActiveOutlet("orchard");
      const session = link.dataset.session;
      chooseRef.current(isOption(session) ? session : "");
      // Let the browser jump (scroll-padding-top clears the header), then
      // put keyboard focus on the dropdown.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => selectRef.current?.focus({ preventScroll: true })),
      );
    };
    document.addEventListener("click", onClick);

    const fromUrl = new URLSearchParams(location.search).get("session");
    if (isOption(fromUrl)) chooseRef.current(fromUrl);

    // Landing on /#arrange-your-visit: sections above add height after load,
    // so jump again once the page has settled.
    let timer = 0;
    const settleHash = () => {
      timer = window.setTimeout(() => {
        if (location.hash === VISIT_HREF) {
          document.getElementById(VISIT_ANCHOR)?.scrollIntoView();
          selectRef.current?.focus({ preventScroll: true });
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
  }, []);

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Message copied.");
    } catch {
      draftRef.current?.focus();
      draftRef.current?.select();
      setStatus("Copying didn’t work. The message is selected so you can copy it yourself.");
    }
  };

  const session = asSession(choice);
  const other = outlet === "orchard" ? null : outlets.find((item) => item.id === outlet);

  return (
    <section
      id={VISIT_ANCHOR}
      ref={sectionRef}
      className="arrange"
      aria-labelledby={`${id}-heading`}
    >
      <div className="arrange-invite">
        <h2 id={`${id}-heading`} className="arrange-heading">
          {copy.heading}
        </h2>
        <p className="arrange-intro">{copy.intro}</p>
      </div>

      <div className="arrange-controls">
        {other ? (
          // Great World or Holland Village, as chosen in Section 06.
          <div className="arrange-outlet">
            <h3>{other.name}</h3>
            <p>{other.text}</p>
            <ul className="arrange-actions">
              {other.actions.map((action) => (
                <li key={action.label}>
                  <a
                    className={
                      action.primary ? "arrange-button" : "arrange-button arrange-button--outline"
                    }
                    href={action.href}
                    {...(action.external ? external : {})}
                  >
                    {action.label} <Arrow />
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="arrange-button arrange-button--outline"
                  onClick={() => {
                    setActiveOutlet("orchard");
                    requestAnimationFrame(() => selectRef.current?.focus());
                  }}
                >
                  {copy.orchardInstead} <Arrow />
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <div className="arrange-field">
              <label id={`${id}-session-label`} htmlFor={`${id}-session`}>
                {copy.selectorLabel}
              </label>
              {/* shadcn Select (Radix): keyboard and screen-reader support built
                  in; "" shows the placeholder. */}
              <Select value={choice} onValueChange={choose}>
                <SelectTrigger
                  id={`${id}-session`}
                  ref={selectRef}
                  aria-labelledby={`${id}-session-label`}
                  className="arrange-control arrange-trigger"
                >
                  <SelectValue placeholder={copy.placeholder} />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6} className="arrange-menu">
                  {sessionOptions.map((option) => (
                    <div key={option.value}>
                      {option.value === HELP_ME_CHOOSE ? <SelectSeparator /> : null}
                      <SelectItem value={option.value} className="arrange-option">
                        {option.label}
                      </SelectItem>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="arrange-field">
              <label htmlFor={`${id}-draft`}>{copy.draftLabel}</label>
              <textarea
                className="arrange-control"
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
              <div className="arrange-draft-meta">
                <button type="button" className="arrange-chip" onClick={copyDraft}>
                  {status === "Message copied." ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                  {copy.copy}
                </button>
                <p className="arrange-status" role="status">
                  {status}
                </p>
              </div>
            </div>

            <div className="arrange-primary">
              <a className="arrange-button" href={orchardWhatsAppHref(draft)} {...external}>
                <WhatsAppMark />
                {copy.primary}
              </a>
              <p className="arrange-confirm">{copy.confirm}</p>
            </div>
          </>
        )}
      </div>

      {/* Left column on wide screens (under the heading, level with the
          form's foot); after the form when stacked. */}
      {other ? null : (
        <div className="arrange-aside">
          <a
            className="arrange-button arrange-button--outline"
            href={orchardWhatsAppHref(quoteMessage(session))}
            {...external}
          >
            {copy.quote} <Arrow />
          </a>
          <p className="arrange-legal">
            <a href={PRIVACY_POLICY_HREF}>{copy.privacy}</a>
            <span aria-hidden="true"> · </span>
            <a href={BOOKING_TERMS_HREF}>{copy.terms}</a>
          </p>
        </div>
      )}
    </section>
  );
}
