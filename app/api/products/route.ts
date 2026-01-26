import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";
import prisma from "@/lib/prisma";
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

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const categorySlug = searchParams.get("category");
  const activeParam = searchParams.get("active");

  if (!categorySlug) {
    return NextResponse.json(
      { message: "Categoría es requerida" },
      { status: 400 },
    );
  }
  const isActive = activeParam === null ? undefined : activeParam === "true";

  try {
    const now = new Date();
    const products = await prisma.product.findMany({
      where: { category: { slug: categorySlug }, active: isActive },
      include: {
        promotionProducts: {
          where: {
            promotion: {
              active: true,
              startDate: { lte: now },
              endDate: { gte: now },
            },
          },
          include: { promotion: true },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        ingredients: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const newProducts = products.map((p) => {
      const promo = p.promotionProducts.find((item) => item.productId === p.id);
      return {
        ...p,
        price: p.price.toNumber(),
        hasDiscount: !!promo,
        discountCode: promo?.promotion.code ?? null,
        promotionName: promo?.promotion.name ?? null,
        promotionProducts: null,
      };
    });

    return NextResponse.json(newProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
};
