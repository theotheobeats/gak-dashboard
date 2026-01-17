import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attendances = await prisma.attendance.findMany({
      where: {
        congregationId: id,
      },
      include: {
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
