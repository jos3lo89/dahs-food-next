"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { Package, Tag } from "lucide-react";

export function OrderSummary() {
  const { items, getSubtotal, getDiscount, getTotal, promotion } =
    useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-pink-500" />
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 pb-3 border-b border-gray-100 dark:border-gray-700"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.quantity} x {formatPrice(item.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-pink-600 dark:text-pink-400 text-sm">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && promotion && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Descuento ({promotion.code}):
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Envío:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            <span className="text-gray-400 text-sm">Incluido</span>
          </span>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Total a Pagar:
          </span>
          <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
