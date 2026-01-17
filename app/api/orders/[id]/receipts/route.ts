import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

const createReceiptSchema = z.object({
  imageUrl: z.string().url("URL inválida"),
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createReceiptSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        receipts: {
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado" },
        { status: 404 },
      );
    }

    if (order.paymentMethod === "efectivo") {
      return NextResponse.json(
        { success: false, error: "El pedido es pago en efectivo" },
        { status: 400 },
      );
    }

    if (order.paymentStatus === "VERIFIED") {
      return NextResponse.json(
        { success: false, error: "El pago ya fue verificado" },
        { status: 400 },
      );
    }

    if (order.receipts.length > 0) {
      return NextResponse.json(
        { success: false, error: "Ya existe un comprobante pendiente" },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.paymentReceipt.create({
        data: {
          orderId: id,
          imageUrl: validatedData.imageUrl,
        },
      });

      return tx.order.update({
        where: { id },
        data: {
          paymentStatus: "PENDING",
          status: "PENDING",
          receiptImage: validatedData.imageUrl,
          paymentVerificationNotes: null,
          verifiedAt: null,
          verifiedBy: null,
          cancelledAt: null,
        },
        include: {
          receipts: {
            orderBy: { createdAt: "desc" },
          },
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

    const serializedOrder = serializeOrder(updatedOrder);

    return NextResponse.json({
      success: true,
      data: {
        receipt: serializedOrder.latestReceipt,
        order: serializedOrder,
      },
      message: "Comprobante registrado",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message || "Datos inválidos" },
        { status: 400 },
      );
    }

    console.error("Error al registrar comprobante:", error);
    return NextResponse.json(
      { success: false, error: "Error al registrar comprobante" },
      { status: 500 },
    );
  }
}
