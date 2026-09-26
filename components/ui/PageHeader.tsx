import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel = "Kembali",
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge-dark)] transition-all duration-100 active:translate-y-[4px] active:shadow-none"
          >
            <ArrowLeft size={26} strokeWidth={3} />
          </Link>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
              {eyebrow}
            </p>
          )}
          <h1 className="truncate text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-mute sm:text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
