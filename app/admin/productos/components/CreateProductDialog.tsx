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
import { Plus, Loader2 } from "lucide-react";
import { useCreateProducto, useCategorias } from "@/hooks/useProducts";
import { ImageUpload } from "./ImageUpload";
import { ImageGallery } from "./ImageGallery";
import { uploadApi } from "@/services/upload.service";

const createProductSchema = z.object({
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

type CreateProductForm = z.infer<typeof createProductSchema>;

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const { mutate: createProducto, isPending } = useCreateProducto();
  const { data: categoriasData } = useCategorias(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      featured: false,
      stock: 999,
      images: [],
    },
  });

  const featured = watch("featured");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const cleanupImages = async () => {
    const allImages = [mainImage, ...galleryImages].filter(Boolean);
    for (const url of allImages) {
      try {
        await uploadApi.deleteImage(url);
      } catch (error) {
        console.error("Error al limpiar imagen:", url);
      }
    }
  };

  const onSubmit = (data: CreateProductForm) => {
    createProducto(
      { ...data, images: galleryImages },
      {
        onSuccess: () => {
          reset();
          setMainImage("");
          setGalleryImages([]);
          setOpen(false);
        },
        onError: async () => {
          await cleanupImages();
        },
      }
    );
  };

  const handleCancel = async () => {
    await cleanupImages();
    reset();
    setMainImage("");
    setGalleryImages([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Crear Producto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={handleNameChange}
              placeholder="Desayuno Continental"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL amigable) *</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="desayuno-continental"
              disabled={isPending}
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe el producto..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio (PEN) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="25.00"
                disabled={isPending}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="999"
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
            <Label htmlFor="categoryId">Categoría *</Label>
            <Select
              onValueChange={(value) => setValue("categoryId", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
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
          {errors.image && (
            <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
          )}

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
              <Label htmlFor="featured" className="cursor-pointer">
                Producto Destacado
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se mostrará en la página principal
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
              disabled={isPending || !mainImage}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Producto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
