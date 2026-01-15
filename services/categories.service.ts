import { axiosInstance } from "@/lib/axios";
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  CategoriasResponse,
  CategoriaResponse,
  ReorderCategoriesDto,
} from "@/types/categories";

export const categoriasApi = {
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

  getCategoria: async (id: string) => {
    const { data } = await axiosInstance.get<CategoriaResponse>(
      `categories/${id}`
    );
    return data;
  },

  createCategoria: async (categoria: CreateCategoriaDto) => {
    const { data } = await axiosInstance.post<CategoriaResponse>(
      "categories",
      categoria
    );
    return data;
  },

  updateCategoria: async (id: string, categoria: UpdateCategoriaDto) => {
    const { data } = await axiosInstance.patch<CategoriaResponse>(
      `categories/${id}`,
      categoria
    );
    return data;
  },

  deleteCategoria: async (id: string) => {
    const { data } = await axiosInstance.delete<CategoriaResponse>(
      `categories/${id}`
    );
    return data;
  },

  activateCategoria: async (id: string) => {
    const { data } = await axiosInstance.patch<CategoriaResponse>(
      `categories/${id}`,
      { active: true }
    );
    return data;
  },

  reorderCategorias: async (categories: ReorderCategoriesDto) => {
    const { data } = await axiosInstance.patch("categories", categories);
    return data;
  },
};
