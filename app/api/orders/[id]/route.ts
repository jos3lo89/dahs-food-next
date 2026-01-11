// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const updateOrderSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"])
    .optional(),
  paymentMethod: z.enum(["culqi", "yape", "plin", "efectivo"]).optional(),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
  receiptImage: z.string().optional(), // ✅ NUEVO
  estimatedDeliveryTime: z.string().optional(), // ✅ NUEVO
});

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
    deliveryFee:
      order.deliveryFee instanceof Decimal
        ? order.deliveryFee.toNumber()
        : Number(order.deliveryFee),
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

// GET /api/orders/[id]
export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id },
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
    return NextResponse.json(
      { success: false, error: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id]
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
    const validatedData = updateOrderSchema.parse(body);

    // ✅ NUEVO: Actualizar timestamps automáticamente según el estado
    const updateData: any = { ...validatedData };

    if (validatedData.status) {
      const now = new Date();

      switch (validatedData.status) {
        case "CONFIRMED":
          if (!updateData.confirmedAt) {
            updateData.confirmedAt = now;
          }
          break;
        case "PREPARING":
          if (!updateData.preparingAt) {
            updateData.preparingAt = now;
          }
          break;
        case "DELIVERED":
          if (!updateData.deliveredAt) {
            updateData.deliveredAt = now;
          }
          break;
        case "CANCELLED":
          if (!updateData.cancelledAt) {
            updateData.cancelledAt = now;
          }
          break;
      }
    }

    // ✅ Convertir estimatedDeliveryTime a Date si existe
    if (updateData.estimatedDeliveryTime) {
      updateData.estimatedDeliveryTime = new Date(
        updateData.estimatedDeliveryTime
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: serializeOrder(order),
      message: "Pedido actualizado exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error al actualizar pedido:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}
