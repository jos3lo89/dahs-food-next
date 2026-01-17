"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import {
  CheckCircle,
  Package,
  Phone,
  MapPin,
  Loader2,
  CreditCard,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { TrackOrderStatus } from "@/types/orders";
import { ReceiptResubmit } from "@/components/common/ReceiptResubmit";
import { toast } from "sonner";

export default function ConfirmacionPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const { clearCart, clearCheckoutData } = useCartStore();
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: () => ordersApi.trackOrder(orderNumber),
    enabled: !!orderNumber,
  });

  const order = data?.data;

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;
    clearCart();
    clearCheckoutData();
  }, [order, clearCart, clearCheckoutData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  const buildItemsSummary = () => {
    if (!order?.items?.length) {
      return "Sin productos";
    }

    return order.items
      .map((item: { product: { name: string }; quantity: number }) => {
        return `${item.quantity}x ${item.product.name}`;
      })
      .join(", ");
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: es });
  };

  const getStatusColor = (status: TrackOrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "PREPARING":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: TrackOrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Pendiente de Confirmación";
      case "CONFIRMED":
        return "Confirmado";
      case "PREPARING":
        return "En Preparación";
      case "OUT_FOR_DELIVERY":
        return "En Camino";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      yape: "Yape",
      plin: "Plin",
      culqi: "Tarjeta",
      efectivo: "Efectivo",
    };
    return labels[method] || method;
  };

  const addressDetails = order?.addressDetails
    ? typeof order.addressDetails === "string"
      ? JSON.parse(order.addressDetails)
      : order.addressDetails
    : null;

  const latestReceipt = order?.latestReceipt ?? null;
  const receiptStatus = latestReceipt?.status ?? order?.paymentStatus;
  const receiptNotes = latestReceipt?.notes ?? order?.paymentVerificationNotes;
  const receiptStatusLabel = receiptStatus
    ? receiptStatus === "VERIFIED"
      ? "Verificado"
      : receiptStatus === "REJECTED"
        ? "Rechazado"
        : "Pendiente"
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-rose-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-rose-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            No pudimos encontrar un pedido con el número:{" "}
            <strong>{orderNumber}</strong>
          </p>
          <Link href="/">
            <Button className="w-full bg-pink-500 hover:bg-pink-600">
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Pedido{" "}
            {order.status === TrackOrderStatus.CONFIRMED
              ? "Confirmado"
              : order.status === TrackOrderStatus.CANCELLED
                ? "Cancelado"
                : "Recibido"}
            !
          </h1>
          <p className="text-xl text-gray-600">
            Gracias por tu compra, <strong>{order.customerName}</strong>
          </p>
        </div>

        <div className="rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de pedido:</p>
              <p
                className="text-3xl font-bold text-pink-600 cursor-pointer bg-pink-50 p-1 rounded-lg"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(order.orderNumber);
                    toast.success("Copeado");
                  } catch (error) {
                    toast.warning("Error al copear");
                  }
                }}
              >
                {order.orderNumber}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full border-2 ${getStatusColor(
                order.status,
              )}`}
            >
              <span className="font-semibold">
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-pink-500" />
              Información de Contacto
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Nombre:</p>
                <p className="font-semibold text-gray-900">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Teléfono:</p>
                <p className="font-semibold text-gray-900">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customerPhone}
                  </a>
                </p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold text-gray-900">
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Dirección de Entrega
            </h3>
            <p className="text-gray-900 mb-2">{order.customerAddress}</p>

            {addressDetails && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
                {addressDetails.district && (
                  <p className="text-gray-600">
                    <strong>Distrito:</strong> {addressDetails.district}
                  </p>
                )}
                {addressDetails.city && (
                  <p className="text-gray-600">
                    <strong>Ciudad:</strong> {addressDetails.city}
                  </p>
                )}
                {addressDetails.reference && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-gray-600 text-xs mb-1">Referencia:</p>
                    <p className="text-gray-900 italic">
                      {addressDetails.reference}
                    </p>
                  </div>
                )}
              </div>
            )}

            {order.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-xs mb-1">Notas:</p>
                <p className="text-sm text-gray-900">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-500" />
            Productos
          </h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento:</span>
                <span className="font-medium">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-pink-600 pt-2 border-t border-gray-200">
              <span>Total (incluye envío):</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.paymentMethod && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  Método de pago: {getPaymentMethodLabel(order.paymentMethod)}
                </h3>

                {latestReceipt && receiptStatusLabel && (
                  <div className="mt-3">
                    <p className="text-sm text-blue-800 mb-2">
                      Último comprobante: {receiptStatusLabel}
                    </p>
                  </div>
                )}

                {receiptStatus === "REJECTED" ? (
                  <p className="text-sm text-red-700">
                    Pago rechazado.{" "}
                    {receiptNotes ||
                      "Revisa el comprobante y vuelve a subirlo."}
                  </p>
                ) : order.status === "PENDING" ? (
                  <p className="text-sm text-blue-800">
                    {order.paymentMethod === "efectivo"
                      ? "Pagará en efectivo al recibir su pedido."
                      : "Estamos verificando su comprobante de pago. Le confirmaremos por WhatsApp en breve."}
                  </p>
                ) : order.status === "CONFIRMED" ? (
                  <p className="text-sm text-green-800">
                    ✓ Pago confirmado. Tu pedido está siendo preparado.
                  </p>
                ) : null}

                {receiptStatus === "REJECTED" && (
                  <div className="mt-4">
                    <ReceiptResubmit orderId={order.id} onUploaded={refetch} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/tracking/${order.orderNumber}`}>
            <Button className="w-full bg-pink-500 hover:bg-pink-600 py-6 text-lg">
              Rastrear Pedido
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 py-6 text-lg"
            >
              Volver a la tienda
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ¿Necesitas ayuda? Contacta por WhatsApp:{" "}
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                `Hola, tengo una consulta sobre mi pedido #${order.orderNumber}. Resumen: ${buildItemsSummary()}. Total: ${formatPrice(order.total)}. Dirección: ${order.customerAddress}.`,
              )}`}
              className="text-pink-600 font-semibold hover:underline"
              target="_blank"
            >
              {whatsappPhone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
