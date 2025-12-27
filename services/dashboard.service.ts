import { axiosInstance } from "@/lib/axios";
import { DashboardResponse } from "@/types/dashboard";

export const dashboardApi = {
  // GET: Obtener estadísticas del dashboard
  getStats: async () => {
    const { data } = await axiosInstance.get<DashboardResponse>(
      "/dashboard/stats"
    );
    return data;
  },
};
