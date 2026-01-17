import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { whatsappNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const congregations = await prisma.congregation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(congregations);
  } catch (error) {
    console.error("Error fetching congregations:", error);
    return NextResponse.json(
      { error: "Failed to fetch congregations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, birthday, whatsappNumber, address, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const congregation = await prisma.congregation.create({
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

    return NextResponse.json(congregation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating congregation:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "WhatsApp number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create congregation" },
      { status: 500 }
    );
  }
}
