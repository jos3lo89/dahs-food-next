import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const updatePromocionSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  code: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.literal("DISCOUNT").optional(),
  image: z.url().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  productIds: z.array(z.string()).optional(),
});

function serializePromocion(promocion: any) {
  return {
    ...promocion,
    discount:
      promocion.discount instanceof Decimal
        ? promocion.discount.toNumber()
        : Number(promocion.discount),
    products: promocion.products?.map((pp: any) => ({
      ...pp,
      discountPrice:
        pp.discountPrice instanceof Decimal
          ? pp.discountPrice.toNumber()
          : pp.discountPrice
          ? Number(pp.discountPrice)
          : null,
      product: {
        ...pp.product,
        price:
          pp.product.price instanceof Decimal
            ? pp.product.price.toNumber()
            : Number(pp.product.price),
      },
    })),
    packs: [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promocion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: { select: { name: true } },
              },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!promocion) {
      return NextResponse.json(
        { success: false, error: "Promoción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializePromocion(promocion),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al obtener promoción" },
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
    const validatedData = updatePromocionSchema.parse(body);

    const existingPromocion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!existingPromocion) {
      return NextResponse.json(
        { success: false, error: "Promoción no encontrada" },
        { status: 404 }
      );
    }

    if (validatedData.code && validatedData.code !== existingPromocion.code) {
      const existingCode = await prisma.promotion.findFirst({
        where: {
          code: validatedData.code,
          NOT: { id },
        },
      });

      if (existingCode) {
        return NextResponse.json(
          { success: false, error: "El código de promoción ya está en uso" },
          { status: 400 }
        );
      }
    }

    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : existingPromocion.startDate;
    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : existingPromocion.endDate;

    if (startDate >= endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "La fecha de inicio debe ser anterior a la fecha de fin",
        },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {
      name: validatedData.name,
      description: validatedData.description,
      discount: validatedData.discount
        ? new Decimal(validatedData.discount)
        : undefined,
      code: validatedData.code,
      startDate: validatedData.startDate
        ? new Date(validatedData.startDate)
        : undefined,
      endDate: validatedData.endDate
        ? new Date(validatedData.endDate)
        : undefined,
      type: "DISCOUNT",
      image: validatedData.image,
      active: validatedData.active,
      featured: validatedData.featured,
    };

    if (validatedData.productIds) {
      await prisma.promotionProduct.deleteMany({
        where: { promotionId: id },
      });

      dataToUpdate.products = {
        create: validatedData.productIds.map((productId) => ({
          productId,
          discountPrice: null,
        })),
      };
    }

    await prisma.promotionPack.deleteMany({
      where: { promotionId: id },
    });

    const promocion = await prisma.promotion.update({
      where: { id },
      data: dataToUpdate,
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: { select: { name: true } },
              },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: serializePromocion(promocion),
      message: "Promoción actualizada exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al actualizar promoción:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar promoción" },
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

    const promocion = await prisma.promotion.update({
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
      message: "Promoción desactivada exitosamente",
      data: serializePromocion(promocion),
    });
  } catch (error) {
    console.error("Error al desactivar promoción:", error);
    return NextResponse.json(
      { success: false, error: "Error al desactivar promoción" },
      { status: 500 }
    );
  }
}
