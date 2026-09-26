import type { ReactNode } from "react";

interface DisplayPanelProps {
  label?: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  hint?: string;
  tone?: "dark" | "light";
}

export function DisplayPanel({
  label,
  value,
  unit,
  sub,
  hint,
  tone = "dark",
}: DisplayPanelProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border-2 px-5 py-6 sm:px-7 sm:py-7 ${
        isDark
          ? "border-ink bg-screen text-screen-ink"
          : "border-edge bg-surface text-ink"
      }`}
    >
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 opacity-25 bg-[radial-gradient(circle,#ffffff33_1px,transparent_1px)] bg-[size:7px_7px]"
        />
      )}
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {label && (
            <p
              className={`mb-2 font-mono text-[11px] uppercase tracking-[0.3em] ${
                isDark ? "text-screen-ink/50" : "text-mute"
              }`}
            >
              {label}
            </p>
          )}
          <div className="flex items-end gap-2">
            <span className="font-mono text-5xl leading-none font-bold tabular-nums sm:text-6xl">
              {value}
            </span>
            {unit && (
              <span
                className={`mb-1 font-mono text-sm uppercase tracking-[0.2em] ${
                  isDark ? "text-screen-ink/60" : "text-mute"
                }`}
              >
                {unit}
              </span>
            )}
          </div>
          {sub && (
            <div
              className={`mt-3 font-mono text-xs uppercase tracking-[0.15em] sm:text-sm ${
                isDark ? "text-screen-ink/70" : "text-mute"
              }`}
            >
              {sub}
            </div>
          )}
        </div>
        {hint && (
          <p
            className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
              isDark ? "text-screen-ink/45" : "text-mute"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
