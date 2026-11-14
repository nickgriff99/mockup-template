import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../components/Button";
import { resolvePrimaryCTAHref } from "../lib/cta";
import type { ClientConfig } from "../schema";

// Entrance stagger budget: starts at 0/0.1/0.2s, each 0.35s dur, power2.out ->
// last element finishes at 0.55s, under the 600ms spec cap.
const STAGGER = 0.1;
const DURATION = 0.35;
const EASE = "power2.out";

export function Hero({ config }: { config: ClientConfig }) {
  const ctaHref = resolvePrimaryCTAHref(config);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(content.children, {
          y: 16,
          opacity: 0,
          duration: DURATION,
          stagger: STAGGER,
          ease: EASE,
        });
      }, content);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

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
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 text-white md:px-8"
      >
        <h1 className="text-fluid-h1 font-bold">{config.name}</h1>
        <p className="max-w-xl text-lg">{config.tagline}</p>
        <Button href={ctaHref}>{config.primaryCTA.label}</Button>
      </div>
    </section>
  );
}
