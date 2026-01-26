import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createIngredientSchema } from "@/schemas/ingredients.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const ingredients = await prisma.ingredient.findMany({
      where: { productId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Error al obtener ingredientes:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener ingredientes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = createIngredientSchema.parse(body);
    const name = validatedData.name.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nombre muy corto" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        productId: id,
      },
    });

    return NextResponse.json(
      { success: true, data: ingredient, message: "Ingrediente agregado" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    console.error("Error al crear ingrediente:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear ingrediente" },
      { status: 500 }
    );
  }
}
