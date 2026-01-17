"use client";

import { useState, useEffect } from "react";
import { Plus, History, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Attendance {
  id: string;
  date: string;
  congregation: {
    id: string;
    name: string;
  };
  sermonSession: {
    id: string;
    name: string;
  };
}

interface AttendanceResponse {
  success: boolean;
  data: Attendance[];
}

export default function AttendancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sundayAttendances, setSundayAttendances] = useState<Attendance[]>([]);
  const [allAttendances, setAllAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sundayResponse, allResponse] = await Promise.all([
          fetch("/api/attendances/sunday"),
          fetch("/api/attendances"),
        ]);

        const sundayResult = (await sundayResponse.json()) as AttendanceResponse;
        const allResult = (await allResponse.json()) as AttendanceResponse;

        if (sundayResult.success) {
          setSundayAttendances(sundayResult.data);
        }
        if (allResult.success) {
          setAllAttendances(allResult.data);
        }
      } catch (error) {
        console.error("Error fetching attendances:", error);
        toast.error("Gagal memuat data absensi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const session1Attendances = sundayAttendances.filter(
    (a) => a.sermonSession.name === "Session 1"
  );
  const session2Attendances = sundayAttendances.filter(
    (a) => a.sermonSession.name === "Session 2"
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Absensi Jemaat
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Kelola kehadiran jemaat dalam kebaktian
          </p>
        </div>
        <Link
          href="/attendance/create"
          className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
        >
          <Plus size={18} />
          <span>Buat Absensi</span>
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Kebaktian Umum 1</h3>
          <p className="text-xs text-gray-500 mb-3">
            {sundayAttendances[0] ? formatDate(sundayAttendances[0].date) : formatDate(new Date().toISOString())}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {session1Attendances.length} Orang
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Kebaktian Umum 2</h3>
          <p className="text-xs text-gray-500 mb-3">
            {sundayAttendances[0] ? formatDate(sundayAttendances[0].date) : formatDate(new Date().toISOString())}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {session2Attendances.length} Orang
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Riwayat Absensi</h3>
        <p className="text-xs text-gray-500 mb-4">
          Daftar absensi jemaat yang telah direkam
        </p>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                  Tanggal
                </th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                  Sesi
                </th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                  Nama
                </th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700 text-xs">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {allAttendances.map((attendance) => (
                <tr
                  key={attendance.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {formatDateTime(attendance.date)}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {attendance.sermonSession.name}
                  </td>
                  <td className="py-3 px-3 text-sm font-medium text-gray-900">
                    {attendance.congregation.name}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/attendance/${attendance.congregation.id}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-primary"
                        title="Lihat Riwayat"
                      >
                        <History size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {allAttendances.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                    Belum ada data absensi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
