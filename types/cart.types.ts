import { Product } from "@/app/generated/prisma/client";

// Item del carrito
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

// Información del cliente
export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

// Promoción aplicada
export interface AppliedPromotion {
  code: string;
  name: string;
  discount: number; // Porcentaje
}

// Estado completo del carrito
export interface CartState {
  // Estado
  items: CartItem[];
  customerInfo: CustomerInfo | null;
  promotion: AppliedPromotion | null;
  isOpen: boolean;

  // Acciones del carrito
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;

  // Información del cliente
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCustomerInfo: () => void;

  // Promociones
  applyPromotion: (promotion: AppliedPromotion) => void;
  removePromotion: () => void;

  // UI
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Cálculos
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemsCount: () => number;
  getItemQuantity: (productId: string) => number;

  // Validaciones
  hasItems: () => boolean;
  canCheckout: () => boolean;
}
