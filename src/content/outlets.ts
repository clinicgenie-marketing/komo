/**
 * 06 Visit KOMO — copy from docs/content/KOMO_Homepage_Content.md (Section 07).
 * Orchard is the booking route in this edition; Great World and Holland
 * Village offer an opening-details enquiry carrying the outlet's name.
 */
import { images, type ImageSlot } from "@/content/images";
import { VISIT_HREF } from "@/content/contact";

export const OUTLETS_HEADING = "Visit KOMO";

export type OutletId = "orchard" | "greatWorld" | "hollandVillage";

export type OutletAction = {
  label: string;
  href: string;
  /** Primary (filled) action. */
  primary?: boolean;
  external?: boolean;
};

export type Outlet = {
  id: OutletId;
  name: string;
  /** Address or opening-details line, exactly as supplied. */
  text: string;
  /** Approved photograph of this outlet only; `null` shows the outlet's field. */
  photo: ImageSlot | null;
  actions: OutletAction[];
};

const ORCHARD_ADDRESS = "501 Orchard Road, Level 3, unit 03‑03A, Singapore 238880.";

// Unconfirmed destinations (see the baseline brief):
// - No map link exists in the project; this is a Google Maps search for the
//   address until the confirmed map pin is supplied.
// - No WhatsApp number exists yet. When it is supplied, opening enquiries open
//   WhatsApp with the message; until then they go to the visit-request route
//   with the outlet and message as parameters.
const ORCHARD_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "KOMO Wellness, 501 Orchard Road, Singapore 238880",
)}`;
// Separate from Orchard booking (Section 09): opening updates for Great World
// and Holland Village have their own destination.
const WHATSAPP_NUMBER: string | null = null;

/** Opening-details enquiry for one outlet; the outlet's name is in the message. */
export function openingEnquiryMessage(outlet: string) {
  return `Hello KOMO, I’d like opening details for ${outlet}, please.`;
}

function openingEnquiryHref(outlet: string) {
  const message = openingEnquiryMessage(outlet);
  if (WHATSAPP_NUMBER)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const params = new URLSearchParams({ outlet, message });
  return `/first-visit/?${params}#visit-form`;
}

export const outlets: Outlet[] = [
  {
    id: "orchard",
    name: "Orchard",
    text: ORCHARD_ADDRESS,
    photo: images.outlets.orchard,
    actions: [
      { label: "Get Directions", href: ORCHARD_MAP_URL, external: true },
      // To Section 08, Arrange your visit.
      { label: "Request a Visit", href: VISIT_HREF, primary: true },
    ],
  },
  {
    id: "greatWorld",
    name: "Great World",
    text: "Interested in visiting Great World?",
    // MISSING ASSET: no approved Great World interior or neighbourhood
    // photograph yet; the frame shows the outlet's warm field until then.
    photo: null,
    actions: [
      {
        label: "Ask About Great World Opening Details",
        href: openingEnquiryHref("Great World"),
        primary: true,
        external: WHATSAPP_NUMBER !== null,
      },
    ],
  },
  {
    id: "hollandVillage",
    name: "Holland Village",
    text: "For opening news and first booking updates,",
    // MISSING ASSET: no approved Holland Village interior or neighbourhood
    // photograph yet; the frame shows the outlet's warm field until then.
    photo: null,
    actions: [
      {
        label: "Ask About Holland Village Opening Details",
        href: openingEnquiryHref("Holland Village"),
        primary: true,
        external: WHATSAPP_NUMBER !== null,
      },
    ],
  },
];
