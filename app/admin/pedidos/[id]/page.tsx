"use client";

import { useOrder } from "@/hooks/useOrders";
import { OrderTimeline } from "../components/OrderTimeline";
import { OrderCustomerInfo } from "@/app/admin/components/OrderCustomerInfo";
import { OrderAddressInfo } from "@/app/admin/components/OrderAddressInfo";
import { OrderPaymentInfo } from "@/app/admin/components/OrderPaymentInfo";
import { OrderProductsList } from "@/app/admin/components/OrderProductsList";
import { OrderSummary } from "@/app/admin/components/OrderSummary";
import { OrderStatusForm } from "@/app/admin/components/OrderStatusForm";
import { OrderAdminNotes } from "@/app/admin/components/OrderAdminNotes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Loader2, MessageCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrderStatus, PaymentVerificationStatus } from "@/types/orders";

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

const paymentStatusColors: Record<PaymentVerificationStatus, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-300",
  VERIFIED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

const paymentStatusLabels: Record<PaymentVerificationStatus, string> = {
  PENDING: "Pendiente",
  VERIFIED: "Verificado",
  REJECTED: "Rechazado",
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useOrder(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pedido no encontrado</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a pedidos
        </Button>
      </div>
    );
  }

  const order = data.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  const buildItemsSummary = () => {
    if (!order.items?.length) {
      return "Sin productos";
    }

    return order.items
      .map((item) => `${item.quantity}x ${item.product.name}`)
      .join(", ");
  };

  const handleWhatsApp = () => {
    const message = `Hola, le escribimos de Dahs Food por su pedido #${order.orderNumber}. Resumen: ${buildItemsSummary()}. Total: ${formatPrice(order.total)}. Dirección: ${order.customerAddress}. Su pago fue confirmado y su pedido está en preparación. Le avisaremos cuando esté en camino.`;
    const whatsappDigits = order.customerPhone.replace(/\D/g, "");
    const link = `https://wa.me/51${whatsappDigits}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pedido #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Creado el {new Date(order.createdAt).toLocaleString("es-PE")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={cn("text-base px-3 py-1", statusColors[order.status])}
          >
            {statusLabels[order.status]}
          </Badge>
          {order.paymentStatus && (
            <Badge
              className={cn(
                "text-base px-3 py-1",
                paymentStatusColors[order.paymentStatus],
              )}
            >
              {paymentStatusLabels[order.paymentStatus]}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-pink-500" />
          Estado del Pedido
        </h3>
        <OrderTimeline order={order} />
      </div>

      {/* Grid principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">
          <OrderCustomerInfo order={order} />
          <OrderAddressInfo order={order} />
          <OrderPaymentInfo order={order} />
          <OrderProductsList order={order} />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <OrderSummary order={order} />
          <OrderStatusForm order={order} />
          <OrderAdminNotes order={order} />
        </div>
      </div>
    </div>
  );
}
