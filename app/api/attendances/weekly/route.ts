import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
    const prisma = await getPrisma();
  try {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfYear,
          lte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const weeklyMap = new Map<string, { startDate: string; total: number }>();
    const monthlyMap = new Map<string, { total: number }>();

    for (const attendance of attendances) {
      const date = new Date(attendance.date);
      const dayOfWeek = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          startDate: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
          total: 0,
        });
      }
      weeklyMap.get(weekKey)!.total += 1;

      const monthKey = date.toLocaleString("id-ID", { month: "short" });
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { total: 0 });
      }
      monthlyMap.get(monthKey)!.total += 1;
    }

    const weekly = Array.from(weeklyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => ({
        label: data.startDate,
        total: data.total,
      }));

    const monthlyOrder = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthly = monthlyOrder
      .filter((m) => monthlyMap.has(m))
      .map((m) => ({
        label: m,
        total: monthlyMap.get(m)!.total,
      }));

    return NextResponse.json({
      success: true,
      data: {
        year: today.getFullYear(),
        weekly,
        monthly,
      },
    });
  } catch (error) {
    console.error("Error fetching yearly attendances:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch yearly attendances" },
      { status: 500 }
    );
  }
}
