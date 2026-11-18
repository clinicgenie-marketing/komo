import { useEffect, useRef, useState } from "react";
import { LogoHoverEffect } from "@/components/ui/logo-hover-effect";

const images = {
  hero: "https://images.unsplash.com/photo-1717160675332-1a8d1080ae3d?auto=format&fit=crop&w=1800&q=88",
  scalp:
    "https://images.unsplash.com/photo-1757066033634-bbbf874ce525?auto=format&fit=crop&w=1200&q=86",
  hair: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1200&q=86",
  location: "/images/KOMO_Home_SobreImg2.png",
};

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow-down" : "arrow"} viewBox="0 0 20 20" aria-hidden="true">
      <path d={down ? "M10 3v13m0 0 5-5m-5 5-5-5" : "M3 10h13m0 0-5-5m5 5-5 5"} />
    </svg>
  );
}

// Topographic corner waves: every line is a blend between a tight inner curve
// (which dips into a small bay near the corner) and a broad, smooth outer
// curve, so the lines nest like contour lines. Points are [x, y] for one move
// + three cubic segments, drawn with the corner at the top-left of a 600×400
// box; the ends run past the box edges and are cropped by its frame.
const WAVE_LINES = 22;
const waveInner = [
  [320, -10],
  [280, 51],
  [243, 84],
  [200, 78],
  [157, 71],
  [141, 30],
  [120, -7],
  [67, -101],
  [-147, -203],
  [-200, -220],
];
const waveOuter = [
  [547, -10],
  [453, 101],
  [367, 199],
  [260, 193],
  [153, 186],
  [107, 254],
  [0, 318],
  [-93, 372],
  [-200, 363],
  [-360, 338],
];

