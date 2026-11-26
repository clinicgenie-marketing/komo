/* ---------------------------------------------------------------------------
 * 05 A closer look at the products
 *
 * One continuous still of the KOMO range, the full width of the section at
 * its own landscape ratio (never cropped, so the products at both ends stay
 * in frame on phones too). The section's warm ivory matches the
 * photograph's backdrop, and the photograph's top and bottom edges feather
 * into it. Heading and the one link are centred above.
 *
 * Arrival from Section 04: the ivory rises over the olive along a shallow
 * basin-rim curve that flattens as it reaches the top of the screen
 * (scrubbed by scroll, so it reverses).
 *
 * Parallax on the photograph (scrubbed, reverses): as the section passes, it
 * drifts down inside its feathered frame, moving slower than the page so it
 * sits further back. The heading scrolls normally. The frame clips the drift
 * and feathers its edges, so the range is never cropped at the sides and its
 * foot is always in place once it is on screen.
 * Reduced motion: a straight edge and no parallax.
 *
 * The previous single-bottle scene is preserved, unmounted, for the
 * individual product page: src/sections/product-detail/.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import { productRange } from "@/content/productRange";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function ProductRange() {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [still, setStill] = useState(() => window.matchMedia(REDUCED_MOTION).matches);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setStill(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // The rim: --rim runs from 1 (a shallow curve) to 0 (flat) as the
  // section's top edge travels up the screen.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (still || !section) return;
    const tween = gsap.fromTo(
      section,
      { "--rim": 1 },
      {
        "--rim": 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      section.style.removeProperty("--rim");
    };
  }, [still]);

  // Parallax: the photograph only.
  const photoRef = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (still || !section || !photo) return;
    const ctx = gsap.context(() => {
      // From raised (only while its foot is still below the screen) to
      // lowered: level as its foot comes into view.
      gsap.fromTo(
        photo,
        { yPercent: -20 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [still]);

  const { heading, link, image, backdrop } = productRange;

  return (
    <section
      id="products"
      ref={sectionRef}
      className={`range${still ? "" : " has-rim"}`}
      aria-labelledby={`${id}-heading`}
      style={{ "--range-bg": backdrop } as CSSProperties}
    >
      <div className="range-head">
        <h2 id={`${id}-heading`}>{heading}</h2>
        <a className="session-detail-link" href={link.href}>
          {link.label} <Arrow />
        </a>
      </div>
      <div className="range-photo-frame">
        <img
          ref={photoRef}
          className="range-photo"
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
        />
      </div>
    </section>
  );
}
