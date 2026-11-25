import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Arrow } from "@/components/Arrow";
import { WaveCorner } from "@/components/WaveCorner";
import { VISIT_HREF } from "@/content/contact";
import { Hero } from "@/sections/Hero";
import { Sessions } from "@/sections/Sessions";
import { FirstVisit } from "@/sections/FirstVisit";
import { Product } from "@/sections/Product";
import { Outlets } from "@/sections/Outlets";
import { Reviews } from "@/sections/Reviews";
import { ArrangeVisit } from "@/sections/ArrangeVisit";
import { Faq } from "@/sections/Faq";
import { SiteFooter } from "@/sections/Footer";

/* ---------------------------------------------------------------------------
 * 01 Header
 * Slim sticky ivory bar: Menu (disclosure) left, KOMO logo centred,
 * Request a Visit right. Copy and links: docs/content/KOMO_Homepage_Content.md.
 * The EN / 中文 switch is deferred by the owner; no placeholder control.
 * ------------------------------------------------------------------------- */

// Existing routes are kept; "#concerns" is the homepage anchor for section 04
// and resolves once that section is built.
const menuLinks = [
  { label: "Services", href: "/treatments/" },
  { label: "Scalp & Hair Concerns", href: "#concerns" },
  { label: "Your First Visit", href: "/first-visit/" },
  { label: "About KOMO", href: "/about/" },
  { label: "Locations", href: "/locations/" },
];

// Handover: switch to "#arrange-your-visit" (section 09) once it is built.
// Until then keep the existing visit-request route.
const REQUEST_VISIT_HREF = VISIT_HREF;

// The panel is revealed by a clip from the Menu side; the contour inside it
// never moves (design rule: lines stay still, panels uncover them).
// Visibility is hidden once closed, so closed links leave the tab order.
const menuPanelVariants: Variants = {
  open: { clipPath: "inset(0% 0% 0% 0%)", visibility: "visible" },
  closed: { clipPath: "inset(0% 100% 0% 0%)", transitionEnd: { visibility: "hidden" } },
};

const menuLinkVariants: Variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -16 },
};

/**
 * The header is transparent, so each control (Menu, logo, Request a Visit)
 * reads what lies directly beneath it and takes ivory over photographs and
 * dark fields, olive over light ones. An ancestor's `data-header-tone`
 * ("light" = ivory text, "dark" = olive text) overrides the measurement.
 * Sampled every frame for a moment after scrolling, resizing, clicks and
 * keys (scrubbed animations keep moving briefly), and every 400ms otherwise
 * to catch changes such as the intro loader lifting.
 */
// Small downscaled copies of photographs, to read their brightness.
const photoSamples = new WeakMap<
  HTMLImageElement,
  { src: string; data: Uint8ClampedArray; w: number; h: number }
>();

/** Ivory over a dark part of a photograph, olive over a light part. */
function photoTone(img: HTMLImageElement, x: number, y: number): "light" | "dark" {
  if (!img.complete || !img.naturalWidth) return "light";
  let sample = photoSamples.get(img);
  if (!sample || sample.src !== img.currentSrc) {
    const w = 64;
    const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return "light";
    context.drawImage(img, 0, 0, w, h);
    sample = { src: img.currentSrc, data: context.getImageData(0, 0, w, h).data, w, h };
    photoSamples.set(img, sample);
  }
  // Map the point into the image, allowing for object-fit: cover (centred).
  const rect = img.getBoundingClientRect();
  const cover = getComputedStyle(img).objectFit === "cover";
  const scale = cover
    ? Math.max(rect.width / sample.w, rect.height / sample.h)
    : rect.width / sample.w;
  const offsetX = (rect.width - sample.w * scale) / 2;
  const offsetY = cover ? (rect.height - sample.h * scale) / 2 : 0;
  let total = 0;
  let count = 0;
  for (const dx of [-16, 0, 16]) {
    for (const dy of [-8, 0, 8]) {
      const px = Math.floor((x + dx - rect.left - offsetX) / scale);
      const py = Math.floor((y + dy - rect.top - offsetY) / scale);
      if (px < 0 || py < 0 || px >= sample.w || py >= sample.h) continue;
      const i = (py * sample.w + px) * 4;
      total +=
        (0.2126 * sample.data[i] + 0.7152 * sample.data[i + 1] + 0.0722 * sample.data[i + 2]) / 255;
      count++;
    }
  }
  return count && total / count > 0.55 ? "dark" : "light";
}

