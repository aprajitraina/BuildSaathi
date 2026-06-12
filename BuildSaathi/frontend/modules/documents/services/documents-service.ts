import { apiClient } from "@/lib/api-client";
import type { DocumentItem, PaginatedResponse } from "@/types/api";

export interface UploadDocumentPayload {
  file: File;
  documentType: string;
  entityType?: string;
  entityId?: string;
}

export const documentsService = {
  async getDocuments(params: {
    entityType?: string;
    entityId?: string;
    pageNumber: number;
    pageSize: number;
  }, signal?: AbortSignal): Promise<PaginatedResponse<DocumentItem>> {
    const response = await apiClient.get<PaginatedResponse<DocumentItem>>("/documents", {
      params,
      signal,
    });
    return response.data;
  },

  async uploadFile(payload: UploadDocumentPayload): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("documentType", payload.documentType);
    if (payload.entityType) formData.append("entityType", payload.entityType);
    if (payload.entityId) formData.append("entityId", payload.entityId);

    const response = await apiClient.post<{ id: string }>("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getDownloadUrl(id: string): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/documents/${id}/download`);
    return response.data.url;
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },
};
