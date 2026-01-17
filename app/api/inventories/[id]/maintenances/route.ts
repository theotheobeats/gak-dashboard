import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, status, cost, quantity } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const maintenance = await prisma.inventoryMaintenance.create({
      data: {
        name,
        description,
        status,
        cost: parseInt(cost),
        quantity: parseInt(quantity) || 1,
        inventoryId: id,
      },
    });

    return NextResponse.json(maintenance, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating maintenance:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance" },
      { status: 500 }
    );
  }
}
