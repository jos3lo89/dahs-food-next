import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const createPromocionSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  discount: z.number().min(0).max(100, "El descuento debe estar entre 0 y 100"),
  code: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["DISCOUNT", "PACK", "DAY_SPECIAL", "WEEK_DEAL"]),
  image: z.url().optional(),
  featured: z.boolean().optional().default(false),
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");
    const featured = searchParams.get("featured");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const where: any = {};

    if (active !== null) {
      where.active = active === "true";
    }

    if (featured !== null) {
      where.featured = featured === "true";
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    const promociones = await prisma.promotion.findMany({
      where,
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: {
                  select: { name: true },
                },
              },
            },
          },
        },
        packs: true,
        _count: {
          select: {
            products: true,
            packs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: promociones.map(serializePromocion),
    });
  } catch (error) {
    console.error("Error al obtener promociones:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener promociones" },
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
    const validatedData = createPromocionSchema.parse(body);

    if (new Date(validatedData.startDate) >= new Date(validatedData.endDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "La fecha de inicio debe ser anterior a la fecha de fin",
        },
        { status: 400 }
      );
    }

    if (validatedData.code) {
      const existingCode = await prisma.promotion.findUnique({
        where: { code: validatedData.code },
      });

      if (existingCode) {
        return NextResponse.json(
          { success: false, error: "El código de promoción ya está en uso" },
          { status: 400 }
        );
      }
    }

    const promocion = await prisma.promotion.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        discount: new Decimal(validatedData.discount),
        code: validatedData.code,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        type: validatedData.type,
        image: validatedData.image,
        featured: validatedData.featured,
        ...(validatedData.type === "DISCOUNT" &&
          validatedData.productIds && {
            products: {
              create: validatedData.productIds.map((productId) => ({
                productId,
                discountPrice: null,
              })),
            },
          }),
        ...(validatedData.type === "PACK" &&
          validatedData.packs && {
            packs: {
              create: validatedData.packs.map((pack) => ({
                name: pack.name,
                description: pack.description,
                items: pack.items,
                originalPrice: new Decimal(pack.originalPrice),
                packPrice: new Decimal(pack.packPrice),
                image: pack.image,
              })),
            },
          }),
      },
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

    return NextResponse.json(
      {
        success: true,
        data: serializePromocion(promocion),
        message: "Promoción creada exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al crear promoción:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear promoción" },
      { status: 500 }
    );
  }
}
