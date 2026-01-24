import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";
import { addMinutes } from "date-fns";

const addressDetailsSchema = z.object({
  street: z.string().min(5, "Calle muy corta"),
  district: z.string().optional(),
  city: z.string().optional(),
  reference: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(3, "Nombre muy corto"),
  customerPhone: z.string().min(9, "Teléfono inválido"),
  customerAddress: z.string().min(10, "Dirección muy corta"),
  customerEmail: z.email("Email inválido").optional(),
  addressDetails: addressDetailsSchema.optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      }),
    )
    .min(1, "Debes agregar al menos un producto"),
  subtotal: z.number().positive(),
  discount: z.number().min(0).default(0),
  deliveryFee: z.number().min(0).default(0),
  total: z.number().positive(),
  paymentMethod: z.enum(["yape", "plin", "culqi", "efectivo"]),
  promotionCode: z.string().optional(),
  notes: z.string().optional(),
  receiptImage: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
});

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    console.log("datos validados: ", validatedData);

    const productIds = validatedData.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "Algunos productos no están disponibles" },
        { status: 400 },
      );
    }

    for (const item of validatedData.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Producto ${item.productId} no encontrado` },
          { status: 400 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Stock insuficiente para ${product.name}. Solo quedan ${product.stock} unidades`,
          },
          { status: 400 },
        );
      }
    }

    const productPriceMap = new Map(
      products.map((product) => {
        const price =
          product.price instanceof Decimal
            ? product.price.toNumber()
            : Number(product.price);
        return [product.id, price];
      }),
    );

    const subtotal = validatedData.items.reduce((total, item) => {
      const price = productPriceMap.get(item.productId) ?? 0;
      return total + price * item.quantity;
    }, 0);

    let discount = 0;
    let promotionCode = validatedData.promotionCode;

    if (promotionCode) {
      const promocion = await prisma.promotion.findUnique({
        where: { code: promotionCode },
        include: { products: true },
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

      if (promocion.type !== "DISCOUNT") {
        return NextResponse.json(
          { success: false, error: "La promoción no aplica como código" },
          { status: 400 },
        );
      }

      const promoProductIds = new Set(
        promocion.products.map((item) => item.productId),
      );

      const applicableSubtotal = validatedData.items.reduce((total, item) => {
        if (!promoProductIds.has(item.productId)) return total;
        const price = productPriceMap.get(item.productId) ?? 0;
        return total + price * item.quantity;
      }, 0);

      if (applicableSubtotal <= 0) {
        return NextResponse.json(
          { success: false, error: "La promoción no aplica a tus productos" },
          { status: 400 },
        );
      }

      const promoDiscount =
        promocion.discount instanceof Decimal
          ? promocion.discount.toNumber()
          : Number(promocion.discount);

      discount = (applicableSubtotal * promoDiscount) / 100;
    }

    const deliveryFee = validatedData.deliveryFee ?? 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    let orderNumber = generateOrderNumber();
    let exists = await prisma.order.findUnique({
      where: { orderNumber },
    });

    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await prisma.order.findUnique({
        where: { orderNumber },
      });
    }

    const estimatedDeliveryTime = validatedData.estimatedDeliveryTime
      ? new Date(validatedData.estimatedDeliveryTime)
      : addMinutes(new Date(), 40);

    let initialStatus: "PENDING" | "CONFIRMED" = "PENDING";
    let confirmedAt: Date | undefined = undefined;

    if (validatedData.paymentMethod === "efectivo") {
      initialStatus = "PENDING";
    } else if (validatedData.receiptImage) {
      initialStatus = "PENDING";
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: validatedData.customerName,
          customerPhone: validatedData.customerPhone,
          customerEmail: validatedData.customerEmail,
          customerAddress: validatedData.customerAddress,
          addressDetails: validatedData.addressDetails || undefined,
          subtotal: new Decimal(subtotal),
          discount: new Decimal(discount),
          deliveryFee: new Decimal(deliveryFee),
          total: new Decimal(total),
          status: initialStatus,
          paymentMethod: validatedData.paymentMethod,
          promotionCode,
          notes: validatedData.notes,
          receiptImage: validatedData.receiptImage,
          estimatedDeliveryTime,
          confirmedAt,
        },
      });

      if (validatedData.receiptImage) {
        const paymentReceipt = await tx.paymentReceipt.create({
          data: {
            orderId: newOrder.id,
            imageUrl: validatedData.receiptImage,
            status: "PENDING",
          },
        });

        console.log("payments table: ", paymentReceipt);
      }

      await tx.orderItem.createMany({
        data: validatedData.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: new Decimal(item.price),
          subtotal: new Decimal(item.price * item.quantity),
        })),
      });

      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total:
          order.total instanceof Decimal
            ? order.total.toNumber()
            : Number(order.total),
        status: order.status,
        paymentMethod: order.paymentMethod,
        estimatedDeliveryTime: order.estimatedDeliveryTime?.toISOString(),
        createdAt: order.createdAt.toISOString(),
      },
      message: "Pedido creado exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.message },
        { status: 400 },
      );
    }

    console.error("Error al crear pedido:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear pedido" },
      { status: 500 },
    );
  }
}
