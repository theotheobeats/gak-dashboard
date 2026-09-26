export const WIB_OFFSET_HOURS = 7;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Instants are stored as "WIB wall clock encoded as UTC": the writer adds the
 * Jakarta offset so 08:00 WIB is persisted as 08:00Z. Reading a stored value
 * with `timeZone: "UTC"` therefore reproduces exactly what was typed in.
 */
export function wibNow(): Date {
  const now = new Date();
  return new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + WIB_OFFSET_HOURS * HOUR_MS
  );
}

export function wibDayKey(reference: Date = wibNow()): string {
  return reference.toISOString().slice(0, 10);
}

export function storedDayKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function wibDayBounds(reference: Date = wibNow()): {
  start: Date;
  end: Date;
  key: string;
} {
  const key = wibDayKey(reference);
  const start = new Date(`${key}T00:00:00.000Z`);
  return { start, end: new Date(start.getTime() + DAY_MS), key };
}

export function formatStoredDay(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("id-ID", { timeZone: "UTC", ...options });
}

export function formatStoredClock(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleTimeString("id-ID", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayKey(
  key: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return formatStoredDay(`${key}T00:00:00.000Z`, options);
}
