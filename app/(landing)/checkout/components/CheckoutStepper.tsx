// app/(landing)/checkout/components/CheckoutStepper.tsx
"use client";

import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Carrito" },
  { number: 2, title: "Datos" },
  { number: 3, title: "Pago" },
  { number: 4, title: "Confirmación" },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep > step.number
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                    ? "bg-pink-500 text-white ring-4 ring-pink-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs md:text-sm font-medium mt-2 ${
                  currentStep >= step.number ? "text-pink-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 md:mx-4 transition-all ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
