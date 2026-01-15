"use client";

import { Order } from "@/types/orders";
import { User, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCustomerInfoProps {
  order: Order;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-pink-500" />
        Información del Cliente
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Nombre:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.customerName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Teléfono:</p>
            <a
              href={`tel:${order.customerPhone}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {order.customerPhone}
            </a>
          </div>
        </div>

        {order.customerEmail && (
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email:</p>
              <a
                href={`mailto:${order.customerEmail}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {order.customerEmail}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
