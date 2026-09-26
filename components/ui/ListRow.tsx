import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";

type RowTone = "default" | "selected" | "muted";

const TONE_CLASS: Record<RowTone, string> = {
  default:
    "border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge-dark)] active:translate-y-[4px] active:shadow-none hover:border-ink/25",
  selected:
    "border-accent-dark bg-accent text-white shadow-[0_4px_0_var(--device-accent-dark)] active:translate-y-[4px] active:shadow-none",
  muted: "border-edge bg-canvas text-mute",
};

interface ListRowProps {
  title: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: RowTone;
  disabled?: boolean;
  className?: string;
}

export function ListRow({
  title,
  meta,
  leading,
  trailing,
  href,
  onClick,
  tone = "default",
  disabled = false,
  className = "",
}: ListRowProps) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {leading && <span className="shrink-0">{leading}</span>}
        <span className="min-w-0">
          <span className="block truncate text-base font-bold sm:text-lg">
            {title}
          </span>
          {meta && (
            <span className="mt-0.5 block truncate font-mono text-[11px] uppercase tracking-[0.15em] opacity-80">
              {meta}
            </span>
          )}
        </span>
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </>
  );

  const base = `flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-100 ${TONE_CLASS[tone]} ${
    disabled ? "pointer-events-none opacity-60" : ""
  } ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={base}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={base}>
      {body}
    </button>
  );
}

export function RowCheck({ active, muted = false }: { active: boolean; muted?: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
        muted
          ? "border-mute/40 bg-mute/15 text-mute"
          : active
            ? "border-white bg-white text-accent-dark"
            : "border-edge bg-canvas text-mute"
      }`}
    >
      {active ? (
        <Check size={24} strokeWidth={4} />
      ) : (
        <Plus size={24} strokeWidth={3} />
      )}
    </span>
  );
}
