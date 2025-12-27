"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Eye, EyeOff, Package } from "lucide-react";
import { useToggleCategoriaActive } from "@/hooks/useCategories";
import { Categoria } from "@/types/categories";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CategoriasTableProps {
  categorias: Categoria[];
}

export function CategoriasTable({ categorias }: CategoriasTableProps) {
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null
  );
  const { mutate: toggleActive } = useToggleCategoriaActive();

  const handleToggleActive = (categoria: Categoria) => {
    toggleActive({
      id: categoria.id,
      active: !categoria.active,
    });
  };

  if (categorias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No hay categorías registradas
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="w-20">Orden</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                {/* Orden */}
                <TableCell>
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full font-semibold text-sm">
                    {categoria.order}
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {categoria.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {categoria.slug}
                    </p>
                  </div>
                </TableCell>

                {/* Productos */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {categoria._count?.products || 0} producto(s)
                    </span>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={categoria.active}
                      onCheckedChange={() => handleToggleActive(categoria)}
                    />
                    <span
                      className={`text-sm ${
                        categoria.active
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {categoria.active ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </TableCell>

                {/* Fecha */}
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(categoria.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingCategoria(categoria)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(categoria)}
                        className={
                          categoria.active ? "text-red-600" : "text-green-600"
                        }
                      >
                        {categoria.active ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <EditCategoryDialog
        categoria={editingCategoria}
        open={!!editingCategoria}
        onOpenChange={(open) => !open && setEditingCategoria(null)}
      />
    </>
  );
}
