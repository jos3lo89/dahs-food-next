"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  ChefHat,
  Package,
  XCircle,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/orders";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

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
    <>
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
                {/* Pedido */}
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

                {/* Cliente */}
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

                {/* Productos */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {order.items?.length || 0} producto(s)
                    </span>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        -{formatPrice(order.discount)}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <OrderStatusBadge status={order.status} showIcon />
                    {order.status !== "DELIVERED" &&
                      order.status !== "CANCELLED" && (
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {order.status === "PENDING" && (
                              <SelectItem value="CONFIRMED">
                                Confirmar
                              </SelectItem>
                            )}
                            {(order.status === "PENDING" ||
                              order.status === "CONFIRMED") && (
                              <SelectItem value="PREPARING">
                                Preparar
                              </SelectItem>
                            )}
                            {order.status !== "PENDING" && (
                              <SelectItem value="DELIVERED">
                                Entregar
                              </SelectItem>
                            )}
                            <SelectItem value="CANCELLED">Cancelar</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                  </div>
                </TableCell>

                {/* Fecha */}
                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(order.createdAt), "dd MMM", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {format(new Date(order.createdAt), "HH:mm", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>

                      {order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (
                          <>
                            <DropdownMenuSeparator />
                            {order.status === "PENDING" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(order.id, "CONFIRMED")
                                }
                                className="text-blue-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirmar
                              </DropdownMenuItem>
                            )}
                            {(order.status === "PENDING" ||
                              order.status === "CONFIRMED") && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(order.id, "PREPARING")
                                }
                                className="text-purple-600"
                              >
                                <ChefHat className="w-4 h-4 mr-2" />
                                En Preparación
                              </DropdownMenuItem>
                            )}
                            {order.status !== "PENDING" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(order.id, "DELIVERED")
                                }
                                className="text-green-600"
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Entregar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "CANCELLED")
                              }
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Detalles */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </>
  );
}
