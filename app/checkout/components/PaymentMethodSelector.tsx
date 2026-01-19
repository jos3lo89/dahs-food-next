"use client";

import { PaymentMethod } from "@/types/checkout";
import { Banknote, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: "yape" as PaymentMethod,
    name: "Yape",
    icon: Smartphone,
    color: "border-purple-300",
    activeColor: "border-purple-600 bg-purple-50 text-purple-800",
    description: "Pago con QR",
    disabled: false,
  },
  {
    id: "efectivo" as PaymentMethod,
    name: "Efectivo",
    icon: Banknote,
    color: "border-orange-300",
    activeColor: "border-orange-500 bg-orange-50 text-orange-800",
    description: "Pago al recibir",
    disabled: false,
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
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
                ? "cursor-not-allowed"
                : isSelected
                  ? method.activeColor
                  : method.color
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
  );
}
