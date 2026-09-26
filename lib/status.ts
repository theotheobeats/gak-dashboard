import type { Tone } from "@/components/ui/StatusPill";

const TONES: Record<string, Tone> = {
  GOOD: "ok",
  ACTIVE: "ok",
  PUBLISHED: "ok",
  COMPLETED: "ok",
  ONGOING: "warn",
  MAINTENANCE: "warn",
  NEW: "info",
  REVIEWED: "info",
  DRAFT: "neutral",
  ARCHIVED: "neutral",
  DISPOSED: "neutral",
  DAMAGED: "danger",
  INACTIVE: "danger",
};

const LABELS: Record<string, string> = {
  GOOD: "Baik",
  DAMAGED: "Rusak",
  MAINTENANCE: "Perawatan",
  DISPOSED: "Dibuang",
  ACTIVE: "Aktif",
  INACTIVE: "Tidak Aktif",
  PUBLISHED: "Terbit",
  DRAFT: "Draf",
  NEW: "Baru",
  REVIEWED: "Ditinjau",
  ARCHIVED: "Diarsipkan",
  ONGOING: "Berjalan",
  COMPLETED: "Selesai",
  SOUNDSYSTEM: "Sound System",
  MULTIMEDIA: "Multimedia",
  OTHER: "Lainnya",
  active: "Aktif",
  inactive: "Tidak Aktif",
};

export function statusTone(status: string): Tone {
  return TONES[status.toUpperCase()] || "neutral";
}

export function statusLabel(status: string): string {
  return LABELS[status] || LABELS[status.toUpperCase()] || status;
}
