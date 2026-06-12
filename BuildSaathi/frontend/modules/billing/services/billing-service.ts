import { apiClient } from "@/lib/api-client";
import type { Invoice, PaginatedResponse } from "@/types/api";

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate?: string;
  projectId?: string;
}

export const billingService = {
  async getInvoices(params: {
    pageNumber: number;
    pageSize: number;
    status?: string;
    search?: string;
  }, signal?: AbortSignal): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get<PaginatedResponse<Invoice>>("/billing/invoices", { params, signal });
    return response.data;
  },

  async getOverdue(): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>("/billing/overdue");
    return response.data;
  },

  async createInvoice(payload: CreateInvoiceRequest): Promise<{ id: string; invoiceNumber: string; status: string }> {
    const response = await apiClient.post("/billing/invoices", payload);
    return response.data;
  },

  async recordPayment(invoiceId: string, amount: number): Promise<void> {
    await apiClient.post(`/billing/invoices/${invoiceId}/payments`, { amount });
  },

  async exportInvoicePdf(invoiceId: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/billing/invoices/${invoiceId}/export-pdf`, { responseType: "blob" });
    return response.data;
  },
};
