import { axiosInstance } from "@/lib/axios";
import type {
  IngredientResponse,
  IngredientsResponse,
} from "@/types/ingredients";

export const ingredientsApi = {
  getIngredients: async (productId: string) => {
    const { data } = await axiosInstance.get<IngredientsResponse>(
      `productos/${productId}/ingredients`
    );
    return data;
  },

  createIngredient: async (productId: string, name: string) => {
    const { data } = await axiosInstance.post<IngredientResponse>(
      `productos/${productId}/ingredients`,
      { name }
    );
    return data;
  },

  deleteIngredient: async (productId: string, ingredientId: string) => {
    const { data } = await axiosInstance.delete<{ success: boolean; message?: string }>(
      `productos/${productId}/ingredients/${ingredientId}`
    );
    return data;
  },
};
