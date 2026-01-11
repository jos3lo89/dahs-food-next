export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "culqi" | "yape" | "plin" | "efectivo";

// ✅ NUEVO - Detalles de dirección estructurados
export interface AddressDetails {
  street: string; // Calle y número
  district?: string; // Distrito
  city?: string; // Ciudad
  reference?: string; // Referencia
  coordinates?: {
    // Coordenadas GPS (opcional)
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
  notes: string | null;
  promotionCode: string | null;
  estimatedDeliveryTime: string | null; // ✅ NUEVO
  confirmedAt: string | null; // ✅ NUEVO
  preparingAt: string | null; // ✅ NUEVO
  deliveredAt: string | null; // ✅ NUEVO
  cancelledAt: string | null; // ✅ NUEVO
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
  notes?: string;
  estimatedDeliveryTime?: string; // ✅ NUEVO
  confirmedAt?: string; // ✅ NUEVO
  preparingAt?: string; // ✅ NUEVO
  deliveredAt?: string; // ✅ NUEVO
  cancelledAt?: string; // ✅ NUEVO
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
