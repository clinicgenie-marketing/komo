/* PRESERVED with SingleBottleScene.tsx for the individual product page; not
 * mounted on the homepage. */
/* ---------------------------------------------------------------------------
 * Section 04 → 05 handover: from the wide treatment still (card 06) to the
 * bottle close-up that opens Section 05, anchored on the bottle cap.
 *
 * One fixed overlay, driven by one scroll progress value p (0–1) from the end
 * of Section 04 to the moment Section 05's stage pins, so it reverses:
 *   0.00–0.06  the frame appears over the carousel's centre card, showing the
 *              wide still (if another card is centred, it fades across)
 *   0.06–0.45  the frame grows to fill the screen while the photograph moves
 *              its cap to T, where the close-up's cap will sit
 *   0.45–0.55  hold on the wide shot
 *   0.55–0.92  warm ivory enters along a shallow curve (from the right on
 *              desktop, from the lower edge on phones); the wide shot scales
 *              about T to the close-up's scale; the close-up fades in with
 *              its cap on T. The cap is the anchor throughout
 *   0.92–1.00  the overlay fades off Section 05's identical opening frame
 * Every position is measured live: the centre card, and the bottle in
 * Section 05's stage as it will sit once pinned. Reduced motion: none of
 * this; the two stills appear in normal page flow.
 *
 * Cap anchors (fractions of each image): the wide still's spray-cap collar,
 * and the same point on the close-up cut-out, with their collar widths so
 * the two caps match in size.
 * ------------------------------------------------------------------------- */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bottle } from "@/content/product";
import { images } from "@/content/images";
import { headerHeight } from "@/lib/stage";

gsap.registerPlugin(ScrollTrigger);

