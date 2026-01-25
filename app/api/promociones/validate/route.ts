import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

function serializePromocion(promocion: any) {
  return {
    id: promocion.id,
    name: promocion.name,
    code: promocion.code,
    type: promocion.type,
    discount:
      promocion.discount instanceof Decimal
        ? promocion.discount.toNumber()
        : Number(promocion.discount),
    productIds: promocion.products?.map((pp: any) => pp.productId) || [],
    packs: [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Debes ingresar un código" },
        { status: 400 },
      );
    }

    const promocion = await prisma.promotion.findUnique({
      where: { code },
      include: {
        products: { select: { productId: true } },
      },
    });

    if (!promocion) {
      return NextResponse.json(
        { success: false, error: "Código de promoción inválido" },
        { status: 400 },
      );
    }

    const now = new Date();
    if (!promocion.active || promocion.startDate > now || promocion.endDate < now) {
      return NextResponse.json(
        { success: false, error: "La promoción no está vigente" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: serializePromocion(promocion),
    });
  } catch (error) {
    console.error("Error al validar promoción:", error);
    return NextResponse.json(
      { success: false, error: "Error al validar promoción" },
      { status: 500 },
    );
  }
}
