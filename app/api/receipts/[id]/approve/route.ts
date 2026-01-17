import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

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
  _: NextRequest,
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

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.paymentReceipt.update({
        where: { id },
        data: {
          status: "VERIFIED",
          verifiedAt: new Date(),
          verifiedBy: session.user.email || "admin",
          notes: null,
        },
      });

      return tx.order.update({
        where: { id: receipt.orderId },
        data: {
          paymentStatus: "VERIFIED",
          paymentVerificationNotes: null,
          verifiedAt: new Date(),
          verifiedBy: session.user.email || "admin",
          status: receipt.order.status === "PENDING" ? "CONFIRMED" : receipt.order.status,
          confirmedAt:
            receipt.order.status === "PENDING"
              ? new Date()
              : receipt.order.confirmedAt,
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
      message: "Pago aprobado exitosamente",
    });
  } catch (error) {
    console.error("Error al aprobar comprobante:", error);
    return NextResponse.json(
      { success: false, error: "Error al aprobar pago" },
      { status: 500 },
    );
  }
}
