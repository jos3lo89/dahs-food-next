import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ingredientId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id, ingredientId } = await params;

    const result = await prisma.ingredient.deleteMany({
      where: { id: ingredientId, productId: id },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: "Ingrediente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ingrediente eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar ingrediente:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar ingrediente" },
      { status: 500 }
    );
  }
}
