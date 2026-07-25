"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartPoint {
  label: string;
  total: number;
}

interface AttendanceChartData {
  year: number;
  weekly: ChartPoint[];
  monthly: ChartPoint[];
}

interface AttendanceChartProps {
  data: AttendanceChartData | null;
  loading?: boolean;
}

type ViewMode = "weekly" | "monthly";

export function AttendanceChart({ data, loading }: AttendanceChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");

  const chartData = viewMode === "weekly" ? data?.weekly ?? [] : data?.monthly ?? [];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-8 w-40 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-[220px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Grafik Kehadiran {data?.year}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {viewMode === "weekly"
              ? `${chartData.length} minggu tercatat`
              : `${chartData.length} bulan tercatat`}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 self-start">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === "weekly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      <div className="h-[220px] sm:h-[260px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-400">Belum ada data kehadiran</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                dy={8}
                interval={viewMode === "weekly" ? Math.ceil(chartData.length / 8) : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#64748b", marginBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary, #6366f1)"
                strokeWidth={2}
                fill="url(#attendanceGradient)"
                dot={viewMode === "monthly" ? {
                  fill: "var(--color-primary, #6366f1)",
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 4,
                } : false}
                activeDot={{
                  fill: "var(--color-primary, #6366f1)",
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
