"use client";

import { Order, OrderStatus } from "@/types/orders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  Home,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  order: Order;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: typeof Clock; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pedido creado",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  CONFIRMED: {
    label: "Pedido confirmado",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  PREPARING: {
    label: "En preparación",
    icon: ChefHat,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  OUT_FOR_DELIVERY: {
    label: "En camino",
    icon: Truck,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  DELIVERED: {
    label: "Entregado",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

const statusOrder: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const getStatusIndex = (status: OrderStatus): number => {
  return statusOrder.indexOf(status);
};

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return "";
  return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
};

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-6 relative">
        {statusOrder.map((status, index) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = status === order.status;

          return (
            <div key={status} className="flex items-start gap-4 relative">
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? cn(config.bgColor, config.color, "border-current")
                    : "bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:border-gray-700",
                  isCurrent && "ring-2 ring-offset-2 ring-pink-500 scale-110",
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium",
                      isCompleted ? config.color : "text-gray-500",
                    )}
                  >
                    {config.label}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-full">
                      Actual
                    </span>
                  )}
                </div>

                {isCompleted && (
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isCompleted
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-400",
                    )}
                  >
                    {status === "PENDING" && formatDateTime(order.createdAt)}
                    {status === "CONFIRMED" &&
                      formatDateTime(order.confirmedAt)}
                    {status === "PREPARING" &&
                      formatDateTime(order.preparingAt)}
                    {status === "OUT_FOR_DELIVERY" &&
                      formatDateTime(order.outForDeliveryAt)}
                    {status === "DELIVERED" &&
                      formatDateTime(order.deliveredAt)}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {isCancelled && (
          <div className="flex items-start gap-4 relative">
            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-red-100 text-red-600 border-red-600",
              )}
            >
              <XCircle className="w-4 h-4" />
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">
                  Pedido cancelado
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatDateTime(order.cancelledAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {order.estimatedDeliveryTime && !isCancelled && (
        <div className="mt-6 ml-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Entrega estimada:</span>
          </div>
          <p className="text-pink-600 dark:text-pink-400 mt-1 font-semibold">
            {formatDateTime(order.estimatedDeliveryTime)}
          </p>
        </div>
      )}
    </div>
  );
}
