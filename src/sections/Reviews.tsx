/* ---------------------------------------------------------------------------
 * 08 Reviews (storyboard frame 14)
 *
 * "Reviews" at the upper left; portraits spaced along a shallow arc that dips
 * at the centre, the active one centred and gently tilted, slices of its
 * neighbours at the far edges. Two circular arrows at the lower left; the
 * active guest's name, quotation and source at the lower right.
 *
 * One target position drives everything: the portraits follow a continuous
 * `position` value along the arc, and the attribution switches to the target
 * review when the incoming portrait settles (the latest movement only, so
 * rapid navigation always ends on the right attribution). The list wraps.
 *
 * Swipe or drag moves the portraits horizontally; `touch-action: pan-y` keeps
 * vertical page scrolling. Nothing advances on its own.
 * Reduced motion: the selected entry replaces the previous one directly.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { Arrow } from "@/components/Arrow";
import {
  ORCHARD_GOOGLE_REVIEWS_URL,
  REVIEWS_HEADING,
  reviews,
  sourceLabel,
  type GoogleReview,
  type Review,
} from "@/content/reviews";

const CONTOUR_SRC = "/images/komo-contour.svg#lines";
const MOVE = { duration: 0.85, ease: [0.45, 0, 0.2, 1] as const };

const wrap = (value: number, n: number) => ((value % n) + n) % n;

/** Signed distance of slide `index` from `position`, wrapped to [-n/2, n/2). */
const distance = (index: number, position: number, n: number) => {
  return wrap(index - position + n / 2, n) - n / 2;
};

function Silhouette() {
  return (
    <svg viewBox="0 0 120 160" className="review-silhouette" aria-hidden="true" focusable="false">
      <circle cx="60" cy="58" r="22" />
      <ellipse cx="60" cy="122" rx="38" ry="28" />
    </svg>
  );
}

/** Five stars, `rating` of them filled. Decorative; the rating is also given
 *  in text beside it. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className={star <= rating ? "is-on" : undefined}>
          <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
        </svg>
      ))}
    </span>
  );
}

/** Card for a Google review: rating, an excerpt and the reviewer's initial. */
function GoogleCard({ review }: { review: GoogleReview }) {
  return (
    <div className="review-google-card">
      <Stars rating={review.rating} />
      <p className="review-google-excerpt">{review.quote}</p>
      <div className="review-google-foot">
        <span className="review-initial">{review.name.trim().charAt(0)}</span>
        <span>
          <span className="review-google-name">{review.name}</span>
          <span className="review-google-label">Google review</span>
        </span>
      </div>
    </div>
  );
}

