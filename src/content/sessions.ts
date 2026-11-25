/**
 * 03 Choose your session — copy from docs/content/KOMO_Homepage_Content.md
 * (Section 03). No prices on the homepage.
 */
import { images, type ImageSlot } from "@/content/images";

export type Session = {
  /** Full name; also carried into the visit request. */
  name: string;
  /** Short name used in the session list. */
  short: string;
  description: string;
  /** Treatment time in minutes, shown as "Treatment time · N minutes". */
  minutes?: number;
  /** Secondary action. `href: null` hides it until a destination is confirmed. */
  detail: { label: string; href: string | null; external?: boolean };
  image: ImageSlot;
};

export const SESSIONS_HEADING = "Choose your session at Orchard";

// Detail routes follow the existing /treatments/<slug>/ pattern; only
// Signature's route existed before this build. The award feature URL is
// unconfirmed, so that action stays hidden until it is supplied.
const AWARD_FEATURE_URL: string | null = null;

export const sessions: Session[] = [
  {
    name: "Signature Scalp Care",
    short: "Signature",
    description:
      "For the guest who wants a scalp cleanse and help choosing products. Start with how your scalp feels between washes. Oil Balancing, Hydrating and Soothing are among the care options described for Signature.",
    detail: { label: "Explore Signature", href: "/treatments/signature-scalp-care/" },
    image: images.sessions.signature,
  },
  {
    name: "Advanced Scalp Care",
    short: "Advanced",
    description:
      "For the guest who wants to spend more of the visit on scalp care. Published accounts of Advanced at Orchard describe cleansing, exfoliation and the application of a scalp essence, alongside time to look at scalp images with a consultant. If you’re choosing between Signature and Advanced, the extra care steps are worth comparing.",
    detail: { label: "Explore Advanced", href: "/treatments/advanced-scalp-care/" },
    image: images.sessions.advanced,
  },
  {
    name: "Aromatic Waterfall Scalp Spa",
    short: "Waterfall",
    description:
      "For the guest who wants to settle back at the basin and enjoy the rhythm of a scalp massage. Harper’s BAZAAR Singapore named Waterfall “Best Head Spa Experience” in its 2026/2027 Spa & Aesthetics Awards.",
    minutes: 50,
    detail: { label: "Read the Award Feature", href: AWARD_FEATURE_URL, external: true },
    image: images.sessions.waterfall,
  },
  {
    name: "Meridian Hydro Restoring Scalp Spa",
    short: "Meridian",
    description:
      "For the guest who enjoys focused pressure. Your therapist works across the scalp with their fingertips and a rounded gua sha tool. Tell them which areas you enjoy and how the pressure feels as they go.",
    minutes: 60,
    detail: { label: "Explore Meridian", href: "/treatments/meridian-hydro-restoring-scalp-spa/" },
    image: images.sessions.meridian,
  },
];

/** "01/04" style counter. */
export const counterLabel = (index: number) =>
  `${String(index + 1).padStart(2, "0")}/${String(sessions.length).padStart(2, "0")}`;
