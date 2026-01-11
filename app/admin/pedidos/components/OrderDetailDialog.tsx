"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus } from "@/types/orders";
import { useUpdateOrder } from "@/hooks/useOrders";
import { toast } from "sonner";
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Tag,
  Calendar,
  Clock,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OrderDetailDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
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

const paymentMethodLabels: Record<string, string> = {
  yape: "Yape",
  plin: "Plin",
  culqi: "Tarjeta",
  efectivo: "Efectivo",
};

export function OrderDetailDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailDialogProps) {
  const { mutate: updateOrder, isPending } = useUpdateOrder();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [notes, setNotes] = useState("");

  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Selecciona un estado");
      return;
    }

    updateOrder(
      {
        id: order.id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success("Estado actualizado exitosamente");
          setNewStatus("");
          onClose();
        },
      }
    );
  };

  const handleUpdateNotes = () => {
    updateOrder(
      {
        id: order.id,
        data: { notes },
      },
      {
        onSuccess: () => {
          toast.success("Notas actualizadas exitosamente");
        },
      }
    );
  };

  const addressDetails = order.addressDetails
    ? typeof order.addressDetails === "string"
      ? JSON.parse(order.addressDetails)
      : order.addressDetails
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-pink-500" />
              <div>
                <p className="text-2xl font-bold">
                  Pedido #{order.orderNumber}
                </p>
                <p className="text-sm text-gray-500 font-normal">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
            <Badge
              className={`${
                statusColors[order.status]
              } border px-4 py-2 text-base`}
            >
              {statusLabels[order.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-500" />
                Información del Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Nombre:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Teléfono:
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.customerPhone}
                      </a>
                    </p>
                  </div>
                </div>

                {order.customerEmail && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Email:</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        <a
                          href={`mailto:${order.customerEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.customerEmail}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                Dirección de Entrega
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 dark:text-white font-medium">
                  {order.customerAddress}
                </p>

                {addressDetails && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                    {addressDetails.district && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Distrito:</strong> {addressDetails.district}
                      </p>
                    )}
                    {addressDetails.city && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Ciudad:</strong> {addressDetails.city}
                      </p>
                    )}
                    {addressDetails.reference && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Referencia:</strong> {addressDetails.reference}
                      </p>
                    )}
                  </div>
                )}

                {order.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                      Notas especiales:
                    </p>
                    <p className="text-gray-900 dark:text-white italic">
                      "{order.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-500" />
                Información de Pago
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Método de pago:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {order.paymentMethod
                      ? paymentMethodLabels[order.paymentMethod] ||
                        order.paymentMethod
                      : "No especificado"}
                  </span>
                </div>

                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      ID de transacción:
                    </span>
                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                      {order.paymentId}
                    </span>
                  </div>
                )}

                {order.receiptImage && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Comprobante de pago:
                    </p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <Image
                        src={order.receiptImage}
                        alt="Comprobante"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <a
                      href={order.receiptImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs mt-2 inline-block"
                    >
                      Ver en tamaño completo
                    </a>
                  </div>
                )}

                {order.promotionCode && (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-300 font-semibold">
                      Código: {order.promotionCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-500" />
                Timeline del Pedido
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400">Creado:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>

                {order.confirmedAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Confirmado:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(order.confirmedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {order.preparingAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        En preparación:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(order.preparingAt)}
                      </p>
                    </div>
                  </div>
                )}

                {order.deliveredAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Entregado:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(order.deliveredAt)}
                      </p>
                    </div>
                  </div>
                )}

                {order.cancelledAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Cancelado:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(order.cancelledAt)}
                      </p>
                    </div>
                  </div>
                )}

                {order.estimatedDeliveryTime && (
                  <div className="flex items-start gap-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 mt-2">
                    <Clock className="w-4 h-4 text-pink-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Entrega estimada:
                      </p>
                      <p className="font-bold text-pink-600 dark:text-pink-400">
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-500" />
                Productos ({order.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product.category.name}
                      </p>
                      <p className="text-sm text-pink-600 dark:text-pink-400">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600 dark:text-pink-400">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Resumen
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Descuento:</span>
                    <span className="font-medium">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}

                {order.deliveryFee !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Envío:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.deliveryFee === 0
                        ? "GRATIS"
                        : formatPrice(order.deliveryFee)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold text-pink-600 dark:text-pink-400">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Actualizar Estado
              </h3>
              <div className="space-y-3">
                <div>
                  <Label>Nuevo Estado</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                      <SelectItem value="PREPARING">En Preparación</SelectItem>
                      <SelectItem value="OUT_FOR_DELIVERY">
                        En Camino
                      </SelectItem>
                      <SelectItem value="DELIVERED">Entregado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
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

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" />
                Notas Administrativas
              </h3>
              <div className="space-y-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agregar notas internas..."
                  rows={3}
                />
                <Button
                  onClick={handleUpdateNotes}
                  disabled={isPending || !notes.trim()}
                  variant="outline"
                  className="w-full"
                >
                  Guardar Notas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
