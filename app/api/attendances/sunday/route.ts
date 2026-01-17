import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);

    if (currentDay !== 0) {
      sunday.setDate(today.getDate() + (7 - currentDay));
    }

    sunday.setHours(0, 0, 0, 0);
    const nextDay = new Date(sunday);
    nextDay.setDate(sunday.getDate() + 1);

    const sundayAttendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: sunday,
          lt: nextDay,
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

    return NextResponse.json({
      success: true,
      data: sundayAttendances,
    });
  } catch (error) {
    console.error("Error fetching Sunday attendances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Sunday attendances",
      },
      { status: 500 }
    );
  }
}
