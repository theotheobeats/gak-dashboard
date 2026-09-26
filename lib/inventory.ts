export const INVENTORY_CATEGORIES = [
  "SOUNDSYSTEM",
  "MULTIMEDIA",
  "OTHER",
] as const;

export const INVENTORY_STATUSES = [
  "GOOD",
  "DAMAGED",
  "MAINTENANCE",
  "DISPOSED",
] as const;

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];
export type InventoryStatus = (typeof INVENTORY_STATUSES)[number];

const CATEGORY_LABELS: Record<string, string> = {
  SOUNDSYSTEM: "Sound System",
  MULTIMEDIA: "Multimedia",
  OTHER: "Lainnya",
};

const STATUS_LABELS: Record<string, string> = {
  GOOD: "Baik",
  DAMAGED: "Rusak",
  MAINTENANCE: "Perawatan",
  DISPOSED: "Dibuang",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

export function inventoryStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

export function formatRupiah(value: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value || 0)}`;
}

export function formatDateID(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
