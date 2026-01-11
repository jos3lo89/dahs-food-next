import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    const where: any = {};

    if (active !== null) {
      where.active = active === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const categorias = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    const existingByName = await prisma.category.findUnique({
      where: { name: validatedData.name },
    });

    if (existingByName) {
      return NextResponse.json(
        { success: false, error: "El nombre ya está en uso" },
        { status: 400 }
      );
    }

    const existingBySlug = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingBySlug) {
      return NextResponse.json(
        { success: false, error: "El slug ya está en uso" },
        { status: 400 }
      );
    }

    const maxOrderCategory = await prisma.category.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 1;

    const categoria = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        order: newOrder,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: categoria,
        message: "Categoría creada exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: error.message,
        },
        { status: 400 }
      );
    }

    console.error("Error al crear categoría:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { categories } = await request.json();

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, error: "Formato inválido" },
        { status: 400 }
      );
    }

    await Promise.all(
      categories.map((cat: { id: string; order: number }) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { order: cat.order },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Orden actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al reordenar categorías:", error);
    return NextResponse.json(
      { success: false, error: "Error al reordenar categorías" },
      { status: 500 }
    );
  }
}