function Portrait({
  review,
  index,
  position,
  spacing,
  lift,
}: {
  review: Review;
  index: number;
  position: MotionValue<number>;
  spacing: MotionValue<number>;
  lift: MotionValue<number>;
}) {
  const n = reviews.length;
  const transform = useTransform([position, spacing, lift], ([p, gap, rise]: number[]) => {
    const d = n > 1 ? distance(index, p, n) : 0;
    // Along the arc: higher towards the edges, tilted with the curve.
    const x = d * gap;
    const y = -rise * Math.min(d * d, 4);
    const tilt = -3 - d * 5;
    return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${tilt}deg)`;
  });
  // Hidden only beyond the neighbours (off-screen), where the list wraps.
  const opacity = useTransform(position, (p) => {
    const d = Math.abs(n > 1 ? distance(index, p, n) : 0);
    return Math.max(0, Math.min(1, (2 - d) * 2.5));
  });
  return (
    <motion.div
      className={`review-portrait review-portrait--${review.kind}`}
      style={{ transform, opacity }}
      aria-hidden="true"
    >
      {review.kind === "google" ? (
        <GoogleCard review={review} />
      ) : review.portrait ? (
        <img src={review.portrait.src} alt="" draggable={false} />
      ) : (
        <Silhouette />
      )}
    </motion.div>
  );
}

export function Reviews() {
  const id = useId();
  const n = reviews.length;
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const position = useMotionValue(0);
  const spacing = useMotionValue(0);
  const lift = useMotionValue(0);
  // `target` is unbounded so movement always takes the short way round;
  // `nonce` re-runs the settle animation after a drag that lands where it began.
  const [target, setTarget] = useState({ value: 0, nonce: 0 });
  const [shown, setShown] = useState(0);
  const [announce, setAnnounce] = useState("");
  const interacted = useRef(false);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  // Spacing and lift follow the track size (wide gaps on desktop, a glimpse
  // of the neighbours on mobile).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const width = track.clientWidth;
      const card = track.querySelector<HTMLElement>(".review-portrait");
      const cardH = card?.offsetHeight ?? 300;
      const narrow = width < 700;
      const cardW = card?.offsetWidth ?? 220;
      // Always a clear gap between portraits (allowing for their tilt), so each
      // keeps its own silhouette.
      spacing.set(Math.max(narrow ? width * 0.72 : width * 0.45, cardW * 1.12 + 24));
      lift.set(cardH * 0.16);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [spacing, lift]);

  // Move to the target; switch the attribution when this movement settles.
  useEffect(() => {
    controls.current?.stop();
    const settle = () => {
      const index = wrap(target.value, n || 1);
      setShown(index);
      if (interacted.current && reviews[index]) {
        const review = reviews[index];
        setAnnounce(`Review ${index + 1} of ${n}: ${review.name}, ${sourceLabel(review)}`);
      }
    };
    if (reduceMotion || position.get() === target.value) {
      position.set(target.value);
      settle();
      return;
    }
    controls.current = animate(position, target.value, { ...MOVE, onComplete: settle });
    return () => controls.current?.stop();
  }, [target, n, position, reduceMotion]);

  const go = (step: 1 | -1) => {
    interacted.current = true;
    setTarget((current) => ({ value: current.value + step, nonce: current.nonce }));
  };

  // Horizontal swipe / drag. Vertical gestures are left to the page.
  const drag = useRef<{ x: number; y: number; from: number; active: boolean; id: number } | null>(
    null,
  );
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (n < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      from: position.get(),
      active: false,
      id: event.pointerId,
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (!state.active) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      state.active = true;
      controls.current?.stop();
      state.from = position.get();
      state.x = event.clientX;
      event.currentTarget.setPointerCapture(state.id);
      return;
    }
    position.set(state.from - (event.clientX - state.x) / spacing.get());
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state?.active) return;
    interacted.current = true;
    const dx = event.clientX - state.x;
    let next = Math.round(position.get());
    // A deliberate swipe always moves at least one portrait.
    if (Math.abs(dx) > 40 && next === Math.round(state.from)) next += dx < 0 ? 1 : -1;
    setTarget((current) => ({ value: next, nonce: current.nonce + 1 }));
  };

  if (!n) return null;
  const review = reviews[shown];
  const several = n > 1;

  return (
    <section id="reviews" className="reviews tone-dark" aria-labelledby={`${id}-heading`}>
      <div className="reviews-contour" aria-hidden="true">
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" focusable="false">
          <use href={CONTOUR_SRC} />
        </svg>
      </div>

      <h2 id={`${id}-heading`} className="reviews-heading">
        {REVIEWS_HEADING}
      </h2>

      <div
        className={`reviews-track${several ? " is-draggable" : ""}`}
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {reviews.map((item, index) => (
          <Portrait
            key={item.id}
            review={item}
            index={index}
            position={position}
            spacing={spacing}
            lift={lift}
          />
        ))}
      </div>

      {several ? (
        <div className="reviews-controls">
          <button
            type="button"
            className="arc-button arc-prev"
            aria-label="Previous review"
            onClick={() => go(-1)}
          >
            <Arrow />
          </button>
          <button
            type="button"
            className="arc-button"
            aria-label="Next review"
            onClick={() => go(1)}
          >
            <Arrow />
          </button>
        </div>
      ) : null}

      <div className="review-text" key={review.id}>
        {review.preview ? (
          <p className="review-preview">Preview only. Not for publication.</p>
        ) : null}
        <p className="review-name">{review.name}</p>
        <blockquote>
          <p>{review.quote}</p>
        </blockquote>
        {review.kind === "google" ? (
          <p className="review-source">
            <Stars rating={review.rating} />
            <span className="visually-hidden">Rated {review.rating} out of 5. </span>
            Google review · {review.date}
            {review.url ? (
              <>
                {" · "}
                <a href={review.url} target="_blank" rel="noopener noreferrer">
                  View on Google
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </>
            ) : null}
          </p>
        ) : (
          <p className="review-source">Guest testimonial</p>
        )}
      </div>

      {ORCHARD_GOOGLE_REVIEWS_URL ? (
        <a
          className="session-detail-link reviews-all"
          href={ORCHARD_GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          See all Orchard reviews on Google <Arrow />
        </a>
      ) : null}

      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}
