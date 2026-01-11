import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/services/orders.service";
import {
  UpdateOrderDto,
  Order,
  OrderStatus,
  PaymentMethod,
} from "@/types/orders";
import { toast } from "sonner";
import { CreateOrderDto } from "@/types/checkout";

export const useOrders = (params?: {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  search?: string;
  startDate?: string;
  endDate?: string;
  includeStats?: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.getOrders(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      ordersApi.updateOrder(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData(["orders"]);

      queryClient.setQueryData(["orders"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((order: Order) =>
            order.id === id ? { ...order, ...data } : order
          ),
        };
      });

      return { previousOrders };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido actualizado exitosamente");
    },

    onError: (error: any, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      toast.error(error.response?.data?.error || "Error al actualizar pedido");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData(["orders"]);

      queryClient.setQueryData(["orders"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((order: Order) =>
            order.id === id ? { ...order, status } : order
          ),
        };
      });

      return { previousOrders };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Estado actualizado exitosamente");
    },

    onError: (error: any, _, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (order: CreateOrderDto) => ordersApi.createOrder(order),
    onSuccess: () => {
      toast.success("Pedido creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al crear pedido");
    },
  });
};
