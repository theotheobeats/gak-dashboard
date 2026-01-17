import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where: Record<string, unknown> = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [inventories, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.inventory.count({ where }),
    ]);

    return NextResponse.json({
      data: inventories,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, quantity, category, status, price, purchaseDate } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const inventory = await prisma.inventory.create({
      data: {
        name,
        quantity: parseInt(quantity),
        category,
        status,
        price: parseInt(price),
        purchaseDate: new Date(purchaseDate),
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating inventory:", error);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 }
    );
  }
}
