import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET /api/productos
// Query params: ?category=desayunos&active=true
// ============================================
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const categorySlug = searchParams.get("category");
  const activeParam = searchParams.get("active");

  if (!categorySlug) {
    return NextResponse.json(
      { message: "Categoría es requerida" },
      { status: 400 }
    );
  }
  const isActive = activeParam === null ? undefined : activeParam === "true";

  try {
    const products = await prisma.product.findMany({
      where: { category: { slug: categorySlug }, active: isActive },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
};
