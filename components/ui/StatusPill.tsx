import type { ReactNode } from "react";

export type Tone = "ok" | "warn" | "danger" | "info" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  ok: "border-ok-dark bg-ok text-white",
  warn: "border-[var(--device-warn-dark)] bg-[var(--device-warn)] text-white",
  danger: "border-[var(--device-danger-dark)] bg-[var(--device-danger)] text-white",
  info: "border-accent-dark bg-accent text-white",
  neutral: "border-edge bg-canvas text-mute",
};

export function StatusPill({
  tone = "neutral",
  children,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] ${TONE_CLASS[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function FilterChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 px-4 font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all duration-100 active:translate-y-[3px] active:shadow-none ${
        active
          ? "border-ink bg-ink text-screen-ink shadow-[0_4px_0_var(--device-ink-dark)]"
          : "border-edge bg-surface text-mute shadow-[0_4px_0_var(--device-edge-dark)]"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] tabular-nums ${
            active ? "bg-screen-ink/20 text-screen-ink" : "bg-mute/15 text-mute"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex flex-wrap gap-1 rounded-2xl border-2 border-edge bg-canvas p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`min-h-10 rounded-xl px-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-100 ${
            option.value === value
              ? "bg-ink text-screen-ink"
              : "text-mute hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
