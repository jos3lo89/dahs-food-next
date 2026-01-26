import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ingredientsApi } from "@/services/ingredients.service";

export const useIngredients = (productId?: string) => {
  return useQuery({
    queryKey: ["ingredientes", productId],
    queryFn: () => ingredientsApi.getIngredients(productId ?? ""),
    enabled: !!productId,
  });
};

export const useCreateIngredient = (productId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      ingredientsApi.createIngredient(productId ?? "", name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes", productId] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Ingrediente agregado");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al agregar ingrediente");
    },
  });
};

export const useDeleteIngredient = (productId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ingredientId: string) =>
      ingredientsApi.deleteIngredient(productId ?? "", ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes", productId] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Ingrediente eliminado");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al eliminar ingrediente");
    },
  });
};
