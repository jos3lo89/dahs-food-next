"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateIngredient,
  useDeleteIngredient,
  useIngredients,
} from "@/hooks/useIngredients";
import { Producto } from "@/types/products";

interface IngredientsDialogProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IngredientsDialog({
  producto,
  open,
  onOpenChange,
}: IngredientsDialogProps) {
  const [ingredientName, setIngredientName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const productId = producto?.id;
  const { data, isLoading } = useIngredients(productId);
  const { mutateAsync: createIngredient, isPending: isCreating } =
    useCreateIngredient(productId);
  const { mutate: deleteIngredient, isPending: isDeleting } =
    useDeleteIngredient(productId);

  const ingredients = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    if (!open) {
      setIngredientName("");
    }
  }, [open]);

  const handleAddIngredient = async () => {
    if (!productId) return;
    const trimmed = ingredientName.trim();
    if (!trimmed) return;

    await createIngredient(trimmed);
    setIngredientName("");
    inputRef.current?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ingredientes</DialogTitle>
          <DialogDescription>
            Administra los ingredientes del producto{producto ? ` "${producto.name}"` : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-xl border border-dashed border-amber-200 p-4">
            <p className="text-sm font-medium text-gray-700">Nuevo ingrediente</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                ref={inputRef}
                placeholder="Ej. Queso fresco"
                value={ingredientName}
                onChange={(event) => setIngredientName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddIngredient}
                disabled={isCreating || ingredientName.trim().length < 2}
                className="sm:w-36"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Agregar
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Lista actual</p>
              <Badge variant="outline" className="text-xs">
                {ingredients.length} item{ingredients.length === 1 ? "" : "s"}
              </Badge>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando ingredientes...
              </div>
            ) : ingredients.length === 0 ? (
              <div className="rounded-lg border border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                Aun no hay ingredientes registrados.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center gap-2 rounded-full border border-amber-100 bg-card px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm"
                  >
                    <span>{ingredient.name}</span>
                    <button
                      type="button"
                      onClick={() => deleteIngredient(ingredient.id)}
                      disabled={isDeleting}
                      className="text-gray-400 transition hover:text-rose-500"
                      aria-label={`Eliminar ${ingredient.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
