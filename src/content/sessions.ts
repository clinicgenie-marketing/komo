/**
 * 03 Choose your session — storyboard Section 03 (03.1–03.6). No prices on
 * the homepage.
 *
 * Only the homepage is being built, so "Explore …" and "Read the Award
 * Feature" render without links for now; `href` keeps each existing
 * destination ready (unconfirmed where marked).
 */
import { images, type ImageSlot } from "@/content/images";

export type SessionCategory = "scalp" | "spa";

export type Session = {
  /** Full name; also carried into the visit request. */
  name: string;
  /** Short name, used in the visit request label and elsewhere. */
  short: string;
  category: SessionCategory;
  /** One line, set under the name. */
  summary: string;
  body: string;
  /** Treatment time in minutes, shown as "Treatment time · N minutes". */
  minutes?: number;
  /** Verified award wording, shown secondary to the description. */
  award?: { text: string; label: string; href: string | null };
  explore: { label: string; href: string | null };
  image: ImageSlot;
  /** Crop of the photograph in its 4:5 frame (CSS object-position). */
  focus?: string;
};

export const SESSIONS_HEADING = "Choose your session";

export const categories: { id: SessionCategory; label: string }[] = [
  { id: "scalp", label: "Scalp care" },
  { id: "spa", label: "Head spa" },
];

// The award feature URL is unconfirmed.
const AWARD_FEATURE_URL: string | null = null;

export const sessions: Session[] = [
  {
    name: "Signature Scalp Care",
    short: "Signature",
    category: "scalp",
    summary: "Scalp cleansing and product guidance.",
    body: "Start with how your scalp feels between washes. Oil Balancing, Hydrating and Soothing are among the care options described for Signature.",
    explore: { label: "Explore Signature", href: "/treatments/signature-scalp-care/" },
    image: images.sessions.signature,
    focus: "55% 40%",
  },
  {
    name: "Advanced Scalp Care",
    short: "Advanced",
    category: "scalp",
    summary: "More time on scalp care.",
    // Concise until Orchard confirms the additional treatment steps.
    body: "For the guest who wants to spend more of the visit on scalp care. If you’re choosing between Signature and Advanced, the extra care steps are worth comparing.",
    explore: { label: "Explore Advanced", href: "/treatments/advanced-scalp-care/" },
    image: images.sessions.advanced,
    focus: "60% 35%",
  },
  {
    name: "Aromatic Waterfall Scalp Spa",
    short: "Waterfall",
    category: "spa",
    summary: "Rhythmic massage at the basin.",
    body: "Settle back at the basin and enjoy the rhythm of a scalp massage.",
    minutes: 50,
    award: {
      text: "Harper’s BAZAAR Singapore named Waterfall “Best Head Spa Experience” in its 2026/2027 Spa & Aesthetics Awards.",
      label: "Read the Award Feature",
      href: AWARD_FEATURE_URL,
    },
    explore: { label: "Explore Waterfall", href: "/treatments/aromatic-waterfall-scalp-spa/" },
    image: images.sessions.waterfall,
    // Water meeting the scalp: the contact point on the hairline.
    focus: "62% 30%",
  },
  {
    name: "Meridian Hydro Restoring Scalp Spa",
    short: "Meridian",
    category: "spa",
    summary: "Focused pressure and gua sha.",
    body: "Your therapist works across the scalp with their fingertips and a rounded gua sha tool. Tell them which areas you enjoy and how the pressure feels as they go.",
    minutes: 60,
    explore: { label: "Explore Meridian", href: "/treatments/meridian-hydro-restoring-scalp-spa/" },
    image: images.sessions.meridian,
    // Portrait crop of a landscape photo: keep the gua sha and the guest's head.
    focus: "45% 45%",
  },
];

export const requestLabel = (session: Session) => `Request ${session.short}`;

/** 03.6 Single visit quote. */
export const quotePanel = {
  heading: "Planning for one visit?",
  body: "Ask Orchard for the GST-inclusive price, the total time from arrival to departure and whether a single visit is available.",
  action: "Get a Single Visit Quote",
};
