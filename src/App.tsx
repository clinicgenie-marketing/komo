import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Arrow } from "@/components/Arrow";
import { WaveCorner } from "@/components/WaveCorner";
import { arrangeVisit } from "@/content/arrangeVisit";
import {
  HEADER_CTA,
  type LanguageCode,
  bookingChoices,
  languages,
  menuLinks,
} from "@/content/header";
import { Hero } from "@/sections/Hero";
import { Concerns } from "@/sections/Concerns";
import { Sessions } from "@/sections/Sessions";
import { FirstVisit } from "@/sections/FirstVisit";
import { ProductRange } from "@/sections/ProductRange";
import { Outlets } from "@/sections/Outlets";
import { Reviews } from "@/sections/Reviews";
import { ArrangeVisit } from "@/sections/ArrangeVisit";
import { SiteFooter } from "@/sections/Footer";

/* ---------------------------------------------------------------------------
 * 00 Header
 * Full-width fixed bar in three zones: Menu (disclosure) left, the KOMO
 * wordmark at the true viewport centre, EN / 中文 and the booking pill right.
 * Clear over photography; a solid surface (ivory or green, following the
 * section beneath) once the page turns text-led. Below 900px the language
 * switch moves into the menu. Labels, links and choices: src/content/header.ts.
 * ------------------------------------------------------------------------- */

// The booking choices drop from the pill; same open/close as the menu panel.
const bookingVariants: Variants = {
  open: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, visibility: "visible" },
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    opacity: 0,
    transitionEnd: { visibility: "hidden" },
  },
};

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

/**
 * Mist layers (e.g. the hero's fog) let clicks through, so elementsFromPoint
 * never returns them. An element with `data-header-mist="0.6"` counts as a
 * light, solid surface over the lower 60% of its box while it is visible.
 */
function mistBeneath(x: number, y: number) {
  for (const mist of document.querySelectorAll<HTMLElement>("[data-header-mist]")) {
    const rect = mist.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;
    if (Number(getComputedStyle(mist).opacity) < 0.5) continue;
    if (y >= rect.bottom - rect.height * Number(mist.dataset.headerMist)) return true;
  }
  return false;
}

