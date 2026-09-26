import type { ReactNode } from "react";

type ShellWidth = "form" | "wide" | "full";

const WIDTH_CLASS: Record<ShellWidth, string> = {
  form: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

export function PageShell({
  children,
  width = "form",
  className = "",
}: {
  children: ReactNode;
  width?: ShellWidth;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full ${WIDTH_CLASS[width]} rounded-[36px] border-2 border-edge bg-canvas p-3 shadow-[0_18px_40px_-32px_rgba(17,24,39,0.45)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  step,
  action,
  children,
  className = "",
}: {
  title?: string;
  step?: number;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border-2 border-edge bg-surface p-4 sm:p-5 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center gap-3">
          {step !== undefined && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink font-mono text-sm font-bold text-screen-ink">
              {step}
            </span>
          )}
          {title && (
            <h2 className="flex-1 font-mono text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