const WIDE = {
  src: images.basin.treatment.src,
  w: 1122,
  h: 1402,
  cap: [0.3654, 0.4244],
  collar: 55,
};
// The Section 05 cut-out (571 × 1379): the collar top centre and width.
const CLOSE = { cap: [0.6007, 0.145], collar: 233, w: 571 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => (value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const logMix = (a: number, b: number, t: number) => Math.exp(mix(Math.log(a), Math.log(b), t));

type Rect = { l: number; t: number; w: number; h: number };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function BottleHandover() {
  const [still, setStill] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setStill(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const spacerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const wideRef = useRef<HTMLImageElement>(null);
  const ivoryRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const spacer = spacerRef.current;
    const frame = frameRef.current;
    const wide = wideRef.current;
    const ivory = ivoryRef.current;
    const close = closeRef.current;
    const stage = document.querySelector<HTMLElement>(".product-stage");
    if (
      still ||
      !spacer ||
      !frame ||
      !wide ||
      !ivory ||
      !close ||
      !stage ||
      bottle.kind !== "image"
    )
      return;

    let hiddenCard: HTMLElement | null = null;
    const showCard = () => {
      if (hiddenCard) hiddenCard.style.opacity = "";
      hiddenCard = null;
    };
    const reset = () => {
      frame.style.visibility = "hidden";
      showCard();
    };

    /** The carousel's centre card (its figure) at the start scroll position. */
    const centreCard = () => {
      const slides = Array.from(document.querySelectorAll<HTMLElement>(".arc-slide"));
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const slide of slides) {
        const d = Math.abs(parseFloat(slide.style.getPropertyValue("--d")) || 0);
        if (d < bestD) {
          bestD = d;
          best = slide;
        }
      }
      return {
        card: best?.querySelector<HTMLElement>(".arc-photo") ?? null, // the photograph
        isLast: best === slides.at(-1),
      };
    };

    let progress = 0;
    let startScroll = 0;
    const render = (p: number) => {
      progress = p;
      if (p <= 0 || p >= 1) {
        reset();
        return;
      }
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const narrow = vw <= 720;
      const drift = window.scrollY - startScroll;

      // K0: the centre card's photograph, where it sat when the sequence
      // started.
      const { card, isLast } = centreCard();
      if (!card) return;
      const c = card.getBoundingClientRect();
      const k0: Rect = { l: c.left, t: c.top + drift, w: c.width, h: c.height };

      // T: the close-up's cap, where Section 05's pinned stage will put it.
      const bottleBox = stage.querySelector<HTMLElement>(".bottle-image") ?? stage;
      const b = bottleBox.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const close0: Rect = {
        l: b.left,
        t: b.top - st.top + headerHeight(),
        w: b.width,
        h: b.height,
      };
      const T: [number, number] = [
        close0.l + CLOSE.cap[0] * close0.w,
        close0.t + CLOSE.cap[1] * close0.h,
      ];
      // The wide shot's scale at which its cap matches the close-up's cap.
      const sMatch = (CLOSE.collar * (close0.w / CLOSE.w)) / WIDE.collar;

      const [ax, ay] = WIDE.cap;
      const iw = WIDE.w;
      const ih = WIDE.h;
      // Scale needed for the photograph, with its cap on P, to cover box R.
      const coverAround = (P: [number, number], R: Rect) =>
        Math.max(
          (P[0] - R.l) / (ax * iw),
          (R.l + R.w - P[0]) / ((1 - ax) * iw),
          (P[1] - R.t) / (ay * ih),
          (R.t + R.h - P[1]) / ((1 - ay) * ih),
        );

      const screen: Rect = { l: 0, t: 0, w: vw, h: vh };
      let box: Rect;
      let scale: number;
      let P: [number, number];
      let ivoryEdge = 1; // 1 = ivory fully out, 0 = fully in
      let closeOpacity = 0;

      // The card shows the still with object-fit: cover, centred.
      const s0 = Math.max(k0.w / iw, k0.h / ih);
      const P0: [number, number] = [
        k0.l + (k0.w - iw * s0) / 2 + ax * iw * s0,
        k0.t + (k0.h - ih * s0) / 2 + ay * ih * s0,
      ];
      const s1 = Math.max(sMatch, coverAround(T, screen));

      if (p < 0.55) {
        const a = ease(clamp((p - 0.06) / 0.39));
        box = { l: mix(k0.l, 0, a), t: mix(k0.t, 0, a), w: mix(k0.w, vw, a), h: mix(k0.h, vh, a) };
        P = [mix(P0[0], T[0], a), mix(P0[1], T[1], a)];
        scale = Math.max(logMix(s0, s1, a), coverAround(P, clipToScreen(box, vw, vh)));
      } else {
        const e = ease(clamp((p - 0.55) / 0.37));
        box = screen;
        P = T;
        ivoryEdge = 1 - e;
        // Cover only what the ivory has not reached yet.
        const open = narrow
          ? { l: 0, t: 0, w: vw, h: Math.max(1, vh * ivoryEdge + vh * 0.12) }
          : { l: 0, t: 0, w: Math.max(1, vw * ivoryEdge + vw * 0.08), h: vh };
        scale = Math.max(logMix(s1, sMatch, e), coverAround(P, clipToScreen(open, vw, vh)));
        closeOpacity = clamp((p - 0.64) / 0.16);
      }

      frame.style.visibility = "visible";
      frame.style.opacity = String(Math.min(clamp(p / 0.06), 1 - clamp((p - 0.92) / 0.06)));
      frame.style.clipPath = `inset(${box.t}px ${vw - box.l - box.w}px ${vh - box.t - box.h}px ${box.l}px round ${mix(14, 0, clamp((p - 0.06) / 0.39))}px)`;
      // If a different card is centred, the still fades across it.
      wide.style.opacity = isLast ? "1" : String(clamp(p / 0.06));
      wide.style.width = `${iw * scale}px`;
      wide.style.height = `${ih * scale}px`;
      wide.style.left = `${P[0] - ax * iw * scale}px`;
      wide.style.top = `${P[1] - ay * ih * scale}px`;

      // Ivory along a shallow curve: a large ellipse whose near edge sweeps
      // across, bulging slightly at its middle, like the basin rim.
      if (narrow) {
        const ry = vh * 2.2;
        const edge = vh * ivoryEdge;
        ivory.style.clipPath = `ellipse(${vw * 1.6}px ${ry}px at 50% ${edge + ry}px)`;
      } else {
        const rx = vw * 2.2;
        const edge = vw * ivoryEdge;
        ivory.style.clipPath = `ellipse(${rx}px ${vh * 1.6}px at ${edge + rx}px 50%)`;
      }
      ivory.style.visibility = p >= 0.55 ? "visible" : "hidden";

      // The close-up starts at the wide cap's size (the wide shot may need a
      // little more scale than a match to cover the screen) and settles to
      // its own, about T, so the cap size never jumps.
      const wideCollar = WIDE.collar * scale;
      const closeCollar = CLOSE.collar * (close0.w / CLOSE.w);
      const k = mix(wideCollar / closeCollar, 1, ease(clamp((p - 0.64) / 0.28)));
      close.style.opacity = String(closeOpacity);
      close.style.left = `${T[0] - (T[0] - close0.l) * k}px`;
      close.style.top = `${T[1] - (T[1] - close0.t) * k}px`;
      close.style.width = `${close0.w * k}px`;
      close.style.height = `${close0.h * k}px`;

      if (hiddenCard !== card) {
        showCard();
        hiddenCard = card;
      }
      card.style.opacity = "0";
    };

    const trigger = ScrollTrigger.create({
      trigger: spacer,
      // Once Section 04's controls have risen clear, so the handover never
      // covers the carousel while the visitor is still using it.
      start: "top 70%",
      endTrigger: stage,
      end: () => `top top+=${headerHeight()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        startScroll = self.start;
        render(self.progress);
      },
      onRefresh: (self) => {
        startScroll = self.start;
        render(self.progress);
      },
    });
    const onResize = () => render(progress);
    window.addEventListener("resize", onResize);
    return () => {
      trigger.kill();
      window.removeEventListener("resize", onResize);
      reset();
    };
  }, [still]);

  if (still) return null;
  return (
    <>
      {/* Scroll room for the handover, over Section 04's olive field. */}
      <div className="bottle-handover-spacer" ref={spacerRef} aria-hidden="true" />
      {createPortal(
        <div className="bottle-handover" ref={frameRef} aria-hidden="true">
          <img ref={wideRef} className="bottle-handover-wide" src={WIDE.src} alt="" />
          <div ref={ivoryRef} className="bottle-handover-ivory" />
          <img
            ref={closeRef}
            className="bottle-handover-close"
            src={bottle.kind === "image" ? bottle.src : ""}
            alt=""
          />
        </div>,
        document.body,
      )}
    </>
  );
}

function clipToScreen(box: Rect, vw: number, vh: number): Rect {
  const l = Math.max(box.l, 0);
  const t = Math.max(box.t, 0);
  return {
    l,
    t,
    w: Math.max(1, Math.min(box.l + box.w, vw) - l),
    h: Math.max(1, Math.min(box.t + box.h, vh) - t),
  };
}
