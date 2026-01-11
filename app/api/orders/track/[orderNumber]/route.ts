// app/api/orders/track/[orderNumber]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

function serializeOrder(order: any) {
  return {
    ...order,
    subtotal:
      order.subtotal instanceof Decimal
        ? order.subtotal.toNumber()
        : Number(order.subtotal),
    discount:
      order.discount instanceof Decimal
        ? order.discount.toNumber()
        : Number(order.discount),
    total:
      order.total instanceof Decimal
        ? order.total.toNumber()
        : Number(order.total),
    items: order.items?.map((item: any) => ({
      ...item,
      price:
        item.price instanceof Decimal
          ? item.price.toNumber()
          : Number(item.price),
      subtotal:
        item.subtotal instanceof Decimal
          ? item.subtotal.toNumber()
          : Number(item.subtotal),
    })),
  };
}

// GET /api/orders/track/[orderNumber]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Número de pedido requerido" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeOrder(order),
    });
  } catch (error) {
    console.error("Error al rastrear pedido:", error);
    return NextResponse.json(
      { success: false, error: "Error al rastrear pedido" },
      { status: 500 }
    );
  }
}
