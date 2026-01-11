"use client";

import { Check, Clock, ChefHat, Truck, Package, XCircle } from "lucide-react";

interface TrackingTimelineProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusSteps = [
  {
    key: "PENDING",
    label: "Pendiente",
    description: "Esperando confirmación",
    icon: Clock,
  },
  {
    key: "CONFIRMED",
    label: "Confirmado",
    description: "Pago verificado",
    icon: Check,
  },
  {
    key: "PREPARING",
    label: "En Preparación",
    description: "Preparando tu pedido",
    icon: ChefHat,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "En Camino",
    description: "Delivery en camino",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Entregado",
    description: "Pedido completado",
    icon: Package,
  },
];

export function TrackingTimeline({
  status,
  createdAt,
  updatedAt,
}: TrackingTimelineProps) {
  const currentStepIndex = statusSteps.findIndex((step) => step.key === status);
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">
              Pedido Cancelado
            </h3>
            <p className="text-red-700 dark:text-red-300">
              Este pedido ha sido cancelado
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Estado del Pedido
      </h3>

      <div className="relative">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === statusSteps.length - 1;

          return (
            <div key={step.key} className="relative pb-8 last:pb-0">
              {!isLast && (
                <div
                  className={`absolute left-8 top-16 w-0.5 h-full -ml-px ${
                    isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              )}

              <div className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-pink-500 ring-4 ring-pink-200 dark:ring-pink-800"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isCompleted ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {isCompleted && !isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-full">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h4
                    className={`text-lg font-bold mb-1 ${
                      isCurrent
                        ? "text-pink-600 dark:text-pink-400"
                        : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-sm ${
                      isCurrent || isCompleted
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>

                  {isCurrent && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                      </span>
                      En proceso
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Pedido realizado:</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {new Date(createdAt).toLocaleString("es-PE")}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Última actualización:
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {new Date(updatedAt).toLocaleString("es-PE")}
          </p>
        </div>
      </div>
    </div>
  );
}
