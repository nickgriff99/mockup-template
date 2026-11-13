import { useEffect, useState } from "react";
import { Button } from "./Button";
import { resolvePrimaryCTAHref } from "../lib/cta";
import type { ClientConfig } from "../schema";

// Mobile-only sticky bottom CTA, appears once the Hero (id="hero") scrolls out
// of view. IntersectionObserver over a scroll-position threshold: no listener
// to throttle, and it naturally re-syncs on resize/orientation change.
export function StickyMobileCTA({ config }: { config: ClientConfig }) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!pastHero) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-text/10 bg-brand-background p-3 shadow-lg md:hidden">
      <Button href={resolvePrimaryCTAHref(config)} className="w-full">
        {config.primaryCTA.label}
      </Button>
    </div>
  );
}
