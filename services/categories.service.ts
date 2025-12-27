import { axiosInstance } from "@/lib/axios";
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  CategoriasResponse,
  CategoriaResponse,
  ReorderCategoriesDto,
} from "@/types/categories";

export const categoriasApi = {
  // GET: Obtener todas las categorías
  getCategorias: async (params?: { active?: boolean; search?: string }) => {
    const queryParams = new URLSearchParams();

    if (params?.active !== undefined) {
      queryParams.append("active", String(params.active));
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const { data } = await axiosInstance.get<CategoriasResponse>(
      `categories?${queryParams.toString()}`
    );
    return data;
  },

  // GET: Obtener una categoría por ID
  getCategoria: async (id: string) => {
    const { data } = await axiosInstance.get<CategoriaResponse>(
      `categories/${id}`
    );
    return data;
  },

  // POST: Crear categoría
  createCategoria: async (categoria: CreateCategoriaDto) => {
    const { data } = await axiosInstance.post<CategoriaResponse>(
      "categories",
      categoria
    );
    return data;
  },

  // PATCH: Actualizar categoría
  updateCategoria: async (id: string, categoria: UpdateCategoriaDto) => {
    const { data } = await axiosInstance.patch<CategoriaResponse>(
      `categories/${id}`,
      categoria
    );
    return data;
  },

  // DELETE: Desactivar categoría (soft delete)
  deleteCategoria: async (id: string) => {
    const { data } = await axiosInstance.delete<CategoriaResponse>(
      `categories/${id}`
    );
    return data;
  },

  // PATCH: Activar categoría
  activateCategoria: async (id: string) => {
    const { data } = await axiosInstance.patch<CategoriaResponse>(
      `categories/${id}`,
      { active: true }
    );
    return data;
  },

  // PATCH: Reordenar categorías
  reorderCategorias: async (categories: ReorderCategoriesDto) => {
    const { data } = await axiosInstance.patch("categories", categories);
    return data;
  },
};
