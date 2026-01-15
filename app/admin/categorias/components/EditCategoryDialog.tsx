"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useUpdateCategoria } from "@/hooks/useCategories";
import { Categoria } from "@/types/categories";

const editCategorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2, "Mínimo 2 caracteres"),
  order: z.number().int().min(1, "El orden debe ser mayor o igual a 1"),
});

type EditCategoryForm = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  categoria: Categoria | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  categoria,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const { mutate: updateCategoria, isPending } = useUpdateCategoria();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditCategoryForm>({
    resolver: zodResolver(editCategorySchema),
  });

  useEffect(() => {
    if (categoria) {
      reset({
        name: categoria.name,
        slug: categoria.slug,
        order: categoria.order,
      });
    }
  }, [categoria, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const onSubmit = (data: EditCategoryForm) => {
    if (!categoria) return;

    updateCategoria(
      { id: categoria.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nombre de la Categoría *</Label>
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
            <Label htmlFor="edit-order">Posición en el listado *</Label>
            <Input
              id="edit-order"
              type="number"
              min="1"
              {...register("order", { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.order && (
              <p className="text-sm text-red-500 mt-1">
                {errors.order.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ⚠️ Si existe una categoría en esta posición, se moverá al final
            </p>
          </div>

          {categoria?._count?.products !== undefined && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📦 Esta categoría tiene{" "}
                <strong>{categoria._count.products}</strong> producto(s)
                asociado(s)
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
