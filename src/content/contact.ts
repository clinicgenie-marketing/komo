/**
 * Shared contact destinations for the homepage.
 *
 * UNCONFIRMED: no Orchard WhatsApp number or legal-page URLs exist in the
 * project yet. Set `ORCHARD_WHATSAPP` (international format, digits only,
 * e.g. "6512345678") before publication. Until then WhatsApp links open
 * WhatsApp's own "send to…" picker with the prepared message, so nothing is
 * sent to a guessed number.
 */
export const ORCHARD_WHATSAPP: string | null = null;

/** WhatsApp link to Orchard carrying `message` (decoded by WhatsApp, editable there). */
export function orchardWhatsAppHref(message: string) {
  const text = `text=${encodeURIComponent(message)}`;
  return ORCHARD_WHATSAPP ? `https://wa.me/${ORCHARD_WHATSAPP}?${text}` : `https://wa.me/?${text}`;
}

// Footer "Information" group routes (Section 11 of the content file); the
// pages are not in this project and the paths are unconfirmed.
export const PRIVACY_POLICY_HREF = "/privacy-policy/";
export const BOOKING_TERMS_HREF = "/booking-and-trial-terms/";

/** The one anchor every visit request on the homepage points to (Section 09). */
export const VISIT_ANCHOR = "arrange-your-visit";
export const VISIT_HREF = `#${VISIT_ANCHOR}`;
