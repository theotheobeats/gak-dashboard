import type { ButtonHTMLAttributes, ReactNode } from "react";

export type BigButtonVariant = "primary" | "ink" | "surface" | "quiet";
export type BigButtonSize = "md" | "lg" | "xl";

const VARIANT_CLASS: Record<BigButtonVariant, string> = {
  primary:
    "bg-accent border-accent-dark text-white shadow-[0_6px_0_var(--device-accent-dark)] hover:bg-accent-soft",
  ink: "bg-ink border-ink text-screen-ink shadow-[0_6px_0_var(--device-ink-dark)] hover:bg-ink-soft",
  surface:
    "bg-surface border-edge text-ink shadow-[0_6px_0_var(--device-edge-dark)] hover:bg-canvas",
  quiet: "bg-transparent border-transparent text-mute shadow-none",
};

const SIZE_CLASS: Record<BigButtonSize, string> = {
  md: "min-h-12 px-4 text-sm",
  lg: "min-h-14 px-5 text-base",
  xl: "min-h-20 px-6 text-xl",
};

export function bigButtonClass(
  variant: BigButtonVariant = "primary",
  size: BigButtonSize = "lg",
  options: { block?: boolean; className?: string } = {}
): string {
  return [
    "inline-flex items-center justify-center gap-3 rounded-2xl border-2 font-bold uppercase tracking-wide transition-all duration-100 select-none text-center",
    "active:translate-y-[4px] active:shadow-none",
    "disabled:pointer-events-none disabled:translate-y-[4px] disabled:opacity-40 disabled:shadow-none",
    "focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-accent",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    options.block ? "w-full" : "",
    options.className || "",
  ].join(" ");
}

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BigButtonVariant;
  size?: BigButtonSize;
  block?: boolean;
  children: ReactNode;
}

export function BigButton({
  variant = "primary",
  size = "lg",
  block = false,
  className,
  children,
  ...props
}: BigButtonProps) {
  return (
    <button
      type="button"
      className={bigButtonClass(variant, size, { block, className })}
      {...props}
    >
      {children}
    </button>
  );
}
