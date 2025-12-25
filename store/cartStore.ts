import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AppliedPromotion,
  CartItem,
  CartState,
  CustomerInfo,
} from "@/types/cart.types";
import { ProductsI } from "@/types/products";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ============================================
      // ESTADO INICIAL
      // ============================================
      items: [],
      customerInfo: null,
      promotion: null,
      isOpen: false,

      // ============================================
      // ACCIONES DEL CARRITO
      // ============================================

      /**
       * Agregar producto al carrito
       */
      addItem: (product: ProductsI) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          // Si ya existe, aumentar cantidad
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Si no existe, agregar nuevo item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            image: product.image,
            quantity: 1,
            category: product.category.name,
          };

          set({ items: [...items, newItem] });
        }
      },

      /**
       * Eliminar producto del carrito
       */
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      /**
       * Actualizar cantidad de un producto
       */
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * Aumentar cantidad en 1
       */
      increaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },

      /**
       * Disminuir cantidad en 1
       */
      decreaseQuantity: (productId: string) => {
        const item = get().items.find((i) => i.productId === productId);

        if (item && item.quantity <= 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          ),
        }));
      },

      /**
       * Vaciar carrito completamente
       */
      clearCart: () => {
        set({
          items: [],
          promotion: null,
        });
      },

      // ============================================
      // INFORMACIÓN DEL CLIENTE
      // ============================================

      /**
       * Guardar información del cliente
       */
      setCustomerInfo: (info: CustomerInfo) => {
        set({ customerInfo: info });
      },

      /**
       * Limpiar información del cliente
       */
      clearCustomerInfo: () => {
        set({ customerInfo: null });
      },

      // ============================================
      // PROMOCIONES
      // ============================================

      /**
       * Aplicar promoción
       */
      applyPromotion: (promotion: AppliedPromotion) => {
        set({ promotion });
      },

      /**
       * Remover promoción
       */
      removePromotion: () => {
        set({ promotion: null });
      },

      // ============================================
      // UI DEL CARRITO
      // ============================================

      /**
       * Abrir drawer del carrito
       */
      openCart: () => {
        set({ isOpen: true });
      },

      /**
       * Cerrar drawer del carrito
       */
      closeCart: () => {
        set({ isOpen: false });
      },

      /**
       * Toggle drawer del carrito
       */
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // ============================================
      // CÁLCULOS
      // ============================================

      /**
       * Calcular subtotal (sin descuentos)
       */
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      /**
       * Calcular descuento aplicado
       */
      getDiscount: () => {
        const { promotion } = get();
        if (!promotion) return 0;

        const subtotal = get().getSubtotal();
        return (subtotal * promotion.discount) / 100;
      },

      /**
       * Calcular total final
       */
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount);
      },

      /**
       * Contar total de items (suma de cantidades)
       */
      getItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      /**
       * Obtener cantidad de un producto específico
       */
      getItemQuantity: (productId: string) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },

      // ============================================
      // VALIDACIONES
      // ============================================

      /**
       * Verificar si hay items en el carrito
       */
      hasItems: () => {
        return get().items.length > 0;
      },

      /**
       * Verificar si se puede proceder al checkout
       */
      canCheckout: () => {
        const { items, customerInfo } = get();
        return (
          items.length > 0 &&
          customerInfo !== null &&
          customerInfo.name.trim() !== "" &&
          customerInfo.phone.trim() !== "" &&
          customerInfo.address.trim() !== ""
        );
      },
    }),
    {
      name: "desayunos-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
        promotion: state.promotion,
      }),
    }
  )
);
