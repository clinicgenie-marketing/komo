/**
 * 07 Google reviews — verified Orchard Google reviews, curated by hand, each
 * short enough to show in full: star rating, exact review text, the
 * reviewer's public display name, and the Google attribution.
 *
 * MISSING: no approved reviews and no verified Google listing URL are in the
 * project yet (the content file has empty slots only). Until they are
 * supplied, development builds show three labelled preview cards so the
 * layout can be reviewed; production builds never show them, and the
 * section is left out entirely while no published review exists.
 */

export const REVIEWS_HEADING = "Google reviews";

export const GOOGLE_LINK_LABEL = "Read more reviews on Google";

/** The verified Orchard Google listing. UNCONFIRMED: not supplied yet. */
export const ORCHARD_GOOGLE_REVIEWS_URL: string | null = null;

export type GoogleReview = {
  id: string;
  /** The reviewer's public display name on Google. */
  name: string;
  /** Exact review text, shown in full. */
  quote: string;
  /** Star rating as shown on Google, 1–5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** The reviewer's Google profile photo, only if supplied with the review;
      otherwise the card shows their initial. */
  photo?: string;
  /** Preview-only entry: never shown in a production build. */
  preview?: true;
};

/** Approved, genuine Google reviews go here (three, short enough in full). */
const publishedReviews: GoogleReview[] = [];

const previewReviews: GoogleReview[] = [
  {
    id: "preview-1",
    name: "Preview reviewer A",
    quote:
      "Preview only. An approved Orchard Google review goes here, shown in full. This one runs a little longer to check that three or four lines still sit comfortably in the card.",
    rating: 5,
    preview: true,
  },
  {
    id: "preview-2",
    name: "Preview reviewer B",
    quote: "Preview only. A shorter approved Orchard Google review goes here.",
    rating: 5,
    preview: true,
  },
  {
    id: "preview-3",
    name: "Preview reviewer C",
    quote: "Preview only. A third approved Orchard Google review goes here, at a medium length.",
    rating: 5,
    preview: true,
  },
];

export const reviews: GoogleReview[] = publishedReviews.length
  ? publishedReviews
  : import.meta.env.DEV
    ? previewReviews
    : [];
