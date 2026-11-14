import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Shared easing for GSAP entrance/reveal motion across the site.
export const EASE = "power2.out";

/**
 * Attach the returned ref to a section's root element to fade+rise it into
 * view once, the first time it scrolls into the viewport. Respects
 * prefers-reduced-motion (element just appears at its final state, no
 * animation, no ScrollTrigger listener registered at all).
 *
 * Usage: const ref = useReveal<HTMLElement>(); <SectionWrapper ref={ref}>
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          noReduce: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(el, { opacity: 0, y: 16 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: EASE,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          });
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
