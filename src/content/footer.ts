/**
 * 09 Footer — copy and link order from docs/content/KOMO_Homepage_Content.md
 * (Section 11) and storyboard Section 09.
 *
 * Destinations reuse the routes already used on the homepage (header menu,
 * Sections 05–09). Entries marked UNCONFIRMED have no existing route in the
 * project; they follow the same /section/page/ pattern and need checking.
 */
import { BOOKING_TERMS_HREF, PRIVACY_POLICY_HREF } from "@/content/contact";

export const FOOTER_NAME = "KOMO Wellness Singapore";
/** Set beneath the wordmark. */
export const FOOTER_PLACE = "Singapore";

export type FooterLink = { label: string; href: string };
export type FooterGroup = { title: string; links: FooterLink[] };

export const footerGroups: FooterGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "All Services", href: "/treatments/" }, // header menu "Services"
      { label: "Scalp & Hair Concerns", href: "#concerns" }, // homepage Section 02
      { label: "Products & Ingredients", href: "/products-and-ingredients/" }, // as Section 05
      { label: "Guides", href: "/guides/" }, // UNCONFIRMED
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Team", href: "/about/our-team/" }, // UNCONFIRMED
      { label: "Scalp Imaging", href: "/about/scalp-imaging/" }, // as Section 04 (unconfirmed)
      { label: "Press & Recognition", href: "/about/press-and-recognition/" }, // UNCONFIRMED
      { label: "KOMO Around the World", href: "/about/komo-around-the-world/" }, // UNCONFIRMED
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Your First Visit", href: "/first-visit/" }, // header menu
      { label: "Orchard", href: "/locations/orchard/" }, // UNCONFIRMED (under /locations/)
      { label: "Great World", href: "/locations/great-world/" }, // UNCONFIRMED
      { label: "Holland Village", href: "/locations/holland-village/" }, // UNCONFIRMED
      { label: "Contact", href: "/contact/" }, // UNCONFIRMED
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: PRIVACY_POLICY_HREF }, // as Section 08 (unconfirmed)
  { label: "Website Terms", href: "/website-terms/" }, // UNCONFIRMED
  { label: "Booking and Trial Terms", href: BOOKING_TERMS_HREF }, // as Section 08 (unconfirmed)
];
