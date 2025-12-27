import { axiosInstance } from "@/lib/axios";
import {
  CreatePromocionDto,
  UpdatePromocionDto,
  PromocionesResponse,
  PromocionResponse,
  PromotionType,
} from "@/types/promotion";

export const promocionesApi = {
  // GET: Obtener todas las promociones
  getPromociones: async (params?: {
    active?: boolean;
    featured?: boolean;
    type?: PromotionType;
    search?: string;
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

    const { data } = await axiosInstance.get<PromocionesResponse>(
      `/promociones?${queryParams.toString()}`
    );
    return data;
  },

  // GET: Obtener una promoción por ID
  getPromocion: async (id: string) => {
    const { data } = await axiosInstance.get<PromocionResponse>(
      `/promociones/${id}`
    );
    return data;
  },

  // POST: Crear promoción
  createPromocion: async (promocion: CreatePromocionDto) => {
    const { data } = await axiosInstance.post<PromocionResponse>(
      "/promociones",
      promocion
    );
    return data;
  },

  // PATCH: Actualizar promoción
  updatePromocion: async (id: string, promocion: UpdatePromocionDto) => {
    const { data } = await axiosInstance.patch<PromocionResponse>(
      `/promociones/${id}`,
      promocion
    );
    return data;
  },

  // DELETE: Desactivar promoción (soft delete)
  deletePromocion: async (id: string) => {
    const { data } = await axiosInstance.delete<PromocionResponse>(
      `/promociones/${id}`
    );
    return data;
  },

  // PATCH: Activar promoción
  activatePromocion: async (id: string) => {
    const { data } = await axiosInstance.patch<PromocionResponse>(
      `/promociones/${id}`,
      { active: true }
    );
    return data;
  },
};
