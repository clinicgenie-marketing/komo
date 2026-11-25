/* ---------------------------------------------------------------------------
 * 11 Footer (storyboard frames 17–18)
 *
 * Frame 17, desktop: the footer sits still at the bottom of the viewport,
 * beneath the ivory FAQ panel (Section 10), and the panel's lower edge
 * travels up with the visitor's scroll to uncover it. Pure CSS (sticky,
 * bottom: 0, behind the panel), so the reveal follows the real heights,
 * stops wherever the visitor stops and reverses with them.
 *
 * The reveal is used only when it is safe: desktop width, motion allowed and
 * a footer that fits the viewport below the header. Otherwise (mobile, short
 * screens, enlarged text, reduced motion) the footer is in ordinary flow.
 * It sits one layer below the ivory <main>, so it is only ever uncovered
 * below the end of <main> (the FAQ panel's lower edge).
 *
 * Frame 18: ivory KOMO logo and descriptor on the left, Explore / About /
 * Visit columns on the right, legal links below a fine divider, and the
 * hero's contour sweep returning, still, at the opposite (lower-right) edge.
 * Mobile: logo and descriptor first, then the groups as disclosures, then
 * the legal links.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useRef, useState } from "react";
import { WaveCorner } from "@/components/WaveCorner";
import { FOOTER_DESCRIPTOR, FOOTER_NAME, footerGroups, legalLinks } from "@/content/footer";
import { headerHeight } from "@/lib/stage";

const COMPACT_QUERY = "(max-width: 760px)";
const REVEAL_QUERY = "(min-width: 761px) and (prefers-reduced-motion: no-preference)";

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function SiteFooter() {
  const id = useId();
  const footerRef = useRef<HTMLElement>(null);
  const compact = useMedia(COMPACT_QUERY);
  const revealAllowed = useMedia(REVEAL_QUERY);
  const [fits, setFits] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Reveal only when the whole footer fits beneath the header.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const measure = () => {
      const height = footer.offsetHeight;
      setFits(height <= window.innerHeight - headerHeight());
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const reveal = revealAllowed && fits && !compact;

  useEffect(() => {
    document.documentElement.classList.toggle("has-footer-reveal", reveal);
    return () => document.documentElement.classList.remove("has-footer-reveal");
  }, [reveal]);

  // While partly covered, a focused footer link could sit under the panel:
  // uncover the footer fully before keyboard focus lands in it.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !reveal) return;
    const onFocus = () => {
      const end = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY < end - 1) window.scrollTo({ top: end, behavior: "auto" });
    };
    footer.addEventListener("focusin", onFocus);
    return () => footer.removeEventListener("focusin", onFocus);
  }, [reveal]);

  return (
    <footer ref={footerRef} className={`site-footer${reveal ? " is-reveal" : ""}`}>
      <div className="footer-contour" aria-hidden="true">
        <WaveCorner />
      </div>

      <div className="footer-inner">
        <div className="footer-identity">
          <a className="footer-logo" href="/" aria-label={`${FOOTER_NAME}, home`}>
            <span className="footer-logo-mark" aria-hidden="true" />
          </a>
          <p>{FOOTER_DESCRIPTOR}</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {footerGroups.map((group) => {
            const listId = `${id}-${group.title}`;
            const open = !compact || Boolean(openGroups[group.title]);
            return (
              <div key={group.title} className="footer-group">
                <h2>
                  {compact ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={listId}
                      onClick={() =>
                        setOpenGroups((current) => ({
                          ...current,
                          [group.title]: !current[group.title],
                        }))
                      }
                    >
                      {group.title}
                      <span className="faq-icon" aria-hidden="true" />
                    </button>
                  ) : (
                    group.title
                  )}
                </h2>
                <ul id={listId} hidden={!open}>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <ul className="footer-legal" aria-label="Information">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
