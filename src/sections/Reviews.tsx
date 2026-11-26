/* ---------------------------------------------------------------------------
 * 07 Google reviews
 *
 * On warm ivory, continuing Section 06: a left-aligned heading, then the
 * reviews as a glass card stack (src/components/ui/glass-testimonial-swiper):
 * the front card shows the reviewer, "Google review" with the Google mark,
 * the stars and the full review; up to two more cards wait behind it. Drag
 * or swipe the front card, use the dots, or Left / Right on the stack.
 * "Read more reviews on Google" sits beneath.
 *
 * Content: src/content/reviews.ts. With no published review the section is
 * left out of production builds.
 * ------------------------------------------------------------------------- */
import { useId } from "react";
import { Arrow } from "@/components/Arrow";
import { GoogleMark } from "@/components/GoogleMark";
import { TestimonialStack, type Testimonial } from "@/components/ui/glass-testimonial-swiper";
import {
  GOOGLE_LINK_LABEL,
  ORCHARD_GOOGLE_REVIEWS_URL,
  REVIEWS_HEADING,
  reviews,
} from "@/content/reviews";

// Initials on KOMO greens and stones (no stock faces for real reviewers).
const AVATARS = [
  "linear-gradient(135deg, #34463a, #5d7262)",
  "linear-gradient(135deg, #8a9a7c, #a6b29a)",
  "linear-gradient(135deg, #a8957c, #c9bcae)",
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export function Reviews() {
  const id = useId();
  if (!reviews.length) return null;

  const testimonials: Testimonial[] = reviews.map((review, index) => ({
    id: review.id,
    initials: initials(review.name),
    name: review.name,
    role: "Google review",
    quote: review.quote,
    rating: review.rating,
    mark: <GoogleMark className="h-6 w-6 shrink-0" />,
    avatarGradient: AVATARS[index % AVATARS.length],
  }));

  return (
    <section id="reviews" className="reviews" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="reviews-heading">
        {REVIEWS_HEADING}
      </h2>
      <div className="reviews-stack">
        <TestimonialStack testimonials={testimonials} label="Google reviews" />
      </div>
      {/* No verified listing URL yet: shown without a destination. */}
      <a
        className="session-detail-link reviews-google"
        href={ORCHARD_GOOGLE_REVIEWS_URL ?? undefined}
        {...(ORCHARD_GOOGLE_REVIEWS_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {GOOGLE_LINK_LABEL} <Arrow />
      </a>
    </section>
  );
}
