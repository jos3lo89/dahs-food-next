import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AppliedPromotion,
  CartItem,
  CartState,
  CustomerInfo,
} from "@/types/cart.types";
import { Producto } from "@/types/products";
import { PaymentMethod } from "@/types/checkout";

interface ExtendedCartState extends CartState {
  paymentMethod: PaymentMethod | null;
  receiptImage: string | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setReceiptImage: (url: string) => void;
  clearCheckoutData: () => void;
}

export const useCartStore = create<ExtendedCartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: null,
      promotion: null,
      isOpen: false,
      paymentMethod: null,
      receiptImage: null,

      addItem: (product: Producto) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id
        );
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
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

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

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

      increaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },

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

      clearCart: () => {
        set({
          items: [],
          promotion: null,
        });
      },

      setCustomerInfo: (info: CustomerInfo) => {
        set({ customerInfo: info });
      },

      clearCustomerInfo: () => {
        set({ customerInfo: null });
      },

      applyPromotion: (promotion: AppliedPromotion) => {
        set({ promotion });
      },

      removePromotion: () => {
        set({ promotion: null });
      },

      setPaymentMethod: (method: PaymentMethod | null) => {
        set({ paymentMethod: method });
      },

      setReceiptImage: (url: string) => {
        set({ receiptImage: url });
      },

      clearCheckoutData: () => {
        set({
          paymentMethod: null,
          receiptImage: null,
        });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const { promotion } = get();
        if (!promotion) return 0;
        const subtotal = get().getSubtotal();
        return (subtotal * promotion.discount) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount);
      },

      getItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },

      hasItems: () => {
        return get().items.length > 0;
      },

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
        paymentMethod: state.paymentMethod,
        receiptImage: state.receiptImage,
      }),
    }
  )
);
