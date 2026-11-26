/**
 * Glass testimonial swiper — from 21st.dev (glass-testimonial-swiper),
 * adapted for KOMO:
 * - optional `rating` (stars) and `mark` (e.g. the Google "G") per card
 * - `tags` and `stats` optional
 * - React 19 ref callback (the original returned the assignment)
 * - only the front card is exposed to assistive tech and the tab order; the
 *   dots name the review they show and mark the current one
 * - keyboard: Left / Right arrows on the stack move between cards
 * - a drag beyond 50px moves one card; a click without a drag does nothing
 * - reduced motion: cards switch without the slide (CSS)
 * Styles: ".testimonials-stack", ".testimonial-card", ".glass-effect" and
 * ".pagination-dot" in index.css.
 */
import React, { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Star } from "lucide-react";

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags?: { text: string; type: "featured" | "default" }[];
  stats?: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }[];
  avatarGradient: string;
  /** Star rating, 1–5, shown as stars with the score. */
  rating?: number;
  /** A source mark shown top right (e.g. the Google "G"). */
  mark?: React.ReactNode;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  /** How many cards to show behind the main card */
  visibleBehind?: number;
  /** Accessible name for the stack. */
  label?: string;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-base font-semibold tabular-nums" aria-hidden="true">
        {rating.toFixed(1)}
      </span>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={
              index < full
                ? "h-4 w-4 fill-[#FBBC04] text-[#FBBC04]"
                : "h-4 w-4 fill-transparent text-[#FBBC04]/50"
            }
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="sr-only">Rated {rating} out of 5</span>
    </div>
  );
}

// --- The Component ---
export const TestimonialStack = ({
  testimonials,
  visibleBehind = 2,
  label = "Testimonials",
}: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  const navigate = useCallback(
    (newIndex: number) => {
      setActiveIndex((newIndex + totalCards) % totalCards);
    },
    [totalCards],
  );

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    // Links inside a card stay clickable.
    if ((e.target as Element).closest("a, button")) return;
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add("is-dragging");
  };

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setDragOffset(clientX - dragStartRef.current);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove("is-dragging");
    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!testimonials?.length) return null;

  return (
    <div
      className="testimonials-stack relative pb-12"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") navigate(activeIndex + 1);
        else if (event.key === "ArrowLeft") navigate(activeIndex - 1);
      }}
    >
      {testimonials.map((testimonial, index) => {
        const isActive = index === activeIndex;
        // Calculate the card's position in the display order
        const displayOrder = (index - activeIndex + totalCards) % totalCards;

        // --- DYNAMIC STYLE CALCULATION ---
        const style: CSSProperties = {};
        if (displayOrder === 0) {
          // The active card
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) {
          // Cards stacked behind
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder; // in rem
          style.transform = `scale(${scale}) translateY(${translateY}rem)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else {
          // Cards that are out of view
          style.transform = "scale(0)";
          style.opacity = 0;
          style.zIndex = 0;
        }

        const tagClasses = (type: "featured" | "default") =>
          type === "featured"
            ? "bg-primary/20 text-primary border border-primary/30"
            : "bg-secondary text-secondary-foreground";

        return (
          <div
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            key={testimonial.id}
            className="testimonial-card glass-effect backdrop-blur-xl"
            style={style}
            data-active={isActive || undefined}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${totalCards}`}
            aria-hidden={!isActive}
            inert={!isActive}
            onMouseDown={(e) => handleDragStart(e, index)}
            onTouchStart={(e) => handleDragStart(e, index)}
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white"
                    style={{ background: testimonial.avatarGradient }}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">{testimonial.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                {testimonial.mark}
              </div>

              {testimonial.rating ? <Stars rating={testimonial.rating} /> : null}

              <blockquote className="mb-6 text-lg leading-relaxed text-card-foreground/90">
                “{testimonial.quote}”
              </blockquote>

              {testimonial.tags?.length || testimonial.stats?.length ? (
                <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-4 md:flex-row md:items-center">
                  <div className="flex flex-wrap gap-2">
                    {testimonial.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className={[
                          "text-xs",
                          "px-2",
                          "py-1",
                          "rounded-md",
                          tagClasses(tag.type),
                        ].join(" ")}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {testimonial.stats?.map((stat, i) => {
                      const IconComponent = stat.icon;
                      return (
                        <span key={i} className="flex items-center">
                          <IconComponent className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                          {stat.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="pagination absolute right-0 bottom-0 left-0 flex justify-center gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show review ${index + 1} of ${totalCards}, by ${testimonial.name}`}
            aria-current={activeIndex === index || undefined}
            onClick={() => navigate(index)}
            className={`pagination-dot ${activeIndex === index ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};
