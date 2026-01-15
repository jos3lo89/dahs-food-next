"use client";

import { PaymentMethod } from "@/types/checkout";
import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: "yape" as PaymentMethod,
    name: "Yape",
    icon: Smartphone,
    color: "bg-purple-100 border-purple-300 text-purple-700",
    activeColor: "bg-purple-500 border-purple-600 text-white",
    description: "Pago con QR",
  },
  {
    id: "plin" as PaymentMethod,
    name: "Plin",
    icon: Wallet,
    color: "bg-blue-100 border-blue-300 text-blue-700",
    activeColor: "bg-blue-500 border-blue-600 text-white",
    description: "Transferencia rápida",
  },
  {
    id: "culqi" as PaymentMethod,
    name: "Tarjeta",
    icon: CreditCard,
    color: "bg-green-100 border-green-300 text-green-700",
    activeColor: "bg-green-500 border-green-600 text-white",
    description: "Débito/Crédito",
    disabled: true,
  },
  {
    id: "efectivo" as PaymentMethod,
    name: "Efectivo",
    icon: Banknote,
    color: "bg-orange-100 border-orange-300 text-orange-700",
    activeColor: "bg-orange-500 border-orange-600 text-white",
    description: "Pago al recibir",
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Método de Pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;
          const isDisabled = method.disabled;

          return (
            <button
              key={method.id}
              onClick={() => !isDisabled && onSelect(method.id)}
              disabled={isDisabled}
              className={`relative p-4 border-2 rounded-xl transition-all ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : isSelected
                    ? method.activeColor + " ring-4 ring-opacity-30"
                    : method.color + " hover:shadow-md"
              }`}
            >
              {isDisabled && (
                <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  Próximamente
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-opacity-20" : "bg-opacity-50"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-base">{method.name}</p>
                  <p
                    className={`text-sm ${
                      isSelected ? "opacity-90" : "opacity-70"
                    }`}
                  >
                    {method.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
