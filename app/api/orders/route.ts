import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfDay, endOfDay } from "date-fns";
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

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const includeStats = searchParams.get("includeStats") === "true";

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
        { promotionCode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    let stats = undefined;

    if (includeStats) {
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const [
        totalCount,
        pendingCount,
        confirmedCount,
        preparingCount,
        deliveredCount,
        cancelledCount,
        todayOrdersData,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "CONFIRMED" } }),
        prisma.order.count({ where: { status: "PREPARING" } }),
        prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma.order.count({ where: { status: "CANCELLED" } }),
        prisma.order.findMany({
          where: {
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        }),
      ]);

      const todayRevenue = todayOrdersData.reduce((sum, order) => {
        return (
          sum +
          (order.total instanceof Decimal
            ? order.total.toNumber()
            : Number(order.total))
        );
      }, 0);

      stats = {
        total: totalCount,
        pending: pendingCount,
        confirmed: confirmedCount,
        preparing: preparingCount,
        delivered: deliveredCount,
        cancelled: cancelledCount,
        todayOrders: todayOrdersData.length,
        todayRevenue,
      };
    }

    return NextResponse.json({
      success: true,
      data: orders.map(serializeOrder),
      stats,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}
