"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Search } from "lucide-react";
import { useProductos } from "@/hooks/useProducts";
import { CreatePackDto, PackItem } from "@/types/promotion";
import Image from "next/image";
import { ImageUpload } from "@/app/admin/productos/components/ImageUpload";

interface PackBuilderProps {
  packs: CreatePackDto[];
  onChange: (packs: CreatePackDto[]) => void;
  disabled?: boolean;
}

export function PackBuilder({
  packs,
  onChange,
  disabled = false,
}: PackBuilderProps) {
  const [searchStates, setSearchStates] = useState<Record<number, string>>({});

  const { data } = useProductos({ active: true });
  const productos = data?.data || [];

  const addPack = () => {
    onChange([
      ...packs,
      {
        name: "",
        description: "",
        items: [],
        originalPrice: 0,
        packPrice: 0,
        image: "",
      },
    ]);
  };

  const removePack = (index: number) => {
    onChange(packs.filter((_, i) => i !== index));
    const newSearchStates = { ...searchStates };
    delete newSearchStates[index];
    setSearchStates(newSearchStates);
  };

  const updatePack = (index: number, updates: Partial<CreatePackDto>) => {
    const newPacks = [...packs];
    newPacks[index] = { ...newPacks[index], ...updates };
    onChange(newPacks);
  };

  const addItemToPack = (packIndex: number, productId: string) => {
    const pack = packs[packIndex];
    const producto = productos.find((p) => p.id === productId);

    if (!producto) {
      console.error("Producto no encontrado:", productId);
      return;
    }

    const existingItem = pack.items.find(
      (item) => item.productId === productId
    );

    let newItems: PackItem[];

    if (existingItem) {
      // Incrementar cantidad
      newItems = pack.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Agregar nuevo item
      newItems = [...pack.items, { productId, quantity: 1 }];
    }

    let total = 0;
    newItems.forEach((item) => {
      const prod = productos.find((p) => p.id === item.productId);
      if (prod) {
        total += prod.price * item.quantity;
      }
    });

    updatePack(packIndex, {
      items: newItems,
      originalPrice: total,
    });

    setTimeout(() => {
      setSearchStates({ ...searchStates, [packIndex]: "" });
    }, 100);
  };

  const removeItemFromPack = (packIndex: number, productId: string) => {
    const pack = packs[packIndex];
    const newItems = pack.items.filter((item) => item.productId !== productId);

    let total = 0;
    newItems.forEach((item) => {
      const producto = productos.find((p) => p.id === item.productId);
      if (producto) {
        total += producto.price * item.quantity;
      }
    });

    updatePack(packIndex, {
      items: newItems,
      originalPrice: total,
    });
  };

  const updateItemQuantity = (
    packIndex: number,
    productId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    const pack = packs[packIndex];
    const newItems = pack.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    let total = 0;
    newItems.forEach((item) => {
      const producto = productos.find((p) => p.id === item.productId);
      if (producto) {
        total += producto.price * item.quantity;
      }
    });

    updatePack(packIndex, {
      items: newItems,
      originalPrice: total,
    });
  };

  const getFilteredProducts = (packIndex: number) => {
    const searchTerm = searchStates[packIndex] || "";
    const pack = packs[packIndex];

    if (!searchTerm) return [];

    return productos.filter((p) => {
      if (pack.items.some((i) => i.productId === p.id)) return false;

      return p.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Packs Promocionales *</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crea combos de productos con precio especial
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPack}
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Pack
        </Button>
      </div>

      {packs.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No hay packs agregados
          </p>
        </div>
      )}

      {packs.map((pack, packIndex) => (
        <div
          key={packIndex}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4"
        >
          {/* Header del Pack */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pack #{packIndex + 1}
            </h3>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removePack(packIndex)}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Nombre del Pack */}
          <div>
            <Label>Nombre del Pack *</Label>
            <Input
              value={pack.name}
              onChange={(e) => updatePack(packIndex, { name: e.target.value })}
              placeholder="Ej: Combo Familiar"
              disabled={disabled}
            />
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción</Label>
            <Textarea
              value={pack.description}
              onChange={(e) =>
                updatePack(packIndex, { description: e.target.value })
              }
              placeholder="Describe el pack..."
              rows={2}
              disabled={disabled}
            />
          </div>

          {/* Imagen del Pack */}
          <ImageUpload
            value={pack.image}
            onChange={(url) => updatePack(packIndex, { image: url })}
            label="Imagen del Pack"
            disabled={disabled}
          />

          {/* Productos del Pack */}
          <div className="space-y-3">
            <Label>Productos del Pack *</Label>

            {/* Items seleccionados */}
            {pack.items.length > 0 ? (
              <div className="space-y-2">
                {pack.items.map((item) => {
                  const producto = productos.find(
                    (p) => p.id === item.productId
                  );
                  if (!producto) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                        <Image
                          src={producto.image}
                          alt={producto.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {producto.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          S/ {producto.price.toFixed(2)} c/u
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateItemQuantity(
                                packIndex,
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={disabled || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(
                                packIndex,
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-8 text-center"
                            disabled={disabled}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateItemQuantity(
                                packIndex,
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            disabled={disabled}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeItemFromPack(packIndex, item.productId)
                          }
                          disabled={disabled}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay productos agregados
                </p>
              </div>
            )}

            {/* Selector de productos */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos para agregar..."
                  value={searchStates[packIndex] || ""}
                  onChange={(e) =>
                    setSearchStates({
                      ...searchStates,
                      [packIndex]: e.target.value,
                    })
                  }
                  className="pl-9"
                  disabled={disabled}
                />
              </div>

              {/* Lista de resultados */}
              {searchStates[packIndex] &&
                getFilteredProducts(packIndex).length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-48 overflow-y-auto bg-white dark:bg-gray-900">
                    {getFilteredProducts(packIndex).map((producto) => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => {
                          console.log(
                            "Agregando producto:",
                            producto.name,
                            producto.id
                          );
                          addItemToPack(packIndex, producto.id);
                        }}
                        disabled={disabled}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={producto.image}
                            alt={producto.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {producto.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            S/ {producto.price.toFixed(2)}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-pink-500" />
                      </button>
                    ))}
                  </div>
                )}

              {/* Mensaje si no hay resultados */}
              {searchStates[packIndex] &&
                getFilteredProducts(packIndex).length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                    No se encontraron productos
                  </div>
                )}
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Precio Original (calculado)</Label>
              <div className="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  S/ {pack.originalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {pack.items.length} producto(s)
                </p>
              </div>
            </div>

            <div>
              <Label>Precio del Pack *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={pack.packPrice || ""}
                onChange={(e) =>
                  updatePack(packIndex, {
                    packPrice: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Ahorro */}
          {pack.originalPrice > 0 && pack.packPrice > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                💰 Ahorro: S/ {(pack.originalPrice - pack.packPrice).toFixed(2)}{" "}
                (
                {(
                  ((pack.originalPrice - pack.packPrice) / pack.originalPrice) *
                  100
                ).toFixed(0)}
                % de descuento)
              </p>
            </div>
          )}

          {/* Advertencia si el precio del pack es mayor */}
          {pack.packPrice > pack.originalPrice && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                ⚠️ El precio del pack es mayor al precio original
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
