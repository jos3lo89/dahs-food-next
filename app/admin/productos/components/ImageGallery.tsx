"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function ImageGallery({
  images = [],
  onChange,
  disabled = false,
  maxImages = 5,
}: ImageGalleryProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, deleteImage, isUploading } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        alert(`${file.name} no es una imagen válida`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} supera los 5MB`);
        continue;
      }

      setUploadingIndex(i);

      await new Promise<void>((resolve) => {
        upload(file, {
          onSuccess: (data) => {
            if (data.data?.url) {
              newImages.push(data.data.url);
            }
            resolve();
          },
          onError: () => {
            resolve();
          },
        });
      });
    }

    setUploadingIndex(null);
    onChange(newImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (index: number) => {
    const imageToDelete = images[index];

    if (imageToDelete.includes("cloudinary")) {
      try {
        await deleteImage(imageToDelete);
      } catch (error) {
        console.error("Error al eliminar imagen:", error);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Galería de Imágenes Secundarias</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hasta {maxImages} imágenes ({images.length}/{maxImages})
          </p>
        </div>
        {canAddMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
          >
            <Upload className="w-4 h-4 mr-2" />
            Agregar Imágenes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group"
          >
            <Image
              src={imageUrl}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <X className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>

            {uploadingIndex === index && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ))}

        {canAddMore && images.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
            className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-pink-500 dark:hover:border-pink-500 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
          >
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs font-medium">Agregar imágenes</p>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
