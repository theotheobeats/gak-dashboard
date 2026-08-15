import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";


export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; maintenanceId: string }> }
) {
    const prisma = await getPrisma();
  try {
    const { maintenanceId } = await params;

    await prisma.inventoryMaintenance.delete({
      where: { id: maintenanceId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting maintenance:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Maintenance not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete maintenance" },
      { status: 500 }
    );
  }
}
