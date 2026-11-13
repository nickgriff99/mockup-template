import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

// Shared card wrapper reused by services/reviews/gallery sections (later stages).
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={
        "transition-brand rounded-xl bg-brand-background p-6 shadow-md " +
        "hover-hover:-translate-y-1 hover-hover:shadow-lg " +
        className
      }
    >
      {children}
    </div>
  );
}
