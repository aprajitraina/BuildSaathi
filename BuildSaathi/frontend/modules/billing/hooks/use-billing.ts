import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingService, type CreateInvoiceRequest } from "../services/billing-service";
import { QUERY_KEYS } from "@/lib/constants";
import { getApiErrorMessage, isRequestCanceled } from "@/lib/api-client";
import type { Invoice, PaginatedResponse } from "@/types/api";
import { toast } from "sonner";

export function useInvoices(params: { pageNumber: number; pageSize: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.billing.invoices(params),
    queryFn: ({ signal }) => billingService.getInvoices(params, signal),
    placeholderData: (previousData) => previousData,
  });
}

export function useOverdueInvoices() {
  return useQuery({
    queryKey: QUERY_KEYS.billing.overdue,
    queryFn: () => billingService.getOverdue(),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoiceRequest) => billingService.createInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.overdue });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success("Invoice created");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create invoice")),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, amount }: { invoiceId: string; amount: number }) =>
      billingService.recordPayment(invoiceId, amount),
    onMutate: async ({ invoiceId, amount }) => {
      await queryClient.cancelQueries({ queryKey: ["billing", "invoices"] });
      const previousInvoiceQueries = queryClient.getQueriesData<PaginatedResponse<Invoice>>({
        queryKey: ["billing", "invoices"],
      });
      const previousOverdue = queryClient.getQueryData<Invoice[]>(QUERY_KEYS.billing.overdue);

      queryClient.setQueriesData<PaginatedResponse<Invoice>>(
        { queryKey: ["billing", "invoices"] },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((invoice) => {
              if (invoice.id !== invoiceId) return invoice;

              const paymentAmount = Math.min(Math.max(amount, 0), invoice.balanceDue);
              const paidAmount = invoice.paidAmount + paymentAmount;
              const balanceDue = Math.max(invoice.balanceDue - paymentAmount, 0);
              const status = balanceDue === 0 ? "paid" : "partiallypaid";

              return { ...invoice, paidAmount, balanceDue, status };
            }),
          };
        }
      );

      queryClient.setQueryData<Invoice[]>(QUERY_KEYS.billing.overdue, (current) =>
        (current ?? []).filter((invoice) => !(invoice.id === invoiceId && Math.min(Math.max(amount, 0), invoice.balanceDue) >= invoice.balanceDue))
      );

      return { previousInvoiceQueries, previousOverdue };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.overdue });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success("Payment recorded");
    },
    onError: (error, _variables, context) => {
      context?.previousInvoiceQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      queryClient.setQueryData(QUERY_KEYS.billing.overdue, context?.previousOverdue);
      if (!isRequestCanceled(error)) {
        toast.error(getApiErrorMessage(error, "Failed to record payment"));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.overdue });
    },
  });
}

export function useExportInvoicePdf() {
  return useMutation({
    mutationFn: (invoiceId: string) => billingService.exportInvoicePdf(invoiceId),
    onSuccess: (blob, invoiceId) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice PDF exported");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to export invoice PDF"));
    },
  });
}
