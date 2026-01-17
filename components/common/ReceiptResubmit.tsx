"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadApi } from "@/services/upload.service";
import { useCreateReceipt } from "@/hooks/useOrders";
import { toast } from "sonner";

interface ReceiptResubmitProps {
  orderId: string;
  onUploaded?: () => void;
  disabled?: boolean;
}

export function ReceiptResubmit({
  orderId,
  onUploaded,
  disabled = false,
}: ReceiptResubmitProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: createReceipt, isPending } = useCreateReceipt();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      await createReceipt({ orderId, imageUrl: response.data.url });
      if (onUploaded) {
        onUploaded();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al enviar comprobante");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
      <p className="font-semibold text-gray-900">Subir nuevo comprobante</p>
      <p className="mt-1 text-xs text-gray-500">
        El anterior fue rechazado. Puedes enviar una nueva captura de Yape.
      </p>
      <div className="mt-4">
        <Label
          htmlFor="receipt-resubmit"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Upload className="h-4 w-4" />
          {isUploading || isPending ? "Enviando..." : "Subir comprobante"}
        </Label>
        <Input
          id="receipt-resubmit"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading || isPending}
        />
      </div>
    </div>
  );
}
