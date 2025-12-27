export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "culqi" | "yape" | "plin" | "efectivo";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  paymentId: string | null;
  notes: string | null;
  promotionCode: string | null;
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
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
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
