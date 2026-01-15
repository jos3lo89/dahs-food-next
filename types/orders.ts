export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "culqi" | "yape" | "plin" | "efectivo";

export type PaymentVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface AddressDetails {
  street: string;
  district?: string;
  city?: string;
  reference?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress: string;
  addressDetails?: AddressDetails | null;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  paymentId: string | null;
  receiptImage: string | null;
  paymentStatus: PaymentVerificationStatus | null;
  paymentVerificationNotes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  notes: string | null;
  promotionCode: string | null;
  estimatedDeliveryTime: string | null;
  confirmedAt: string | null;
  preparingAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    image: string;
    category: {
      name: string;
    };
  };
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  paymentStatus?: PaymentVerificationStatus;
  paymentVerificationNotes?: string;
  notes?: string;
  estimatedDeliveryTime?: string;
  confirmedAt?: string;
  preparingAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  stats?: OrderStats;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}
