"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Calendar, CheckSquare } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();

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
          value="0"
          trend="up"
          trendLabel="Anggota aktif"
          variant="primary"
        />
        <StatCard
          title="Anggota Aktif"
          value="0"
          trend="up"
          trendLabel="Saat ini aktif"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value="0"
          trend="up"
          trendLabel="Terdata hari ini"
        />
        <StatCard
          title="Tugas Tertunda"
          value="0"
          trend="up"
          trendLabel="Perlu perhatian"
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
              href="/congregations"
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
              href="/congregations"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Lihat Jadwal</h4>
                <p className="text-xs text-gray-500">Acara yang akan datang</p>
              </div>
            </a>
            <a
              href="/congregations"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Lihat Laporan</h4>
                <p className="text-xs text-gray-500">Analisis dan wawasan</p>
              </div>
            </a>
          </div>
        </div>

        <div className="xl:col-span-2 min-h-[300px] bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-gray-900">Selamat datang di Dashboard GAK</p>
                <p className="text-[10px] text-gray-500">Mulai dengan menambahkan anggota jemaat pertama Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-gray-900">Sistem diinisialisasi</p>
                <p className="text-[10px] text-gray-500">Semua sistem berjalan dengan lancar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
