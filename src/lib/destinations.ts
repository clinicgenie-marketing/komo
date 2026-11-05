/**
 * External destination registry (Architecture.md 6, 10).
 * A destination only becomes a link once it is verified, approved and uses an
 * allowlisted protocol. Otherwise preview builds point to the on-page
 * appointment guidance, and production builds fail via the publication guard.
 */
import type { Destination } from './schema.ts';
import { isPublishable } from './publication.ts';

const ALLOWED_PROTOCOLS = new Set(['https:', 'tel:', 'mailto:']);

export function safeExternalUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export interface ResolvedDestination {
  /** Real destination URL, or null while unverified. */
  href: string | null;
  label: string;
  opensNewTab: boolean;
}

export function resolveDestination(d: Destination): ResolvedDestination {
  const href = isPublishable(d) ? safeExternalUrl(d.url) : null;
  return { href, label: d.label, opensNewTab: d.opensNewTab };
}

/** In-page anchor for the appointment guidance section on every concept. */
export const APPOINTMENT_SECTION_ID = 'appointment';
