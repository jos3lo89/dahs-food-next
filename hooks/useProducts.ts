import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/services/products.service";
import {
  CreateProductoDto,
  UpdateProductoDto,
  Producto,
} from "@/types/products";
import { toast } from "sonner";

// Hook para obtener productos
export const useProductos = (params?: {
  category?: string;
  active?: boolean;
  featured?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productsApi.getProductos(params),
  });
};

// Hook para obtener un producto
export const useProducto = (id: string) => {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: () => productsApi.getProducto(id),
    enabled: !!id,
  });
};

// Hook para obtener categorías
export const useCategorias = (active?: boolean) => {
  return useQuery({
    queryKey: ["categorias", active],
    queryFn: () => productsApi.getCategorias(active),
  });
};

// Hook para crear producto
export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: CreateProductoDto) =>
      productsApi.createProducto(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al crear producto");
    },
  });
};

// Hook para actualizar producto (con optimistic update)
export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoDto }) =>
      productsApi.updateProducto(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previousProductos = queryClient.getQueryData(["productos"]);

      queryClient.setQueryData(["productos"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((producto: Producto) =>
            producto.id === id ? { ...producto, ...data } : producto
          ),
        };
      });

      return { previousProductos };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto actualizado exitosamente");
    },

    onError: (error: any, variables, context) => {
      if (context?.previousProductos) {
        queryClient.setQueryData(["productos"], context.previousProductos);
      }
      toast.error(
        error.response?.data?.error || "Error al actualizar producto"
      );
    },
  });
};

// Hook para toggle active (con optimistic update)
export const useToggleProductoActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      productsApi.updateProducto(id, { active }),

    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previousProductos = queryClient.getQueryData(["productos"]);

      queryClient.setQueryData(["productos"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((producto: Producto) =>
            producto.id === id ? { ...producto, active } : producto
          ),
        };
      });

      return { previousProductos };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success(
        variables.active
          ? "Producto activado exitosamente"
          : "Producto desactivado exitosamente"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousProductos) {
        queryClient.setQueryData(["productos"], context.previousProductos);
      }
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    },
  });
};

// Hook para toggle featured (con optimistic update)
export const useToggleProductoFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      productsApi.updateProducto(id, { featured }),

    onMutate: async ({ id, featured }) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previousProductos = queryClient.getQueryData(["productos"]);

      queryClient.setQueryData(["productos"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((producto: Producto) =>
            producto.id === id ? { ...producto, featured } : producto
          ),
        };
      });

      return { previousProductos };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success(
        variables.featured
          ? "Producto destacado exitosamente"
          : "Producto quitado de destacados"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousProductos) {
        queryClient.setQueryData(["productos"], context.previousProductos);
      }
      toast.error(error.response?.data?.error || "Error al cambiar destacado");
    },
  });
};

// Hook para eliminar producto
export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto desactivado exitosamente");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Error al desactivar producto"
      );
    },
  });
};
