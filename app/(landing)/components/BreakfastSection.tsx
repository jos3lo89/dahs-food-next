"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/products.service";
import ProductCart from "./ProductCart";

const BreakfastSection = () => {
  const {
    data: breakFasts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getProducts("desayunos", true),
  });

  if (isLoading) {
    <div>
      <p>Cargando....</p>
    </div>;
  }

  if (error) {
    <div>
      <p>No hay desayunos disponibles en este momento.</p>
    </div>;
  }

  return (
    <section id="desayunos" className="py-20 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-pink-900 mb-4">
            Nuestros Desayunos
          </h2>
          <p className="text-xl text-pink-600">
            Elige tu favorito y comienza el día con energía
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {breakFasts?.map((p) => (
            <ProductCart product={p} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default BreakfastSection;
