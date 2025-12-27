import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const createProductSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  image: z.url("La imagen debe ser una URL válida"),
  images: z.array(z.url()).optional(),
  categoryId: z.string().min(1, "La categoría es requerida"),
  featured: z.boolean().optional().default(false),
  stock: z.number().int().min(0).optional().default(999),
});

// Serializar Producto (convertir Decimal a number)
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

// GET /api/productos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");
    const active = searchParams.get("active");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: any = {};

    if (active !== null) {
      where.active = active === "true";
    }

    if (featured !== null) {
      where.featured = featured === "true";
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const productos = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const serializedProductos = productos.map(serializeProduct);

    return NextResponse.json({
      success: true,
      data: serializedProductos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST /api/productos
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
    const validatedData = createProductSchema.parse(body);

    // Verificar si el slug ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "El slug ya está en uso" },
        { status: 400 }
      );
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const producto = await prisma.product.create({
      data: {
        ...validatedData,
        price: new Decimal(validatedData.price),
        images: validatedData.images || [],
      },
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

    return NextResponse.json(
      {
        success: true,
        data: serializeProduct(producto),
        message: "Producto creado exitosamente",
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

    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
