/* ---------------------------------------------------------------------------
 * Section 02 → 03 handover: a scroll-driven zoom through the mirror.
 *
 * One fixed frame (`.handover`) carries one photograph through two
 * keyframes, both measured live from the page on every update:
 *   K0  the chosen mirror: its box, arch, crop and ivory veil, exactly
 *   K1  an arch larger than the viewport, the photograph covering the screen
 * The photograph's focal point is anchored the way CSS object-position
 * anchors it (focus fraction of the image on the same fraction of the box),
 * so the start matches the real mirror pixel for pixel and the detail
 * (e.g. water meeting the hairline) stays in view throughout. In between,
 * scale and focal point ease between the keyframes and the scale never
 * drops below what covers the visible part of the frame. The full-screen
 * photograph then fades away, whole, over the session strip.
 *
 * Progress p (0–1) runs from Section 02 filling the screen (its scroll-lock
 * point) to the strip at the top of the viewport, so it reverses with scroll:
 *   0.00–0.06  the frame fades in over the mirror; its text and glare go
 *   0.06–0.40  the reflection grows towards the viewer, the arch passing
 *              beyond the screen edges; the veil clears; other mirrors fall
 *   0.40–0.52  hold on the full-screen photograph
 *   0.52–0.95  the whole screen fades from the photograph into Section 03,
 *              which scrolls into place beneath it (no shrinking)
 * Route: scalp cleansing → Signature; head massage → Waterfall; anything
 * else (no choice, information-only) → the centre mirror into Advanced, a
 * visual default only. Reduced motion: none of this; the strip is in flow.
 * ------------------------------------------------------------------------- */
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mirrors } from "@/content/concerns";
import { sessions } from "@/content/sessions";
import { getSessionMatches, subscribeSessionMatches } from "@/lib/sessionMatch";

gsap.registerPlugin(ScrollTrigger);

