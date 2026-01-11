"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/products.service";
import { PropagateLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";
import ProductCard from "./ProductCart";

const FeaturedProducts = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["productos-destacados"],
    queryFn: () =>
      productsApi.getProductos({
        active: true,
        category: undefined,
        featured: true,
        search: undefined,
      }), // featured=true
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <PropagateLoader color="#ec4899" />
      </div>
    );
  }

  const productos = data?.data || [];

  if (productos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-3">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold text-sm">DESTACADOS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-pink-900">
              ⭐ Productos Destacados
            </h2>
            <p className="text-lg text-pink-600 mt-2">
              Los favoritos de nuestros clientes
            </p>
          </div>

          {/* Botones de navegación */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("left")}
              className="rounded-full w-10 h-10 p-0 border-pink-200 hover:bg-pink-50"
            >
              <ChevronLeft className="w-5 h-5 text-pink-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("right")}
              className="rounded-full w-10 h-10 p-0 border-pink-200 hover:bg-pink-50"
            >
              <ChevronRight className="w-5 h-5 text-pink-600" />
            </Button>
          </div>
        </div>

        {/* Carousel de productos */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {productos.map((producto) => (
              <div key={producto.id} className="flex-none w-80">
                <ProductCard product={producto} featured />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
