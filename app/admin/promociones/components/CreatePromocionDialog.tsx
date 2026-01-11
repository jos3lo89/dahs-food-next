"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Calendar } from "lucide-react";
import { useCreatePromocion } from "@/hooks/usePromotion";
import { PromotionType, CreatePackDto } from "@/types/promotion";
import { ProductSelector } from "./ProductSelector";
import { PackBuilder } from "./PackBuilder";
import { ImageUpload } from "@/app/admin/productos/components/ImageUpload";
import { uploadApi } from "@/services/upload.service";

const createPromocionSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional(),
  discount: z.number().min(0).max(100, "Entre 0 y 100"),
  code: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["DISCOUNT", "PACK", "DAY_SPECIAL", "WEEK_DEAL"]),
  image: z.string().optional(),
  featured: z.boolean(),
});

type CreatePromocionForm = z.infer<typeof createPromocionSchema>;

export function CreatePromocionDialog() {
  const [open, setOpen] = useState(false);
  const [promoImage, setPromoImage] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [packs, setPacks] = useState<CreatePackDto[]>([]);
  const { mutate: createPromocion, isPending } = useCreatePromocion();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePromocionForm>({
    resolver: zodResolver(createPromocionSchema),
    defaultValues: {
      featured: false,
      type: "DISCOUNT",
      discount: 0,
    },
  });

  const promotionType = watch("type");
  const featured = watch("featured");

  const cleanupImages = async () => {
    const allImages = [
      promoImage,
      ...packs.map((p) => p.image).filter(Boolean),
    ];
    for (const url of allImages) {
      if (url && url.includes("cloudinary")) {
        try {
          await uploadApi.deleteImage(url);
        } catch (error) {
          console.error("Error al limpiar imagen:", url);
        }
      }
    }
  };

  const onSubmit = (data: CreatePromocionForm) => {
    if (data.type === "DISCOUNT" && selectedProductIds.length === 0) {
      alert("Debes seleccionar al menos un producto");
      return;
    }

    if (data.type === "PACK" && packs.length === 0) {
      alert("Debes crear al menos un pack");
      return;
    }

    const payload = {
      ...data,
      image: promoImage || undefined,
      productIds: data.type === "DISCOUNT" ? selectedProductIds : undefined,
      packs: data.type === "PACK" ? packs : undefined,
    };

    createPromocion(payload, {
      onSuccess: () => {
        reset();
        setPromoImage("");
        setSelectedProductIds([]);
        setPacks([]);
        setOpen(false);
      },
      onError: async () => {
        await cleanupImages();
      },
    });
  };

  const handleCancel = async () => {
    await cleanupImages();
    reset();
    setPromoImage("");
    setSelectedProductIds([]);
    setPacks([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Crear Promoción
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-225 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Promoción</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="type">Tipo de Promoción *</Label>
            <Select
              value={promotionType}
              onValueChange={(value) =>
                setValue("type", value as PromotionType)
              }
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISCOUNT">Descuento en Productos</SelectItem>
                <SelectItem value="PACK">Packs/Combos</SelectItem>
                <SelectItem value="DAY_SPECIAL">Especial del Día</SelectItem>
                <SelectItem value="WEEK_DEAL">Oferta de la Semana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Nombre de la Promoción *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Combo Desayuno Familiar"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe la promoción..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="discount">Descuento (%) *</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("discount", { valueAsNumber: true })}
              placeholder="10"
              disabled={isPending}
            />
            {errors.discount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.discount.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Porcentaje de descuento aplicado
            </p>
          </div>

          <div>
            <Label htmlFor="code">Código Promocional (opcional)</Label>
            <Input
              id="code"
              {...register("code")}
              placeholder="VERANO2025"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Los clientes pueden usar este código al realizar el pedido
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="startDate"
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
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="endDate"
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

          {promotionType === "DISCOUNT" && (
            <ProductSelector
              selectedProductIds={selectedProductIds}
              onChange={setSelectedProductIds}
              disabled={isPending}
            />
          )}

          {promotionType === "PACK" && (
            <PackBuilder
              packs={packs}
              onChange={setPacks}
              disabled={isPending}
            />
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <Label htmlFor="featured" className="cursor-pointer">
                Destacar en Slider Principal
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se mostrará en el slider de la página principal
              </p>
            </div>
            <Switch
              id="featured"
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
                  Creando...
                </>
              ) : (
                "Crear Promoción"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
