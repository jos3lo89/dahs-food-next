"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus, PaymentMethod } from "@/types/orders";
import { useUpdateOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Tag,
  Calendar,
  Loader2,
} from "lucide-react";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  culqi: "Culqi (Tarjeta)",
  yape: "Yape",
  plin: "Plin",
  efectivo: "Efectivo",
};

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [notes, setNotes] = useState("");
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  useState(() => {
    if (order) {
      setStatus(order.status);
      setNotes(order.notes || "");
    }
  });

  const handleSave = () => {
    if (!order) return;

    updateOrder(
      {
        id: order.id,
        data: {
          status,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} showIcon />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Información del Cliente
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {order.customerPhone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {order.customerAddress}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Productos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Productos ({order.items?.length || 0})
            </h3>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.product.category.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.quantity}x {formatPrice(item.price)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumen de Pago */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Resumen de Pago
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Descuento:
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-pink-600 dark:text-pink-400">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Adicional */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Información Adicional
            </h3>
            <div className="space-y-2 text-sm">
              {order.paymentMethod && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Método de pago:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {paymentMethodLabels[order.paymentMethod]}
                  </span>
                </div>
              )}
              {order.promotionCode && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Código de promoción:
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    {order.promotionCode}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Fecha del pedido:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado del Pedido */}
          <div className="space-y-3">
            <Label>Estado del Pedido</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="PREPARING">En Preparación</SelectItem>
                <SelectItem value="DELIVERED">Entregado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div className="space-y-3">
            <Label>Notas del Pedido</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre el pedido..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-pink-500 hover:bg-pink-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
