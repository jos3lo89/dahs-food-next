import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriasApi } from "@/services/categories.service";
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  Categoria,
  ReorderCategoriesDto,
} from "@/types/categories";
import { toast } from "sonner";

export const useCategorias = (params?: {
  active?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["categorias", params],
    queryFn: () => categoriasApi.getCategorias(params),
  });
};

export const useCategoria = (id: string) => {
  return useQuery({
    queryKey: ["categoria", id],
    queryFn: () => categoriasApi.getCategoria(id),
    enabled: !!id,
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoria: CreateCategoriaDto) =>
      categoriasApi.createCategoria(categoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al crear categoría");
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaDto }) =>
      categoriasApi.updateCategoria(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["categorias"] });
      const previousCategorias = queryClient.getQueryData(["categorias"]);

      queryClient.setQueryData(["categorias"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((categoria: Categoria) =>
            categoria.id === id ? { ...categoria, ...data } : categoria
          ),
        };
      });

      return { previousCategorias };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría actualizada exitosamente");
    },

    onError: (error: any, variables, context) => {
      if (context?.previousCategorias) {
        queryClient.setQueryData(["categorias"], context.previousCategorias);
      }
      toast.error(
        error.response?.data?.error || "Error al actualizar categoría"
      );
    },
  });
};

export const useToggleCategoriaActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      categoriasApi.updateCategoria(id, { active }),

    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ["categorias"] });
      const previousCategorias = queryClient.getQueryData(["categorias"]);

      queryClient.setQueryData(["categorias"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((categoria: Categoria) =>
            categoria.id === id ? { ...categoria, active } : categoria
          ),
        };
      });

      return { previousCategorias };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success(
        variables.active
          ? "Categoría activada exitosamente"
          : "Categoría desactivada exitosamente"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousCategorias) {
        queryClient.setQueryData(["categorias"], context.previousCategorias);
      }
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    },
  });
};

export const useReorderCategorias = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: ReorderCategoriesDto) =>
      categoriasApi.reorderCategorias(categories),

    onMutate: async (categories) => {
      await queryClient.cancelQueries({ queryKey: ["categorias"] });
      const previousCategorias = queryClient.getQueryData(["categorias"]);

      queryClient.setQueryData(["categorias"], (old: any) => {
        if (!old?.data) return old;

        const categoriesMap = new Map(
          categories.categories.map((c) => [c.id, c.order])
        );

        return {
          ...old,
          data: old.data
            .map((cat: Categoria) => ({
              ...cat,
              order: categoriesMap.get(cat.id) ?? cat.order,
            }))
            .sort((a: Categoria, b: Categoria) => a.order - b.order),
        };
      });

      return { previousCategorias };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Orden actualizado exitosamente");
    },

    onError: (error: any, _, context) => {
      if (context?.previousCategorias) {
        queryClient.setQueryData(["categorias"], context.previousCategorias);
      }
      toast.error(error.response?.data?.error || "Error al reordenar");
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriasApi.deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría desactivada exitosamente");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Error al desactivar categoría"
      );
    },
  });
};
