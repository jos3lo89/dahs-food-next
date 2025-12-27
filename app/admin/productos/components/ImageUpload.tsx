"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onDelete?: () => void;
  label?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onDelete,
  label = "Imagen",
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, deleteImage, isUploading } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    const previousImageUrl = value;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    upload(file, {
      onSuccess: async (data) => {
        if (data.data?.url) {
          if (previousImageUrl && previousImageUrl.includes("cloudinary")) {
            try {
              await deleteImage(previousImageUrl);
            } catch (error) {
              console.error("Error al eliminar imagen anterior:", error);
            }
          }

          onChange(data.data.url);
          setPreview(data.data.url);
        }
      },
      onError: () => {
        setPreview(value || null);
      },
    });
  };

  const handleRemove = () => {
    if (value && value.includes("cloudinary")) {
      deleteImage(value);
    }
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onDelete?.();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative w-full h-64 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading || disabled}
            >
              <X className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || disabled}
            >
              <Upload className="w-4 h-4 mr-2" />
              Cambiar
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || disabled}
          className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-pink-500 dark:hover:border-pink-500 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <p className="text-sm font-medium">Click para subir imagen</p>
              <p className="text-xs">JPG, PNG o WEBP (máx. 5MB)</p>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
