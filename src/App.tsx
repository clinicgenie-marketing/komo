import { useEffect, useRef, useState } from "react";

const images = {
  hero: "https://images.unsplash.com/photo-1717160675332-1a8d1080ae3d?auto=format&fit=crop&w=1800&q=88",
  scalp:
    "https://images.unsplash.com/photo-1757066033634-bbbf874ce525?auto=format&fit=crop&w=1200&q=86",
  hair: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1200&q=86",
  visit:
    "https://images.unsplash.com/photo-1717160675158-fdd75b8595cf?auto=format&fit=crop&w=1400&q=86",
  location:
    "https://images.unsplash.com/photo-1687579520868-b22b33ca8fa5?auto=format&fit=crop&w=1800&q=88",
};

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow-down" : "arrow"} viewBox="0 0 20 20" aria-hidden="true">
      <path d={down ? "M10 3v13m0 0 5-5m-5 5-5-5" : "M3 10h13m0 0-5-5m5 5-5 5"} />
    </svg>
  );
}

function Contours({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`contours ${className}`}
      viewBox="0 0 1200 430"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <path
          key={index}
          d={`M-80 ${65 + index * 18} C130 ${-90 + index * 20}, 285 ${285 + index * 5}, 500 ${150 + index * 13} S850 ${5 + index * 21}, 1280 ${150 + index * 12}`}
        />
      ))}
    </svg>
  );
}

function Image({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`image-wrap ${className}`}>
      <img src={src} alt={alt} />
      <span className="image-note">Illustrative imagery</span>
    </div>
  );
}

