"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const SidebarCart = () => {
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
    customerInfo,
    setCustomerInfo,
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const [formData, setFormData] = useState({
    name: customerInfo?.name || "",
    phone: customerInfo?.phone || "",
    address: customerInfo?.address || "",
    notes: customerInfo?.notes || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    // Guardar info del cliente
    setCustomerInfo({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
    });

    // Enviar pedido por WhatsApp
    // sendWhatsAppOrder({
    //   items,
    //   subtotal,
    //   discount,
    //   total,
    //   customerInfo: {
    //     name: formData.name,
    //     phone: formData.phone,
    //     address: formData.address,
    //     notes: formData.notes,
    //   },
    //   promotionCode: promotion?.code,
    //   businessPhone: BUSINESS_PHONE,
    // });

    // Opcional: Limpiar carrito después de enviar
    // clearCart();
  };

  const canCheckout =
    items.length > 0 &&
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.address.trim() !== "";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
    >
      <SheetTrigger asChild>
        <button className="relative cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-xl flex items-center">
          <ShoppingCart />
          {mounted && itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
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
        {/* CONTENIDO DEL CARRITO */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {items.length === 0 ? (
            // Carrito vacío
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
              {/* LISTA DE PRODUCTOS */}
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-pink-50 rounded-lg p-3"
                    >
                      {/* Imagen */}
                      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-pink-600 font-medium">
                          {formatPrice(item.price)}
                        </p>

                        {/* Controles de cantidad */}
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

                      {/* Precio total y eliminar */}
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

              {/* FORMULARIO Y TOTALES */}
              <div className="border-t border-pink-100 px-6 py-4 space-y-4">
                {/* Totales */}
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

                {/* Formulario de cliente */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm">
                      Nombre completo *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">
                      Teléfono / WhatsApp *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="999 999 999"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm">
                      Dirección de entrega *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Av. Principal 123, Lima"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm">
                      Notas adicionales (opcional)
                    </Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Sin cebolla, por favor..."
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Botón de checkout */}
                <Button
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enviar Pedido por WhatsApp
                </Button>

                {!canCheckout && items.length > 0 && (
                  <p className="text-xs text-center text-red-500">
                    * Completa todos los campos requeridos
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default SidebarCart;
