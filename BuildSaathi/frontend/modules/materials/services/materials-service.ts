import { apiClient } from "@/lib/api-client";
import type { MaterialRate } from "@/types/api";

export const materialsService = {
  async getMaterials(state?: string): Promise<MaterialRate[]> {
    const response = await apiClient.get<MaterialRate[]>("/materials", { params: { state } });
    return response.data;
  },

  async getRates(materialName: string, state?: string): Promise<MaterialRate[]> {
    const response = await apiClient.get<MaterialRate[]>(`/materials/${encodeURIComponent(materialName)}/rates`, {
      params: { state },
    });
    return response.data;
  },
};
