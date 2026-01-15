"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { uploadApi } from "@/services/upload.service";
import { toast } from "sonner";

interface YapePaymentProps {
  amount: number;
  onReceiptUpload: (imageUrl: string) => void;
}

const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";

const YAPE_CONFIG = {
  qrImage: "/images/payment/yape-qr.png",
  phoneNumber: whatsappPhone,
  recipientName: "Desayunos Dulces SAC",
};

export function YapePayment({ amount, onReceiptUpload }: YapePaymentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadApi.uploadImage(file);

      if (!response.success || !response.data?.url) {
        throw new Error(response.error || "Error al subir imagen");
      }

      const imageUrl = response.data.url;

      setUploadedImage(imageUrl);
      onReceiptUpload(imageUrl);
      toast.success("Comprobante cargado exitosamente");
    } catch (error: any) {
      console.error("Error al subir comprobante:", error);
      toast.error(error.message || "Error al subir el comprobante");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (uploadedImage) {
      try {
        await uploadApi.deleteImage(uploadedImage);
        setUploadedImage(null);
        onReceiptUpload("");
      } catch (error) {
        console.error("Error al eliminar imagen:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">
              Pago con Yape
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Escanea el QR o usa el número
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Monto a pagar:
          </p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(amount)}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Instrucciones:
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
              <li>Abre tu app de Yape</li>
              <li>Escanea el código QR o yapea al número</li>
              <li>
                Ingresa el monto exacto: <strong>{formatPrice(amount)}</strong>
              </li>
              <li>Captura de pantalla del comprobante</li>
              <li>Sube la captura aquí abajo</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 text-center">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Escanea el QR
          </h4>
          <div className="relative w-48 h-48 mx-auto bg-white rounded-xl p-4 shadow-lg">
            <Image
              src={YAPE_CONFIG.qrImage}
              alt="QR Yape"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            O yapea directamente
          </h4>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                Número de Yape:
              </Label>
              <div className="mt-1 flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <span className="font-mono font-bold text-purple-900 dark:text-purple-100 text-lg">
                  {YAPE_CONFIG.phoneNumber}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      YAPE_CONFIG.phoneNumber.replace(/\s/g, "")
                    );
                    toast.success("Número copiado");
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                Nombre:
              </Label>
              <div className="mt-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {YAPE_CONFIG.recipientName}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                Monto exacto:
              </Label>
              <div className="mt-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">
                  {formatPrice(amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Subir comprobante de pago *
        </h4>

        {uploadedImage ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-green-500">
              <Image
                src={uploadedImage}
                alt="Comprobante"
                width={400}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
                <Check className="w-5 h-5" />
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                Cambiar imagen
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Click para subir</span> o
                  arrastra aquí
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG o JPEG (Max. 5MB)
                </p>
              </div>
              <Input
                id="receipt-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </Label>

            {isUploading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Subiendo comprobante...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-1">Importante:</p>
            <p>
              Su pedido será confirmado una vez verifiquemos el pago. Esto puede
              tomar hasta 15 minutos. Le notificaremos por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
