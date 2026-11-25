// KOMO contour motif: a static asset of evenly spaced contour lines in a
// 600×400 box, corner at the top-left; each placement crops it with its frame.
// Stroke and colour (currentColor) are defined in the file. To use the
// original KOMO artwork, replace the file and keep the viewBox and the
// `lines` group id.
const CONTOUR_SRC = "/images/komo-contour.svg#lines";

export function WaveCorner() {
  return (
    <svg
      className="wave-corner"
      viewBox="0 0 600 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <use href={CONTOUR_SRC} />
    </svg>
  );
}
