"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingCart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SidebarCart = () => {
  const router = useRouter();
  const {
    items,
    getItemsCount,
    getSubtotal,
    getDiscount,
    getTotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    isOpen,
    openCart,
    closeCart,
    promotion,
  } = useCartStore();

  const itemsCount = getItemsCount();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleGoToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
    >
      <SheetTrigger asChild>
        <button className="relative cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-xl flex items-center">
          <ShoppingCart />
          {mounted && itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {itemsCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold text-pink-900">
                🛒 Mi Carrito
              </SheetTitle>
              <SheetDescription className="text-pink-600">
                {itemsCount} {itemsCount === 1 ? "producto" : "productos"}
              </SheetDescription>
            </div>

            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega algunos deliciosos desayunos
              </p>
              <SheetClose asChild>
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Ver Productos
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-pink-50 rounded-lg p-3"
                    >
                      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-pink-600 font-medium">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => decreaseQuantity(item.productId)}
                            className="h-7 w-7 p-0 border-pink-200 hover:bg-pink-100"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="font-semibold text-sm min-w-7.5 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => increaseQuantity(item.productId)}
                            className="h-7 w-7 p-0 border-pink-200 hover:bg-pink-100"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>

                        <p className="font-bold text-pink-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-pink-100 px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento ({promotion?.code}):</span>
                      <span className="font-medium">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-pink-600">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoToCheckout}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6 rounded-lg"
                >
                  Finalizar Pedido
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Completa tu pedido en la siguiente pantalla
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarCart;
