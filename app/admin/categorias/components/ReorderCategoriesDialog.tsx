"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, GripVertical, Loader2 } from "lucide-react";
import { useReorderCategorias } from "@/hooks/useCategories";
import { Categoria } from "@/types/categories";

interface ReorderCategoriesDialogProps {
  categorias: Categoria[];
}

export function ReorderCategoriesDialog({
  categorias,
}: ReorderCategoriesDialogProps) {
  const [open, setOpen] = useState(false);
  const [orderedCategories, setOrderedCategories] = useState<Categoria[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { mutate: reorderCategorias, isPending } = useReorderCategorias();

  useEffect(() => {
    if (categorias) {
      setOrderedCategories([...categorias].sort((a, b) => a.order - b.order));
    }
  }, [categorias]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = [...orderedCategories];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    setOrderedCategories(items);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const categories = orderedCategories.map((cat, index) => ({
      id: cat.id,
      order: index,
    }));

    reorderCategorias(
      { categories },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const handleReset = () => {
    setOrderedCategories([...categorias].sort((a, b) => a.order - b.order));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Reordenar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Reordenar Categorías</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arrastra para cambiar el orden de visualización
          </p>

          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-100 overflow-y-auto">
          {orderedCategories.map((categoria, index) => (
            <div
              key={categoria.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />

              <div className="flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full font-semibold text-sm">
                {index + 1}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {categoria.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {categoria.slug}
                </p>
              </div>

              {categoria._count?.products !== undefined && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {categoria._count.products} productos
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end flex-wrap gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
          >
            Restablecer
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-pink-500 hover:bg-pink-600"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Orden"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
