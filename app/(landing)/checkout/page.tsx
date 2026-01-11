"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutStepper } from "./components/CheckoutStepper";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { YapePayment } from "./components/YapePayment";
import { OrderSummary } from "./components/OrderSummary";
import { AddressForm } from "./components/AddressForm";
import { useCreateOrder } from "@/hooks/useOrders";
import { PaymentMethod } from "@/types/checkout";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Loader2,
  User,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { addMinutes } from "date-fns";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    customerInfo,
    promotion,
    paymentMethod,
    receiptImage,
    getSubtotal,
    getDiscount,
    getTotal,
    setCustomerInfo,
    setPaymentMethod,
    setReceiptImage,
    clearCart,
    clearCheckoutData,
  } = useCartStore();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: customerInfo?.name || "",
    phone: customerInfo?.phone || "",
    email: customerInfo?.email || "",

    address: customerInfo?.address || "",
    district: "",
    city: "Lima",
    reference: "",

    notes: customerInfo?.notes || "",
  });

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const deliveryFee = total >= 50 ? 0 : 5;
  const finalTotal = total + deliveryFee;

  useEffect(() => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      router.push("/");
    }
  }, [items, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return items.length > 0;
  };

  const validateStep2 = () => {
    return (
      formData.name.trim().length >= 3 &&
      formData.phone.trim().length >= 9 &&
      formData.address.trim().length >= 10 &&
      formData.district.trim().length >= 3 &&
      formData.city.trim().length >= 3
    );
  };

  const validateStep3 = () => {
    if (!paymentMethod) return false;

    if (paymentMethod === "yape" || paymentMethod === "plin") {
      return !!receiptImage;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error("Tu carrito está vacío");
      return;
    }

    if (currentStep === 2) {
      if (!validateStep2()) {
        toast.error("Completa todos los campos requeridos");
        return;
      }
      setCustomerInfo({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.district}, ${formData.city}`,
        notes: formData.notes,
      });
    }

    if (currentStep === 3 && !validateStep3()) {
      if (!paymentMethod) {
        toast.error("Selecciona un método de pago");
        return;
      }
      if (paymentMethod === "yape" || paymentMethod === "plin") {
        toast.error("Sube el comprobante de pago");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = () => {
    if (!validateStep2() || !validateStep3()) {
      toast.error("Completa todos los pasos");
      return;
    }

    const estimatedDeliveryTime = addMinutes(new Date(), 40).toISOString();

    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || undefined,
      customerAddress: `${formData.address}, ${formData.district}, ${formData.city}`,

      addressDetails: {
        street: formData.address,
        district: formData.district,
        city: formData.city,
        reference: formData.reference || undefined,
      },

      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),

      subtotal,
      discount,
      deliveryFee,
      total: finalTotal,

      paymentMethod: paymentMethod!,
      promotionCode: promotion?.code,
      notes: formData.notes,
      receiptImage: receiptImage || undefined,
      estimatedDeliveryTime,
    };

    createOrder(orderData, {
      onSuccess: (response) => {
        const orderNumber = response.data.orderNumber;
        clearCart();
        clearCheckoutData();
        router.push(`/confirmacion/${orderNumber}`);
      },
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-pink-900">
            Finalizar Pedido
          </h1>
        </div>

        <CheckoutStepper currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6 text-pink-500" />
                      Revisa tu pedido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Verifica que todo esté correcto antes de continuar
                    </p>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category}
                          </p>
                          <p className="text-sm text-pink-600 dark:text-pink-400">
                            S/ {item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-600 dark:text-pink-400">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Tus datos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Necesitamos esta información para entregar tu pedido
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-pink-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Información Personal
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Juan Pérez"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="999 999 999"
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="email">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email (opcional)
                          </div>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="tu@email.com"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Para enviarte la confirmación de tu pedido
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <AddressForm
                      formData={{
                        address: formData.address,
                        district: formData.district,
                        city: formData.city,
                        reference: formData.reference,
                      }}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Ej: Sin cebolla, tocar timbre, entregar en recepción..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Método de pago
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Elige cómo prefieres pagar
                    </p>
                  </div>

                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                  />

                  {paymentMethod === "yape" && (
                    <YapePayment
                      amount={finalTotal}
                      onReceiptUpload={setReceiptImage}
                    />
                  )}

                  {paymentMethod === "plin" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-900 dark:text-blue-100">
                        🚧 Pago con Plin próximamente disponible
                      </p>
                    </div>
                  )}

                  {paymentMethod === "efectivo" && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                        Pago en Efectivo
                      </h3>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Pagarás en efectivo cuando recibas tu pedido. Asegúrate
                        de tener el monto exacto o cambio disponible.
                      </p>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                        <strong>Total a pagar:</strong> S/{" "}
                        {finalTotal.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isPending || !validateStep3()}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Confirmar Pedido
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
