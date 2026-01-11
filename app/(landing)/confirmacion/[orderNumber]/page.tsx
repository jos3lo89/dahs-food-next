// app/(landing)/confirmacion/[orderNumber]/page.tsx - ACTUALIZAR
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Package,
  Phone,
  MapPin,
  Clock,
  Loader2,
  Mail,
  CreditCard,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

export default function ConfirmacionPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: () => ordersApi.trackOrder(orderNumber),
    enabled: !!orderNumber,
  });

  const order = data?.data;

  // Confetti al cargar
  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [order]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: es });
  };

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  // ✅ Parsear addressDetails
  const addressDetails = order?.addressDetails
    ? typeof order.addressDetails === "string"
      ? JSON.parse(order.addressDetails)
      : order.addressDetails
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
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-xl text-gray-600">
            Gracias por tu compra, <strong>{order.customerName}</strong>
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de pedido:</p>
              <p className="text-3xl font-bold text-pink-600">
                #{order.orderNumber}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full border-2 ${getStatusColor(
                order.status
              )}`}
            >
              <span className="font-semibold">
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ Tiempo Estimado de Entrega */}
        {order.estimatedDeliveryTime && order.status !== "DELIVERED" && (
          <div className="bg-linear-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center mb-6">
            <Clock className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">
              Tiempo estimado de entrega
            </h3>
            <p className="text-4xl font-bold">
              {formatTime(order.estimatedDeliveryTime)}
            </p>
            <p className="text-sm opacity-90 mt-2">
              {formatDateTime(order.estimatedDeliveryTime)}
            </p>
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Información de Contacto */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
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
              {/* ✅ Email */}
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

          {/* Dirección de Entrega */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Dirección de Entrega
            </h3>
            <p className="text-gray-900 mb-2">{order.customerAddress}</p>

            {/* ✅ Detalles de dirección */}
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

        {/* Productos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-500" />
            Productos
          </h3>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-pink-50 rounded-lg"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
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

          {/* Totales */}
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
            {/* ✅ Costo de envío */}
            {order.deliveryFee !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Envío:
                </span>
                <span className="font-medium">
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">GRATIS</span>
                  ) : (
                    formatPrice(order.deliveryFee)
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-pink-600 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        {order.paymentMethod && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  Método de pago: {getPaymentMethodLabel(order.paymentMethod)}
                </h3>

                {/* ✅ Comprobante de pago */}
                {order.receiptImage && (
                  <div className="mt-3">
                    <p className="text-sm text-blue-800 mb-2">
                      Comprobante recibido ✓
                    </p>
                  </div>
                )}

                {order.status === "PENDING" && (
                  <p className="text-sm text-blue-800">
                    {order.paymentMethod === "efectivo"
                      ? "Pagarás en efectivo al recibir tu pedido."
                      : "Estamos verificando tu comprobante de pago. Te confirmaremos por WhatsApp en breve."}
                  </p>
                )}
                {order.status === "CONFIRMED" && (
                  <p className="text-sm text-green-800">
                    ✓ Pago confirmado. Tu pedido está siendo preparado.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/tracking/${order.orderNumber}`}>
            <Button className="w-full bg-pink-500 hover:bg-pink-600 py-6 text-lg">
              📦 Rastrear Pedido
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

        {/* Info adicional */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ¿Necesitas ayuda? Contacta por WhatsApp:{" "}
            <a
              href={`https://wa.me/51999999999?text=Hola, consulta sobre pedido ${order.orderNumber}`}
              className="text-pink-600 font-semibold hover:underline"
            >
              +51 999 999 999
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
