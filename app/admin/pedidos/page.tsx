"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrdersTable } from "./components/OrdersTable";
import { OrderStatus, PaymentMethod } from "@/types/orders";
import { format, startOfDay, endOfDay } from "date-fns";

export default function PedidosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentMethod>(
    "all"
  );
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  const { data, isLoading, error } = useOrders({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    paymentMethod: paymentFilter !== "all" ? paymentFilter : undefined,
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined,
    includeStats: true,
  });

  const orders = data?.data || [];
  const stats = data?.stats;

  const handleTodayFilter = () => {
    const today = new Date();
    setDateRange({
      start: format(startOfDay(today), "yyyy-MM-dd'T'HH:mm"),
      end: format(endOfDay(today), "yyyy-MM-dd'T'HH:mm"),
    });
  };

  const handleClearDateFilter = () => {
    setDateRange({ start: "", end: "" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra y da seguimiento a todos los pedidos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por # pedido, cliente, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v: any) => setStatusFilter(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmado</SelectItem>
            <SelectItem value="PREPARING">En Preparación</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter}
          onValueChange={(v: any) => setPaymentFilter(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los métodos</SelectItem>
            <SelectItem value="culqi">Culqi (Tarjeta)</SelectItem>
            <SelectItem value="yape">Yape</SelectItem>
            <SelectItem value="plin">Plin</SelectItem>
            <SelectItem value="efectivo">Efectivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="datetime-local"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="flex-1"
          />
          <span className="text-gray-500">a</span>
          <Input
            type="datetime-local"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="flex-1"
          />
        </div>
        <Button variant="outline" onClick={handleTodayFilter}>
          <Calendar className="w-4 h-4 mr-2" />
          Hoy
        </Button>
        {(dateRange.start || dateRange.end) && (
          <Button variant="ghost" onClick={handleClearDateFilter}>
            Limpiar
          </Button>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Pendientes
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.confirmed}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Confirmados
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.preparing}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              En Preparación
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.delivered}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Entregados
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.cancelled}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cancelados
            </p>
          </div>

          <div className="bg-linear-to-br from-pink-500 to-purple-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatPrice(stats.todayRevenue)}
            </p>
            <p className="text-xs text-white/80">Ventas Hoy</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar pedidos</p>
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
