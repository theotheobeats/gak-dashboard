import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const firstDayOfYear = new Date(currentYear, 0, 1);
    const lastDayOfYear = new Date(currentYear, 11, 31);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: firstDayOfYear,
          lte: lastDayOfYear,
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

    const monthlyData = attendances.reduce(
      (acc, attendance) => {
        const date = new Date(attendance.date);
        const monthKey = date.toLocaleString("default", { month: "long" });

        if (!acc[monthKey]) {
          acc[monthKey] = {
            attendances: [],
            total: 0,
            startDate: new Date(date.getFullYear(), date.getMonth(), 1),
            endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
          };
        }

        acc[monthKey].attendances.push(attendance);
        acc[monthKey].total += 1;

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

    const yearlyTotal = attendances.length;

    return NextResponse.json({
      success: true,
      data: {
        monthlyData,
        yearlyTotal,
        year: currentYear,
      },
    });
  } catch (error) {
    console.error("Error fetching yearly attendances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch yearly attendances",
      },
      { status: 500 }
    );
  }
}
