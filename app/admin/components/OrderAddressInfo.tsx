"use client";

import { Order } from "@/types/orders";
import { MapPin } from "lucide-react";

interface OrderAddressInfoProps {
  order: Order;
}

export function OrderAddressInfo({ order }: OrderAddressInfoProps) {
  const addressDetails = order.addressDetails
    ? typeof order.addressDetails === "string"
      ? JSON.parse(order.addressDetails)
      : order.addressDetails
    : null;

  return (
    <div className="bg-pink-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-pink-500" />
        Dirección de Entrega
      </h3>
      <div className="space-y-3 text-sm">
        <p className="text-gray-900 dark:text-white font-medium">
          {order.customerAddress}
        </p>

        {addressDetails && (
          <div className="grid sm:grid-cols-2 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {addressDetails.district && (
              <p className="text-gray-900 dark:text-gray-400">
                <span className="font-medium">Distrito:</span>{" "}
                {addressDetails.district}
              </p>
            )}
            {addressDetails.city && (
              <p className="text-gray-900 dark:text-gray-400">
                <span className="font-medium">Ciudad:</span>{" "}
                {addressDetails.city}
              </p>
            )}
            {addressDetails.reference && (
              <p className="text-gray-900 dark:text-gray-400 sm:col-span-2">
                <span className="font-medium">Referencia:</span>{" "}
                {addressDetails.reference}
              </p>
            )}
          </div>
        )}

        {order.notes && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-900 dark:text-gray-400 mb-1">
              Notas especiales:
            </p>
            <p className="text-gray-900 dark:text-white italic">
              &ldquo;{order.notes}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
