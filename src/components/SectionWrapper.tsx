import type { ElementType, ReactNode } from "react";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

// Every page section wraps itself in this so vertical rhythm/max-width/gutters
// stay consistent site-wide. Mobile-first: base is tuned for 375px.
export function SectionWrapper({
  children,
  className = "",
  as: Component = "section",
}: SectionWrapperProps) {
  return (
    <Component
      className={
        "mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-16 lg:py-20 " +
        className
      }
    >
      {children}
    </Component>
  );
}
