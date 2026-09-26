export const SESSIONS = ["Session 1", "Session 2"] as const;

export type SessionName = (typeof SESSIONS)[number];

export function sessionLabel(name: string): string {
  const match = name.match(/(\d+)/);
  return match ? `Kebaktian ${match[1]}` : name;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  congregation: {
    id: string;
    name: string;
    title: string | null;
  };
  sermonSession: {
    id: string;
    name: string;
  };
}

export interface CongregationRecord {
  id: string;
  name: string;
  title: string | null;
  status: string;
}

export function congregationLabel(congregation: {
  name: string;
  title?: string | null;
}): string {
  return congregation.title
    ? `${congregation.title} ${congregation.name}`
    : congregation.name;
}

export function sortByLabel<T extends { name: string; title?: string | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) =>
    congregationLabel(a).localeCompare(congregationLabel(b), "id-ID")
  );
}

export function attendanceKey(
  congregationId: string,
  sessionName: string
): string {
  return `${congregationId}|${sessionName}`;
}
