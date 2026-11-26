/**
 * 08 Arrange your visit — copy from storyboard Section 08. The WhatsApp
 * message templates are working drafts for approval; they never mention
 * prices.
 */
import { sessions } from "@/content/sessions";

export const arrangeVisit = {
  heading: "Arrange your visit",
  intro:
    "Have a session in mind? Tell our Orchard team what you’d like to book, or ask us to help you choose.",
  selectorLabel: "Which session are you considering?",
  placeholder: "Choose a session",
  primary: "WhatsApp Us",
  quote: "Ask for a single-visit quote",
  confirm: "The team will confirm your date and time in their reply.",
  draftLabel: "Your message to Orchard",
  copy: "Copy Message",
  privacy: "Privacy Policy",
  terms: "Booking and Trial Terms",
  /** For Great World and Holland Village (Section 06's active outlet). */
  orchardInstead: "Arrange a visit at Orchard",
};

/** The four approved session names, in their existing order. */
export const sessionNames = sessions.map((session) => session.name);

/** The selector's last option: the team helps the visitor choose. */
export const HELP_ME_CHOOSE = "Help me choose";

/** Selector options: the four sessions (short labels), then Help me choose. */
export const sessionOptions = [
  ...sessions.map((session) => ({ value: session.name, label: session.short })),
  { value: HELP_ME_CHOOSE, label: HELP_ME_CHOOSE },
];

/* ------------------------------ Message drafts ----------------------------- */

export function visitMessage(session: string | null) {
  return session
    ? `Hello KOMO Orchard, I’d like to request a visit for ${session}. Could you let me know your availability?\nPreferred day (if any): `
    : "Hello KOMO Orchard, I’d like to request a visit. Could you let me know your availability?\nPreferred day (if any): ";
}

export function helpMessage() {
  return "Hello KOMO Orchard, I’d like help choosing a session. What matters most to me is: ";
}

export function quoteMessage(session: string | null) {
  const subject = session ? `for ${session}` : "while I’m still deciding on a session";
  return `Hello KOMO Orchard, could you send me a single visit quote ${subject}? Please include the GST-inclusive total, what is included, any optional extras or package conditions, and how long to allow from arrival to departure.`;
}
