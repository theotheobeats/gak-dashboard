import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
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
  try {
    const body = await request.json();
    const { attendees } = body;

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendees array is required",
        },
        { status: 400 }
      );
    }

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    
    let sessionName = "";
    if (currentHour >= 6 && currentHour < 9) {
      sessionName = "Session 1";
    } else if (currentHour >= 9 && currentHour < 13) {
      sessionName = "Session 2";
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Absensi hanya dapat dicatat pada jam 06:00 - 13:00 (GMT+7)",
        },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(async (tx) => {
      const createdAttendances = [];

      for (const attendee of attendees) {
        const { congregationId, name, isNewCongregation } = attendee;

        let finalCongregationId = congregationId;

        if (isNewCongregation || !congregationId) {
          const newCongregation = await tx.congregation.create({
            data: {
              name,
              status: "active",
            },
          });
          finalCongregationId = newCongregation.id;
        }

        const sermonSession = await tx.sermonSession.findFirst({
          where: {
            name: sessionName,
          },
        });

        if (!sermonSession) {
          throw new Error(`Session "${sessionName}" not found`);
        }

        const attendance = await tx.attendance.create({
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

      return createdAttendances;
    });

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