function toneBeneath(
  header: HTMLElement,
  x: number,
  y: number,
  /** Look through buttons and links (for the bar's surface: a control
      passing under the header is not the page's colour). */
  skipControls = false,
): "light" | "dark" {
  if (mistBeneath(x, y)) return "dark";
  // Walk down the stack beneath the point and use the first thing that is
  // actually painted there: a tagged area, a photograph or an opaque fill.
  // Transparent wrappers (sections, pin spacers) are looked through.
  for (const element of document.elementsFromPoint(x, y)) {
    if (header.contains(element)) continue;
    if (skipControls && element.closest("a, button, input, textarea, select, [role=button]")) {
      continue;
    }
    const tagged = element.closest<HTMLElement>("[data-header-tone]");
    if (tagged) return tagged.dataset.headerTone === "light" ? "light" : "dark";
    if (element instanceof HTMLImageElement && !element.closest("[data-header-solid]")) {
      return photoTone(element, x, y);
    }
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

/** True when the first painted thing beneath the point is a photograph. */
function photoBeneath(header: HTMLElement, x: number, y: number) {
  if (mistBeneath(x, y)) return false;
  for (const element of document.elementsFromPoint(x, y)) {
    if (header.contains(element)) continue;
    // Photographs inside a text-led section ([data-header-solid]) don't
    // count: the bar stays solid over them.
    if (element instanceof HTMLImageElement) return !element.closest("[data-header-solid]");
    const match = getComputedStyle(element).backgroundColor.match(/[\d.]+/g);
    if (match && Number(match[3] ?? "1") >= 0.5) return false;
  }
  return false;
}

/**
 * Header surface: "clear" while any part of the bar sits over a photograph,
 * otherwise a solid surface matching the section beneath ("ivory" over light
 * fields, "green" over dark ones), so the controls always read.
 */
function headerSurface(header: HTMLElement, y: number) {
  const width = header.clientWidth;
  const xs = [0.04, 0.25, 0.5, 0.75, 0.96].map((f) => width * f);
  if (xs.some((x) => photoBeneath(header, x, y))) return "clear";
  return toneBeneath(header, width / 2, y, true) === "light" ? "green" : "ivory";
}

function useHeaderTones(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const controls = Array.from(
      header.querySelectorAll<HTMLElement>(".menu-toggle, .wordmark, .header-lang, .header-cta"),
    );
    let frame = 0;
    let until = 0;
    const update = () => {
      // An open dropdown (Radix) turns pointer events off on the page, which
      // hides everything from elementsFromPoint: hold the current tones.
      if (document.body.style.pointerEvents === "none") return;
      const y = header.offsetHeight / 2;
      const surface = headerSurface(header, y);
      if (header.dataset.surface !== surface) header.dataset.surface = surface;
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

/** EN / 中文 toggle. Both copies (bar and menu) share one state. */
function LanguageSwitch({
  className,
  value,
  onChange,
}: {
  className: string;
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
}) {
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Language">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          lang={language.code}
          aria-pressed={language.code === value}
          aria-label={language.name}
          onClick={() => onChange(language.code)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

type Panel = "menu" | "booking" | null;

function SiteHeader() {
  const [panel, setPanel] = useState<Panel>(null);
  // Toggle state only for now; the Chinese site is connected here later.
  const [language, setLanguage] = useState<LanguageCode>("en");
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const bookingRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const ease = [0.65, 0, 0.35, 1] as const;
  const menuOpen = panel === "menu";
  const bookingOpen = panel === "booking";

  useHeaderTones(headerRef);

  // Disclosure behaviour: Escape closes and returns focus to the control that
  // opened the panel; a pointer press outside the header closes without
  // moving focus.
  useEffect(() => {
    if (!panel) return;
    const opener = panel === "menu" ? toggleRef : bookingRef;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanel(null);
      opener.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [panel]);

  const toggle = (next: Exclude<Panel, null>) =>
    setPanel((current) => (current === next ? null : next));

  return (
    <header
      className="site-header"
      ref={headerRef}
      data-menu-open={menuOpen || undefined}
      data-booking-open={bookingOpen || undefined}
      // Tabbing out of the header closes any panel; clicks on empty panel
      // space (no relatedTarget) are left alone.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (panel && next && !event.currentTarget.contains(next)) setPanel(null);
      }}
    >
      <button
        type="button"
        className="menu-toggle"
        ref={toggleRef}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        onClick={() => toggle("menu")}
      >
        <span className="menu-icon" aria-hidden="true" />
        Menu
      </button>

      <motion.div
        className="menu-scrim"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
        onClick={() => setPanel(null)}
      />

      <motion.div
        id="site-menu"
        className="menu-panel"
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={menuPanelVariants}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
      >
        <div className="menu-body">
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
                  <a
                    className="menu-link"
                    href={link.href}
                    onClick={link.href ? () => setPanel(null) : undefined}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          {/* Narrow screens only: the bar has no room for it. */}
          <LanguageSwitch className="menu-lang" value={language} onChange={setLanguage} />
        </div>
        <div className="menu-contour" aria-hidden="true">
          <WaveCorner />
        </div>
      </motion.div>

      <a className="wordmark" href="/" aria-label="KOMO Wellness, home" />

      <div className="header-actions">
        <LanguageSwitch className="header-lang" value={language} onChange={setLanguage} />
        <button
          type="button"
          className="header-cta"
          ref={bookingRef}
          aria-expanded={bookingOpen}
          aria-controls="booking-choices"
          onClick={() => toggle("booking")}
        >
          {HEADER_CTA}
          <Arrow />
        </button>
        <motion.div
          id="booking-choices"
          className="booking-choices"
          initial={false}
          animate={bookingOpen ? "open" : "closed"}
          variants={bookingVariants}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
        >
          <p className="booking-choices-label" id="booking-choices-label">
            {arrangeVisit.selectorLabel}
          </p>
          <ul aria-labelledby="booking-choices-label">
            {bookingChoices.map((choice) => (
              <li key={choice.label}>
                <a className="booking-choice" href={choice.href} onClick={() => setPanel(null)}>
                  {choice.label}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
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
        <Concerns />
        <Sessions />
        <FirstVisit />
        <ProductRange />
        <Outlets />
        <Reviews />
        <ArrangeVisit />
      </main>
      <SiteFooter />
    </>
  );
}
