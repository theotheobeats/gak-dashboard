import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { wibDayBounds } from "@/lib/wib";

export async function GET(_request: NextRequest) {
  const prisma = await getPrisma();
  try {
    const { start, end, key } = wibDayBounds();

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
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

    const counts = attendances.reduce<Record<string, number>>(
      (acc, attendance) => {
        const name = attendance.sermonSession.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      success: true,
      data: attendances,
      counts,
      total: attendances.length,
      date: key,
    });
  } catch (error) {
    console.error("Error fetching today's attendances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch today's attendances",
      },
      { status: 500 }
    );
  }
}
