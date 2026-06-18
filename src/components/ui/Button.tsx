import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-white hover:bg-signal-light hover:shadow-lg hover:shadow-signal/20 font-semibold",
  secondary: "border border-line bg-surface-2/40 text-ink hover:border-signal/50 hover:bg-surface-2",
  ghost: "text-muted hover:text-signal hover:bg-signal/5",
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  children,
  className = "",
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
