"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, Truck } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative bg-linear-to-br from-pink-200 via-pink-100 to-rose-100 py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-semibold text-sm">
                ¡Envío gratis en compras mayores a S/ 50!
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pink-900 mb-6 leading-tight">
              Los desayunos más{" "}
              <span className="text-pink-600 relative inline-block">
                deliciosos
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              para alegrar tu mañana
            </h1>

            <p className="text-lg md:text-xl text-pink-700 mb-8 max-w-2xl">
              Desayunos preparados con ingredientes frescos y mucho cariño.
              ¡Despierta con sabor y energía!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#desayunos">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ver Desayunos
                </Button>
              </a>
              <a href="#promociones">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold px-8 py-6 rounded-full"
                >
                  🔥 Ver Promociones
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-pink-900 text-sm">
                    Entrega Rápida
                  </p>
                  <p className="text-xs text-pink-600">30-45 min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-pink-900 text-sm">
                    Envío Gratis
                  </p>
                  <p className="text-xs text-pink-600">Desde S/ 50</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">❤️</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-pink-900 text-sm">
                    Hecho con Amor
                  </p>
                  <p className="text-xs text-pink-600">100% Fresco</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src="/images/hero-breakfast.jpg"
                  alt="Desayuno delicioso"
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
