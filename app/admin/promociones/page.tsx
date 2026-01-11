"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Tag, Calendar, Percent } from "lucide-react";
import { usePromociones } from "@/hooks/usePromotion";
import { CreatePromocionDialog } from "./components/CreatePromocionDialog";
import { PromocionesTable } from "./components/PromocionesTable";
import { PromotionType } from "@/types/promotion";
import { isPast, isFuture } from "date-fns";

export default function PromocionesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | PromotionType>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { data, isLoading, error } = usePromociones({
    search: search || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    active:
      statusFilter === "all"
        ? undefined
        : statusFilter === "active"
        ? true
        : false,
  });

  const promociones = data?.data || [];

  const totalPromociones = promociones.length;
  const promocionesActivas = promociones.filter((p) => {
    const now = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return p.active && !isPast(end) && !isFuture(start);
  }).length;
  const promocionesDestacadas = promociones.filter((p) => p.featured).length;
  const promocionesVencidas = promociones.filter((p) =>
    isPast(new Date(p.endDate))
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Promociones
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra descuentos, ofertas y packs promocionales
          </p>
        </div>
        <CreatePromocionDialog />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, descripción o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="DISCOUNT">Descuentos</SelectItem>
            <SelectItem value="PACK">Packs/Combos</SelectItem>
            <SelectItem value="DAY_SPECIAL">Del Día</SelectItem>
            <SelectItem value="WEEK_DEAL">De la Semana</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v: any) => setStatusFilter(v)}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Promociones
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPromociones}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vigentes
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {promocionesActivas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Destacadas
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {promocionesDestacadas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vencidas
              </p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {promocionesVencidas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar promociones</p>
        </div>
      ) : (
        <PromocionesTable promociones={promociones} />
      )}
    </div>
  );
}
