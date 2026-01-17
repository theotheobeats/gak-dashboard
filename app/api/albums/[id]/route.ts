import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "desc" },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, date } = body;

    const album = await prisma.album.update({
      where: { id },
      data: {
        name,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(album);
  } catch (error: unknown) {
    console.error("Error updating album:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update album" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.album.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting album:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
