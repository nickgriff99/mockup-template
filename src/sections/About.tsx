import { SectionWrapper } from "../components/SectionWrapper";
import type { ClientConfig } from "../schema";

export function About({ config }: { config: ClientConfig }) {
  return (
    <SectionWrapper>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <p className="text-brand-text/80 md:flex-1 md:text-lg">
          {config.about}
        </p>
        {config.aboutImage && (
          <img
            src={config.aboutImage.src}
            alt={config.aboutImage.alt}
            className="w-full rounded-xl object-cover md:flex-1"
          />
        )}
      </div>
    </SectionWrapper>
  );
}
