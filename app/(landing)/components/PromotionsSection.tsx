"use client";

import { useQuery } from "@tanstack/react-query";
import { promocionesApi } from "@/services/promotion.service";
import { PropagateLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Tag, Calendar } from "lucide-react";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const PromotionsSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["promociones-activas"],
    queryFn: () =>
      promocionesApi.getPromociones({
        active: true,
        current: true,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <PropagateLoader color="#ec4899" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-lg my-4">
        <AlertCircleIcon className="w-4 h-4" />
        <AlertTitle>Error al cargar promociones</AlertTitle>
        <AlertDescription>
          No se pudieron cargar las promociones activas
        </AlertDescription>
      </Alert>
    );
  }

  const promociones = data?.data || [];

  if (promociones.length === 0) {
    return null;
  }

  return (
    <section
      id="promociones"
      className="py-16 bg-linear-to-br from-pink-50 to-rose-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-4">
            <Tag className="w-4 h-4" />
            <span className="font-semibold text-sm">OFERTAS ESPECIALES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-pink-900 mb-4">
            🔥 Promociones Activas
          </h2>
          <p className="text-lg md:text-xl text-pink-600 max-w-2xl mx-auto">
            Aprovecha nuestras ofertas exclusivas por tiempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map((promo) => {
            const daysLeft = differenceInDays(
              new Date(promo.endDate),
              new Date(),
            );
            const isEndingSoon = daysLeft <= 3;

            return (
              <div
                key={promo.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden card-hover group"
              >
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-pink-200 to-purple-200">
                  {promo.image ? (
                    <Image
                      src={promo.image}
                      alt={promo.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-16 h-16 text-pink-400" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{promo.discount}%
                  </div>

                  {isEndingSoon && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      ¡Últimos {daysLeft} día(s)!
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-pink-900 mb-2">
                    {promo.name}
                  </h3>

                  {promo.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                  )}

                  {promo.code && (
                    <div className="flex items-center gap-2 mb-4 bg-pink-50 p-3 rounded-lg">
                      <Tag className="w-4 h-4 text-pink-600" />
                      <span className="text-xs text-gray-600">Código:</span>
                      <span className="font-mono font-bold text-pink-600">
                        {promo.code}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Hasta el{" "}
                      {format(new Date(promo.endDate), "dd 'de' MMMM", {
                        locale: es,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    {promo._count && (
                      <>
                        {promo._count.products > 0 && (
                          <span>{promo._count.products} productos</span>
                        )}
                      </>
                    )}
                  </div>

                  <a href="#desayunos">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full">
                      Ver Productos
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
