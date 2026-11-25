/* ---------------------------------------------------------------------------
 * 10 First visit questions (storyboard frame 16)
 *
 * Warm ivory, two columns: the heading on the left, three initially collapsed
 * questions on the right, each a disclosure (APG) with a plus / minus
 * control. Rows open independently. On mobile each question spans the width.
 *
 * Collapsed answers are hidden from the accessibility tree and the tab order
 * (visibility hidden once closed). Reduced motion: rows open without the
 * height transition.
 *
 * Handover to 11: this section is the ivory panel that lifts away from the
 * olive footer on desktop; it keeps its own background and stacking context.
 * ------------------------------------------------------------------------- */
import { useId, useState } from "react";
import { FAQ_HEADING, faqs } from "@/content/faq";

export function Faq() {
  const id = useId();
  const [open, setOpen] = useState<boolean[]>(() => faqs.map(() => false));

  const toggle = (index: number) =>
    setOpen((current) => current.map((value, i) => (i === index ? !value : value)));

  return (
    <section id="questions" className="faq" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{FAQ_HEADING}</h2>
      <ul className="faq-list">
        {faqs.map((item, index) => {
          const expanded = open[index];
          const panelId = `${id}-answer-${index}`;
          return (
            <li key={item.question} className={`faq-item${expanded ? " is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className="faq-answer">
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
