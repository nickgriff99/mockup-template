import { SectionWrapper } from "../components/SectionWrapper";
import { useReveal } from "../hooks/useReveal";
import type { ClientConfig } from "../schema";

export function About({ config }: { config: ClientConfig }) {
  const ref = useReveal<HTMLElement>();
  return (
    <SectionWrapper ref={ref}>
      <h2 className="mb-6 text-2xl font-bold text-brand-text">
        About {config.name}
      </h2>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <p className="text-brand-text/80 md:flex-1 md:text-lg">
          {config.about}
        </p>
        {config.aboutImage && (
          <img
            src={config.aboutImage.src}
            alt={config.aboutImage.alt}
            width={600}
            height={450}
            loading="lazy"
            className="w-full rounded-xl object-cover md:flex-1"
          />
        )}
      </div>
    </SectionWrapper>
  );
}
