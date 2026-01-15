"use client";

import { Order } from "@/types/orders";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Resumen del Pedido
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatPrice(order.subtotal)}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Descuento:</span>
            <span className="font-medium">-{formatPrice(order.discount)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span className="text-gray-900 dark:text-white">Total (incluye envío):</span>
          <span className="text-pink-600 dark:text-pink-400">
            {formatPrice(order.total)}
          </span>
        </div>

        {order.promotionCode && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <span className="text-green-700 dark:text-green-300 text-sm font-medium">
              Código aplicado: {order.promotionCode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
