"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/products.service";
import ProductCart from "./ProductCart";
import { PropagateLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const BreakfastSection = () => {
  const {
    data: breakFasts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "desayunos"],
    queryFn: () => productsApi.getProducts("desayunos", true),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <PropagateLoader color="#3b7dec" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-lg my-4">
        <AlertCircleIcon />
        <AlertTitle>Ocurrio algo inesperado.</AlertTitle>
        <AlertDescription>
          <ul className="list-inside list-disc text-sm">
            <li>No se pudo cargar los productos</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  if (breakFasts?.length === 0) {
    return null;
  }

  console.log(breakFasts);

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
