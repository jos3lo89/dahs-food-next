import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format,
} from "date-fns";
import { es } from "date-fns/locale";
import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { locale: es });
    const weekEnd = endOfWeek(now, { locale: es });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // ========== VENTAS ==========
    const [todayOrders, weekOrders, monthOrders, lastMonthOrders] =
      await Promise.all([
        prisma.order.findMany({
          where: {
            createdAt: { gte: todayStart, lte: todayEnd },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        }),
        prisma.order.findMany({
          where: {
            createdAt: { gte: weekStart, lte: weekEnd },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        }),
        prisma.order.findMany({
          where: {
            createdAt: { gte: monthStart, lte: monthEnd },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        }),
        prisma.order.findMany({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        }),
      ]);

    const todayRevenue = todayOrders.reduce(
      (sum, o) =>
        sum +
        (o.total instanceof Decimal ? o.total.toNumber() : Number(o.total)),
      0
    );
    const weekRevenue = weekOrders.reduce(
      (sum, o) =>
        sum +
        (o.total instanceof Decimal ? o.total.toNumber() : Number(o.total)),
      0
    );
    const monthRevenue = monthOrders.reduce(
      (sum, o) =>
        sum +
        (o.total instanceof Decimal ? o.total.toNumber() : Number(o.total)),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, o) =>
        sum +
        (o.total instanceof Decimal ? o.total.toNumber() : Number(o.total)),
      0
    );

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const totalRevenue = await prisma.order
      .aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { total: true },
      })
      .then((r) =>
        r._sum.total instanceof Decimal
          ? r._sum.total.toNumber()
          : Number(r._sum.total || 0)
      );

    // ========== PEDIDOS ==========
    const [
      totalOrders,
      todayOrdersCount,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      lastMonthOrdersCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
    ]);

    const ordersGrowth =
      lastMonthOrdersCount > 0
        ? ((monthOrders.length - lastMonthOrdersCount) / lastMonthOrdersCount) *
          100
        : 0;

    // ========== PRODUCTOS ==========
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({
        where: { active: true, stock: { lt: 10, gt: 0 } },
      }),
      prisma.product.count({ where: { active: true, stock: 0 } }),
    ]);

    // ========== USUARIOS ==========
    const [totalUsers, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    // ========== PROMOCIONES ==========
    const [activePromotions, featuredPromotions] = await Promise.all([
      prisma.promotion.count({
        where: {
          active: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      prisma.promotion.count({
        where: {
          active: true,
          featured: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
    ]);

    // ========== TOP PRODUCTOS ==========
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, image: true },
        });

        return {
          id: item.productId,
          name: product?.name || "Desconocido",
          image: product?.image || "",
          totalSold: item._sum.quantity || 0,
          revenue:
            item._sum.subtotal instanceof Decimal
              ? item._sum.subtotal.toNumber()
              : Number(item._sum.subtotal || 0),
        };
      })
    );

    // ========== GRÁFICO DE VENTAS (ÚLTIMOS 7 DÍAS) ==========
    const salesChart = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = subDays(now, 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const orders = await prisma.order.findMany({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
            status: { not: "CANCELLED" },
          },
          select: { total: true },
        });

        const revenue = orders.reduce(
          (sum, o) =>
            sum +
            (o.total instanceof Decimal ? o.total.toNumber() : Number(o.total)),
          0
        );

        return {
          date: format(date, "EEE", { locale: es }),
          revenue,
          orders: orders.length,
        };
      })
    );

    // ========== PEDIDOS POR ESTADO ==========
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const ordersByStatusFormatted = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    // ========== VENTAS POR CATEGORÍA ==========
    const salesByCategory = await prisma.orderItem.findMany({
      where: {
        order: { status: { not: "CANCELLED" } },
      },
      include: {
        product: {
          select: {
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    const categorySales = salesByCategory.reduce((acc: any, item) => {
      const categoryName = item.product.category.name;
      const subtotal =
        item.subtotal instanceof Decimal
          ? item.subtotal.toNumber()
          : Number(item.subtotal);

      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += subtotal;
      return acc;
    }, {});

    const totalCategoryRevenue = Object.values(categorySales).reduce(
      (sum: number, val: any) => sum + val,
      0
    ) as number;

    const salesByCategoryFormatted = Object.entries(categorySales).map(
      ([category, revenue]: [string, any]) => ({
        category,
        revenue,
        percentage:
          totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0,
      })
    );

    // ========== MÉTODOS DE PAGO ==========
    const paymentMethodsData = await prisma.order.groupBy({
      by: ["paymentMethod"],
      where: { status: { not: "CANCELLED" } },
      _count: { paymentMethod: true },
      _sum: { total: true },
    });

    const paymentMethods = paymentMethodsData
      .filter((item) => item.paymentMethod)
      .map((item) => ({
        method: item.paymentMethod!,
        count: item._count.paymentMethod,
        revenue:
          item._sum.total instanceof Decimal
            ? item._sum.total.toNumber()
            : Number(item._sum.total || 0),
      }));

    // ========== PEDIDOS RECIENTES ==========
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    const recentOrdersFormatted = recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total:
        order.total instanceof Decimal
          ? order.total.toNumber()
          : Number(order.total),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        // Ventas
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        revenueGrowth,

        // Pedidos
        totalOrders,
        todayOrders: todayOrdersCount,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        ordersGrowth,

        // Productos
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,

        // Usuarios
        totalUsers,
        activeUsers,

        // Promociones
        activePromotions,
        featuredPromotions,

        // Gráficos y datos
        topProducts: topProductsWithDetails,
        salesChart,
        ordersByStatus: ordersByStatusFormatted,
        salesByCategory: salesByCategoryFormatted,
        paymentMethods,
        recentOrders: recentOrdersFormatted,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
