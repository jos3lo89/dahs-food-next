"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ProductsI } from "@/types/products";
import { Minus, Plus, ShoppingCart } from "lucide-react";

type Props = {
  product: ProductsI;
};

const ProductCart = ({ product }: Props) => {
  const { increaseQuantity, decreaseQuantity, getItemQuantity, addItem } =
    useCartStore();

  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden card-hover">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-md">
          S/ {Number(product.price).toFixed(2)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-pink-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {quantity > 0 ? (
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center bg-pink-50 rounded-full overflow-hidden">
              <Button
                variant="ghost"
                className="px-4 py-2 rounded-l-full text-pink-600 hover:bg-pink-200 transition font-bold cursor-pointer"
                onClick={() => decreaseQuantity(product.id)}
              >
                <Minus />
              </Button>
              <span className="quantity px-4 py-2 font-semibold text-pink-900 cursor-default">
                {quantity}
              </span>
              <Button
                variant="ghost"
                className="px-4 py-2 rounded-r-full text-pink-600 hover:bg-pink-200 transition font-bold cursor-pointer"
                onClick={() => increaseQuantity(product.id)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al carrito
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCart;
