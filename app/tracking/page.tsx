"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrackingSearchPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const whatsappDigits = whatsappPhone.replace(/\D/g, "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/tracking/${orderNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        Logo/Icon
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rastrear Pedido
          </h1>
          <p className="text-gray-600">
            Ingresa tu número de pedido para ver el estado
          </p>
        </div>
        Card de búsqueda
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="orderNumber" className="text-base font-semibold">
                Número de Pedido
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="Ej: ORD-20250127-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="pl-10 h-12 text-base"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Lo encuentras en tu email o WhatsApp de confirmación
              </p>
            </div>

            <Button
              type="submit"
              disabled={!orderNumber.trim()}
              className="w-full bg-pink-500 hover:bg-pink-600 h-12 text-base"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar Pedido
            </Button>
          </form>
        </div>
        Info cards
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email de confirmación
                </h3>
                <p className="text-sm text-gray-600">
                  Revisa tu correo, ahí encontrarás el número de pedido
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Mensaje de WhatsApp
                </h3>
                <p className="text-sm text-gray-600">
                  También te enviamos un mensaje con el link de rastreo
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
          >
            Volver a la tienda
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-gray-500">
            ¿Problemas para rastrear?{" "}
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline font-medium"
              >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
