/**
 * Responsive photography from src/assets (style guide 13.4, Architecture.md 9).
 *
 * Asset records in src/data/records.ts point at an original by its project path,
 * for example "/src/assets/series/Serene Salon Hair Wash.png". Only originals
 * listed below are imported, so unused photos in src/assets never reach the
 * build. Originals are not served as they are: Astro generates AVIF and WebP
 * sources plus a JPEG fallback at a few widths.
 *
 * To use another photo: import it here, then point an asset record at its path.
 * tests/build.test.mjs fails if a record points at a file that is not listed.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

import treatmentHero from '../assets/series/Relaxing Shampoo Basin Scalp Massage.png';
import treatmentWide from '../assets/series/Calming Scalp Massage at KOMO.png';
import healthConsultation from '../assets/series/Serene KOMO Spa Consultation.png';
import joyMassage from '../assets/series/KOMO Spa Head Massage Relaxation.png';
import beautyMirror from '../assets/series/Calm KOMO Spa Blow-Dry Scene.png';
import vitalityDeparture from '../assets/series/Warm Spa Locker Moment.png';
import arrivalSignage from '../assets/series/Welcoming KOMO Wellness Reception.png';
import flowArchitecture from '../assets/Warm Minimalist Salon Interior.png';
import assessmentDetail from '../assets/series/Modern KOMO Scalp Consultation.png';
import waterDetail from '../assets/series/Serene Salon Hair Wash.png';
import linenDetail from '../assets/Warm Modern Spa Shampoo Lounge.png';
import hairTexture from '../assets/series/Relaxing Head Massage in a Spa.png';
import entrance from '../assets/Bright KOMO Scalp Care Clinic Storefront.png';
import therapistPortrait from '../assets/series/Bright Salon Hair Wash Spa Moment.png';

const originals: Record<string, ImageMetadata> = {
  '/src/assets/series/Relaxing Shampoo Basin Scalp Massage.png': treatmentHero,
  '/src/assets/series/Calming Scalp Massage at KOMO.png': treatmentWide,
  '/src/assets/series/Serene KOMO Spa Consultation.png': healthConsultation,
  '/src/assets/series/KOMO Spa Head Massage Relaxation.png': joyMassage,
  '/src/assets/series/Calm KOMO Spa Blow-Dry Scene.png': beautyMirror,
  '/src/assets/series/Warm Spa Locker Moment.png': vitalityDeparture,
  '/src/assets/series/Welcoming KOMO Wellness Reception.png': arrivalSignage,
  '/src/assets/Warm Minimalist Salon Interior.png': flowArchitecture,
  '/src/assets/series/Modern KOMO Scalp Consultation.png': assessmentDetail,
  '/src/assets/series/Serene Salon Hair Wash.png': waterDetail,
  '/src/assets/Warm Modern Spa Shampoo Lounge.png': linenDetail,
  '/src/assets/series/Relaxing Head Massage in a Spa.png': hairTexture,
  '/src/assets/Bright KOMO Scalp Care Clinic Storefront.png': entrance,
  '/src/assets/series/Bright Salon Hair Wash Spa Moment.png': therapistPortrait,
};

const DEFAULT_WIDTHS = [480, 800, 1200, 1600];

export interface ResponsiveImage {
  width: number;
  height: number;
  avif: string;
  webp: string;
  fallbackSrc: string;
  fallbackSrcSet: string;
}

export const registeredPhotoPaths = Object.keys(originals);

export async function responsiveImage(src: string, widths = DEFAULT_WIDTHS): Promise<ResponsiveImage> {
  const meta = originals[src];
  if (!meta) throw new Error(`Image not registered in src/lib/images.ts: ${src}`);
  // Never upscale: keep widths below the original, then add the original width.
  const usable = [...new Set([...widths.filter((w) => w < meta.width), meta.width])];
  const [avif, webp, jpg] = await Promise.all(
    (['avif', 'webp', 'jpg'] as const).map((format) =>
      getImage({ src: meta, widths: usable, format, quality: format === 'jpg' ? 78 : 62 }),
    ),
  );
  return {
    width: meta.width,
    height: meta.height,
    avif: avif.srcSet.attribute,
    webp: webp.srcSet.attribute,
    fallbackSrc: jpg.src,
    fallbackSrcSet: jpg.srcSet.attribute,
  };
}
