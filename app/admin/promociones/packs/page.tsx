"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Package, Plus } from "lucide-react";
import { usePromociones } from "@/hooks/usePromotion";
import Link from "next/link";
import Image from "next/image";
import { PromotionType } from "@/types/promotion";

export default function PacksPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePromociones({
    type: "PACK",
    active: true,
  });

  const promociones = data?.data || [];

  // Filtrar por búsqueda
  const filteredPromociones = promociones.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Obtener todos los packs
  const allPacks = filteredPromociones.flatMap((p) =>
    (p.packs || []).map((pack) => ({
      ...pack,
      promocion: {
        id: p.id,
        name: p.name,
        discount: p.discount,
        active: p.active,
      },
    }))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Packs Promocionales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los combos y packs especiales
          </p>
        </div>
        <Link href="/admin/promociones">
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Crear Promoción con Packs
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar packs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Packs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {allPacks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Activos
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {allPacks.filter((p) => p.active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Promociones
              </p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {promociones.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Packs Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : allPacks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay packs promocionales
          </p>
          <Link href="/admin/promociones">
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600">
              Crear Primer Pack
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPacks.map((pack) => {
            const ahorro = pack.originalPrice - pack.packPrice;
            const porcentajeAhorro = (ahorro / pack.originalPrice) * 100;

            return (
              <Card key={pack.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  {pack.image ? (
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={pack.image}
                        alt={pack.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <Package className="w-16 h-16 text-pink-500 dark:text-pink-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge
                      className={pack.active ? "bg-green-500" : "bg-gray-500"}
                    >
                      {pack.active ? "Activo" : "Inactivo"}
                    </Badge>
                    <Badge className="bg-pink-500">
                      -{porcentajeAhorro.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {pack.name}
                    </h3>
                    {pack.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {pack.description}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Promoción: {pack.promocion.name}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(pack.originalPrice)}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Ahorras {formatPrice(ahorro)}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {formatPrice(pack.packPrice)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Incluye {pack.items.length} productos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {pack.items.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item.quantity}x
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
