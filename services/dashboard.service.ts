import { axiosInstance } from "@/lib/axios";
import { DashboardResponse } from "@/types/dashboard";

export const dashboardApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get<DashboardResponse>(
      "/dashboard/stats"
    );
    return data;
  },
};
