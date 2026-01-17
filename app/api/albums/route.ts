import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    const albums = await prisma.album.findMany({
      include: {
        images: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, date, uploadedById } = body;

    if (!name || !uploadedById) {
      return NextResponse.json(
        { error: "Name and uploadedById are required" },
        { status: 400 }
      );
    }

    const album = await prisma.album.create({
      data: {
        name,
        description,
        date: new Date(date),
        uploadedBy: {
          connect: {
            id: uploadedById
          }
        }
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating album:", error);
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}
