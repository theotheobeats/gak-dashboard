"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { BigButton, bigButtonClass } from "@/components/attendance/BigButton";
import { DeviceShell, StepCard } from "@/components/attendance/DeviceShell";
import { DisplayPanel } from "@/components/attendance/DisplayPanel";
import {
  SESSIONS,
  congregationLabel,
  sessionLabel,
  sortByLabel,
  type AttendanceRecord,
  type CongregationRecord,
} from "@/lib/attendance";
import { formatDayKey, formatStoredDay } from "@/lib/wib";

interface TodayResponse {
  success: boolean;
  data: AttendanceRecord[];
  counts: Record<string, number>;
  total: number;
  date: string;
}

interface CongregationsResponse {
  data: CongregationRecord[];
  total: number;
}

interface AttendancesResponse {
  success: boolean;
  data: AttendanceRecord[];
}

const VISIBLE_MEMBERS = 25;

export default function AttendancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayCounts, setTodayCounts] = useState<Record<string, number>>({});
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayKey, setTodayKey] = useState("");
  const [congregations, setCongregations] = useState<CongregationRecord[]>([]);
  const [recent, setRecent] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMembers, setShowAllMembers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [todayResponse, congregationResponse, recentResponse] =
          await Promise.all([
            fetch("/api/attendances/today", { credentials: "include" }),
            fetch("/api/congregations?pageSize=1000", { credentials: "include" }),
            fetch("/api/attendances", { credentials: "include" }),
          ]);

        const todayResult = (await todayResponse.json()) as TodayResponse;
        if (todayResult.success) {
          setTodayCounts(todayResult.counts || {});
          setTodayTotal(todayResult.total || 0);
          setTodayKey(todayResult.date);
        }

        const congregationResult =
          (await congregationResponse.json()) as CongregationsResponse;
        if (congregationResult.data) {
          setCongregations(sortByLabel(congregationResult.data));
        }

        const recentResult = (await recentResponse.json()) as AttendancesResponse;
        if (recentResult.success) {
          setRecent(recentResult.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Gagal memuat data absensi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return congregations;
    return congregations.filter((congregation) =>
      congregationLabel(congregation).toLowerCase().includes(query)
    );
  }, [congregations, searchQuery]);

  const visibleMembers = showAllMembers
    ? filteredMembers
    : filteredMembers.slice(0, VISIBLE_MEMBERS);

  if (isLoading) {
    return (
      <DeviceShell className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </DeviceShell>
    );
  }

  return (
    <DeviceShell>
      <div className="space-y-5">
        <header className="px-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
            Gereja Anugerah Kristus
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
            Absensi Jemaat
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-mute sm:text-sm">
            {todayKey
              ? formatDayKey(todayKey)
              : formatStoredDay(new Date(), {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
          </p>
        </header>

        <DisplayPanel
          label="Hadir hari ini"
          value={todayTotal}
          unit="orang"
          sub="Total kedua kebaktian"
          hint="tekan tombol oranye"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {SESSIONS.map((session) => (
            <div
              key={session}
              className="rounded-[28px] border-2 border-edge bg-surface p-4 sm:p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-mute sm:text-sm">
                  {sessionLabel(session)}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute/70">
                  {session}
                </span>
              </div>
              <p className="mt-3 font-mono text-5xl leading-none font-bold tabular-nums text-ink sm:text-6xl">
                {todayCounts[session] || 0}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                orang tercatat
              </p>
              <Link
                href={`/attendance/create?session=${encodeURIComponent(session)}`}
                className={bigButtonClass("primary", "xl", {
                  block: true,
                  className: "mt-4",
                })}
              >
                <Plus size={26} strokeWidth={3} />
                Isi Absensi
              </Link>
            </div>
          ))}
        </div>

        <StepCard title="Riwayat per jemaat">
          <div className="relative">
            <Search
              size={22}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama jemaat…"
              className="h-14 w-full rounded-2xl border-2 border-edge bg-surface pr-4 pl-12 text-base font-semibold text-ink placeholder:text-mute focus:border-accent focus:outline-none"
            />
          </div>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
            {filteredMembers.length} jemaat · tekan nama untuk lihat riwayat
          </p>

          <div className="mt-3 space-y-2">
            {visibleMembers.map((congregation) => (
              <Link
                key={congregation.id}
                href={`/attendance/${congregation.id}`}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-edge bg-surface px-4 py-3 transition-all duration-100 active:translate-y-[3px] hover:border-ink/30"
              >
                <span className="flex items-center gap-3 truncate">
                  <Users size={20} className="shrink-0 text-mute" />
                  <span className="truncate text-base font-bold text-ink sm:text-lg">
                    {congregationLabel(congregation)}
                  </span>
                </span>
                <ChevronRight size={22} className="shrink-0 text-mute" />
              </Link>
            ))}

            {filteredMembers.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-edge px-4 py-6 text-center text-sm font-semibold text-mute">
                Jemaat tidak ditemukan
              </p>
            )}
          </div>

          {!showAllMembers && filteredMembers.length > VISIBLE_MEMBERS && (
            <BigButton
              variant="surface"
              size="lg"
              block
              className="mt-3"
              onClick={() => setShowAllMembers(true)}
            >
              Tampilkan semua ({filteredMembers.length})
            </BigButton>
          )}
        </StepCard>

        <StepCard title="Catatan terakhir">
          <div className="space-y-2">
            {recent.map((attendance) => (
              <Link
                key={attendance.id}
                href={`/attendance/${attendance.congregation.id}`}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-edge bg-surface px-4 py-3 active:translate-y-[3px]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-base font-bold text-ink">
                    {attendance.congregation.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
                    {formatStoredDay(attendance.date, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {sessionLabel(attendance.sermonSession.name)}
                  </span>
                </span>
                <CalendarCheck size={20} className="shrink-0 text-ok" />
              </Link>
            ))}

            {recent.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-edge px-4 py-6 text-center text-sm font-semibold text-mute">
                Belum ada catatan absensi
              </p>
            )}
          </div>
        </StepCard>
      </div>
    </DeviceShell>
  );
}
