export interface Ingredient {
  id: string;
  name: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export type IngredientSummary = Pick<Ingredient, "id" | "name">;

export interface IngredientsResponse {
  success: boolean;
  data: Ingredient[];
}

export interface IngredientResponse {
  success: boolean;
  data: Ingredient;
  message?: string;
}