function toneBeneath(header: HTMLElement, x: number, y: number): "light" | "dark" {
  // Walk down the stack beneath the point and use the first thing that is
  // actually painted there: a tagged area, a photograph or an opaque fill.
  // Transparent wrappers (sections, pin spacers) are looked through.
  for (const element of document.elementsFromPoint(x, y)) {
    if (header.contains(element)) continue;
    const tagged = element.closest<HTMLElement>("[data-header-tone]");
    if (tagged) return tagged.dataset.headerTone === "light" ? "light" : "dark";
    if (element instanceof HTMLImageElement) return photoTone(element, x, y);
    const fill = getComputedStyle(element).backgroundColor;
    const match = fill.match(/[\d.]+/g);
    if (!match) continue;
    // rgb() reports 0–255; color(srgb …) (e.g. from color-mix) reports 0–1.
    const scale = fill.startsWith("color(") ? 1 : 255;
    const [r, g, b, a = "1"] = match;
    if (Number(a) < 0.5) continue;
    const lum = (0.2126 * Number(r) + 0.7152 * Number(g) + 0.0722 * Number(b)) / scale;
    return lum < 0.4 ? "light" : "dark";
  }
  return "light";
}

function useHeaderTones(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const controls = Array.from(
      header.querySelectorAll<HTMLElement>(".menu-toggle, .wordmark, .header-cta"),
    );
    let frame = 0;
    let until = 0;
    const update = () => {
      const y = header.offsetHeight / 2;
      for (const control of controls) {
        // Left, centre and right: a control spanning two backgrounds (e.g. a
        // dark panel beside a bright photo) is marked "mixed".
        const rect = control.getBoundingClientRect();
        const tones = new Set(
          [rect.left + 6, rect.left + rect.width / 2, rect.right - 6].map((x) =>
            toneBeneath(header, x, y),
          ),
        );
        control.dataset.tone = tones.size === 1 ? [...tones][0] : "mixed";
      }
    };
    const loop = () => {
      update();
      frame = performance.now() < until ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      until = performance.now() + 900;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    wake();
    const idle = window.setInterval(update, 400);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("click", wake);
    document.addEventListener("keydown", wake);
    window.addEventListener("load", wake);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(idle);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("click", wake);
      document.removeEventListener("keydown", wake);
      window.removeEventListener("load", wake);
    };
  }, [headerRef]);
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const ease = [0.65, 0, 0.35, 1] as const;

  useHeaderTones(headerRef);

  // Disclosure behaviour: Escape closes and returns focus to Menu; a pointer
  // press outside the header closes without moving focus.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header
      className="site-header"
      ref={headerRef}
      data-menu-open={open || undefined}
      // Tabbing out of the header closes the menu; clicks on empty panel
      // space (no relatedTarget) are left alone.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (open && next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="menu-toggle"
        ref={toggleRef}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menu-icon" aria-hidden="true" />
        Menu
      </button>

      <motion.div
        className="menu-scrim"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
      />

      <motion.div
        id="site-menu"
        className="menu-panel"
        initial={false}
        animate={open ? "open" : "closed"}
        variants={menuPanelVariants}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
      >
        <nav aria-label="Main">
          <motion.ul
            className="menu-links"
            variants={{
              open: {
                transition: reduceMotion ? {} : { staggerChildren: 0.05, delayChildren: 0.15 },
              },
              closed: {},
            }}
          >
            {menuLinks.map((link) => (
              <motion.li
                key={link.label}
                variants={menuLinkVariants}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease }}
              >
                <a className="menu-link" href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
        <div className="menu-contour" aria-hidden="true">
          <WaveCorner />
        </div>
      </motion.div>

      <a className="wordmark" href="/" aria-label="KOMO Wellness, home" />

      <a className="header-cta" href={REQUEST_VISIT_HREF}>
        Request a Visit <Arrow />
      </a>
    </header>
  );
}

export default function App() {
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
  }, []);

  return (
    <>
      <SiteHeader />
      {/* Sections are built one at a time; see docs/homepage/KOMO_HOMEPAGE_BASELINE.md. */}
      <main id="main">
        <Hero />
        <Sessions />
        {/* 04 What brings you in? is pending and will sit here. */}
        <FirstVisit />
        <Product />
        <Outlets />
        <Reviews />
        <ArrangeVisit />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
