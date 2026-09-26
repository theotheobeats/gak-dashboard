import { ChevronLeft, ChevronRight } from "lucide-react";
import { BigButton } from "./BigButton";

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  label = "data",
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:text-left">
        Halaman {page} / {safeTotalPages} · {total} {label}
      </p>
      <div className="flex gap-3">
        <BigButton
          variant="surface"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex-1 sm:w-40"
        >
          <ChevronLeft size={22} strokeWidth={3} />
          Sebelumnya
        </BigButton>
        <BigButton
          variant="surface"
          onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
          disabled={page >= safeTotalPages}
          className="flex-1 sm:w-32"
        >
          Lanjut
          <ChevronRight size={22} strokeWidth={3} />
        </BigButton>
      </div>
    </div>
  );
}
