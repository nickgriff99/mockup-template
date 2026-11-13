import { Button } from "../components/Button";
import { resolvePrimaryCTAHref } from "../lib/cta";
import type { ClientConfig } from "../schema";

export function Hero({ config }: { config: ClientConfig }) {
  const ctaHref = resolvePrimaryCTAHref(config);

  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] w-full items-center overflow-hidden"
    >
      <img
        src={config.heroImage.src}
        alt={config.heroImage.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {/* Grouped wrapper so a later stage can stagger-animate these together. */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 text-white md:px-8">
        <h1 className="text-fluid-h1 font-bold">{config.name}</h1>
        <p className="max-w-xl text-lg">{config.tagline}</p>
        <Button href={ctaHref}>{config.primaryCTA.label}</Button>
      </div>
    </section>
  );
}
