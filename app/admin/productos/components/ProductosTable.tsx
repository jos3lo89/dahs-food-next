"use client";

import { useState } from "react";
import {
  Edit,
  Eye,
  EyeOff,
  ListPlus,
  MoreVertical,
  Star,
  StarOff,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useToggleProductoActive,
  useToggleProductoFeatured,
} from "@/hooks/useProducts";
import { Producto } from "@/types/products";
import { EditProductDialog } from "./EditProductDialog";
import { IngredientsDialog } from "./IngredientsDialog";

interface ProductosTableProps {
  productos: Producto[];
}

export function ProductosTable({ productos }: ProductosTableProps) {
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [ingredientsProducto, setIngredientsProducto] =
    useState<Producto | null>(null);
  const { mutate: toggleActive } = useToggleProductoActive();
  const { mutate: toggleFeatured } = useToggleProductoFeatured();

  const handleToggleActive = (producto: Producto) => {
    toggleActive({
      id: producto.id,
      active: !producto.active,
    });
  };

  const handleToggleFeatured = (producto: Producto) => {
    toggleFeatured({
      id: producto.id,
      featured: !producto.featured,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No hay productos registrados
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
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      <Image
                        src={producto.image}
                        alt={producto.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {producto.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {producto.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                  >
                    {producto.category.name}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(producto.price)}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      producto.stock > 50
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : producto.stock > 10
                        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    }
                  >
                    {producto.stock}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={producto.active}
                      onCheckedChange={() => handleToggleActive(producto)}
                    />
                    <span
                      className={`text-sm ${
                        producto.active
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {producto.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(producto)}
                    className={
                      producto.featured
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    {producto.featured ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </Button>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(producto.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingProducto(producto)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIngredientsProducto(producto)}
                      >
                        <ListPlus className="w-4 h-4 mr-2" />
                        Ingredientes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleFeatured(producto)}
                      >
                        {producto.featured ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Quitar Destacado
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Marcar Destacado
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(producto)}
                        className={
                          producto.active ? "text-red-600" : "text-green-600"
                        }
                      >
                        {producto.active ? (
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

      <EditProductDialog
        producto={editingProducto}
        open={!!editingProducto}
        onOpenChange={(open) => !open && setEditingProducto(null)}
      />
      <IngredientsDialog
        producto={ingredientsProducto}
        open={!!ingredientsProducto}
        onOpenChange={(open) => !open && setIngredientsProducto(null)}
      />
    </>
  );
}
