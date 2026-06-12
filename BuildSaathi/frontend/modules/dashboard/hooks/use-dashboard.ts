import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service";
import { QUERY_KEYS } from "@/lib/constants";

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => dashboardService.getSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
