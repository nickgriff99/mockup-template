import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

type SharedProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

// Renders <a> when `href` is given (tel:/mailto:/maps links), <button> otherwise.
type ButtonAsAnchor = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = ButtonAsAnchor | ButtonAsButton;

// Shared easing/duration convention (also used by Card) — keep hover/press/future
// GSAP-driven motion consistent across the site.
const base =
  "transition-brand inline-flex min-h-11 min-w-11 items-center justify-center " +
  "rounded-lg px-5 text-base font-medium active:scale-95";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-white hover-hover:brightness-110",
  secondary:
    "border-2 border-brand-primary text-brand-primary hover-hover:bg-brand-primary hover-hover:text-white",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
