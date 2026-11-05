/**
 * Local image registry. Asset records store a path relative to src/assets/;
 * this resolves it to Astro image metadata so components can emit responsive,
 * re-encoded sources (style guide 13.4) instead of shipping the originals.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/**/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

export function resolveImage(src: string): ImageMetadata {
  const found = files[`../assets/${src}`];
  if (!found) throw new Error(`Image file not found in src/assets/: ${src}`);
  return found.default;
}
