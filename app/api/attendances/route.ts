import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";


export async function GET(_request: NextRequest) {
    const prisma = await getPrisma();
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        congregation: true,
        sermonSession: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: attendances,
    });
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attendances",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    const prisma = await getPrisma();
  try {
    const body = await request.json();
    const { attendees, sessionName } = body;

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendees array is required",
        },
        { status: 400 }
      );
    }

    if (!sessionName) {
      return NextResponse.json(
        {
          success: false,
          error: "Session is required",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const gmt7Offset = 7;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const currentDate = new Date(utc + (3600000 * gmt7Offset));

    // D1 does not support transactions; each write commits individually.
    const createdAttendances = [];

    for (const attendee of attendees) {
      const { congregationId, name, isNewCongregation } = attendee;

      let finalCongregationId = congregationId;

      if (isNewCongregation || !congregationId) {
        const newCongregation = await prisma.congregation.create({
          data: {
            name,
            status: "active",
          },
        });
        finalCongregationId = newCongregation.id;
      }

      let sermonSession = await prisma.sermonSession.findFirst({
        where: {
          name: sessionName,
        },
      });

      if (!sermonSession) {
        sermonSession = await prisma.sermonSession.create({
          data: {
            name: sessionName,
          },
        });
      }

      const attendance = await prisma.attendance.create({
        data: {
          congregationId: finalCongregationId,
          sessionId: sermonSession.id,
          date: currentDate,
        },
        include: {
          congregation: true,
          sermonSession: true,
        },
      });

      createdAttendances.push(attendance);
    }

    const results = createdAttendances;

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: unknown) {
    console.error("Error creating attendance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create attendance",
      },
      { status: 500 }
    );
  }
}
