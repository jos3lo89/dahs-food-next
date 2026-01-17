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
import { AxiosError } from "axios";

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
            order.id === id ? { ...order, ...data } : order,
          ),
        };
      });

      return { previousOrders };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error: any, _, context) => {
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
            order.id === id ? { ...order, status } : order,
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

export const useApprovePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiptId }: { receiptId: string }) =>
      ordersApi.approvePayment(receiptId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Pago aprobado");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al aprobar pago");
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiptId, notes }: { receiptId: string; notes: string }) =>
      ordersApi.rejectPayment(receiptId, notes),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Pago rechazado");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al rechazar pago");
    },
  });
};

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, imageUrl }: { orderId: string; imageUrl: string }) =>
      ordersApi.createReceipt(orderId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
      toast.success("Comprobante enviado para verificación");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Error al enviar el comprobante",
      );
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (order: CreateOrderDto) => ordersApi.createOrder(order),
    onSuccess: () => {
      toast.success("Pedido creado exitosamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Error al crear pedido");
      } else {
        toast.error("Error al crear pedido");
      }
    },
  });
};
