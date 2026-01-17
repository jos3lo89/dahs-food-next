export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "culqi" | "yape" | "plin" | "efectivo";

export type PaymentVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface PaymentReceipt {
  id: string;
  orderId: string;
  imageUrl: string;
  status: PaymentVerificationStatus;
  notes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  receipts?: PaymentReceipt[];
  latestReceipt?: PaymentReceipt | null;
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

export interface PaymentReceiptResponse {
  success: boolean;
  data: {
    receipt: PaymentReceipt;
    order: Order;
  };
  message?: string;
}

// trackOrder
export enum TrackOrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum TrackOrderPaymentStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface TrackOrderResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    addressDetails: {
      city: string;
      street: string;
      district: string;
      reference: string;
    };
    subtotal: number;
    discount: number;
    deliveryFee: string;
    total: number;
    status: TrackOrderStatus;
    receiptImage: string | null;
    paymentMethod: string;
    paymentId: string | null;
    paymentStatus: TrackOrderPaymentStatus;
    paymentVerificationNotes: string | null;
    verifiedBy: string | null;
    verifiedAt: string | null;
    latestReceipt: PaymentReceipt | null;
    receipts: PaymentReceipt[];
    notes: string;
    estimatedDeliveryTime: string;
    confirmedAt: string | null;
    preparingAt: string | null;
    outForDeliveryAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    promotionCode: string | null;
    items: Array<{
      id: string;
      orderId: string;
      productId: string;
      quantity: number;
      price: number;
      subtotal: number;
      createdAt: string;
      product: {
        id: string;
        name: string;
        image: string;
        category: {
          name: string;
        };
      };
    }>;
  };
}
