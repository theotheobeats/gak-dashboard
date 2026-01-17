import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        inspections: {
          orderBy: { createdAt: "desc" },
        },
        maintenances: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
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
    const { name, quantity, category, status, price, purchaseDate } = body;

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        quantity: parseInt(quantity),
        category,
        status,
        price: parseInt(price),
        purchaseDate: new Date(purchaseDate),
      },
    });

    return NextResponse.json(inventory);
  } catch (error: unknown) {
    console.error("Error updating inventory:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update inventory" },
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

    await prisma.inventory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting inventory:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete inventory" },
      { status: 500 }
    );
  }
}
