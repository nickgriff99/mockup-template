import { forwardRef } from "react";
import type { ElementType, ReactNode } from "react";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

// Every page section wraps itself in this so vertical rhythm/max-width/gutters
// stay consistent site-wide. Mobile-first: base is tuned for 375px.
export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  function SectionWrapper(
    { children, className = "", as: Component = "section" },
    ref,
  ) {
    return (
      <Component
        ref={ref}
        className={
          "mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-16 lg:py-20 " +
          className
        }
      >
        {children}
      </Component>
    );
  },
);
