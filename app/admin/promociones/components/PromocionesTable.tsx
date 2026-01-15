"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Tag,
} from "lucide-react";
import {
  useTogglePromocionActive,
  useTogglePromocionFeatured,
} from "@/hooks/usePromotion";
import { Promocion, PromotionType } from "@/types/promotion";
import { format, isPast, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { EditPromocionDialog } from "./EditPromocionDialog";
import { useState } from "react";

interface PromocionesTableProps {
  promociones: Promocion[];
}

const typeLabels: Record<PromotionType, string> = {
  DISCOUNT: "Descuento",
  PACK: "Pack/Combo",
  DAY_SPECIAL: "Del Día",
  WEEK_DEAL: "De la Semana",
};

const typeColors: Record<PromotionType, string> = {
  DISCOUNT: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  PACK: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  DAY_SPECIAL:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
  WEEK_DEAL:
    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
};

export function PromocionesTable({ promociones }: PromocionesTableProps) {
  const { mutate: toggleActive } = useTogglePromocionActive();
  const { mutate: toggleFeatured } = useTogglePromocionFeatured();
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(
    null
  );

  const handleToggleActive = (promocion: Promocion) => {
    toggleActive({
      id: promocion.id,
      active: !promocion.active,
    });
  };

  const handleToggleFeatured = (promocion: Promocion) => {
    toggleFeatured({
      id: promocion.id,
      featured: !promocion.featured,
    });
  };

  const getStatusBadge = (promocion: Promocion) => {
    const now = new Date();
    const start = new Date(promocion.startDate);
    const end = new Date(promocion.endDate);

    if (!promocion.active) {
      return <Badge variant="secondary">Inactiva</Badge>;
    }

    if (isFuture(start)) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
          Programada
        </Badge>
      );
    }

    if (isPast(end)) {
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300">
          Expirada
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
        Activa
      </Badge>
    );
  };

  if (promociones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No hay promociones registradas
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
              <TableHead>Promoción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promociones.map((promocion) => (
              <TableRow key={promocion.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {promocion.image ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        <Image
                          src={promocion.image}
                          alt={promocion.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Tag className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {promocion.name}
                      </p>
                      {promocion.code && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Código: {promocion.code}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {promocion._count && (
                          <>
                            {promocion._count.products > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {promocion._count.products} productos
                              </span>
                            )}
                            {promocion._count.packs > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {promocion._count.packs} packs
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={typeColors[promocion.type]}
                  >
                    {typeLabels[promocion.type]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="font-semibold text-pink-600 dark:text-pink-400">
                    {promocion.discount}%
                  </p>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(promocion.startDate), "dd MMM", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      hasta{" "}
                      {format(new Date(promocion.endDate), "dd MMM", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(promocion)}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={promocion.active}
                        onCheckedChange={() => handleToggleActive(promocion)}
                        className="scale-75"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {promocion.active ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(promocion)}
                    className={
                      promocion.featured
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    {promocion.featured ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </Button>
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
                        onClick={() => setEditingPromocion(promocion)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleFeatured(promocion)}
                      >
                        {promocion.featured ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Quitar de Slider
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Destacar en Slider
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(promocion)}
                        className={
                          promocion.active ? "text-red-600" : "text-green-600"
                        }
                      >
                        {promocion.active ? (
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
      <EditPromocionDialog
        promocion={editingPromocion}
        open={!!editingPromocion}
        onOpenChange={(open) => !open && setEditingPromocion(null)}
      />
    </>
  );
}
