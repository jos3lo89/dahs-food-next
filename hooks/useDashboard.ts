import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboard.service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 30000,
  });
};
