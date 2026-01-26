import { z } from "zod";

export const createIngredientSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
});

export type CreateIngredientDto = z.infer<typeof createIngredientSchema>;
