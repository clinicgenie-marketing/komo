export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow-down" : "arrow"} viewBox="0 0 20 20" aria-hidden="true">
      <path d={down ? "M10 3v13m0 0 5-5m-5 5-5-5" : "M3 10h13m0 0-5-5m5 5-5 5"} />
    </svg>
  );
}
