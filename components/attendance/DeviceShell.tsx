import type { ReactNode } from "react";

export function DeviceShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-3xl rounded-[36px] border-2 border-edge bg-canvas p-3 shadow-[0_30px_60px_-45px_rgba(20,20,20,0.8)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function StepCard({
  step,
  title,
  children,
  className = "",
}: {
  step?: number;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border-2 border-edge bg-surface/80 p-4 sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        {step !== undefined && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink font-mono text-sm font-bold text-screen-ink">
            {step}
          </span>
        )}
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
