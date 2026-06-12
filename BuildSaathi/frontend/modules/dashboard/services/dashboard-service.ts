import { apiClient } from "@/lib/api-client";
import type { DashboardSummary } from "@/types/api";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>("/dashboard/summary");
    return response.data;
  },

  async getAlerts(): Promise<{ id: string; message: string; type: string; createdAt: string }[]> {
    const response = await apiClient.get("/dashboard/alerts");
    return response.data;
  },
};
