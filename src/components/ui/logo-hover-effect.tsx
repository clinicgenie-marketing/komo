import { useEffect, useId, useRef, useState, type Ref } from "react";
import logoSource from "../../../public/images/komo-logo.svg?raw";

// The logo's <path> elements, reused as one shape for every layer below.
const LOGO_PATHS = logoSource.slice(logoSource.indexOf("<path"), logoSource.lastIndexOf("</svg>"));
const VIEW_W = 4335;
const VIEW_H = 1647;

/**
 * KOMO logo with a cursor-following hover effect, adapted from Aceternity's
 * TextHoverEffect: on hover an outline draws in and a sage spotlight
 * tracks the pointer across the letterforms. The base logo uses currentColor.
 */
export function LogoHoverEffect({
  className,
  ref,
}: {
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const spotRef = useRef<SVGRadialGradientElement>(null);
  const [hovered, setHovered] = useState(false);
  const target = useRef({ x: VIEW_W / 2, y: VIEW_H / 2 });
  const current = useRef({ x: VIEW_W / 2, y: VIEW_H / 2 });

  // Ease the spotlight towards the pointer for a soft trailing motion.
  useEffect(() => {
    if (!hovered) return;
    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      spotRef.current?.setAttribute("cx", `${current.current.x}`);
      spotRef.current?.setAttribute("cy", `${current.current.y}`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered]);

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    target.current = {
      x: ((event.clientX - box.left) / box.width) * VIEW_W,
      y: ((event.clientY - box.top) / box.height) * VIEW_H,
    };
  };

  const handleEnter = (event: React.PointerEvent<SVGSVGElement>) => {
    handleMove(event);
    // Start the spotlight under the pointer rather than sliding in from the centre.
    current.current = { ...target.current };
    setHovered(true);
  };

  const shape = `#${id}-shape`;

  return (
    <div className={className} ref={ref} aria-hidden="true">
      <svg
        ref={svgRef}
        className={`logo-hover${hovered ? " is-hovered" : ""}`}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={() => setHovered(false)}
      >
        <defs>
          <g id={`${id}-shape`} dangerouslySetInnerHTML={{ __html: LOGO_PATHS }} />
          <radialGradient
            id={`${id}-spot`}
            ref={spotRef}
            gradientUnits="userSpaceOnUse"
            r={VIEW_W * 0.22}
            cx={VIEW_W / 2}
            cy={VIEW_H / 2}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="45%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id={`${id}-mask`}>
            <rect width="100%" height="100%" fill={`url(#${id}-spot)`} />
          </mask>
        </defs>

        {/* Base logo, as before. */}
        <use href={shape} className="logo-hover-base" />
        {/* Outline that draws in on hover. */}
        <use href={shape} className="logo-hover-outline" />
        {/* Sage fill revealed under the pointer. */}
        <g className="logo-hover-spot" mask={`url(#${id}-mask)`}>
          <use href={shape} />
        </g>
      </svg>
    </div>
  );
}
