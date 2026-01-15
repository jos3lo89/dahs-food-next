import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  order: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoria = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { success: false, error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener categoría" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    if (validatedData.name) {
      const existingByName = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          NOT: { id },
        },
      });

      if (existingByName) {
        return NextResponse.json(
          { success: false, error: "El nombre ya está en uso" },
          { status: 400 }
        );
      }
    }

    if (validatedData.slug) {
      const existingBySlug = await prisma.category.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      });

      if (existingBySlug) {
        return NextResponse.json(
          { success: false, error: "El slug ya está en uso" },
          { status: 400 }
        );
      }
    }

    if (validatedData.order !== undefined) {
      const currentCategory = await prisma.category.findUnique({
        where: { id },
        select: { order: true },
      });

      if (!currentCategory) {
        return NextResponse.json(
          { success: false, error: "Categoría no encontrada" },
          { status: 404 }
        );
      }

      const oldOrder = currentCategory.order;
      const newOrder = validatedData.order;

      if (oldOrder !== newOrder) {
        if (newOrder < 1) {
          return NextResponse.json(
            { success: false, error: "El orden debe ser mayor o igual a 1" },
            { status: 400 }
          );
        }

        const categoryInTargetPosition = await prisma.category.findFirst({
          where: {
            order: newOrder,
            NOT: { id },
          },
        });

        if (categoryInTargetPosition) {
          const maxOrderCategory = await prisma.category.findFirst({
            orderBy: { order: "desc" },
            select: { order: true },
          });

          const maxOrder = maxOrderCategory?.order || 0;

          await prisma.category.update({
            where: { id: categoryInTargetPosition.id },
            data: { order: maxOrder + 1 },
          });
        }
      }
    }

    const categoria = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categoria,
      message: "Categoría actualizada exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al actualizar categoría:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar categoría" },
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
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No se puede desactivar. Hay ${productsCount} producto(s) asociado(s)`,
        },
        { status: 400 }
      );
    }

    const categoria = await prisma.category.update({
      where: { id },
      data: { active: false },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Categoría desactivada exitosamente",
      data: categoria,
    });
  } catch (error) {
    console.error("Error al desactivar categoría:", error);
    return NextResponse.json(
      { success: false, error: "Error al desactivar categoría" },
      { status: 500 }
    );
  }
}
