/**
 * Shared geometry for the pinned hero (02) and session (03) scenes, so the
 * hero's contracted photo lands exactly on the session counter square.
 */

/** Both scenes pin only when there is room and motion is allowed. */
export const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

export const headerHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;

/** Mirrors --session-square and --session-square-radius in index.css. */
export function squareMetrics() {
  const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
  return {
    size: Math.min(22 * vmin, 220),
    radius: Math.min(32, Math.max(20, 2.6 * vmin)),
  };
}

/** Fired by 03 when its pinned/flow mode changes, so 02 can rebuild its ending. */
export const STAGE_CHANGE_EVENT = "komo:stage-change";