const choices = [
  {
    number: "01",
    title: "Care for my scalp",
    text: "Explore Signature Scalp Care and its six named care options.",
    link: "Explore Signature Scalp Care",
    href: "/treatments/signature-scalp-care/",
    image: images.scalp,
    alt: "A person receiving a gentle scalp treatment",
  },
  {
    number: "02",
    title: "Take time to relax",
    text: "Explore the Aromatic Waterfall Relaxing Scalp Spa, with relaxation as the focus of your visit.",
    link: "Explore the Waterfall Head Spa",
    href: "/treatments/waterfall-head-spa/",
    // Same photo as the hero: the hero pill lands in this card as you scroll.
    image: images.hero,
    alt: "A relaxing hair wash treatment",
    handoff: true,
  },
  {
    number: "03",
    title: "Care for my hair",
    text: "Explore Moisturising Cuticle Hair Care for dry or rough hair lengths.",
    link: "Explore Moisturising Hair Care",
    href: "/treatments/moisturising-hair-care/",
    image: images.hair,
    alt: "A practitioner caring for a client’s hair",
  },
];

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroCaptionRef = useRef<HTMLDivElement>(null);
  const heroProgressRef = useRef<HTMLDivElement>(null);
  const handoffTargetRef = useRef<HTMLAnchorElement>(null);
  const heroCueRef = useRef<HTMLDivElement>(null);
  const [heroBeat, setHeroBeat] = useState(0);

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
    let currentBeat = -1;

    const clamp = (value: number, minimum = 0, maximum = 1) =>
      Math.min(maximum, Math.max(minimum, value));
    const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;
    const ease = (amount: number) => 1 - Math.pow(1 - clamp(amount), 3);
    const segment = (progress: number, start: number, end: number) =>
      ease(clamp((progress - start) / (end - start)));

    const updateHero = () => {
      frameRequest = 0;
      const hero = heroRef.current;
      const frame = heroFrameRef.current;
      if (!hero || !frame || reducedMotion.matches) return;

      const bounds = hero.getBoundingClientRect();
      const distance = hero.offsetHeight - window.innerHeight;
      const progress = clamp(-bounds.top / distance);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gutter = viewportWidth < 640 ? 18 : 28;
      // Place the opening pill in the space below the copy so it never sits behind the text.
      const copy = heroCopyRef.current;
      const copyBottom = copy ? copy.offsetTop + copy.offsetHeight : viewportHeight * 0.55;
      const pillGap = viewportWidth < 640 ? 20 : 32;
      const bottomReserve = viewportWidth < 640 ? 64 : 72;
      const spaceBelowCopy = viewportHeight - copyBottom - pillGap - bottomReserve;
      const maxCapsuleWidth =
        viewportWidth < 640 ? Math.min(viewportWidth * 0.72, 340) : Math.min(viewportWidth * 0.48, 460);
      const capsuleHeight = Math.max(
        Math.min(viewportHeight * 0.25, 230, maxCapsuleWidth / 2, spaceBelowCopy),
        96,
      );
      const capsuleWidth = Math.min(maxCapsuleWidth, capsuleHeight * 2.2);
      const startCentreY = copyBottom + pillGap + capsuleHeight / 2;

      let width = capsuleWidth;
      let height = capsuleHeight;
      let radius = capsuleHeight / 2;
      let radiusBottom = radius;
      let centreY = startCentreY;
      let imageScale = 1.08;

      if (progress <= 0.3) {
        const amount = segment(progress, 0.03, 0.3);
        width = mix(capsuleWidth, viewportWidth - gutter * 2, amount);
        height = mix(capsuleHeight, viewportHeight - gutter * 2, amount);
        radius = mix(capsuleHeight / 2, 8, amount);
        radiusBottom = radius;
        centreY = mix(startCentreY, viewportHeight / 2, amount);
        imageScale = mix(1.08, 1, amount);
      } else if (progress <= 0.48) {
        width = viewportWidth - gutter * 2;
        height = viewportHeight - gutter * 2;
        radius = 8;
        radiusBottom = 8;
        centreY = viewportHeight / 2;
        imageScale = 1;
      } else if (progress <= 0.66) {
        const amount = segment(progress, 0.48, 0.66);
        const archWidth = Math.min(viewportWidth * 0.48, 650);
        width = mix(viewportWidth - gutter * 2, archWidth, amount);
        height = mix(viewportHeight - gutter * 2, viewportHeight * 0.78, amount);
        radius = mix(8, archWidth / 2, amount);
        radiusBottom = mix(8, 34, amount);
        centreY = viewportHeight / 2;
        imageScale = mix(1, 1.06, amount);
      } else if (progress <= 0.82) {
        const amount = segment(progress, 0.66, 0.82);
        const archWidth = Math.min(viewportWidth * 0.48, 650);
        const wideWidth = Math.min(viewportWidth * 0.72, 980);
        const wideHeight = Math.min(viewportHeight * 0.42, 410);
        width = mix(archWidth, wideWidth, amount);
        height = mix(viewportHeight * 0.78, wideHeight, amount);
        radius = mix(archWidth / 2, wideHeight / 2, amount);
        radiusBottom = mix(34, wideHeight / 2, amount);
        centreY = viewportHeight / 2;
        imageScale = mix(1.06, 1.02, amount);
      } else {
        const amount = segment(progress, 0.82, 1);
        const wideWidth = Math.min(viewportWidth * 0.72, 980);
        const wideHeight = Math.min(viewportHeight * 0.42, 410);
        width = mix(wideWidth, viewportWidth - gutter * 2, amount);
        height = mix(wideHeight, viewportHeight * 0.82, amount);
        radius = mix(wideHeight / 2, 8, amount);
        radiusBottom = radius;
        centreY = viewportHeight / 2;
        imageScale = mix(1.02, 1, amount);
      }

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
        let targetPageLeft = 0;
        for (let node: HTMLElement | null = target; node; node = node.offsetParent as HTMLElement | null) {
          targetPageTop += node.offsetTop;
          targetPageLeft += node.offsetLeft;
        }
        const targetWidth = target.offsetWidth;
        const targetHeight = target.offsetHeight;
        const heroEndScroll = window.scrollY + bounds.top + distance;
        const landScroll = targetPageTop + targetHeight / 2 - viewportHeight / 2;
        const travel = landScroll - heroEndScroll;

        if (travel > 0) {
          handoff = clamp(overscroll / travel);
          const targetCentreX = targetPageLeft - window.scrollX + targetWidth / 2;
          const targetCentreY = targetPageTop - window.scrollY + targetHeight / 2;
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
      frame.style.visibility = landed ? "hidden" : "";
      if (target) target.style.opacity = handoffEnabled && !landed ? "0" : "";

      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      frame.style.borderRadius = `${radius}px ${radius}px ${radiusBottom}px ${radiusBottom}px`;
      frame.style.transform = `translate(-50%, -50%) translate(${centreX - viewportWidth / 2}px, ${centreY - viewportHeight / 2}px)`;
      frame.style.setProperty("--hero-image-scale", `${imageScale}`);
      frame.style.setProperty("--handoff", `${handoff}`);

      if (heroCopyRef.current) {
        const copyFade = 1 - segment(progress, 0.02, 0.18);
        heroCopyRef.current.style.opacity = `${copyFade}`;
        heroCopyRef.current.style.transform = `translateX(-50%) translateY(${-progress * 90}px)`;
        heroCopyRef.current.style.pointerEvents = copyFade < 0.2 ? "none" : "auto";
      }

      if (heroCaptionRef.current) {
        const captionOpacity =
          progress < 0.22 ? 0 : progress < 0.3 ? segment(progress, 0.22, 0.3) : 1;
        heroCaptionRef.current.style.opacity = `${captionOpacity}`;
      }

      if (heroProgressRef.current) {
        heroProgressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (heroCueRef.current) {
        heroCueRef.current.style.opacity = overscroll > 0 ? "0" : "";
      }

      const nextBeat = progress < 0.3 ? 0 : progress < 0.48 ? 1 : progress < 0.66 ? 2 : 3;
      if (nextBeat !== currentBeat) {
        currentBeat = nextBeat;
        setHeroBeat(nextBeat);
      }
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

  function moveContours(event: React.PointerEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
  }

  return (
    <main>
      <header className="site-header">
        <a className="header-link desktop-only" href="/treatments/">
          Treatments
        </a>
        <a className="wordmark" href="/" aria-label="KOMO home">
          KOMO
        </a>
        <a className="header-cta" href="/first-visit/#visit-form">
          Request a visit <Arrow />
        </a>
      </header>

      <section id="top" className="hero" ref={heroRef} onPointerMove={moveContours}>
        <div className="hero-sticky">
          <Contours className="hero-contours" />
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
            <span className="image-note">Illustrative imagery</span>
          </div>
          <div className="hero-caption" ref={heroCaptionRef} aria-live="polite">
            <span>0{heroBeat + 1}</span>
            <p>{["Care in Harmony", "Scalp care", "Hair care", "Time to unwind"][heroBeat]}</p>
          </div>
          <div className="hero-scroll-cue" ref={heroCueRef}>
            <span>Scroll to explore</span>
            <div className="hero-progress">
              <div ref={heroProgressRef} />
            </div>
          </div>
        </div>
      </section>

      <section className="choices section-pad" id="treatments">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Choose by purpose</p>
          <h2>What brings you to KOMO?</h2>
        </div>
        <div className="choice-grid" data-reveal>
          {choices.map((choice) => (
            <article className="choice-card" key={choice.title}>
              <a
                href={choice.href}
                className="choice-image-link"
                aria-label={choice.link}
                ref={choice.handoff ? handoffTargetRef : undefined}
              >
                <Image
                  src={choice.image}
                  alt={choice.alt}
                  className={choice.handoff ? "handoff-target" : ""}
                />
              </a>
              <div className="choice-copy">
                <span className="card-number">{choice.number}</span>
                <h3>{choice.title}</h3>
                <p>{choice.text}</p>
                <a className="inline-link" href={choice.href}>
                  {choice.link} <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="first-visit section-pad">
        <div className="visit-layout">
          <Image src={images.visit} alt="A calm treatment consultation and spa experience" />
          <div className="visit-copy" data-reveal>
            <p className="eyebrow">Getting started</p>
            <h2>A first visit, at your pace</h2>
            <p>
              You do not need to choose a treatment before getting in touch. Select “Help me choose”
              and tell us what you would like from your visit.
            </p>
            <p>
              You can enquire through the visit form, WhatsApp or telephone. The outlet confirms the
              service, date and time before your appointment is booked.
            </p>
            <div className="visit-links">
              <a className="button button-filled" href="/first-visit/">
                Plan your first visit <Arrow />
              </a>
              <a className="inline-link" href="/about/">
                About KOMO <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="locations" onPointerMove={moveContours}>
        <Image
          src={images.location}
          alt="A warm and welcoming wellness interior"
          className="location-image"
        />
        <div className="location-overlay" />
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
        <Contours className="location-contours" />
      </section>

      <footer>
        <a className="wordmark" href="/">
          KOMO
        </a>
        <p>Scalp care, hair care and head spa experiences in Singapore.</p>
        <p className="footer-note">
          Prototype photography is illustrative and will be replaced with approved KOMO imagery.
        </p>
        <a
          className="back-top"
          href="#top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top <Arrow down />
        </a>
      </footer>
    </main>
  );
}
