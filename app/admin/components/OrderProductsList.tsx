"use client";

import { Order } from "@/types/orders";
import { Package } from "lucide-react";
import Image from "next/image";

interface OrderProductsListProps {
  order: Order;
}

export function OrderProductsList({ order }: OrderProductsListProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-pink-500" />
        Productos ({order.items?.length || 0})
      </h3>

      <div className="space-y-4">
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {item.product.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.product.category.name}
              </p>
              <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-pink-600 dark:text-pink-400">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
