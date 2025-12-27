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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useUpdateProducto, useCategorias } from "@/hooks/useProducts";
import { Producto } from "@/types/products";
import { ImageUpload } from "./ImageUpload";
import { ImageGallery } from "./ImageGallery";
import { uploadApi } from "@/services/upload.service";

const editProductSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  slug: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  image: z.url("Debe ser una URL válida"),
  images: z.array(z.url()).optional(),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  featured: z.boolean(),
  stock: z.number().int().min(0),
});

type EditProductForm = z.infer<typeof editProductSchema>;

interface EditProductDialogProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
  producto,
  open,
  onOpenChange,
}: EditProductDialogProps) {
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const originalMainImageRef = useRef<string>("");
  const originalGalleryImagesRef = useRef<string[]>([]);

  const { mutate: updateProducto, isPending } = useUpdateProducto();
  const { data: categoriasData } = useCategorias(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),
  });

  const featured = watch("featured");
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (producto) {
      reset({
        name: producto.name,
        slug: producto.slug,
        description: producto.description || "",
        price: producto.price,
        image: producto.image,
        images: producto.images || [],
        categoryId: producto.categoryId,
        featured: producto.featured,
        stock: producto.stock,
      });
      setMainImage(producto.image);
      setGalleryImages(producto.images || []);

      originalMainImageRef.current = producto.image;
      originalGalleryImagesRef.current = producto.images || [];
    }
  }, [producto, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const getNewImages = () => {
    const newImages: string[] = [];

    if (mainImage && mainImage !== originalMainImageRef.current) {
      newImages.push(mainImage);
    }

    galleryImages.forEach((img) => {
      if (!originalGalleryImagesRef.current.includes(img)) {
        newImages.push(img);
      }
    });

    return newImages;
  };

  const cleanupNewImages = async () => {
    const newImages = getNewImages();

    for (const url of newImages) {
      if (url.includes("cloudinary")) {
        try {
          await uploadApi.deleteImage(url);
        } catch (error) {
          console.error("Error al limpiar imagen:", url);
        }
      }
    }
  };

  const onSubmit = (data: EditProductForm) => {
    if (!producto) return;

    updateProducto(
      { id: producto.id, data: { ...data, images: galleryImages } },
      {
        onSuccess: () => {
          originalMainImageRef.current = mainImage;
          originalGalleryImagesRef.current = [...galleryImages];
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

    setMainImage(originalMainImageRef.current);
    setGalleryImages(originalGalleryImagesRef.current);

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
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="edit-name">Nombre del Producto *</Label>
            <Input
              id="edit-name"
              {...register("name")}
              onChange={handleNameChange}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-slug">Slug (URL amigable) *</Label>
            <Input id="edit-slug" {...register("slug")} disabled={isPending} />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">Precio (PEN) *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-stock">Stock *</Label>
              <Input
                id="edit-stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.stock && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="edit-categoryId">Categoría *</Label>
            <Select
              value={categoryId || ""}
              onValueChange={(value) => setValue("categoryId", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoriasData?.data.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <ImageUpload
            value={mainImage}
            onChange={(url) => {
              setMainImage(url);
              setValue("image", url);
            }}
            label="Imagen Principal *"
            disabled={isPending}
          />

          {mainImage && (
            <ImageGallery
              images={galleryImages}
              onChange={setGalleryImages}
              disabled={isPending}
              maxImages={5}
            />
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <Label htmlFor="edit-featured" className="cursor-pointer">
                Producto Destacado
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se mostrará en la página principal
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
