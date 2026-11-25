/**
 * 09 Arrange your visit — public copy from docs/content/KOMO_Homepage_Content.md
 * (Section 09). The WhatsApp message templates are working drafts for
 * approval; they never mention prices.
 */
import { sessions } from "@/content/sessions";

export const arrangeVisit = {
  heading: "Arrange your visit",
  chosenLead: "Already chosen a session?",
  chosenBody:
    "Choose your session to start a WhatsApp message to our Orchard team. Add your preferred day if you have one. Your appointment is confirmed when the team replies with an agreed date and time.",
  selectorLabel: "Choose your session",
  request: "Request a Visit",
  decidingLead: "Still deciding?",
  decidingBody:
    "Tell us what matters most to you: a scalp cleanse, more detailed scalp care, a rhythmic massage or gua sha.",
  help: "Help Me Choose on WhatsApp",
  quote: "Get a Single Visit Quote",
  copy: "Copy Message",
  privacy: "Privacy Policy",
  terms: "Booking and Trial Terms",
};

/** The four approved session names, in their existing order. */
export const sessionNames = sessions.map((session) => session.name);

/** The quote path also accepts this in place of a session. */
export const STILL_DECIDING = "Still deciding";

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
