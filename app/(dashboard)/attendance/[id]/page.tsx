"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { format, subMonths, eachDayOfInterval, isSameDay, isWeekend } from "date-fns";
import { id as idLocale } from "date-fns/locale";

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
  whatsappNumber: string | null;
  address: string | null;
}

export default function AttendanceHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [congregation, setCongregation] = useState<Congregation | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attendanceResponse, congregationResponse] = await Promise.all([
          fetch(`/api/attendances/${id}`),
          fetch(`/api/congregations/${id}`),
        ]);

        const attendanceResult = await attendanceResponse.json();
        const congregationResult = await congregationResponse.json();

        if (attendanceResult.success) {
          setAttendances(attendanceResult.data);
        }
        if (congregationResult) {
          setCongregation(congregationResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attendanceResponse, congregationResponse] = await Promise.all([
          fetch(`/api/attendances/${id}`),
          fetch(`/api/congregations/${id}`),
        ]);

        const attendanceResult = await attendanceResponse.json();
        const congregationResult = await congregationResponse.json();

        if (attendanceResult.success) {
          setAttendances(attendanceResult.data);
        }
        if (congregationResult) {
          setCongregation(congregationResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!congregation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Jemaat tidak ditemukan</p>
      </div>
    );
  }

  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);

  const days = eachDayOfInterval({
    start: sixMonthsAgo,
    end: today,
  });
  const sundays = days.filter((day) => isWeekend(day) && day.getDay() === 0);

  const sundaysByMonth = sundays.reduce<Record<string, Date[]>>(
    (acc, sunday) => {
      const monthKey = format(sunday, "MMMM yyyy", { locale: idLocale });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(sunday);
      return acc;
    },
    {}
  );

  const totalAttendances = attendances.filter((attendance) => {
    const attendanceDate = new Date(attendance.date);
    return attendanceDate >= sixMonthsAgo && attendanceDate <= today;
  }).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {congregation.name}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            {totalAttendances} kehadiran dari {sundays.length} minggu terakhir (
            {Math.round((totalAttendances / sundays.length) * 100)}%)
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(sundaysByMonth).map(([month, monthSundays]) => (
          <div
            key={month}
            className="border border-gray-200 rounded-xl p-4 flex-shrink-0"
            style={{ minWidth: "280px", maxWidth: "calc(33.333% - 0.75rem)" }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-3">{month}</h3>
            <div className="flex flex-wrap gap-1.5">
              {monthSundays.map((sunday) => {
                const attendance = attendances.find((a) =>
                  isSameDay(new Date(a.date), sunday)
                );

                return (
                  <div
                    key={sunday.toISOString()}
                    className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs transition-colors ${
                      attendance
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {format(sunday, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />
          <span>Hadir</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-50 border border-red-100" />
          <span>Tidak Hadir</span>
        </div>
      </div>
    </div>
  );
}
