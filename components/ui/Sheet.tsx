import type { ReactNode } from "react";
import { X } from "lucide-react";
import { BigIconButton } from "./BigButton";

interface SheetProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: SheetProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div className="flex max-h-[94vh] w-full flex-col rounded-t-[32px] border-2 border-edge bg-canvas sm:max-w-2xl sm:rounded-[32px]">
        <div className="flex items-center gap-3 border-b-2 border-edge px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-black uppercase tracking-tight text-ink">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                {subtitle}
              </p>
            )}
          </div>
          <BigIconButton label="Tutup" onClick={onClose}>
            <X size={26} strokeWidth={3} />
          </BigIconButton>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {children}
        </div>

        {footer && (
          <div className="border-t-2 border-edge bg-canvas px-4 py-4 sm:rounded-b-[32px] sm:px-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
