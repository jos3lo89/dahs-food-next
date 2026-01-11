"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/orders";
import { Clock, CheckCircle, ChefHat, Package, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    icon: any;
  }
> = {
  PENDING: {
    label: "Pendiente",
    variant: "secondary",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmado",
    variant: "default",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    icon: CheckCircle,
  },
  PREPARING: {
    label: "En Preparación",
    variant: "default",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    icon: ChefHat,
  },
  DELIVERED: {
    label: "Entregado",
    variant: "default",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    icon: Package,
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "destructive",
    className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    icon: XCircle,
  },
  OUT_FOR_DELIVERY: {
    label: "En Ruta",
    variant: "default",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
    icon: Package,
  },
};

export function OrderStatusBadge({
  status,
  showIcon = false,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
