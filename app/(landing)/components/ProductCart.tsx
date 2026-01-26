"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ProductsI } from "@/types/products";
import { formatSMoney } from "@/utils/formatMoney";

type Props = {
  product: ProductsI;
  featured?: boolean;
};

const ProductCard = ({ product, featured = false }: Props) => {
  const { increaseQuantity, decreaseQuantity, getItemQuantity, addItem } =
    useCartStore();
  const quantity = getItemQuantity(product.id);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const ingredients = product.ingredients ?? [];
  const hasIngredients = ingredients.length > 0;

  const handleAddToCart = () => addItem(product);

  return (
    <div className="group flex flex-col self-start overflow-hidden rounded-2xl border border-amber-100/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-24px_rgba(124,45,18,0.65)]">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 p-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-white/0 to-white/0" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <Badge className="bg-amber-100/80 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">
            {product.category.name}
          </Badge>
          {featured && (
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
              <Star className="h-3 w-3 fill-amber-400" />
              Destacado
            </div>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-tight text-neutral-900">
          {product.name}
        </h3>

        <p className="mb-3 text-sm leading-relaxed text-neutral-600 line-clamp-2">
          {product.description}
        </p>

        {hasIngredients && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setIngredientsOpen((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 transition hover:text-amber-900"
              aria-expanded={ingredientsOpen}
            >
              {ingredientsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Ver ingredientes
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                ingredientsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* {product.stock > 0 && product.stock < 10 && (
          <div className="flex items-center gap-1 mb-2 text-orange-600 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>¡Solo quedan {product.stock}!</span>
          </div>
        )} */}

        {product.hasDiscount && (
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-amber-700">
            <AlertCircle className="h-3 w-3" />
            <span>Promo aplicable</span>
            {product.discountCode && (
              <Badge className="bg-amber-100/80 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">
                {product.discountCode}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto mb-4">
          <span className="text-2xl font-semibold text-rose-600">
            {formatSMoney(product.price)}
          </span>
        </div>

        <div className="mt-auto">
          {product.stock === 0 ? (
            <Button
              disabled
              variant="outline"
              className="w-full cursor-not-allowed border-amber-100 bg-amber-50 text-amber-400"
            >
              Agotado
            </Button>
          ) : quantity > 0 ? (
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/70 p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-200/70 hover:text-rose-700"
                onClick={() => decreaseQuantity(product.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-semibold text-rose-900">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-200/70 hover:text-rose-700"
                onClick={() => increaseQuantity(product.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="h-11 w-full rounded-xl bg-rose-600 text-white shadow-sm transition-all hover:bg-rose-700 hover:shadow-md"
              onClick={handleAddToCart} > <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
