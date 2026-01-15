import { AddressDetails } from "./orders";

export type PaymentMethod = "yape" | "plin" | "culqi" | "efectivo";

export interface CheckoutCustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  email?: string;
  addressDetails?: AddressDetails;
}

export interface CheckoutData {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  customerInfo: CheckoutCustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  promotionCode?: string;
  receiptImage?: string;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  addressDetails?: AddressDetails;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  deliveryFee: number; // Mantenido para compatibilidad, siempre será 0
  total: number;
  paymentMethod: PaymentMethod;
  promotionCode?: string;
  notes?: string;
  receiptImage?: string;
  estimatedDeliveryTime?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentMethod: string;
    estimatedDeliveryTime?: string;
    createdAt: string;
  };
  message?: string;
}
