"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { TrackingTimeline } from "../components/TrackingTimeline";
import {
  ArrowLeft,
  Package,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ReceiptResubmit } from "@/components/common/ReceiptResubmit";
import { formatSMoney } from "@/utils/formatMoney";

export default function TrackingPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: () => ordersApi.trackOrder(orderNumber),
    enabled: !!orderNumber,
    refetchInterval: 30000,
  });

  const order = data?.data;

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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      yape: "Yape",
      plin: "Plin",
      culqi: "Tarjeta",
      efectivo: "Efectivo",
    };
    return labels[method] || method;
  };

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
          <p className="text-gray-600">Buscando tu pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-rose-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            No pudimos encontrar un pedido con el número:{" "}
            <strong className="text-pink-600">{orderNumber}</strong>
          </p>
          <div className="space-y-3">
            <Link href="/tracking">
              <Button variant="outline" className="w-full">
                Buscar otro pedido
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Volver a la tienda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Rastrear Pedido
              </h1>
              <p className="text-gray-600 mt-1">
                Pedido{" "}
                <span className="text-pink-600 font-bold">
                  #{order.orderNumber}
                </span>
              </p>
            </div>
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
        </div>

        <div className="mb-6">
          <TrackingTimeline
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-pink-500" />
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nombre:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Teléfono:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.customerPhone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Dirección de Entrega
            </h3>
            <p className="text-gray-900 dark:text-white">
              {order.customerAddress}
            </p>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Notas adicionales:
                </p>
                <p className="text-sm text-gray-900 dark:text-white italic">
                  "{order.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-500" />
            Productos ({order.items?.length || 0})
          </h3>

          <div className="space-y-3 mb-6">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
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
                    {item.quantity} x {formatSMoney(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600 dark:text-pink-400">
                    {formatSMoney(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatSMoney(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Descuento:</span>
                  <span className="font-medium">
                    -{formatSMoney(order.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-pink-600 dark:text-pink-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total:</span>
                <span>{formatSMoney(order.total)}</span>
              </div>
            </div>

            {order.paymentMethod && (
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Método de pago:
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                    {receiptStatusLabel && (
                      <p className="text-xs text-gray-500">
                        Estado del pago: {receiptStatusLabel}
                      </p>
                    )}
                  </div>

                  {receiptStatus === "REJECTED" ? (
                    <p className="text-sm text-red-600">
                      Pago rechazado.{" "}
                      {receiptNotes || "Vuelve a subir tu comprobante."}
                    </p>
                  ) : receiptStatus === "PENDING" ? (
                    <p className="text-sm text-gray-600">
                      Pago pendiente de verificación.
                    </p>
                  ) : receiptStatus === "VERIFIED" ? (
                    <p className="text-sm text-green-600">Pago verificado.</p>
                  ) : null}

                  {receiptStatus === "REJECTED" && (
                    <ReceiptResubmit orderId={order.id} onUploaded={refetch} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-linear-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda?</h3>
          <p className="mb-4 opacity-90">
            Si tienes alguna duda sobre tu pedido, contáctanos
          </p>

          <a
            href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
              `Hola, tengo una consulta sobre mi pedido #${order.orderNumber}. Resumen: ${buildItemsSummary()}. Total: ${formatSMoney(order.total)}. Dirección: ${order.customerAddress}.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-white text-pink-600 hover:bg-gray-100">
              <Phone className="w-4 h-4 mr-2" />
              Contactar por WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
