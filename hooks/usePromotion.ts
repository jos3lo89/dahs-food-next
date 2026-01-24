import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promocionesApi } from "@/services/promotion.service";
import {
  CreatePromocionDto,
  UpdatePromocionDto,
  Promocion,
  PromotionType,
} from "@/types/promotion";
import { toast } from "sonner";

export const usePromociones = (params?: {
  active?: boolean;
  featured?: boolean;
  type?: PromotionType;
  search?: string;
  current?: boolean;
}) => {
  return useQuery({
    queryKey: ["promociones", params],
    queryFn: () => promocionesApi.getPromociones(params),
  });
};

export const usePromocion = (id: string) => {
  return useQuery({
    queryKey: ["promocion", id],
    queryFn: () => promocionesApi.getPromocion(id),
    enabled: !!id,
  });
};

export const useCreatePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promocion: CreatePromocionDto) =>
      promocionesApi.createPromocion(promocion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success("Promoción creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al crear promoción");
    },
  });
};

export const useUpdatePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromocionDto }) =>
      promocionesApi.updatePromocion(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["promociones"] });
      const previousPromociones = queryClient.getQueryData(["promociones"]);

      queryClient.setQueryData(["promociones"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((promocion: Promocion) =>
            promocion.id === id ? { ...promocion, ...data } : promocion
          ),
        };
      });

      return { previousPromociones };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success("Promoción actualizada exitosamente");
    },

    onError: (error: any, variables, context) => {
      if (context?.previousPromociones) {
        queryClient.setQueryData(["promociones"], context.previousPromociones);
      }
      toast.error(
        error.response?.data?.error || "Error al actualizar promoción"
      );
    },
  });
};

export const useTogglePromocionActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      promocionesApi.updatePromocion(id, { active }),

    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ["promociones"] });
      const previousPromociones = queryClient.getQueryData(["promociones"]);

      queryClient.setQueryData(["promociones"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((promocion: Promocion) =>
            promocion.id === id ? { ...promocion, active } : promocion
          ),
        };
      });

      return { previousPromociones };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success(
        variables.active
          ? "Promoción activada exitosamente"
          : "Promoción desactivada exitosamente"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousPromociones) {
        queryClient.setQueryData(["promociones"], context.previousPromociones);
      }
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    },
  });
};

export const useTogglePromocionFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      promocionesApi.updatePromocion(id, { featured }),

    onMutate: async ({ id, featured }) => {
      await queryClient.cancelQueries({ queryKey: ["promociones"] });
      const previousPromociones = queryClient.getQueryData(["promociones"]);

      queryClient.setQueryData(["promociones"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((promocion: Promocion) =>
            promocion.id === id ? { ...promocion, featured } : promocion
          ),
        };
      });

      return { previousPromociones };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success(
        variables.featured
          ? "Promoción destacada en slider"
          : "Promoción quitada del slider"
      );
    },

    onError: (error: any, _, context) => {
      if (context?.previousPromociones) {
        queryClient.setQueryData(["promociones"], context.previousPromociones);
      }
      toast.error(error.response?.data?.error || "Error al cambiar destacado");
    },
  });
};

export const useDeletePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promocionesApi.deletePromocion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promociones"] });
      toast.success("Promoción desactivada exitosamente");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Error al desactivar promoción"
      );
    },
  });
};
