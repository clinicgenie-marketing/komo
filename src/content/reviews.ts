/**
 * 08 Reviews — editorial slots from docs/content/KOMO_Homepage_Content.md
 * (Section 08). Two kinds share one carousel, each with its own card:
 *
 *   testimonial  an approved guest testimonial: approved display name, exact
 *                quotation, and a portrait only when that guest–portrait
 *                pairing is supplied and approved (otherwise a silhouette).
 *   google       a verified Orchard Google review, curated by hand: public
 *                display name, exact review text, star rating, date and the
 *                link to that review on Google, so visitors can verify it.
 *
 * Order: approved testimonials first, then Google reviews.
 */

export const REVIEWS_HEADING = "Reviews";

/**
 * Orchard's Google reviews page ("See all reviews on Google"). UNCONFIRMED:
 * not in the project yet; the link is hidden while this is null.
 */
export const ORCHARD_GOOGLE_REVIEWS_URL: string | null = null;

type ReviewBase = {
  id: string;
  /** Approved display name (Google: the public display name). */
  name: string;
  /** Exact approved / verified quotation. */
  quote: string;
  /** Preview-only entry: never shown in a production build. */
  preview?: true;
};

export type Testimonial = ReviewBase & {
  kind: "testimonial";
  portrait: { src: string; alt: string } | null;
};

export type GoogleReview = ReviewBase & {
  kind: "google";
  /** Star rating as shown on Google, 1–5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** When it was posted, as a fixed month and year (e.g. "March 2026"). */
  date: string;
  /** Link to this review on Google; `null` hides "View on Google". */
  url: string | null;
};

export type Review = Testimonial | GoogleReview;

export const sourceLabel = (review: Review) =>
  review.kind === "google" ? "Google review" : "Guest testimonial";

/** Publishable entries. The content file has only placeholders so far. */
const publishedReviews: Review[] = [];

/**
 * Preview-only entries used to build and test the interaction while the
 * editorial slots are empty. They are labelled on screen and dropped from
 * production builds (import.meta.env.DEV).
 */
const previewReviews: Review[] = [
  {
    id: "preview-testimonial",
    kind: "testimonial",
    name: "Preview guest A",
    quote: "Preview only. The approved guest testimonial goes here.",
    portrait: null,
    preview: true,
  },
  {
    id: "preview-google-1",
    kind: "google",
    name: "Preview reviewer B",
    quote:
      "Preview only. A long verified Orchard Google review goes here, to check that a longer quotation stays readable: it wraps over several lines, keeps its natural height on mobile and stays beside the arrows on desktop without covering the portraits.",
    rating: 5,
    date: "Month 2026",
    url: null,
    preview: true,
  },
  {
    id: "preview-google-2",
    kind: "google",
    name: "Preview reviewer C",
    quote: "Preview only. A verified Orchard Google review goes here.",
    rating: 5,
    date: "Month 2026",
    url: null,
    preview: true,
  },
  {
    id: "preview-google-3",
    kind: "google",
    name: "Preview reviewer D",
    quote: "Preview only. A verified Orchard Google review goes here.",
    rating: 4,
    date: "Month 2026",
    url: null,
    preview: true,
  },
];

const byKind = (a: Review, b: Review) =>
  (a.kind === "testimonial" ? 0 : 1) - (b.kind === "testimonial" ? 0 : 1);

export const reviews: Review[] = (
  publishedReviews.length ? publishedReviews : import.meta.env.DEV ? previewReviews : []
)
  .slice()
  .sort(byKind);
