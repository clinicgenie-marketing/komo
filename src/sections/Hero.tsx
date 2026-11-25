/* ---------------------------------------------------------------------------
 * 02 Hero (storyboard frames 01–04), preceded by the intro loader.
 *
 * Intro (owner's direction): an ivory panel covers the page while the KOMO
 * contour draws in and photo 1 decodes; the panel then lifts away (the drawn
 * lines ride with it, still) to uncover the hero. Reduced motion skips it.
 *
 * Pinned scene, one scrubbed GSAP timeline:
 *   first    frame 01: photo 1 full-screen, the page's only H1, still contour
 *   rise     frame 02: photo 2 rises into view in a rounded box
 *   copy     frame 03: photo 2 fills the screen; lead upper left, support
 *            lower right, Compare the Sessions lower left
 *   square   frame 04: photo 2 contracts to the session square, centred, with
 *            the sage field and contour around it
 * When 03 is pinned too, the hero overlaps its intro frame (negative margin)
 * and hides at release; 03's intro starts with the same photo in the same
 * square and cross-fades it into the stone "01/04" square in place.
 *
 * Flow layout (narrow, short, reduced motion): photo 1 with the H1, then
 * photo 2 with the copy and CTA, in reading order.
 * ------------------------------------------------------------------------- */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import { WaveCorner } from "@/components/WaveCorner";
import { hero } from "@/content/hero";
import { images } from "@/content/images";
import { PIN_QUERY, STAGE_CHANGE_EVENT, headerHeight, squareMetrics } from "@/lib/stage";

gsap.registerPlugin(ScrollTrigger);

const CONTOUR_FILE = "/images/komo-contour.svg";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------ Intro loader ----------------------------- */

function IntroLoader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[] | null>(null);

  // Lock scrolling for the length of the intro.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // The contour paths come from the same asset as every other placement.
  useEffect(() => {
    let cancelled = false;
    fetch(CONTOUR_FILE)
      .then((response) => response.text())
      .then((svg) => {
        if (!cancelled) setPaths([...svg.matchAll(/ d="([^"]+)"/g)].map((match) => match[1]));
      })
      .catch(() => !cancelled && onDone());
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !paths) return;

    // Photo 1 must be decoded before it is uncovered; never wait more than 4s.
    const photo = new Image();
    photo.src = images.hero.first.src;
    const photoReady = Promise.race([
      photo.decode().catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
    new Image().src = images.hero.second.src;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGPathElement>("path", root);
      gsap
        .timeline()
        .fromTo(
          lines,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.035 },
        )
        .call(() => {
          photoReady.then(() => {
            gsap
              .timeline({ onComplete: onDone })
              // The panel lifts away, uncovering the hero; its lines stay still.
              .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power3.inOut" })
              // The hero sits outside this context's scope, so target it directly.
              .from(
                document.querySelectorAll(".hero-first-photo"),
                { scale: 1.08, duration: 1.6, ease: "power2.out" },
                0,
              )
              .from(
                document.querySelectorAll(".hero-h1"),
                { opacity: 0, y: 28, duration: 0.9, ease: "power2.out" },
                0.45,
              );
          });
        });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths]);

  // Portalled to <body> so it covers the fixed header as well.
  return createPortal(
    <div className="intro-loader" ref={rootRef} aria-hidden="true">
      {paths ? (
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" focusable="false">
          {paths.map((d, index) => (
            <path key={index} d={d} pathLength={1} strokeDasharray="1 1" />
          ))}
        </svg>
      ) : null}
    </div>,
    document.body,
  );
}

/* ------------------------------ Shared parts ----------------------------- */

function FirstPanel() {
  return (
    <div className="hero-first" data-header-tone="light">
      <img
        className="hero-first-photo"
        src={images.hero.first.src}
        alt={images.hero.first.alt}
        fetchPriority="high"
      />
      <div className="hero-first-shade" aria-hidden="true" />
      {/* The broad sweep enters from the corner opposite the headline. */}
      <div className="hero-corner" aria-hidden="true">
        <WaveCorner />
      </div>
      <h1 className="hero-h1" id="hero-heading">
        {hero.h1}
      </h1>
    </div>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="hero-lead">{hero.lead}</p>
      <p className="hero-support">{hero.support}</p>
      <a className="hero-cta" href={hero.cta.href}>
        {hero.cta.label} <Arrow />
      </a>
    </>
  );
}

/* ------------------------------ Pinned scene ----------------------------- */

function PinnedHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [rebuild, setRebuild] = useState(0);

  useEffect(() => {
    const bump = () => setRebuild((value) => value + 1);
    window.addEventListener(STAGE_CHANGE_EVENT, bump);
    return () => window.removeEventListener(STAGE_CHANGE_EVENT, bump);
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const first = stage.querySelector<HTMLElement>(".hero-first");
      const second = stage.querySelector<HTMLElement>(".hero-second");
      const copy = stage.querySelector<HTMLElement>(".hero-copy");
      const copyParts = gsap.utils.toArray<HTMLElement>(".hero-copy > *", stage);

      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;
      // The photo layers extend up behind the transparent header by its
      // height, so boxes are centred in the stage below that band.
      const box = (width: number, height: number, radius: number) => {
        const x = Math.max(0, (W() - width) / 2);
        const y = Math.max(0, (H() - height) / 2);
        return `inset(${y + headerHeight()}px ${x}px ${y}px ${x}px round ${radius}px)`;
      };
      // Frame 02: the box that rises into the first composition.
      const riseBox = () => box(Math.min(W() * 0.24, 380), Math.min(H() * 0.34, 320), 24);
      // Fills the stage and the band behind the header.
      const fullFrame = () => "inset(0px 0px 0px 0px round 0px)";
      const square = () => {
        const { size, radius } = squareMetrics();
        return box(size, size, radius);
      };

      // Overlap only when 03 is pinned and ready to take over in place.
      const handsOver = Boolean(document.querySelector(".sessions.is-pinned"));

      gsap.set(second, { clipPath: riseBox, y: () => H() * 0.72 });
      gsap.set(copy, { autoAlpha: 0 });
      gsap.set(copyParts, { y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.addLabel("first")
        .to({}, { duration: 0.8 })
        .to(second, { y: 0, duration: 1, ease: "power2.out" })
        .addLabel("rise")
        .to(second, { clipPath: fullFrame, duration: 1.2, ease: "power2.inOut" })
        // Photo 1 is fully covered now; the sage field beneath takes its place.
        .set(first, { autoAlpha: 0 })
        .to(copy, { autoAlpha: 1, duration: 0.35 })
        .to(copyParts, { y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "<")
        .to({}, { duration: 0.6 })
        .addLabel("copy")
        .to({}, { duration: 0.6 })
        .to(copy, { autoAlpha: 0, duration: 0.4 })
        .to(second, { clipPath: square, duration: 1.2, ease: "power2.inOut" })
        .addLabel("square")
        .to({}, { duration: 0.3 });

      ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        pin: true,
        start: () => `top top+=${headerHeight()}`,
        end: () => `+=${window.innerHeight * 0.6 * tl.duration()}`,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // The hero's pin spacing pushes 03 down, so it must be measured first,
        // even when this trigger is rebuilt after 03's.
        refreshPriority: 1,
        // At release 03's identical intro frame sits exactly underneath, so the
        // hero steps aside instead of scrolling away; 03 then cross-fades the
        // photo square into its stone "01/04" square.
        onLeave: () => handsOver && gsap.set(stage, { autoAlpha: 0 }),
        onEnterBack: () => gsap.set(stage, { autoAlpha: 1 }),
      });
      ScrollTrigger.sort();
    }, stage);
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [rebuild]);

  return (
    <div className="hero-stage" ref={stageRef}>
      {/* Cream band behind the transparent header, under the photos. */}
      <div className="hero-bleed" aria-hidden="true" data-header-tone="dark" />
      <div className="hero-field" aria-hidden="true">
        <div className="stage-contour">
          <WaveCorner />
        </div>
      </div>
      <FirstPanel />
      <div className="hero-second" data-header-tone="light">
        <img
          className="hero-second-photo"
          src={images.hero.second.src}
          alt={images.hero.second.alt}
        />
        <div className="hero-second-shade" aria-hidden="true" />
      </div>
      <div className="hero-copy">
        <HeroCopy />
      </div>
    </div>
  );
}

/* ------------------------------- Flow layout ----------------------------- */

function FlowHero() {
  return (
    <>
      <FirstPanel />
      <div className="hero-flow-second">
        <img
          className="hero-flow-photo"
          src={images.hero.second.src}
          alt={images.hero.second.alt}
          loading="lazy"
        />
        <div className="hero-flow-copy">
          <HeroCopy />
        </div>
      </div>
    </>
  );
}

/* --------------------------------- Section -------------------------------- */

export function Hero() {
  const [canPin, setCanPin] = useState(() => window.matchMedia(PIN_QUERY).matches);
  const [introDone, setIntroDone] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const onChange = () => setCanPin(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      id="top"
      className={`hero ${canPin ? "is-pinned" : "is-flow"}`}
      aria-labelledby="hero-heading"
    >
      {canPin ? <PinnedHero /> : <FlowHero />}
      {introDone ? null : (
        <IntroLoader
          onDone={() => {
            setIntroDone(true);
            ScrollTrigger.refresh();
          }}
        />
      )}
    </section>
  );
}
