"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Calendar, CheckSquare, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCongregations: 0,
    activeCongregations: 0,
    todayAttendance: 0,
    recentActivities: [] as Array<{ id: string; type: string; message: string; time: string }>,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [congregationsRes, attendancesRes] = await Promise.all([
          fetch("/api/congregations?pageSize=1000"),
          fetch("/api/attendances/sunday"),
        ]);

        const congregationsData = await congregationsRes.json();
        const attendancesData = await attendancesRes.json();

        const totalCongregations = congregationsData.total || 0;
        const activeCongregations = congregationsData.data?.filter((c: { status: string }) => c.status === "active").length || 0;
        const todayAttendance = attendancesData.data?.length || 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const allAttendancesRes = await fetch("/api/attendances");
        const allAttendancesData = await allAttendancesRes.json();

        const recentActivities = allAttendancesData.data
          ?.slice(0, 5)
          .map((a: { id: string; date: string; congregation: { name: string }; sermonSession: { name: string } }) => ({
            id: a.id,
            type: "attendance",
            message: `${a.congregation.name} hadir di ${a.sermonSession.name}`,
            time: new Date(a.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          })) || [];

        setStats({
          totalCongregations,
          activeCongregations,
          todayAttendance,
          recentActivities,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {session?.user?.name ? `Halo, ${session.user.name}` : "Halo"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Selamat datang di Dashboard GAK. Kelola jemaat dan kegiatan Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Jemaat"
          value={stats.totalCongregations.toString()}
          trend="up"
          trendLabel="Anggota terdaftar"
          variant="primary"
        />
        <StatCard
          title="Anggota Aktif"
          value={stats.activeCongregations.toString()}
          trend="up"
          trendLabel="Status aktif"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={stats.todayAttendance.toString()}
          trend="up"
          trendLabel="Terdata hari ini"
        />
        <StatCard
          title="Kehadiran Minggu Ini"
          value={stats.todayAttendance.toString()}
          trend="up"
          trendLabel="Total kehadiran"
        />

        <div className="xl:col-span-2 min-h-[300px] bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/congregations"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Kelola Jemaat</h4>
                <p className="text-xs text-gray-500">Lihat dan edit anggota</p>
              </div>
            </a>
            <a
              href="/attendance/create"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Catat Kehadiran</h4>
                <p className="text-xs text-gray-500">Lacak kehadiran anggota</p>
              </div>
            </a>
            <a
              href="/attendance"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Riwayat Absensi</h4>
                <p className="text-xs text-gray-500">Lihat data kehadiran</p>
              </div>
            </a>
            <a
              href="/attendance"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Laporan Kehadiran</h4>
                <p className="text-xs text-gray-500">Analisis dan wawasan</p>
              </div>
            </a>
          </div>
        </div>

        <div className="xl:col-span-2 min-h-[300px] bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-900">{activity.message}</p>
                    <p className="text-[10px] text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-gray-500">Belum ada aktivitas terbaru</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
