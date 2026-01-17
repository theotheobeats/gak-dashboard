import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const congregation = await prisma.congregation.findUnique({
      where: { id: params.id },
    });

    if (!congregation) {
      return NextResponse.json(
        { error: "Congregation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(congregation);
  } catch (error) {
    console.error("Error fetching congregation:", error);
    return NextResponse.json(
      { error: "Failed to fetch congregation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, title, birthday, whatsappNumber, address, status } = body;

    const congregation = await prisma.congregation.update({
      where: { id: params.id },
      data: {
        name,
        title: title || null,
        nameWithoutTitle: title ? `${name} ${title}` : name,
        birthday: birthday ? new Date(birthday) : null,
        whatsappNumber: whatsappNumber || null,
        address: address || null,
        status: status || "active",
      },
    });

    return NextResponse.json(congregation);
  } catch (error: any) {
    console.error("Error updating congregation:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "WhatsApp number already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Congregation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update congregation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.congregation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Congregation deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting congregation:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Congregation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete congregation" },
      { status: 500 }
    );
  }
}
