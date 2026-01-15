"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { useProductos } from "@/hooks/useProducts";
import Image from "next/image";

interface ProductSelectorProps {
  selectedProductIds: string[];
  onChange: (productIds: string[]) => void;
  disabled?: boolean;
}

export function ProductSelector({
  selectedProductIds,
  onChange,
  disabled = false,
}: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const { data } = useProductos({ active: true, search });

  const productos = data?.data || [];

  const handleToggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      onChange(selectedProductIds.filter((id) => id !== productId));
    } else {
      onChange([...selectedProductIds, productId]);
    }
  };

  const selectedProducts = productos.filter((p) =>
    selectedProductIds.includes(p.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Productos en Promoción *</Label>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona los productos que tendrán descuento
        </p>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((producto) => (
            <Badge
              key={producto.id}
              variant="secondary"
              className="pl-2 pr-1 py-1 gap-2"
            >
              <span className="text-sm">{producto.name}</span>
              <button
                type="button"
                onClick={() => handleToggleProduct(producto.id)}
                disabled={disabled}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          disabled={disabled}
        />
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-96 overflow-y-auto">
        {productos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron productos
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {productos.map((producto) => {
              const isSelected = selectedProductIds.includes(producto.id);
              return (
                <button
                  key={producto.id}
                  type="button"
                  onClick={() => handleToggleProduct(producto.id)}
                  disabled={disabled}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    isSelected ? "bg-pink-50 dark:bg-pink-900/20" : ""
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image
                      src={producto.image}
                      alt={producto.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {producto.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {producto.category.name} • S/ {producto.price.toFixed(2)}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? "bg-pink-500 border-pink-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {selectedProductIds.length} producto(s) seleccionado(s)
      </p>
    </div>
  );
}
