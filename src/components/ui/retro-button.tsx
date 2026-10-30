import Link from "next/link";
import type { ComponentProps } from "react";

// Adapted from neobrutalism.dev's MIT button: docs/component-sources.md.
export function retroButtonClass(
  variant: "dark" | "paper" | "orange" = "dark",
  className = "",
) {
  return `retro-button retro-button--${variant} ${className}`;
}

export function RetroLink({
  variant = "dark",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "dark" | "paper" | "orange" }) {
  return (
    <Link {...props} className={retroButtonClass(variant, className)}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function RetroButton({
  variant = "dark",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "dark" | "paper" | "orange" }) {
  return <button {...props} className={retroButtonClass(variant, className)} />;
}
