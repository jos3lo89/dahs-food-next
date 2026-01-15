import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const active = searchParams.get("active");

    const isActive =
      active === "true" ? true : active === "false" ? false : undefined;

    if (isActive === undefined) {
      console.log("active is undifined");

      return NextResponse.json(
        { success: false, error: "Parámetro 'active' inválido" },
        { status: 400 },
      );
    }

    const categorias = await prisma.category.findMany({
      where: {
        active: isActive,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener categorías" },
      { status: 500 },
    );
  }
}
