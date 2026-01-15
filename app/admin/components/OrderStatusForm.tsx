"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types/orders";
import { useUpdateOrder } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface OrderStatusFormProps {
  order: Order;
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  PREPARING: "bg-purple-100 text-purple-800 border-purple-300",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800 border-orange-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "En Preparación",
  OUT_FOR_DELIVERY: "En Camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function OrderStatusForm({ order }: OrderStatusFormProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  const queryClient = useQueryClient();
  const params = useParams();
  const orderId = params.id as string;

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Selecciona un estado");
      return;
    }

    updateOrder(
      { id: order.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success("Estado actualizado");
          setNewStatus("");
          console.log("status change: ", {
            newStatus,
            orderId,
          });

          queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        },
      },
    );
  };

  const statusOptions: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Actualizar Estado
        </h3>
        <Badge className={statusColors[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nuevo Estado</Label>
          <Select
            value={newStatus}
            onValueChange={(value) => setNewStatus(value as OrderStatus)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleUpdateStatus}
          disabled={isPending || !newStatus}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {isPending ? "Actualizando..." : "Actualizar Estado"}
        </Button>
      </div>
    </div>
  );
}
