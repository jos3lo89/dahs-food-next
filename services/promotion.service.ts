import { axiosInstance } from "@/lib/axios";
import {
  CreatePromocionDto,
  UpdatePromocionDto,
  PromocionesResponse,
  PromocionResponse,
  PromotionType,
} from "@/types/promotion";

export const promocionesApi = {
  getPromociones: async (params?: {
    active?: boolean;
    featured?: boolean;
    type?: PromotionType;
    search?: string;
    current?: boolean;
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.active !== undefined) {
      queryParams.append("active", String(params.active));
    }
    if (params?.featured !== undefined) {
      queryParams.append("featured", String(params.featured));
    }
    if (params?.type) {
      queryParams.append("type", params.type);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.current !== undefined) {
      queryParams.append("current", String(params.current));
    }

    const { data } = await axiosInstance.get<PromocionesResponse>(
      `/promociones?${queryParams.toString()}`
    );
    return data;
  },

  getPromocion: async (id: string) => {
    const { data } = await axiosInstance.get<PromocionResponse>(
      `/promociones/${id}`
    );
    return data;
  },

  createPromocion: async (promocion: CreatePromocionDto) => {
    const { data } = await axiosInstance.post<PromocionResponse>(
      "/promociones",
      promocion
    );
    return data;
  },

  updatePromocion: async (id: string, promocion: UpdatePromocionDto) => {
    const { data } = await axiosInstance.patch<PromocionResponse>(
      `/promociones/${id}`,
      promocion
    );
    return data;
  },

  deletePromocion: async (id: string) => {
    const { data } = await axiosInstance.delete<PromocionResponse>(
      `/promociones/${id}`
    );
    return data;
  },

  activatePromocion: async (id: string) => {
    const { data } = await axiosInstance.patch<PromocionResponse>(
      `/promociones/${id}`,
      { active: true }
    );
    return data;
  },
};