function wavePath(t: number) {
  const p = waveInner.map(([x, y], i) => {
    const [ox, oy] = waveOuter[i];
    return [x + (ox - x) * t, y + (oy - y) * t];
  });
  // Blending breaks the alignment of handles at the joints, which shows as
  // kinks; mirror each outgoing handle through its joint to keep lines smooth.
  for (const joint of [3, 6]) {
    p[joint + 1] = [2 * p[joint][0] - p[joint - 1][0], 2 * p[joint][1] - p[joint - 1][1]];
  }
  const q = p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`);
  return `M${q[0]} C${q[1]}, ${q[2]}, ${q[3]} C${q[4]}, ${q[5]}, ${q[6]} C${q[7]}, ${q[8]}, ${q[9]}`;
}

function Image({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`image-wrap ${className}`}>
      <img src={src} alt={alt} />
      <span className="image-note">Illustrative imagery</span>
    </div>
  );
}

function WaveCorner() {
  return (
    <svg
      className="wave-corner"
      viewBox="0 0 600 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: WAVE_LINES }).map((_, index) => (
        <path key={index} d={wavePath(index / (WAVE_LINES - 1))} />
      ))}
    </svg>
  );
}

// Diagonal pair: the same corner piece top-left and (turned 180°) bottom-right.
// Each frame stays put and crops its lines; the lines inside drift with the
// cursor as one piece, so they never cross and keep their contour-map look.
const heroWaveCorners = ["hero-wave-tl", "hero-wave-br"] as const;

/**
 * Cursor parallax for wave layers: each `[data-depth]` layer inside `rootRef`
 * eases towards the cursor by its depth, trailing it slightly. With
 * `hoverRef`, it follows the cursor only while over that element (positions
 * measured across it) and settles back when the cursor leaves; otherwise it
 * follows the cursor anywhere on screen. Mouse only; off under reduced motion.
 */
function useWaveParallax(
  rootRef: React.RefObject<HTMLElement | null>,
  hoverRef?: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    const scope = hoverRef ? hoverRef.current : null;
    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    if (!root || (hoverRef && !scope) || !motionOk.matches) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const render = () => {
      // Soft follow: close 7% of the gap each frame, so waves trail the cursor.
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth);
        layer.style.transform = `translate3d(${current.x * depth * 28}px, ${current.y * depth * 18}px, 0)`;
      });
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : window.requestAnimationFrame(render);
    };
    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // -1..1 from the centre of the hover area (or the screen).
      const box = scope
        ? scope.getBoundingClientRect()
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      target.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      target.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
      start();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    const moveSource: HTMLElement | Window = scope ?? window;
    const leaveSource = scope ?? document.documentElement;
    moveSource.addEventListener("pointermove", onMove as EventListener, { passive: true });
    leaveSource.addEventListener("pointerleave", onLeave);
    return () => {
      moveSource.removeEventListener("pointermove", onMove as EventListener);
      leaveSource.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef, hoverRef]);
}

/** Hero waves: follow the cursor anywhere on screen. */
function HeroWaves() {
  const rootRef = useRef<HTMLDivElement>(null);
  useWaveParallax(rootRef);

  return (
    <div className="hero-waves" ref={rootRef} aria-hidden="true">
      {heroWaveCorners.map((corner) => (
        // The frame crops the lines; the layers inside it move with the cursor.
        <div className={`hero-wave ${corner}`} key={corner}>
          <div className="hero-wave-layer" data-depth="1">
            <WaveCorner />
          </div>
        </div>
      ))}
    </div>
  );
}

type Service = {
  number: string;
  title: string;
  text: string;
  link: string;
  href: string;
  image: string;
  alt: string;
  /** Optional CSS object-position to keep the subject in frame. */
  focus?: string;
};

// Service chapters. Swap `image` to replace a photo; everything else follows.
const services: Service[] = [
  {
    number: "01",
    title: "Care for my scalp",
    text: "Explore Signature Scalp Care and its six named care options.",
    link: "Explore Signature Scalp Care",
    href: "/treatments/signature-scalp-care/",
    image: "/images/Treatment%20Scalp%20Care.png",
    alt: "A therapist misting a client’s scalp during a scalp care treatment",
    focus: "50% 35%",
  },
  {
    number: "02",
    title: "Take time to relax",
    text: "Explore the Aromatic Waterfall Relaxing Scalp Spa, with relaxation as the focus of your visit.",
    link: "Explore the Waterfall Head Spa",
    href: "/treatments/waterfall-head-spa/",
    // Placeholder (Unsplash), shared with the hero.
    image: images.hero,
    alt: "A client relaxing as water is poured over their hair at a wash basin",
    focus: "50% 48%",
  },
  {
    number: "03",
    title: "Care for my hair",
    text: "Explore Moisturising Cuticle Hair Care for dry or rough hair lengths.",
    link: "Explore Moisturising Hair Care",
    href: "/treatments/moisturising-hair-care/",
    // Placeholder (Unsplash).
    image: images.hair,
    alt: "A practitioner caring for a client’s hair",
  },
];

/**
 * Sticky photograph on the left, scrolling service chapters on the right.
 * Below 900px it becomes stacked image-and-text cards. All content renders
 * visible by default; animation classes are only applied once the script runs.
 */
function ServiceChapters({
  id,
  eyebrow,
  heading,
  items,
  mediaRef,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  items: Service[];
  mediaRef?: React.Ref<HTMLDivElement>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("is-enhanced");
    const chapters = Array.from(section.querySelectorAll<HTMLElement>(".service-chapter"));

    // Active chapter = the last one whose top has passed the middle of the
    // viewport. Measured per frame, so it is right in either direction and
    // after jumps (End key, anchor links) that skip chapters entirely.
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let next = 0;
      chapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= middle) next = index;
      });
      setActive(next);

      // Background hand-over to the sage section below: over the last screen
      // of this section, beige shifts to sage, completing exactly as the sage
      // section's top edge appears, so the two never meet at a visible seam.
      const viewport = window.innerHeight;
      const bottom = section.getBoundingClientRect().bottom;
      const linear = Math.min(1, Math.max(0, (viewport * 1.9 - bottom) / (viewport * 0.9)));
      const t = linear * linear * (3 - 2 * linear); // smoothstep: soft start and end
      const mix = (from: number, to: number) => Math.round(from + (to - from) * t);
      section.style.backgroundColor = `rgb(${mix(235, 166)} ${mix(230, 178)} ${mix(220, 154)})`;
    };
    const requestActive = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };
    updateActive();
    window.addEventListener("scroll", requestActive, { passive: true });
    window.addEventListener("resize", requestActive);
    // Watch what actually animates, not the tall chapter around it: the copy
    // sits mid-chapter, so watching the chapter fired the reveal off-screen.
    // Stacked cards (≤900px) animate whole, image first, so watch the card.
    const stacked = window.matchMedia("(max-width: 900px)").matches;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.closest(".service-chapter")?.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    chapters.forEach((chapter) =>
      revealObserver.observe(
        stacked ? chapter : (chapter.querySelector(".service-chapter-copy") ?? chapter),
      ),
    );

    return () => {
      window.removeEventListener("scroll", requestActive);
      window.removeEventListener("resize", requestActive);
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      section.classList.remove("is-enhanced");
      section.style.backgroundColor = "";
    };
  }, []);

  return (
    <section
      className="services section-pad"
      id={id}
      ref={sectionRef}
      aria-labelledby={`${id}-heading`}
    >
      <div className="section-heading" data-reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-heading`}>{heading}</h2>
      </div>
      <div className="services-layout">
        {/* Non-sticky column: gives the hero hand-off a stable page position. */}
        <div className="services-stage-col" data-handoff-anchor>
          <div className="services-stage">
            <div className="services-media" ref={mediaRef}>
              {items.map((item, index) => (
                <img
                  key={item.number}
                  src={item.image}
                  alt={item.alt}
                  className={index === active ? "is-active" : undefined}
                  loading={index === 0 ? "eager" : "lazy"}
                  style={item.focus ? { objectPosition: item.focus } : undefined}
                />
              ))}
              <span className="image-note">Illustrative imagery</span>
            </div>
            <ol className="services-indicator" aria-hidden="true">
              {items.map((item, index) => (
                <li key={item.number} className={index === active ? "is-active" : undefined}>
                  {item.number}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="services-chapters">
          {items.map((item, index) => (
            <article
              className="service-chapter"
              data-index={index}
              key={item.number}
              aria-labelledby={`${id}-${item.number}`}
            >
              {/* Stacked-card image, shown below the tablet breakpoint only. */}
              <div className="service-chapter-media image-wrap">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  style={item.focus ? { objectPosition: item.focus } : undefined}
                />
                <span className="image-note">Illustrative imagery</span>
              </div>
              <div className="service-chapter-copy">
                <span className="card-number">{item.number}</span>
                <h3 id={`${id}-${item.number}`}>{item.title}</h3>
                <p>{item.text}</p>
                <a className="inline-link" href={item.href}>
                  {item.link} <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * "A first visit, at your pace": a calm two-column pause after the sticky
 * services. One gentle reveal when ~20% is in view (heading, then the copy
 * group 120ms later), then everything stays visible. Content is visible by
 * default; the hidden start state applies only once the script has run.
 */
function FirstVisit() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    section.classList.add("is-enhanced");
    // Watch the content, not the section: its top padding alone could fill
    // the first 20%, firing the reveal before any text was on screen.
    const content = section.querySelector(".first-visit-layout") ?? section;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-revealed");
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="first-visit" ref={sectionRef} aria-labelledby="first-visit-heading">
      <div className="first-visit-layout">
        <h2 id="first-visit-heading" className="first-visit-heading">
          A first visit, at your pace
        </h2>
        <div className="first-visit-copy">
          <p>
            You do not need to choose a treatment before getting in touch. Select “Help me choose”
            and tell us what you would like from your visit.
          </p>
          <p>
            You can enquire through the visit form, WhatsApp or telephone. The outlet confirms the
            service, date and time before your appointment is booked.
          </p>
          <div className="first-visit-links">
            <a className="inline-link" href="/first-visit/">
              Plan your first visit <Arrow />
            </a>
            <a className="inline-link" href="/about/">
              About KOMO <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const footerLinks = [
  { label: "Treatments", href: "/treatments/" },
  { label: "About KOMO", href: "/about/" },
  { label: "Locations", href: "/locations/" },
  { label: "Your First Visit", href: "/first-visit/" },
];

// No destinations exist in the project yet. Add `href` once the pages exist;
// until then these render as plain text so no URL is invented.
const policyLinks: { label: string; href?: string }[] = [
  { label: "Privacy Policy" },
  { label: "Website Terms" },
  { label: "Booking and Trial Information" },
];

/**
 * Footer: logo + descriptor, main nav, and a quieter policy row. One-time
 * fade (logo group, then both navs 100ms later) when it enters the viewport;
 * no movement. Visible by default; hidden start state only once the script
 * has run. Keyboard focus entering early shows it at once.
 */
function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const wavesRef = useRef<HTMLDivElement>(null);
  // Same corner waves as the hero; they follow the cursor while it is over the footer.
  useWaveParallax(wavesRef, footerRef);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    footer.classList.add("is-enhanced");

    const reveal = () => {
      footer.classList.add("is-revealed");
      observer.disconnect();
      footer.removeEventListener("focusin", revealNow);
    };
    const revealNow = () => {
      footer.classList.add("is-instant");
      reveal();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    });
    observer.observe(footer);
    footer.addEventListener("focusin", revealNow);

    return () => {
      observer.disconnect();
      footer.removeEventListener("focusin", revealNow);
    };
  }, []);

  return (
    <footer className="site-footer" ref={footerRef} data-header-dark>
      <div className="footer-waves" ref={wavesRef} aria-hidden="true">
        <div className="footer-wave">
          <div className="hero-wave-layer" data-depth="1">
            <WaveCorner />
          </div>
        </div>
      </div>
      <div className="footer-main">
        <div className="footer-brand">
          <a className="footer-logo" href="/">
            <img
              src="/images/komo-logo.png"
              alt="KOMO Scalp & Hair Wellness, home"
              width={1445}
              height={549}
            />
          </a>
          <p>Scalp care, hair care and head spa experiences in Singapore.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <ul>
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a className="footer-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <nav className="footer-policy" aria-label="Policies">
        <ul>
          {policyLinks.map((link) => (
            <li key={link.label}>
              {link.href ? (
                <a className="footer-link" href={link.href}>
                  {link.label}
                </a>
              ) : (
                <span>{link.label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const locationsRef = useRef<HTMLElement>(null);
  const locationWavesRef = useRef<HTMLDivElement>(null);
  // Find your KOMO: hero corner waves that follow the cursor while hovering the section.
  useWaveParallax(locationWavesRef, locationsRef);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const headerWordmarkRef = useRef<HTMLAnchorElement>(null);
  const heroProgressRef = useRef<HTMLDivElement>(null);
  const handoffTargetRef = useRef<HTMLDivElement>(null);
  const heroCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "KOMO Singapore | Scalp Care, Hair Care & Head Spa";
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content =
      "Explore KOMO scalp care, waterfall head spa and moisturising hair care in Singapore. Compare your options and enquire about your first visit.";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameRequest = 0;

    const clamp = (value: number, minimum = 0, maximum = 1) =>
      Math.min(maximum, Math.max(minimum, value));
    const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;
    const ease = (amount: number) => 1 - Math.pow(1 - clamp(amount), 3);
    const segment = (progress: number, start: number, end: number) =>
      ease(clamp((progress - start) / (end - start)));

    // Header stays pinned and transparent; switch to light text over dark areas.
    // Runs after the hero frame is positioned so it reads this frame's layout.
    const updateHeader = () => {
      const header = headerRef.current;
      if (header) {
        const probeY = header.offsetHeight / 2;
        const items = [...header.children]
          .map((child) => child.getBoundingClientRect())
          .filter((box) => box.width > 0);
        const contentLeft = Math.min(...items.map((box) => box.left));
        const contentRight = Math.max(...items.map((box) => box.right));
        const darkAreas = [
          heroFrameRef.current,
          ...document.querySelectorAll<HTMLElement>("[data-header-dark]"),
        ];
        const onDark = darkAreas.some((area) => {
          if (!area || area.classList.contains("is-landed")) return false;
          const box = area.getBoundingClientRect();
          // Must sit behind every nav item, so a partly covered bar keeps dark text.
          return (
            box.top <= probeY &&
            box.bottom >= probeY &&
            box.left <= contentLeft &&
            box.right >= contentRight
          );
        });
        header.classList.toggle("on-dark", onDark);
      }
    };

    const updateHero = () => {
      frameRequest = 0;
      const hero = heroRef.current;
      const frame = heroFrameRef.current;
      if (!hero || !frame || reducedMotion.matches) {
        updateHeader();
        return;
      }

      const bounds = hero.getBoundingClientRect();
      const distance = hero.offsetHeight - window.innerHeight;
      const progress = clamp(-bounds.top / distance);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // Landing state: a centred card carrying the KOMO logo.
      const narrow = viewportWidth < 640;
      const cardWidth = narrow ? viewportWidth - 48 : Math.min(viewportWidth * 0.58, 840);
      const cardHeight = Math.min(
        narrow ? cardWidth * 1.25 : cardWidth / 1.53,
        viewportHeight * (narrow ? 0.62 : 0.6),
      );
      const cardRadius = narrow ? 20 : 24;

      // One continuous expansion from card to full bleed; the hero copy then
      // settles in over the photo and holds until the hand-off.
      const amount = segment(progress, 0.04, 0.45);
      let width = mix(cardWidth, viewportWidth, amount);
      let height = mix(cardHeight, viewportHeight, amount);
      let radius = mix(cardRadius, 0, amount);
      let radiusBottom = radius;
      let centreY = viewportHeight / 2;
      let imageScale = mix(1.14, 1, amount);

      // Hand-off: once the hero ends, the photo stays centred and shrinks into the
      // "Take time to relax" card while the treatments section scrolls up around it.
      const overscroll = Math.max(0, viewportHeight - bounds.bottom);
      let centreX = viewportWidth / 2;
      centreY -= overscroll;
      let handoff = 0;
      const target = handoffTargetRef.current;
      const handoffEnabled = Boolean(target) && viewportWidth >= 900;

      if (target && handoffEnabled) {
        let targetPageTop = 0;
        // Measure from a non-sticky ancestor so the landing point is stable.
        const anchor = target.closest<HTMLElement>("[data-handoff-anchor]") ?? target;
        for (
          let node: HTMLElement | null = anchor;
          node;
          node = node.offsetParent as HTMLElement | null
        ) {
          targetPageTop += node.offsetTop;
        }
        const targetWidth = target.offsetWidth;
        const targetHeight = target.offsetHeight;
        const heroEndScroll = window.scrollY + bounds.top + distance;
        const landScroll = targetPageTop + targetHeight / 2 - viewportHeight / 2;
        const travel = landScroll - heroEndScroll;

        if (travel > 0) {
          handoff = clamp(overscroll / travel);
          // Live position, so the photo tracks the frame once it turns sticky.
          const targetBox = target.getBoundingClientRect();
          const targetCentreX = targetBox.left + targetWidth / 2;
          const targetCentreY = targetBox.top + targetHeight / 2;
          // Position moves linearly (keeps the photo centred); size eases out so it
          // shrinks early and clears the section heading.
          const shrink = ease(handoff);
          centreX = mix(centreX, targetCentreX, handoff);
          centreY = mix(centreY, targetCentreY, handoff);
          width = mix(width, targetWidth, shrink);
          height = mix(height, targetHeight, shrink);
          radius = mix(radius, 8, shrink);
          radiusBottom = mix(radiusBottom, 8, shrink);
          imageScale = mix(imageScale, 1, shrink);
        }
      }

      const landed = handoffEnabled && handoff >= 1;
      // Once landed, the hero photo fades out over the section's own first image.
      frame.classList.toggle("is-landed", landed);
      if (target) target.style.opacity = handoffEnabled && !landed ? "0" : "";

      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      frame.style.borderRadius = `${radius}px ${radius}px ${radiusBottom}px ${radiusBottom}px`;
      frame.style.transform = `translate(-50%, -50%) translate(${centreX - viewportWidth / 2}px, ${centreY - viewportHeight / 2}px)`;
      frame.style.setProperty("--hero-image-scale", `${imageScale}`);
      frame.style.setProperty("--handoff", `${handoff}`);

      // The logo leaves first, so the photo is clear while it grows.
      const logoFade = 1 - segment(progress, 0.03, 0.16);
      if (heroLogoRef.current) {
        heroLogoRef.current.style.opacity = `${logoFade}`;
        heroLogoRef.current.style.transform = `translate(-50%, -50%) scale(${mix(1.06, 1, logoFade)})`;
        // Hover only while the logo is clearly on screen.
        heroLogoRef.current.style.pointerEvents = logoFade > 0.6 ? "auto" : "none";
      }
      // Avoid two KOMO wordmarks on landing: the header one takes over as the card logo leaves.
      if (headerWordmarkRef.current) headerWordmarkRef.current.style.opacity = `${1 - logoFade}`;

      // Hero copy arrives over the full-bleed photo; clears out quickly at hand-off.
      const reveal =
        segment(progress, 0.4, 0.6) * (1 - clamp(overscroll / (viewportHeight * 0.25)));
      // Light tint behind the landing logo, deeper tint behind the hero copy.
      frame.style.setProperty("--copy-reveal", `${Math.max(logoFade * 0.45, reveal)}`);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = `${reveal}`;
        heroCopyRef.current.style.transform = `translate(-50%, calc(-50% + ${mix(36, 0, reveal)}px))`;
        heroCopyRef.current.style.pointerEvents = reveal > 0.6 ? "auto" : "none";
        heroCopyRef.current.toggleAttribute("inert", reveal < 0.6);
      }

      if (heroProgressRef.current) {
        heroProgressRef.current.style.transform = `scaleX(${clamp(progress / 0.45)})`;
      }

      if (heroCueRef.current) {
        heroCueRef.current.style.opacity = `${1 - segment(progress, 0.15, 0.3)}`;
      }

      updateHeader();
    };

    const requestHeroUpdate = () => {
      if (!frameRequest) frameRequest = window.requestAnimationFrame(updateHero);
    };

    updateHero();
    window.addEventListener("scroll", requestHeroUpdate, { passive: true });
    window.addEventListener("resize", requestHeroUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestHeroUpdate);
      window.removeEventListener("resize", requestHeroUpdate);
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
    };
  }, []);

  return (
    <main>
      <header className="site-header" ref={headerRef}>
        <nav className="header-nav desktop-only" aria-label="Main">
          <a className="header-link" href="/treatments/">
            Treatments
          </a>
          <a className="header-link" href="/about/">
            About KOMO
          </a>
          <a className="header-link" href="/locations/">
            Locations
          </a>
        </nav>
        <a className="wordmark" href="/" aria-label="KOMO home" ref={headerWordmarkRef} />
        <a className="header-cta" href="/first-visit/#visit-form">
          Request a visit <Arrow />
        </a>
      </header>

      <section id="top" className="hero" ref={heroRef}>
        <div className="hero-sticky">
          <HeroWaves />
          <div className="hero-copy" ref={heroCopyRef}>
            <p className="eyebrow">Care in Harmony</p>
            <h1>Scalp care, hair care and time to unwind</h1>
            <p className="hero-lead">
              A scalp that needs attention. Hair that feels dry. A little time to yourself.
            </p>
            <p className="hero-body">
              KOMO brings scalp care, hair care and head spa experiences together. Start with what
              matters to you.
            </p>
            <div className="button-row">
              <a className="button button-filled" href="/first-visit/#visit-form">
                Request a visit <Arrow />
              </a>
              <a className="button button-text" href="/treatments/">
                Explore treatments <Arrow down />
              </a>
            </div>
          </div>
          <div className="hero-frame" ref={heroFrameRef}>
            <img src={images.hero} alt="A calm hair and scalp spa treatment" />
            <div className="hero-shade" />
            <LogoHoverEffect className="hero-logo" ref={heroLogoRef} />
            <span className="image-note">Illustrative imagery</span>
          </div>
          <div className="hero-scroll-cue" ref={heroCueRef}>
            <span>Scroll to explore</span>
            <div className="hero-progress">
              <div ref={heroProgressRef} />
            </div>
          </div>
        </div>
      </section>

      <ServiceChapters
        id="treatments"
        eyebrow="Choose by purpose"
        heading="What brings you to KOMO?"
        items={services}
        mediaRef={handoffTargetRef}
      />

      <FirstVisit />

      <section className="locations" ref={locationsRef}>
        <Image
          src={images.location}
          alt="The entrance and reception of a KOMO outlet"
          className="location-image"
        />
        <div className="location-overlay" data-header-dark />
        <div className="location-copy" data-reveal>
          <p className="eyebrow">Plan your visit</p>
          <h2>Find your KOMO</h2>
          <p>
            Choose an outlet for its address, opening hours and contact information. Check your
            appointment details before travelling.
          </p>
          <div className="button-row">
            <a className="button button-light" href="/locations/">
              View locations <Arrow />
            </a>
            <a className="button button-outline-light" href="/first-visit/#visit-form">
              Request a visit <Arrow />
            </a>
          </div>
        </div>
        <div className="location-waves" ref={locationWavesRef} aria-hidden="true">
          <div className="location-wave">
            <div className="hero-wave-layer" data-depth="1">
              <WaveCorner />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
