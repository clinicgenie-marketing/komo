/* ---------------------------------------------------------------------------
 * 01 Hero: two photographs, then mist into Section 02 (storyboard frames 01–03)
 *
 * Arrival: hero-1 shows at once, full screen. The H1 rises a short way as it
 * fades in, then P1 beneath it. No idle motion: while the visitor pauses,
 * the scene rests.
 *
 * One scrubbed GSAP timeline over a CSS-sticky stage, tied to natural
 * scroll (reverses cleanly; the visitor can scroll on at any time):
 *   0.00–0.10  hold on hero-1 (water reaches the hairline here once a dry
 *              frame, `images.hero.dry`, is supplied)
 *   0.10–0.50  hero-1 morphs into hero-2. They are the same frame, hero-2
 *              with steam, so both share one slow zoom towards her face and
 *              stay registered while hero-2 is revealed through a soft edge
 *              rising from the basin: the steam forms and climbs through the
 *              scene. H1 and P1 fade as it passes
 *   0.52–0.60  hold on hero-2
 *   0.58–0.82  warm ivory mist rises from the basin and thickens (.hero-fog)
 *   0.70–0.84  Section 02's own heading appears in the mist, in the copy space
 *   0.84–1.00  hold; the stage releases and the mist runs straight on into
 *              the ivory section, where the heading settles
 * Each photograph sits in a `.hero-scene` box with its own proportions, sized
 * like object-fit: cover, so any overlay keeps to the same crop.
 *
 * Reduced motion: hero-1 with the H1 and P1, then hero-2, in normal flow;
 * Section 02's heading follows.
 * ------------------------------------------------------------------------- */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONCERNS_HEADING_ID } from "@/content/concerns";
import { hero } from "@/content/hero";
import { images } from "@/content/images";
import { Volume2, VolumeX } from "lucide-react";
import { setWaterfallLevel, startWaterfall, stopWaterfall } from "@/lib/waterfallSound";

/**
 * Opt-in waterfall ambience (src/lib/waterfallSound.ts). Off until the
 * visitor turns it on; once on, it is loudest in the hero and fades out as
 * the hero scrolls away (and back in on return).
 */
function SoundToggle({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Full while the hero fills the screen; fades over its last screen.
      const bottom = section.getBoundingClientRect().bottom;
      setWaterfallLevel((bottom - window.innerHeight * 0.15) / window.innerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      stopWaterfall();
    };
  }, [sectionRef]);

  return (
    <button
      type="button"
      className="hero-sound"
      aria-pressed={on}
      onClick={() => {
        if (on) stopWaterfall();
        else startWaterfall();
        setOn(!on);
      }}
    >
      {on ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      <span>{on ? "Sound on" : "Sound off"}</span>
      <span className="visually-hidden">: waterfall ambience</span>
    </button>
  );
}

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotionQuery() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* -------------------------------- Section -------------------------------- */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const still = useReducedMotionQuery();
  const dry = images.hero.dry;

  // 01.1 Arrival: H1 rises as it fades in, P1 follows beneath it.
  useLayoutEffect(() => {
    if (still) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .from(".hero-h1", { opacity: 0, y: 26, duration: 0.95, ease: "power2.out" })
        .from(".hero-lead", { opacity: 0, y: 16, duration: 0.8, ease: "power2.out" }, 0.4);
    }, sectionRef);
    return () => ctx.revert();
  }, [still]);

  // 01.2 Two photographs, then mist, scrubbed by scroll.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (still || !section) return;
    const ctx = gsap.context(() => {
      // The zoom goes on the photographs, not their scene boxes, whose
      // percentage translate positions the crop.
      const first = gsap.utils.toArray<HTMLElement>(".hero-scene-first .hero-photo", section);
      const wet = section.querySelector<HTMLElement>(".hero-photo-wet");
      const second = section.querySelector<HTMLElement>(".hero-second");
      const copy = section.querySelector<HTMLElement>(".hero-copy");
      const fog = section.querySelector<HTMLElement>(".hero-fog");
      // Section 02's heading lives in that section; this sequence reveals it.
      const heading = document.getElementById(CONCERNS_HEADING_ID);

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // Water reaches the hairline, top-down from the fixture (dry frame only).
      if (wet) tl.fromTo(wet, { "--water": "0%" }, { "--water": "130%", duration: 0.1 }, 0);

      // The morph: one shared zoom keeps both photographs registered while
      // hero-2 is revealed upward from the basin (--morph drives its mask).
      const photos = [...first, ...(second ? [second.querySelector(".hero-photo")] : [])];
      tl.to(photos, { scale: 1.06, duration: 0.4, ease: "sine.inOut" }, 0.1);
      if (second) {
        tl.set(second, { autoAlpha: 1 }, 0.12).fromTo(
          second,
          { "--morph": "0%" },
          { "--morph": "140%", duration: 0.3, ease: "sine.inOut" },
          0.12,
        );
      }

      // The opening copy gives way as hero-2 takes the screen.
      if (copy) tl.to(copy, { opacity: 0, y: -10, duration: 0.14 }, 0.22);

      // Warm ivory mist rises from the basin and thickens into the next section.
      if (fog) {
        tl.fromTo(
          fog,
          { yPercent: 45, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.24, ease: "sine.out" },
          0.58,
        );
      }

      // Section 02's heading appears in the mist, where the copy was.
      if (heading) {
        tl.fromTo(
          heading,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.14, ease: "power1.out" },
          0.7,
        );
      }
      tl.set({}, {}, 1);

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
      });
    }, section);
    return () => ctx.revert();
  }, [still]);

  const secondPhoto = (
    <div className="hero-second">
      <div className="hero-scene hero-scene-second">
        <img
          className="hero-photo"
          src={images.hero.second.src}
          alt={images.hero.second.alt}
          loading={still ? "lazy" : undefined}
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
    </div>
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`hero ${still ? "is-still" : "is-scrubbed"}`}
      aria-labelledby="hero-heading"
    >
      <div className="hero-stage">
        <div className="hero-scene hero-scene-first">
          {dry ? (
            <>
              <img className="hero-photo" src={dry.src} alt={dry.alt} fetchPriority="high" />
              <img
                className="hero-photo hero-photo-wet"
                src={images.hero.first.src}
                alt=""
                aria-hidden="true"
              />
            </>
          ) : (
            <img
              className="hero-photo"
              src={images.hero.first.src}
              alt={images.hero.first.alt}
              fetchPriority="high"
            />
          )}
        </div>
        <div className="hero-shade" aria-hidden="true" />
        {still ? null : secondPhoto}
        <div className="hero-copy">
          <h1 className="hero-h1" id="hero-heading">
            {hero.h1}
          </h1>
          <p className="hero-lead">{hero.lead}</p>
        </div>
        <SoundToggle sectionRef={sectionRef} />
        {/* Mist into Section 02. Slot for the shadcn.io Fog background. */}
        {/* data-header-mist: the header reads its dense lower part as ivory. */}
        {still ? null : <div className="hero-fog" aria-hidden="true" data-header-mist="0.6" />}
      </div>
      {/* Reduced motion: the second photograph follows in normal flow. */}
      {still ? secondPhoto : null}
    </section>
  );
}
