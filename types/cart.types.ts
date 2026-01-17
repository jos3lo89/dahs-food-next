import { Producto } from "./products";

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

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  notes: string;
  district: string;
  city: string;
  reference: string;
}

export interface AppliedPromotion {
  code: string;
  name: string;
  discount: number;
}
export interface CartState {
  items: CartItem[];
  customerInfo: CustomerInfo | null;
  promotion: AppliedPromotion | null;
  isOpen: boolean;
  addItem: (product: Producto) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCustomerInfo: () => void;
  applyPromotion: (promotion: AppliedPromotion) => void;
  removePromotion: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemsCount: () => number;
  getItemQuantity: (productId: string) => number;
  hasItems: () => boolean;
  canCheckout: () => boolean;
}
