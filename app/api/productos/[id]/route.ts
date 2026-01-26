import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.url().optional(),
  images: z.array(z.url()).optional(),
  categoryId: z.string().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
});

function serializeProduct(product: any) {
  return {
    ...product,
    price:
      product.price instanceof Decimal
        ? product.price.toNumber()
        : Number(product.price),
    images: Array.isArray(product.images)
      ? product.images
      : JSON.parse(product.images || "[]"),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const producto = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        ingredients: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeProduct(producto),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener producto" },
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
    const validatedData = updateProductSchema.parse(body);

    if (validatedData.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "El slug ya está en uso" },
          { status: 400 }
        );
      }
    }

    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, error: "Categoría no encontrada" },
          { status: 404 }
        );
      }
    }

    const dataToUpdate: any = { ...validatedData };
    if (validatedData.price) {
      dataToUpdate.price = new Decimal(validatedData.price);
    }

    const producto = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        ingredients: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeProduct(producto),
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar producto" },
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

    const producto = await prisma.product.update({
      where: { id },
      data: { active: false },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        ingredients: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Producto desactivado exitosamente",
      data: serializeProduct(producto),
    });
  } catch (error) {
    console.error("Error al desactivar producto:", error);
    return NextResponse.json(
      { success: false, error: "Error al desactivar producto" },
      { status: 500 }
    );
  }
}
