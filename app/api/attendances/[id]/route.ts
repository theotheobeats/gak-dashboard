import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const prisma = await getPrisma();
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
