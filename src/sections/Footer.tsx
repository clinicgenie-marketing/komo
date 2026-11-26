/* ---------------------------------------------------------------------------
 * 09 Footer
 *
 * In normal flow, directly beneath Section 08, under its ivory curve.
 * Desktop: four top-aligned columns at the page margins: the KOMO
 * wordmark with "Singapore" beneath it, then Explore, About and Visit. The
 * legal links sit in one row beneath, wrapping on smaller screens. Mobile:
 * the wordmark above the groups, which stay open (each heading with its
 * links) in the order Explore, About, Visit, with comfortable tap targets.
 *
 * Parallax: as the footer scrolls into view, its content rises from behind
 * Section 08's ivory curve more slowly than the page, settling in place at
 * the foot of the page. Reduced motion: static.
 *
 * Destinations: src/content/footer.ts.
 * ------------------------------------------------------------------------- */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOOTER_NAME, FOOTER_PLACE, footerGroups, legalLinks } from "@/content/footer";

gsap.registerPlugin(ScrollTrigger);

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const inner = innerRef.current;
    if (!footer || !inner) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        inner,
        { yPercent: -35 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-inner" ref={innerRef}>
        <a className="footer-brand" href="/" aria-label={`${FOOTER_NAME}, home`}>
          <span className="wordmark footer-wordmark" aria-hidden="true" />
          <span className="footer-place" aria-hidden="true">
            {FOOTER_PLACE}
          </span>
        </a>

        <nav className="footer-nav" aria-label="Footer">
          {footerGroups.map((group) => (
            <div key={group.title} className="footer-group">
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <ul className="footer-legal" aria-label="Legal">
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
