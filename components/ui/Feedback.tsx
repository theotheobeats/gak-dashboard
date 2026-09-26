import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function LoadingBlock({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="h-10 w-10 animate-spin text-accent" />
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
        {label}
      </p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-edge px-6 py-10 text-center">
      {icon && <span className="text-mute">{icon}</span>}
      <p className="text-base font-bold text-ink">{title}</p>
      {description && (
        <p className="max-w-md font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
