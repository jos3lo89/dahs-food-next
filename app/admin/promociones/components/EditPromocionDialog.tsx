"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar } from "lucide-react";
import { useUpdatePromocion } from "@/hooks/usePromotion";
import { Promocion } from "@/types/promotion";
import { ProductSelector } from "./ProductSelector";
import { ImageUpload } from "@/app/admin/productos/components/ImageUpload";
import { uploadApi } from "@/services/upload.service";
import { format } from "date-fns";

const editPromocionSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional(),
  discount: z.number().min(0).max(100, "Entre 0 y 100"),
  code: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.literal("DISCOUNT"),
  image: z.string().optional(),
  featured: z.boolean(),
  productIds: z.array(z.string()).min(1, "Selecciona al menos un producto"),
});

type EditPromocionForm = z.infer<typeof editPromocionSchema>;

interface EditPromocionDialogProps {
  promocion: Promocion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPromocionDialog({
  promocion,
  open,
  onOpenChange,
}: EditPromocionDialogProps) {
  const [promoImage, setPromoImage] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const originalPromoImageRef = useRef<string>("");

  const { mutate: updatePromocion, isPending } = useUpdatePromocion();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPromocionForm>({
    resolver: zodResolver(editPromocionSchema),
    defaultValues: {
      type: "DISCOUNT",
      productIds: [],
    },
  });

  const featured = watch("featured");

  useEffect(() => {
    if (promocion) {
      const startDate = format(
        new Date(promocion.startDate),
        "yyyy-MM-dd'T'HH:mm"
      );
      const endDate = format(new Date(promocion.endDate), "yyyy-MM-dd'T'HH:mm");

      reset({
        name: promocion.name,
        description: promocion.description || "",
        discount: promocion.discount,
        code: promocion.code || "",
        startDate,
        endDate,
        type: "DISCOUNT",
        image: promocion.image || "",
        featured: promocion.featured,
        productIds: promocion.products?.map((p) => p.productId) || [],
      });

      setPromoImage(promocion.image || "");
      originalPromoImageRef.current = promocion.image || "";

      if (promocion.products) {
        const productIds = promocion.products.map((p) => p.productId);
        setSelectedProductIds(productIds);
        setValue("productIds", productIds);
      }
    }
  }, [promocion, reset]);

  const getNewImages = () => {
    const newImages: string[] = [];

    if (promoImage && promoImage !== originalPromoImageRef.current) {
      newImages.push(promoImage);
    }

    return newImages;
  };

  const cleanupNewImages = async () => {
    const newImages = getNewImages();

    for (const url of newImages) {
      if (url && url.includes("cloudinary")) {
        try {
          await uploadApi.deleteImage(url);
        } catch (error) {
          console.error("Error al limpiar imagen:", url);
        }
      }
    }
  };

  const onSubmit = (data: EditPromocionForm) => {
    if (!promocion) return;

    if (selectedProductIds.length === 0) {
      alert("Debes seleccionar al menos un producto");
      return;
    }

    const payload = {
      ...data,
      type: "DISCOUNT" as const,
      image: promoImage || undefined,
      productIds: selectedProductIds,
    };

    updatePromocion(
      { id: promocion.id, data: payload },
      {
        onSuccess: () => {
          originalPromoImageRef.current = promoImage;
          onOpenChange(false);
        },
        onError: async () => {
          await cleanupNewImages();
        },
      }
    );
  };

  const handleCancel = async () => {
    await cleanupNewImages();

    setPromoImage(originalPromoImageRef.current);

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-225 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Promoción</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-800">
              Tipo de promoción
            </p>
            <p className="text-sm text-gray-500">Descuento en productos</p>
          </div>

          <div>
            <Label htmlFor="edit-name">Nombre de la Promoción *</Label>
            <Input id="edit-name" {...register("name")} disabled={isPending} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              {...register("description")}
              rows={3}
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="edit-discount">Descuento (%) *</Label>
            <Input
              id="edit-discount"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("discount", { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.discount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-code">Código Promocional (opcional)</Label>
            <Input id="edit-code" {...register("code")} disabled={isPending} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startDate">Fecha de Inicio *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  {...register("startDate")}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-endDate">Fecha de Fin *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  {...register("endDate")}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <ImageUpload
            value={promoImage}
            onChange={setPromoImage}
            label="Imagen del Banner (opcional)"
            disabled={isPending}
          />

          <ProductSelector
            selectedProductIds={selectedProductIds}
            onChange={(ids) => {
              setSelectedProductIds(ids);
              setValue("productIds", ids);
            }}
            disabled={isPending}
          />

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <Label htmlFor="edit-featured" className="cursor-pointer">
                Destacar en Slider Principal
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se mostrará en el slider de la página principal
              </p>
            </div>
            <Switch
              id="edit-featured"
              checked={featured}
              onCheckedChange={(checked) => setValue("featured", checked)}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
