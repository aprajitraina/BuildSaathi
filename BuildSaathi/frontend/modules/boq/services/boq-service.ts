import { apiClient } from "@/lib/api-client";
import type { BOQ, BOQEstimationResponse, BOQLineItem, DSRRate } from "@/types/api";

export interface CreateBOQRequest {
  title: string;
  tenderId?: string;
  projectId?: string;
  state: string;
  workCategory: string;
  contingencyPercent?: number;
  overheadPercent?: number;
}

export interface CreateLineItemRequest {
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  dsrCode?: string;
  category: string;
  remarks?: string;
}

export interface RequestAIEstimateRequest {
  projectScope?: string;
  estimatedAreaSqm?: number;
  estimatedLengthKm?: number;
}

export const boqService = {
  async list(): Promise<BOQ[]> {
    const response = await apiClient.get<BOQ[]>("/boq");
    return response.data;
  },

  async getById(id: string): Promise<BOQ> {
    const response = await apiClient.get<BOQ>(`/boq/${id}`);
    return response.data;
  },

  async create(data: CreateBOQRequest): Promise<BOQ> {
    const response = await apiClient.post<BOQ>("/boq", data);
    return response.data;
  },

  async update(id: string, data: CreateBOQRequest): Promise<BOQ> {
    const response = await apiClient.put<BOQ>(`/boq/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/boq/${id}`);
  },

  async addLineItem(boqId: string, data: CreateLineItemRequest): Promise<BOQLineItem> {
    const response = await apiClient.post<BOQLineItem>(`/boq/${boqId}/line-items`, data);
    return response.data;
  },

  async updateLineItem(boqId: string, lineItemId: string, data: CreateLineItemRequest): Promise<BOQLineItem> {
    const response = await apiClient.put<BOQLineItem>(`/boq/${boqId}/line-items/${lineItemId}`, data);
    return response.data;
  },

  async deleteLineItem(boqId: string, lineItemId: string): Promise<void> {
    await apiClient.delete(`/boq/${boqId}/line-items/${lineItemId}`);
  },

  async getDSRRates(params: { state: string; category?: string; query?: string }): Promise<DSRRate[]> {
    const response = await apiClient.get<DSRRate[]>("/dsr-rates", { params });
    return response.data;
  },

  async requestAIEstimate(boqId: string, data?: RequestAIEstimateRequest): Promise<BOQEstimationResponse> {
    const response = await apiClient.post<BOQEstimationResponse>(`/boq/${boqId}/estimate`, data ?? {});
    return response.data;
  },

  async exportPdf(boqId: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/boq/${boqId}/export-pdf`, { responseType: "blob" });
    return response.data;
  },
};
