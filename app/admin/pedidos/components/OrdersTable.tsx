"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Package } from "lucide-react";
import { Order, PaymentVerificationStatus } from "@/types/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatSMoney } from "@/utils/formatMoney";

interface OrdersTableProps {
  orders: Order[];
}

const paymentStatusColors: Record<PaymentVerificationStatus, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-300",
  VERIFIED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

const paymentStatusLabels: Record<PaymentVerificationStatus, string> = {
  PENDING: "Pago pendiente",
  VERIFIED: "Pago verificado",
  REJECTED: "Pago rechazado",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No hay pedidos registrados
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{order.orderNumber}
                  </p>
                  {order.promotionCode && (
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-mono">
                      {order.promotionCode}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customerPhone}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {order.items?.length || 0} producto(s)
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatSMoney(order.total)}
                  </p>
                  {order.discount > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      -{formatSMoney(order.total)}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-2">
                  <OrderStatusBadge status={order.status} showIcon />
                  {order.paymentMethod && order.paymentMethod !== "efectivo" && (
                    <Badge
                      className={
                        paymentStatusColors[
                          (order.latestReceipt?.status ||
                            order.paymentStatus ||
                            "PENDING") as PaymentVerificationStatus
                        ]
                      }
                    >
                      {paymentStatusLabels[
                        (order.latestReceipt?.status ||
                          order.paymentStatus ||
                          "PENDING") as PaymentVerificationStatus
                      ]}
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-white">
                    {formatDateTime(order.createdAt, "date")}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {formatDateTime(order.createdAt, "time")}
                  </p>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
