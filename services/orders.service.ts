import { axiosInstance } from "@/lib/axios";
import { CreateOrderDto, CreateOrderResponse } from "@/types/checkout";
import {
  UpdateOrderDto,
  OrdersResponse,
  OrderResponse,
  OrderStatus,
  PaymentMethod,
} from "@/types/orders";

export const ordersApi = {
  getOrders: async (params?: {
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
    startDate?: string;
    endDate?: string;
    includeStats?: boolean;
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.paymentMethod) {
      queryParams.append("paymentMethod", params.paymentMethod);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params?.includeStats) {
      queryParams.append("includeStats", "true");
    }

    const { data } = await axiosInstance.get<OrdersResponse>(
      `/orders?${queryParams.toString()}`
    );
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await axiosInstance.get<OrderResponse>(`/orders/${id}`);
    return data;
  },

  updateOrder: async (id: string, order: UpdateOrderDto) => {
    const { data } = await axiosInstance.patch<OrderResponse>(
      `/orders/${id}`,
      order
    );
    return data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const { data } = await axiosInstance.patch<OrderResponse>(`/orders/${id}`, {
      status,
    });
    return data;
  },

  createOrder: async (order: CreateOrderDto) => {
    const { data } = await axiosInstance.post<CreateOrderResponse>(
      "/orders/create",
      order
    );
    return data;
  },

  trackOrder: async (orderNumber: string) => {
    const { data } = await axiosInstance.get(`/orders/track/${orderNumber}`);
    return data;
  },
};
