"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/ui/Shell";
import { DisplayPanel } from "@/components/ui/DisplayPanel";
import { sessionLabel } from "@/lib/attendance";
import { formatDayKey, storedDayKey, wibDayKey } from "@/lib/wib";

interface Attendance {
  id: string;
  date: string;
  sermonSession: {
    id: string;
    name: string;
  };
}

interface Congregation {
  id: string;
  name: string;
  title: string | null;
  whatsappNumber: string | null;
  address: string | null;
}

interface AttendanceResponse {
  success: boolean;
  data: Attendance[];
}

function buildSundayKeys(year: number, endKey: string): string[] {
  const keys: string[] = [];
  const cursor = new Date(Date.UTC(year, 0, 1));
  const end = new Date(`${endKey}T00:00:00.000Z`);

  while (cursor.getTime() <= end.getTime()) {
    if (cursor.getUTCDay() === 0) {
      keys.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return keys;
}

export default function AttendanceHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [congregation, setCongregation] = useState<Congregation | null>(null);

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attendanceResponse, congregationResponse] = await Promise.all([
          fetch(`/api/attendances/${id}`, { credentials: "include" }),
          fetch(`/api/congregations/${id}`, { credentials: "include" }),
        ]);

        const attendanceResult =
          (await attendanceResponse.json()) as AttendanceResponse;
        const congregationResult =
          (await congregationResponse.json()) as Congregation | null;

        if (attendanceResult.success) {
          setAttendances(attendanceResult.data);
        }
        if (congregationResult) {
          setCongregation(congregationResult);
        }
      } catch (error) {
        console.error("Error fetching attendance history:", error);
        toast.error("Gagal memuat riwayat kehadiran");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const todayKey = wibDayKey();
  const year = Number(todayKey.slice(0, 4));

  const sundays = useMemo(
    () => buildSundayKeys(year, todayKey),
    [year, todayKey]
  );

  const attendedDayKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const attendance of attendances) {
      keys.add(storedDayKey(attendance.date));
    }
    return keys;
  }, [attendances]);

  const attendedCount = sundays.filter((key) =>
    attendedDayKeys.has(key)
  ).length;

  const percentage =
    sundays.length > 0 ? Math.round((attendedCount / sundays.length) * 100) : 0;

  const months = useMemo(() => {
    const grouped = new Map<string, string[]>();
    for (const key of sundays) {
      const monthKey = key.slice(0, 7);
      const existing = grouped.get(monthKey);
      if (existing) {
        existing.push(key);
      } else {
        grouped.set(monthKey, [key]);
      }
    }
    return Array.from(grouped, ([monthKey, keys]) => ({ monthKey, keys }));
  }, [sundays]);

  if (isLoading) {
    return (
      <PageShell className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </PageShell>
    );
  }

  if (!congregation) {
    return (
      <PageShell className="space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-ink">Jemaat tidak ditemukan</p>
        <Link
          href="/attendance"
          className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-edge bg-surface px-6 font-bold uppercase tracking-wide text-ink"
        >
          <ArrowLeft size={22} strokeWidth={3} />
          Kembali
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-5">
        <header className="flex items-center gap-3 px-1">
          <Link
            href="/attendance"
            aria-label="Kembali ke absensi"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge)] active:translate-y-[4px] active:shadow-none"
          >
            <ArrowLeft size={26} strokeWidth={3} />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
              {congregation.title
                ? `${congregation.title} ${congregation.name}`
                : congregation.name}
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:text-xs">
              Riwayat kehadiran sejak Januari {year}
            </p>
          </div>
        </header>

        <DisplayPanel
          label="Tingkat kehadiran"
          value={`${percentage}%`}
          sub={`${attendedCount} dari ${sundays.length} minggu · ${attendances.length} catatan`}
          hint="tekan ✓ hadir"
        />

        <div className="flex flex-wrap gap-3 px-1">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-ok-dark bg-ok px-4 py-2 text-white">
            <Check size={20} strokeWidth={4} />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Hadir
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-edge bg-surface px-4 py-2 text-mute">
            <span className="block h-[3px] w-4 rounded bg-mute/60" />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Tidak hadir
            </span>
          </div>
        </div>

        {months.map(({ monthKey, keys }) => {
          const monthAttended = keys.filter((key) =>
            attendedDayKeys.has(key)
          ).length;

          return (
            <section
              key={monthKey}
              className="rounded-[28px] border-2 border-edge bg-surface p-4 sm:p-5"
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
                  {formatDayKey(`${monthKey}-01`, {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <span className="font-mono text-sm font-bold tabular-nums text-ink">
                  {monthAttended}/{keys.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {keys.map((key) => {
                  const attended = attendedDayKeys.has(key);
                  return (
                    <div
                      key={key}
                      title={formatDayKey(key)}
                      className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-2 font-mono sm:h-16 sm:w-16 ${
                        attended
                          ? "border-ok-dark bg-ok text-white"
                          : "border-edge bg-canvas text-mute"
                      }`}
                    >
                      <span className="text-lg leading-none font-bold tabular-nums">
                        {Number(key.slice(8, 10))}
                      </span>
                      <span className="mt-1.5 flex h-4 items-center">
                        {attended ? (
                          <Check size={16} strokeWidth={4} />
                        ) : (
                          <span className="block h-[3px] w-4 rounded bg-current opacity-60" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="rounded-[28px] border-2 border-edge bg-surface p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <Users size={20} className="text-mute" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
              Catatan terakhir
            </h2>
          </div>
          <div className="space-y-2">
            {attendances.slice(0, 6).map((attendance) => (
              <div
                key={attendance.id}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-edge bg-canvas px-4 py-2"
              >
                <span className="text-base font-bold text-ink">
                  {formatDayKey(storedDayKey(attendance.date))}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                  {sessionLabel(attendance.sermonSession.name)}
                </span>
              </div>
            ))}
            {attendances.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-edge px-4 py-6 text-center text-sm font-semibold text-mute">
                Belum ada catatan kehadiran
              </p>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
