"use client";

import { productsApi } from "@/services/products.service";
import { useQuery } from "@tanstack/react-query";
import ProductCart from "./ProductCart";

const ExtrasSection = () => {
  const {
    data: extras,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "extras"],
    queryFn: () => productsApi.getProducts("extras", true),
  });

  if (isLoading) {
    return <div>cargando...</div>;
  }

  if (error) {
    return (
      <div>
        <p>no se pudo cargar los extras</p>
      </div>
    );
  }

  return (
    <section
      id="extras"
      className="py-20 bg-linear-to-br from-pink-100 to-rose-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-pink-900 mb-4">
            Extras Deliciosos
          </h2>
          <p className="text-xl text-pink-600">
            Complementa tu desayuno con algo especial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {extras?.map((e) => (
            <ProductCart product={e} key={e.id} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default ExtrasSection;
