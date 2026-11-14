import { Button } from "../components/Button";
import { SectionWrapper } from "../components/SectionWrapper";
import { useReveal } from "../hooks/useReveal";
import { resolvePrimaryCTAHref } from "../lib/cta";
import type { ClientConfig } from "../schema";

export function FinalCTA({ config }: { config: ClientConfig }) {
  const ref = useReveal<HTMLElement>();
  const ctaHref = resolvePrimaryCTAHref(config);

  return (
    <SectionWrapper ref={ref} className="bg-brand-primary !max-w-none" as="div">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-white">
        <h2 className="text-fluid-h2 font-bold">Ready to visit {config.name}?</h2>
        <Button href={ctaHref} className="!bg-white !text-brand-primary hover-hover:!brightness-95">
          {config.primaryCTA.label}
        </Button>
      </div>
    </SectionWrapper>
  );
}
