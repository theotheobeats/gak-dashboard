import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      include: {
        congregation: true,
        sermonSession: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const weeklyData = attendances.reduce(
      (acc, attendance) => {
        const date = new Date(attendance.date);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayWeekday = firstDay.getDay();
        const weekNumber = Math.ceil((date.getDate() + firstDayWeekday) / 7);
        const weekKey = `Week ${weekNumber}`;

        if (!acc[weekKey]) {
          acc[weekKey] = {
            attendances: [],
            total: 0,
            startDate: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - date.getDay()
            ),
            endDate: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + (6 - date.getDay())
            ),
          };
        }

        acc[weekKey].attendances.push(attendance);
        acc[weekKey].total += 1;

        return acc;
      },
      {} as Record<
        string,
        {
          attendances: typeof attendances;
          total: number;
          startDate: Date;
          endDate: Date;
        }
      >
    );

    const monthlyTotal = attendances.length;

    return NextResponse.json({
      success: true,
      data: {
        weeklyData,
        monthlyTotal,
        month: firstDayOfMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching monthly attendances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch monthly attendances",
      },
      { status: 500 }
    );
  }
}
