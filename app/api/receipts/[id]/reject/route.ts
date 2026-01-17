import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const rejectReceiptSchema = z.object({
  notes: z.string().min(1, "El motivo del rechazo es obligatorio"),
});

function serializeOrder(order: any) {
  const receipts = (order.receipts ?? []).map((receipt: any) => ({
    ...receipt,
    createdAt: receipt.createdAt?.toISOString?.() ?? receipt.createdAt,
    updatedAt: receipt.updatedAt?.toISOString?.() ?? receipt.updatedAt,
    verifiedAt: receipt.verifiedAt?.toISOString?.() ?? receipt.verifiedAt,
  }));
  const latestReceipt = receipts[0] ?? null;

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
    receipts,
    latestReceipt,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = rejectReceiptSchema.parse(body);

    const receipt = await prisma.paymentReceipt.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Comprobante no encontrado" },
        { status: 404 },
      );
    }

    if (receipt.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "El comprobante ya fue procesado" },
        { status: 400 },
      );
    }

    const now = new Date();

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.paymentReceipt.update({
        where: { id },
        data: {
          status: "REJECTED",
          notes: validatedData.notes,
          verifiedAt: now,
          verifiedBy: session.user.email || "admin",
        },
      });

      return tx.order.update({
        where: { id: receipt.orderId },
        data: {
          paymentStatus: "REJECTED",
          paymentVerificationNotes: validatedData.notes,
          verifiedAt: now,
          verifiedBy: session.user.email || "admin",
          status: "CANCELLED",
          cancelledAt: now,
        },
        include: {
          receipts: { orderBy: { createdAt: "desc" } },
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
    });

    return NextResponse.json({
      success: true,
      data: serializeOrder(updatedOrder),
      message: "Pago rechazado",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message || "Datos inválidos" },
        { status: 400 },
      );
    }

    console.error("Error al rechazar comprobante:", error);
    return NextResponse.json(
      { success: false, error: "Error al rechazar pago" },
      { status: 500 },
    );
  }
}