type Box = { l: number; t: number; w: number; h: number; rx: number; ry: number; rb: number };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => (value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixBox = (a: Box, b: Box, t: number): Box => ({
  l: mix(a.l, b.l, t),
  t: mix(a.t, b.t, t),
  w: mix(a.w, b.w, t),
  h: mix(a.h, b.h, t),
  rx: mix(a.rx, b.rx, t),
  ry: mix(a.ry, b.ry, t),
  rb: mix(a.rb, b.rb, t),
});

/** "62% 30%" → [0.62, 0.3]. */
function parseFocus(focus = "50% 50%"): [number, number] {
  const [x = 50, y = 50] = focus.split(/\s+/).map((part) => parseFloat(part));
  return [x / 100, y / 100];
}

/** Which mirror (and session panel) the zoom travels through. */
function routeIndex() {
  const matches = getSessionMatches();
  const reflecting = mirrors.findIndex((mirror) => matches?.[0] === mirror.reflects);
  if (reflecting >= 0) return reflecting;
  // Head massage matches Waterfall and Meridian; Waterfall is the photograph.
  const massage = mirrors.findIndex((mirror) => matches?.includes(mirror.reflects));
  return massage >= 0 ? massage : 1;
}

export function MirrorHandover({ still }: { still: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    const veil = veilRef.current;
    const mirrorList = document.querySelector<HTMLElement>(".mirrors");
    const strip = document.querySelector<HTMLElement>(".sessions-strip");
    if (still || !frame || !img || !veil || !mirrorList || !strip) return;

    const mirrorEls = () => Array.from(document.querySelectorAll<HTMLElement>(".mirror"));
    const panelEls = () => Array.from(document.querySelectorAll<HTMLElement>(".session-panel"));

    const reset = () => {
      frame.style.visibility = "hidden";
      for (const el of [...mirrorEls(), ...panelEls()]) {
        el.style.opacity = "";
        el.style.translate = "";
      }
    };

    let progress = 0;
    // Scroll position where the sequence starts: the zoom grows from where the
    // mirror sat then, while the page scrolls on beneath the frame.
    let startScroll = 0;
    const render = (p: number) => {
      progress = p;
      // Faded out completely by 0.95.
      if (p <= 0 || p >= 0.96) {
        reset();
        return;
      }
      const index = routeIndex();
      const mirrorEl = mirrorEls()[index];
      const session = sessions.find((s) => s.name === mirrors[index].reflects);
      const source = mirrorEl?.querySelector<HTMLImageElement>(".mirror-reflection");
      if (!mirrorEl || !session || !source) return;

      if (img.getAttribute("src") !== source.getAttribute("src")) {
        img.src = source.getAttribute("src")!;
      }
      // The mirror's own photograph when it has one (its focus with it).
      const mirror = mirrors[index];
      const [fx, fy] = parseFocus(mirror.image ? mirror.focus : session.focus);
      const iw = source.naturalWidth || img.naturalWidth || 1600;
      const ih = source.naturalHeight || img.naturalHeight || 1000;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const narrow = vw <= 720;

      // K0: the mirror as it sat at the start (a semicircular arch, or a
      // lower ellipse on phones).
      const m = mirrorEl.getBoundingClientRect();
      const k0: Box = {
        l: m.left,
        t: m.top + (window.scrollY - startScroll),
        w: m.width,
        h: m.height,
        rx: m.width / 2,
        ry: narrow ? m.width * 0.34 : m.width / 2,
        rb: narrow ? 22 : 24,
      };
      // K1: the same arch, grown until it lies beyond every screen edge.
      const w1 = vw * 1.3;
      const ry1 = (w1 / 2) * (k0.ry / k0.rx);
      const k1: Box = {
        l: (vw - w1) / 2,
        t: -ry1 - 40,
        w: w1,
        h: vh + ry1 + 80,
        rx: w1 / 2,
        ry: ry1,
        rb: 0,
      };
      const screen: Box = { l: 0, t: 0, w: vw, h: vh, rx: 0, ry: 0, rb: 0 };

      const cover = (box: Box) => Math.max(box.w / iw, box.h / ih);
      const anchor = (box: Box): [number, number] => [box.l + fx * box.w, box.t + fy * box.h];

      let clip: Box;
      let scale: number;
      let point: [number, number];
      let veilOpacity = 0;
      if (p < 0.46) {
        const a = ease(clamp((p - 0.06) / 0.34));
        clip = mixBox(k0, k1, a);
        scale = Math.exp(mix(Math.log(cover(k0)), Math.log(cover(screen)), a));
        const [x0, y0] = anchor(k0);
        const [x1, y1] = anchor(screen);
        point = [mix(x0, x1, a), mix(y0, y1, a)];
        veilOpacity = 1 - a;
      } else {
        // Full screen until it has faded away.
        clip = k1;
        scale = cover(screen);
        point = anchor(screen);
      }

      // Never leave a gap: cover the visible part of the frame.
      const left = Math.max(clip.l, 0);
      const right = Math.min(clip.l + clip.w, vw);
      const top = Math.max(clip.t, 0);
      const bottom = Math.min(clip.t + clip.h, vh);
      const [px, py] = point;
      scale = Math.max(
        scale,
        fx > 0 ? (px - left) / (fx * iw) : 0,
        fx < 1 ? (right - px) / ((1 - fx) * iw) : 0,
        fy > 0 ? (py - top) / (fy * ih) : 0,
        fy < 1 ? (bottom - py) / ((1 - fy) * ih) : 0,
      );

      frame.style.visibility = "visible";
      // In over the mirror; out, whole screen, over the session strip.
      frame.style.opacity = String(Math.min(clamp(p / 0.06), 1 - ease(clamp((p - 0.52) / 0.43))));
      frame.style.left = `${clip.l}px`;
      frame.style.top = `${clip.t}px`;
      frame.style.width = `${clip.w}px`;
      frame.style.height = `${clip.h}px`;
      frame.style.borderRadius = `${clip.rx}px ${clip.rx}px ${clip.rb}px ${clip.rb}px / ${clip.ry}px ${clip.ry}px ${clip.rb}px ${clip.rb}px`;
      img.style.width = `${iw * scale}px`;
      img.style.height = `${ih * scale}px`;
      img.style.left = `${px - fx * iw * scale - clip.l}px`;
      img.style.top = `${py - fy * ih * scale - clip.t}px`;
      veil.style.opacity = String(veilOpacity);

      // The other mirrors fall away; the chosen one hides under the frame.
      mirrorEls().forEach((el, i) => {
        const fall = clamp((p - 0.06) / 0.24);
        el.style.opacity = String(i === index ? 1 - clamp(p / 0.06) : 1 - fall);
        el.style.translate = i === index ? "" : `0 ${fall * 48}px`;
      });
      // The other panels come into view alongside; the matching one waits
      // for the frame to land.
      // The strip stays as it is: the photograph fades away over it.
    };

    const trigger = ScrollTrigger.create({
      // Starts exactly where Section 02's scroll lock holds (the section's
      // foot at the viewport's foot), so the zoom never covers the options
      // while the visitor is held there.
      trigger: mirrorList.closest("section") ?? mirrorList,
      start: "bottom bottom",
      endTrigger: strip,
      end: "top top",
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
    const unsubscribe = subscribeSessionMatches(() => render(progress));

    return () => {
      trigger.kill();
      window.removeEventListener("resize", onResize);
      unsubscribe();
      reset();
    };
  }, [still]);

  if (still) return null;
  // Portalled to <body>: inside a section it would sit in that section's
  // stacking context, beneath the sections before it. pointer-events stay
  // on while it is visible, so the header can read the photograph beneath
  // it; it covers the screen then anyway.
  return createPortal(
    <div className="handover" ref={frameRef} aria-hidden="true">
      <img ref={imgRef} alt="" />
      <div className="mirror-veil" ref={veilRef} />
    </div>,
    document.body,
  );
}
