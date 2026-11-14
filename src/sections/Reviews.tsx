import { Card } from "../components/Card";
import { SectionWrapper } from "../components/SectionWrapper";
import { useReveal } from "../hooks/useReveal";
import type { ClientConfig } from "../schema";

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`Rated ${rating} out of 5`} className="text-brand-accent text-lg">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

// Renders nothing if there are no reviews — no placeholder/empty state.
export function Reviews({ config }: { config: ClientConfig }) {
  const ref = useReveal<HTMLElement>();
  if (config.reviews.length === 0) return null;

  return (
    <SectionWrapper ref={ref}>
      <h2 className="mb-6 text-2xl font-bold text-brand-text">What people say</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
        {config.reviews.map((review, i) => (
          <Card key={i} className="min-w-[85%] shrink-0 snap-center md:min-w-0 md:shrink">
            <Stars rating={review.rating} />
            <p className="mt-3 text-brand-text">{review.text}</p>
            <p className="mt-3 font-medium text-brand-text/80">{review.author}</p>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
