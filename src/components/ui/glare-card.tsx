/**
 * Glare card — from Aceternity UI (`npx shadcn@latest add @aceternity/glare-card-demo`),
 * adapted for KOMO:
 * - sized and shaped by the caller: `containerClassName` sets the size and
 *   the `--radius` custom property sets the corners (any border-radius
 *   value, including per-corner arches), instead of a fixed 320px card
 * - the surface comes from `className`; the content layer is not blended, so
 *   text keeps its own colour on light glass
 * - no foil logo pattern and no console logging
 * - reduced motion: no tilt and no glare
 * - `--foil-strength` (0–1, default 1) scales the rainbow foil against the
 *   glare, for cards with text on a light face
 */
import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const GlareCard = ({
  children,
  className,
  containerClassName,
  tilt = 0.4,
}: {
  children: ReactNode;
  /** The card face (background, padding, layout). */
  className?: string;
  /** The outer box (size). Defaults to the original 320px, 17:21 card. */
  containerClassName?: string;
  /** How far the card tilts towards the pointer (0 keeps it flat). */
  tilt?: number;
}) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  });

  const containerStyle = {
    "--m-x": "50%",
    "--m-y": "50%",
    "--r-x": "0deg",
    "--r-y": "0deg",
    "--bg-x": "50%",
    "--bg-y": "50%",
    "--duration": "300ms",
    "--foil-size": "100%",
    "--opacity": "0",
    "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
  } as CSSProperties;

  const backgroundStyle = {
    "--step": "5%",
    "--pattern": "none",
    "--rainbow":
      "repeating-linear-gradient( 0deg,rgb(255,119,115) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
    "--diagonal":
      "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
    "--shade":
      "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
    backgroundBlendMode: "hue, hue, hue, overlay",
  } as CSSProperties;

  const updateStyles = () => {
    const element = refElement.current;
    if (!element) return;
    const { background, rotate, glare } = state.current;
    element.style.setProperty("--m-x", `${glare.x}%`);
    element.style.setProperty("--m-y", `${glare.y}%`);
    element.style.setProperty("--r-x", `${rotate.x}deg`);
    element.style.setProperty("--r-y", `${rotate.y}deg`);
    element.style.setProperty("--bg-x", `${background.x}%`);
    element.style.setProperty("--bg-y", `${background.y}%`);
  };

  return (
    <div
      style={containerStyle}
      className={cn(
        "relative isolate transition-transform delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform [contain:layout_style] [perspective:600px]",
        containerClassName ?? "[aspect-ratio:17/21] w-[320px]",
      )}
      ref={refElement}
      onPointerMove={(event) => {
        if (prefersReducedMotion()) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const percentage = {
          x: (100 / rect.width) * (event.clientX - rect.left),
          y: (100 / rect.height) * (event.clientY - rect.top),
        };
        const delta = { x: percentage.x - 50, y: percentage.y - 50 };

        const { background, rotate, glare } = state.current;
        background.x = 50 + percentage.x / 4 - 12.5;
        background.y = 50 + percentage.y / 3 - 16.67;
        rotate.x = -(delta.x / 3.5) * tilt;
        rotate.y = (delta.y / 2) * tilt;
        glare.x = percentage.x;
        glare.y = percentage.y;

        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        setTimeout(() => {
          if (isPointerInside.current) refElement.current?.style.setProperty("--duration", "0s");
        }, 300);
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        const element = refElement.current;
        if (!element) return;
        element.style.removeProperty("--duration");
        element.style.setProperty("--r-x", "0deg");
        element.style.setProperty("--r-y", "0deg");
      }}
    >
      <div className="grid h-full origin-center [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] overflow-hidden rounded-[var(--radius,48px)] transition-transform delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform hover:filter-none hover:[--duration:200ms] hover:[--easing:linear] hover:[--opacity:0.6] motion-reduce:hover:[--opacity:0]">
        <div className="grid h-full w-full [clip-path:inset(0_0_0_0_round_var(--radius,48px))] [grid-area:1/1]">
          <div className={cn("h-full w-full", className)}>{children}</div>
        </div>
        {/* Glare: a soft light that follows the pointer. */}
        <div
          aria-hidden="true"
          className="pointer-events-none grid h-full w-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] [clip-path:inset(0_0_1px_0_round_var(--radius,48px))] [grid-area:1/1]"
        />
        {/* Foil: rainbow and diagonal sheen, offset by the pointer. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative grid h-full w-full opacity-[calc(var(--opacity)*var(--foil-strength,1))] mix-blend-color-dodge transition-opacity [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] [background-blend-mode:hue_hue_hue_overlay] [clip-path:inset(0_0_1px_0_round_var(--radius,48px))] [grid-area:1/1] after:bg-[inherit] after:mix-blend-exclusion after:content-[''] after:[background-blend-mode:soft-light,_hue,_hard-light] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-size:var(--foil-size),_200%_400%,_800%,_200%]"
          style={backgroundStyle}
        />
      </div>
    </div>
  );
};
