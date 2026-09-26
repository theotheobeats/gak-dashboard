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
import { Card } from "@/components/ui/Shell";
import { SegmentedControl } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/Feedback";
import { LineChart } from "lucide-react";

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

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
];

export function AttendanceChart({ data, loading }: AttendanceChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");

  const chartData =
    viewMode === "weekly" ? (data?.weekly ?? []) : (data?.monthly ?? []);

  if (loading) {
    return (
      <Card title="Grafik kehadiran">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 rounded bg-canvas" />
          <div className="h-[240px] rounded-2xl bg-canvas" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Grafik kehadiran ${data?.year ?? ""}`}
      action={
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={viewMode}
          onChange={setViewMode}
        />
      }
    >
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        {chartData.length} {viewMode === "weekly" ? "minggu" : "bulan"} tercatat
      </p>

      <div className="h-[240px] sm:h-[280px]">
        {chartData.length === 0 ? (
          <EmptyState
            icon={<LineChart size={28} />}
            title="Belum ada data kehadiran"
            description="Grafik akan terisi setelah absensi dicatat"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary, #3b82f6)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary, #3b82f6)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                dy={8}
                interval={
                  viewMode === "weekly" ? Math.ceil(chartData.length / 8) : 0
                }
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={38}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px -18px rgba(17,24,39,0.6)",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#6b7280", marginBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary, #3b82f6)"
                strokeWidth={3}
                fill="url(#attendanceGradient)"
                isAnimationActive={false}
                dot={
                  viewMode === "monthly"
                    ? {
                        fill: "var(--color-primary, #3b82f6)",
                        stroke: "#fff",
                        strokeWidth: 2,
                        r: 4,
                      }
                    : false
                }
                activeDot={{
                  fill: "var(--color-primary, #3b82f6)",
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
