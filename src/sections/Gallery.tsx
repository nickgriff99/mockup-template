import { SectionWrapper } from "../components/SectionWrapper";
import type { ClientConfig } from "../schema";

// Renders nothing if there's no gallery — no placeholder/empty state.
export function Gallery({ config }: { config: ClientConfig }) {
  if (!config.gallery || config.gallery.length === 0) return null;

  return (
    <SectionWrapper>
      <h2 className="mb-6 text-2xl font-bold text-brand-text">Gallery</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
        {config.gallery.map((image, i) => (
          <img
            key={i}
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            loading="lazy"
            className="aspect-[4/3] min-w-[85%] shrink-0 snap-center rounded-xl object-cover md:min-w-0 md:shrink"
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
