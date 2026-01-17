import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, alt, caption, width, height, size, albumId, userId } = body;

    if (!url || !albumId) {
      return NextResponse.json(
        { error: "URL and albumId are required" },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        url,
        alt,
        caption,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        size: size ? parseInt(size) : null,
        album: {
          connect: {
            id: albumId
          }
        },
        User: userId ? {
          connect: {
            id: userId
          }
        } : undefined
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
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

    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting image:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
