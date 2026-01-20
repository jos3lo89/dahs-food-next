"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Producto } from "@/types/products";
import { formatSMoney } from "@/utils/formatMoney";
import { Minus, Plus, ShoppingCart, Star, AlertCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  product: Producto;
  featured?: boolean;
};

const ProductCard = ({ product, featured = false }: Props) => {
  const { increaseQuantity, decreaseQuantity, getItemQuantity, addItem } =
    useCartStore();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => addItem(product);

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-2 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-contain mix-blend-multiply"
        />
      </div>

      <div className="flex flex-col flex-1 p-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
            {product.category.name}
          </span>
          {featured && (
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-[10px] font-bold">Destacado</span>
            </div>
          )}
        </div>

        <h3 className="text-gray-800 font-bold text-base leading-tight line-clamp-2 mb-1 min-h-10">
          {product.name}
        </h3>

        <p className="text-sm mb-2">{product.description}</p>

        {product.stock > 0 && product.stock < 10 && (
          <div className="flex items-center gap-1 mb-2 text-orange-600 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>¡Solo quedan {product.stock}!</span>
          </div>
        )}

        <div className="mt-auto mb-4">
          <span className="text-xl font-extrabold text-pink-600">
            {formatSMoney(product.price)}
          </span>
        </div>

        <div className="mt-auto">
          {product.stock === 0 ? (
            <Button
              disabled
              variant="outline"
              className="w-full bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed hover:bg-gray-100"
            >
              Agotado
            </Button>
          ) : quantity > 0 ? (
            <div className="flex items-center justify-between bg-pink-50 rounded-lg p-1 border border-pink-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-pink-600 hover:bg-pink-200 hover:text-pink-700 rounded-md"
                onClick={() => decreaseQuantity(product.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-pink-900 text-sm">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-pink-600 hover:bg-pink-200 hover:text-pink-700 rounded-md"
                onClick={() => increaseQuantity(product.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-sm hover:shadow-md transition-all h-10 font-semibold rounded-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
