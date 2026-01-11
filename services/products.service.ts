import { axiosInstance } from "@/lib/axios";
import {
  CreateProductoDto,
  ProductoResponse,
  ProductosResponse,
  ProductsI,
  UpdateProductoDto,
  Category,
} from "@/types/products";

export const productsApi = {
  getProducts: async (categorySlug: string, isActive: boolean) => {
    const { data } = await axiosInstance.get<ProductsI[]>(
      `products?category=${categorySlug}&active=${isActive}`
    );
    return data;
  },

  getProductos: async (params?: {
    category?: string;
    active?: boolean;
    featured?: boolean;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.active !== undefined) {
      queryParams.append("active", String(params.active));
    }
    if (params?.featured !== undefined) {
      queryParams.append("featured", String(params.featured));
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const { data } = await axiosInstance.get<ProductosResponse>(
      `productos?${queryParams.toString()}`
    );
    return data;
  },

  getProducto: async (id: string) => {
    const { data } = await axiosInstance.get<ProductoResponse>(
      `productos/${id}`
    );
    return data;
  },

  createProducto: async (producto: CreateProductoDto) => {
    const { data } = await axiosInstance.post<ProductoResponse>(
      "productos",
      producto
    );
    return data;
  },

  updateProducto: async (id: string, producto: UpdateProductoDto) => {
    const { data } = await axiosInstance.patch<ProductoResponse>(
      `productos/${id}`,
      producto
    );
    return data;
  },

  deleteProducto: async (id: string) => {
    const { data } = await axiosInstance.delete<ProductoResponse>(
      `productos/${id}`
    );
    return data;
  },

  activateProducto: async (id: string) => {
    const { data } = await axiosInstance.patch<ProductoResponse>(
      `productos/${id}`,
      { active: true }
    );
    return data;
  },

  getCategorias: async (active?: boolean) => {
    const queryParams = new URLSearchParams();
    if (active !== undefined) {
      queryParams.append("active", String(active));
    }

    const { data } = await axiosInstance.get<{
      success: boolean;
      data: Category[];
    }>(`categorias?${queryParams.toString()}`);
    return data;
  },
};
