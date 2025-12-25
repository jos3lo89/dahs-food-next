import { axiosInstance } from "@/lib/axios";
import { ProductsI } from "@/types/products";

export const productsApi = {
  getProducts: async (categorySlug: string, isActive: boolean) => {
    const { data } = await axiosInstance.get<ProductsI[]>(
      `products?category=${categorySlug}&active=${isActive}`
    );
    return data;
  },
};
