"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ImageIcon,
  Users,
  UserCheck,
} from "lucide-react";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { DisplayPanel, StatPanel } from "@/components/ui/DisplayPanel";
import { ListRow } from "@/components/ui/ListRow";
import { EmptyState, LoadingBlock } from "@/components/ui/Feedback";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { sessionLabel } from "@/lib/attendance";
import {
  formatDayKey,
  formatStoredClock,
  formatStoredDay,
  wibDayKey,
} from "@/lib/wib";

interface ChartPoint {
  label: string;
  total: number;
}

interface AttendanceChartData {
  year: number;
  weekly: ChartPoint[];
  monthly: ChartPoint[];
}

interface TodayResponse {
  success: boolean;
  counts: Record<string, number>;
  total: number;
  date: string;
}

interface CongregationsResponse {
  data: { status: string }[];
  total: number;
}

interface AttendancesResponse {
  data: {
    id: string;
    date: string;
    congregation: { name: string };
    sermonSession: { name: string };
  }[];
}

const QUICK_ACTIONS = [
  {
    href: "/attendance/create",
    label: "Catat Kehadiran",
    hint: "Tandai jemaat yang hadir",
    icon: CalendarCheck,
  },
  {
    href: "/attendance",
    label: "Absensi & Riwayat",
    hint: "Rekap kehadiran jemaat",
    icon: CalendarDays,
  },
  {
    href: "/congregations",
    label: "Kelola Jemaat",
    hint: "Lihat dan ubah data anggota",
    icon: Users,
  },
  {
    href: "/media",
    label: "Galeri Media",
    hint: "Kelola album dan foto",
    icon: ImageIcon,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData, setChartData] = useState<AttendanceChartData | null>(null);
  const [stats, setStats] = useState({
    totalCongregations: 0,
    activeCongregations: 0,
    todayAttendance: 0,
    sessionCounts: {} as Record<string, number>,
    todayKey: "",
    recentActivities: [] as Array<{
      id: string;
      message: string;
      date: string;
      time: string;
    }>,
  });

  const averageWeekly = useMemo(() => {
    if (!chartData?.weekly?.length) return "0";
    const total = chartData.weekly.reduce((sum, week) => sum + week.total, 0);
    return Math.round(total / chartData.weekly.length).toString();
  }, [chartData]);

  useEffect(() => {
    if (!session) return;

    const fetchDashboardData = async () => {
      try {
        const [congregationsRes, todayRes, attendancesRes] = await Promise.all([
          fetch("/api/congregations?pageSize=1000", { credentials: "include" }),
          fetch("/api/attendances/today", { credentials: "include" }),
          fetch("/api/attendances", { credentials: "include" }),
        ]);

        const congregationsData =
          (await congregationsRes.json()) as CongregationsResponse;
        const todayData = (await todayRes.json()) as TodayResponse;
        const attendancesData =
          (await attendancesRes.json()) as AttendancesResponse;

        setStats({
          totalCongregations: congregationsData.total || 0,
          activeCongregations:
            congregationsData.data?.filter(
              (congregation) => congregation.status === "active"
            ).length || 0,
          todayAttendance: todayData.total || 0,
          sessionCounts: todayData.counts || {},
          todayKey: todayData.date || wibDayKey(),
          recentActivities: (attendancesData.data || [])
            .slice(0, 6)
            .map((attendance) => ({
              id: attendance.id,
              message: `${attendance.congregation.name} · ${sessionLabel(
                attendance.sermonSession.name
              )}`,
              date: attendance.date,
              time: formatStoredClock(attendance.date),
            })),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await fetch("/api/attendances/weekly", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setChartData(json.data || null);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchDashboardData();
    fetchChartData();
  }, [session]);

  if (loading) {
    return (
      <PageShell width="wide">
        <LoadingBlock label="Memuat dashboard…" />
      </PageShell>
    );
  }

  return (
    <PageShell width="wide">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Gereja Anugerah Kristus"
          title={session?.user?.name ? `Halo, ${session.user.name}` : "Halo"}
          subtitle={formatDayKey(wibDayKey(), {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DisplayPanel
              label="Hadir hari ini"
              value={stats.todayAttendance}
              unit="orang"
              sub={Object.entries(stats.sessionCounts)
                .map(([name, count]) => `${sessionLabel(name)}: ${count}`)
                .join(" · ") || "Belum ada catatan hari ini"}
              hint="tekan catat kehadiran"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            <StatPanel
              label="Total Jemaat"
              value={stats.totalCongregations}
              unit="orang"
              hint="Terdaftar"
              icon={<Users size={20} className="text-mute" />}
            />
            <StatPanel
              label="Anggota Aktif"
              value={stats.activeCongregations}
              unit="orang"
              hint="Status aktif"
              icon={<UserCheck size={20} className="text-mute" />}
            />
            <StatPanel
              label="Rata-rata Mingguan"
              value={averageWeekly}
              unit="hadir"
              hint={`Total catatan ${chartData?.year || ""}`}
              icon={<CalendarCheck size={20} className="text-mute" />}
            />
          </div>
        </div>

        <AttendanceChart data={chartData} loading={chartLoading} />

        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Aksi cepat">
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex min-h-20 items-center gap-3 rounded-2xl border-2 border-edge bg-surface px-4 py-3 shadow-[0_4px_0_var(--device-edge-dark)] transition-all duration-100 active:translate-y-[4px] active:shadow-none"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon size={24} strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-bold text-ink">
                        {action.label}
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                        {action.hint}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card title="Aktivitas terbaru">
            {stats.recentActivities.length > 0 ? (
              <div className="space-y-2">
                {stats.recentActivities.map((activity) => (
                  <ListRow
                    key={activity.id}
                    title={activity.message}
                    meta={`${formatStoredDay(activity.date, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })} · ${activity.time}`}
                    leading={<CalendarCheck size={20} className="text-mute" />}
                    trailing={<ChevronRight size={20} className="text-mute" />}
                    href="/attendance"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarDays size={28} />}
                title="Belum ada aktivitas"
                description="Absensi yang dicatat akan muncul di sini"
              />
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
