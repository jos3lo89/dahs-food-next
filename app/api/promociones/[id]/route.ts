import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { uploadApi } from "@/services/upload.service";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const updatePromocionSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  code: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(["DISCOUNT", "PACK", "DAY_SPECIAL", "WEEK_DEAL"]).optional(),
  image: z.url().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  productIds: z.array(z.string()).optional(),
  packs: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().int().min(1),
          })
        ),
        originalPrice: z.number().positive(),
        packPrice: z.number().positive(),
        image: z.url().optional(),
      })
    )
    .optional(),
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
    packs: promocion.packs?.map((pack: any) => ({
      ...pack,
      originalPrice:
        pack.originalPrice instanceof Decimal
          ? pack.originalPrice.toNumber()
          : Number(pack.originalPrice),
      packPrice:
        pack.packPrice instanceof Decimal
          ? pack.packPrice.toNumber()
          : Number(pack.packPrice),
    })),
  };
}

// GET /api/promociones/[id]
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
        packs: true,
        _count: {
          select: { products: true, packs: true },
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

// PATCH /api/promociones/[id]
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

    // Verificar que la promoción existe
    const existingPromocion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        products: true,
        packs: true,
      },
    });

    if (!existingPromocion) {
      return NextResponse.json(
        { success: false, error: "Promoción no encontrada" },
        { status: 404 }
      );
    }

    // Si se actualiza el código, verificar que sea único
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

    // Verificar fechas
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
      type: validatedData.type,
      image: validatedData.image,
      active: validatedData.active,
      featured: validatedData.featured,
    };

    // Si se actualizan productos (tipo DISCOUNT)
    if (validatedData.productIds) {
      // Eliminar productos antiguos
      await prisma.promotionProduct.deleteMany({
        where: { promotionId: id },
      });

      // Crear nuevos
      dataToUpdate.products = {
        create: validatedData.productIds.map((productId) => ({
          productId,
          discountPrice: null,
        })),
      };
    }

    // Si se actualizan packs (tipo PACK)
    if (validatedData.packs) {
      // Eliminar packs antiguos (y sus imágenes de Cloudinary)
      const oldPacks = existingPromocion.packs;
      for (const pack of oldPacks) {
        if (pack.image && pack.image.includes("cloudinary")) {
          try {
            await uploadApi.deleteImage(pack.image);
          } catch (error) {
            console.error("Error al eliminar imagen de pack:", error);
          }
        }
      }

      await prisma.promotionPack.deleteMany({
        where: { promotionId: id },
      });

      // Crear nuevos packs
      dataToUpdate.packs = {
        create: validatedData.packs.map((pack) => ({
          name: pack.name,
          description: pack.description,
          items: pack.items,
          originalPrice: new Decimal(pack.originalPrice),
          packPrice: new Decimal(pack.packPrice),
          image: pack.image,
        })),
      };
    }

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
        packs: true,
        _count: {
          select: { products: true, packs: true },
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

// DELETE /api/promociones/[id] - SOFT DELETE
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
          select: { products: true, packs: true },
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
