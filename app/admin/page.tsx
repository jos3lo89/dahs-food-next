"use client";

import { useDashboardStats } from "@/hooks/useDashboard";
import { StatCard } from "./components/StatCard";
import { QuickAccessCard } from "./components/QuickAccessCard";
import { SalesChart } from "./components/SalesChart";
import { CategorySalesChart } from "./components/CategorySalesChart";
import { TopProductsTable } from "./components/TopProductsTable";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Tag,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  ChefHat,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboardStats();

  const stats = data?.data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar el dashboard</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vista general de tu negocio
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💰 Ventas e Ingresos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            iconColor="text-pink-600 dark:text-pink-400"
            iconBgColor="bg-pink-100 dark:bg-pink-900/20"
          />
          <StatCard
            title="Ventas Hoy"
            value={formatCurrency(stats.todayRevenue)}
            icon={TrendingUp}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
          />
          <StatCard
            title="Ventas Esta Semana"
            value={formatCurrency(stats.weekRevenue)}
            icon={DollarSign}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatCard
            title="Ventas Este Mes"
            value={formatCurrency(stats.monthRevenue)}
            icon={DollarSign}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            trend={stats.revenueGrowth}
            trendLabel="vs mes anterior"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📦 Pedidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Pedidos"
            value={stats.totalOrders}
            icon={ShoppingBag}
            iconColor="text-pink-600 dark:text-pink-400"
            iconBgColor="bg-pink-100 dark:bg-pink-900/20"
            trend={stats.ordersGrowth}
            trendLabel="vs mes anterior"
          />
          <StatCard
            title="Pedidos Hoy"
            value={stats.todayOrders}
            icon={Clock}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatCard
            title="Pendientes"
            value={stats.pendingOrders}
            icon={Clock}
            iconColor="text-yellow-600 dark:text-yellow-400"
            iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
          />
          <StatCard
            title="En Preparación"
            value={
              stats.ordersByStatus.find((o) => o.status === "PREPARING")
                ?.count || 0
            }
            icon={ChefHat}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          />
          <StatCard
            title="Completados"
            value={stats.completedOrders}
            icon={CheckCircle}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Inventario y General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Productos Activos"
            value={`${stats.activeProducts} / ${stats.totalProducts}`}
            icon={Package}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatCard
            title="Stock Bajo"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBgColor="bg-orange-100 dark:bg-orange-900/20"
          />
          <StatCard
            title="Usuarios Activos"
            value={`${stats.activeUsers} / ${stats.totalUsers}`}
            icon={Users}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
          />
          {/* <StatCard
            title="Promociones Activas"
            value={`${stats.activePromotions} (${stats.featuredPromotions} destacadas)`}
            icon={Tag}
            iconColor="text-pink-600 dark:text-pink-400"
            iconBgColor="bg-pink-100 dark:bg-pink-900/20"
          /> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={stats.salesChart} />
        <CategorySalesChart data={stats.salesByCategory} />
      </div>

      {stats.paymentMethods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💳 Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.paymentMethods.map((method) => (
                <div
                  key={method.method}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {method.method === "culqi" && "Culqi (Tarjeta)"}
                    {method.method === "yape" && "Yape"}
                    {method.method === "plin" && "Plin"}
                    {method.method === "efectivo" && "Efectivo"}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {method.count} pedidos
                  </p>
                  <p className="text-sm text-pink-600 dark:text-pink-400 font-semibold">
                    {formatCurrency(method.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.topProducts.length > 0 && (
        <TopProductsTable products={stats.topProducts} />
      )}

      {stats.recentOrders.length > 0 && (
        <RecentOrdersTable orders={stats.recentOrders} />
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🚀 Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAccessCard
            title="Gestión de Pedidos"
            description="Administra y da seguimiento a todos los pedidos"
            icon={ShoppingBag}
            iconColor="text-pink-600 dark:text-pink-400"
            iconBgColor="bg-pink-100 dark:bg-pink-900/20"
            href="/admin/pedidos"
            count={stats.pendingOrders}
            countLabel="pedidos pendientes"
          />
          <QuickAccessCard
            title="Gestión de Productos"
            description="Administra el catálogo de productos"
            icon={Package}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            href="/admin/productos"
            count={stats.activeProducts}
            countLabel="productos activos"
          />
          {/* <QuickAccessCard
            title="Promociones"
            description="Crea y gestiona ofertas y descuentos"
            icon={Tag}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            href="/admin/promociones"
            count={stats.activePromotions}
            countLabel="promociones activas"
          /> */}
          <QuickAccessCard
            title="Categorías"
            description="Organiza tus productos por categorías"
            icon={Package}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            href="/admin/categorias"
          />
          <QuickAccessCard
            title="Usuarios"
            description="Administra usuarios y permisos"
            icon={Users}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBgColor="bg-orange-100 dark:bg-orange-900/20"
            href="/admin/usuarios"
            count={stats.activeUsers}
            countLabel="usuarios activos"
          />
          <QuickAccessCard
            title="Inventario"
            description="Controla el stock de productos"
            icon={AlertTriangle}
            iconColor="text-red-600 dark:text-red-400"
            iconBgColor="bg-red-100 dark:bg-red-900/20"
            href="/admin/productos"
            count={stats.lowStockProducts}
            countLabel="productos con stock bajo"
          />
        </div>
      </div>

      {(stats.pendingOrders > 0 ||
        stats.lowStockProducts > 0 ||
        stats.outOfStockProducts > 0) && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">
                    Tienes {stats.pendingOrders} pedido(s) pendiente(s) de
                    confirmar
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/pedidos">Ver pedidos</a>
                </Button>
              </div>
            )}
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-900 dark:text-white">
                    {stats.lowStockProducts} producto(s) con stock bajo
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/productos">Ver productos</a>
                </Button>
              </div>
            )}
            {stats.outOfStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-900 dark:text-white">
                    {stats.outOfStockProducts} producto(s) sin stock
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/productos">Ver productos</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
