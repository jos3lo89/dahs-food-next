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
import { Search, Loader2, FolderOpen } from "lucide-react";
import { useCategorias } from "@/hooks/useCategories";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog";
import { CategoriasTable } from "./components/CategoriasTable";
import { ReorderCategoriesDialog } from "./components/ReorderCategoriesDialog";

export default function CategoriasPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { data, isLoading, error } = useCategorias({
    search: search || undefined,
    active:
      statusFilter === "all"
        ? undefined
        : statusFilter === "active"
        ? true
        : false,
  });

  const categorias = data?.data || [];
  const totalCategorias = categorias.length;
  const categoriasActivas = categorias.filter((c) => c.active).length;
  const totalProductos = categorias.reduce(
    (sum, cat) => sum + (cat._count?.products || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Categorías
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra las categorías de productos
          </p>
        </div>
        <div className="flex gap-3">
          {categorias.length > 0 && (
            <ReorderCategoriesDialog categorias={categorias} />
          )}
          <CreateCategoryDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(v: any) => setStatusFilter(v)}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Categorías
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCategorias}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Activas
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {categoriasActivas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Productos
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalProductos}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar categorías</p>
        </div>
      ) : (
        <CategoriasTable categorias={categorias} />
      )}
    </div>
  );
}
