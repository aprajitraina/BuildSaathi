import { apiClient } from "@/lib/api-client";
import type { Tender, TenderSummary, PaginatedResponse } from "@/types/api";

export interface TenderSearchParams {
  query?: string;
  state?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
  deadlineBefore?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const tenderService = {
  async search(params: TenderSearchParams): Promise<PaginatedResponse<Tender>> {
    const response = await apiClient.get<PaginatedResponse<Tender>>("/tenders", { params });
    return response.data;
  },

  async getById(id: string): Promise<Tender> {
    const response = await apiClient.get<Tender>(`/tenders/${id}`);
    return response.data;
  },

  async getSaved(): Promise<Tender[]> {
    const response = await apiClient.get<Tender[]>("/tenders/saved");
    return response.data;
  },

  async saveTender(id: string): Promise<void> {
    await apiClient.post(`/tenders/${id}/save`);
  },

  async unsaveTender(id: string): Promise<void> {
    await apiClient.delete(`/tenders/${id}/save`);
  },

  async requestSummary(id: string, forceRegenerate = false): Promise<TenderSummary> {
    const response = await apiClient.post<TenderSummary>(
      `/tenders/${id}/summarize`,
      undefined,
      { params: { forceRegenerate } }
    );
    return response.data;
  },

  async getSummary(id: string): Promise<TenderSummary | null> {
    try {
      const response = await apiClient.get<TenderSummary>(`/tenders/${id}/summary`);
      return response.data;
    } catch {
      return null;
    }
  },
};
