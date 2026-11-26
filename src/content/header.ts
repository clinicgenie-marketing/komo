/**
 * 00 Header — labels, menu items, languages and booking choices.
 *
 * Only the homepage is being built, so menu items carry no links yet; add an
 * `href` to an item when its destination exists.
 *
 * Languages: the EN / 中文 toggle is in place; the Chinese site is added
 * later and wired to `onLanguageChange` in SiteHeader.
 */
import { VISIT_HREF } from "@/content/contact";
import { sessions } from "@/content/sessions";

export const menuLinks: { label: string; href?: string }[] = [
  { label: "Services" },
  { label: "Scalp & Hair Concerns" },
  { label: "Your First Visit" },
  { label: "About KOMO" },
  { label: "Locations" },
];

export const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "zh-Hans", label: "中文", name: "简体中文" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const HEADER_CTA = "Request a Visit";

/**
 * The header's booking list. Each choice goes to the booking block (Section
 * 08), which arrives at its "Choose a session" placeholder: by the brief,
 * only an explicit request from Section 03 preselects a session.
 */
export const bookingChoices = [
  ...sessions.map((session) => ({ label: session.short })),
  { label: "Help Me Choose" },
].map((choice) => ({ ...choice, href: VISIT_HREF }));
