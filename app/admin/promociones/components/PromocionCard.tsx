"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Promocion } from "@/types/promotion";
import { Tag, Calendar, Percent } from "lucide-react";
import Image from "next/image";
import { format, isPast, isFuture, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface PromocionCardProps {
  promocion: Promocion;
  variant?: "default" | "featured" | "compact";
  showDetails?: boolean;
  onViewDetails?: () => void;
}

const typeLabels = {
  DISCOUNT: "Descuento",
};

const typeIcons = {
  DISCOUNT: Percent,
  DISCOUNT_FALLBACK: Tag,
};

export function PromocionCard({
  promocion,
  variant = "default",
  showDetails = true,
  onViewDetails,
}: PromocionCardProps) {
  const now = new Date();
  const start = new Date(promocion.startDate);
  const end = new Date(promocion.endDate);
  const daysLeft = differenceInDays(end, now);

  const isProgrammed = isFuture(start);
  const isExpired = isPast(end);
  const isActive = promocion.active && !isProgrammed && !isExpired;
  const isEndingSoon = isActive && daysLeft <= 3;

  const Icon = typeIcons[promocion.type] || typeIcons.DISCOUNT_FALLBACK;

  if (variant === "featured") {
    return (
      <div className="relative w-full h-96 rounded-2xl overflow-hidden group">
        {promocion.image ? (
          <Image
            src={promocion.image}
            alt={promocion.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500" />
        )}

        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
          <div className="absolute top-8 left-8 flex gap-2">
            <Badge className="bg-pink-500 hover:bg-pink-600">
              {typeLabels[promocion.type]}
            </Badge>
            {isEndingSoon && (
              <Badge variant="destructive">¡Últimos {daysLeft} día(s)!</Badge>
            )}
            {promocion.code && (
              <Badge variant="secondary">Código: {promocion.code}</Badge>
            )}
          </div>

          <div className="mb-4">
            <p className="text-7xl font-bold drop-shadow-lg">
              {promocion.discount}%
            </p>
            <p className="text-2xl font-semibold">de descuento</p>
          </div>

          <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
            {promocion.name}
          </h2>

          {promocion.description && (
            <p className="text-lg mb-4 line-clamp-2 max-w-2xl">
              {promocion.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              Válido hasta el {format(end, "dd 'de' MMMM", { locale: es })}
            </span>
          </div>

          {showDetails && (
            <Button
              onClick={onViewDetails}
              className="w-fit bg-white text-pink-600 hover:bg-gray-100"
            >
              Ver Detalles
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={onViewDetails}
      >
        <CardContent className="p-4 flex items-center gap-3">
          {promocion.image ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={promocion.image}
                alt={promocion.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-pink-500" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {promocion.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {promocion.discount}% OFF
              </Badge>
              {isEndingSoon && (
                <span className="text-xs text-red-500 font-medium">
                  {daysLeft}d restantes
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        {promocion.image ? (
          <Image
            src={promocion.image}
            alt={promocion.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <Icon className="w-16 h-16 text-pink-500 dark:text-pink-400" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-pink-500 hover:bg-pink-600 w-fit">
            -{promocion.discount}%
          </Badge>
          {isEndingSoon && (
            <Badge variant="destructive" className="w-fit">
              ¡Quedan {daysLeft} día(s)!
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {isProgrammed && (
            <Badge className="bg-yellow-500">Próximamente</Badge>
          )}
          {isExpired && <Badge variant="secondary">Expirada</Badge>}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
            {promocion.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {typeLabels[promocion.type]}
          </p>
        </div>

        {promocion.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {promocion.description}
          </p>
        )}

        {promocion.code && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
              {promocion.code}
            </span>
          </div>
        )}

        {promocion._count && promocion._count.products > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {promocion._count.products} productos
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
          <Calendar className="w-4 h-4" />
          <span>Hasta el {format(end, "dd/MM/yyyy", { locale: es })}</span>
        </div>

        {showDetails && (
          <Button
            onClick={onViewDetails}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Ver Detalles
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
