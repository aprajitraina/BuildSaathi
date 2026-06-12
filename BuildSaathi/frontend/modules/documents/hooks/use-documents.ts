import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsService, type UploadDocumentPayload } from "../services/documents-service";
import { QUERY_KEYS } from "@/lib/constants";
import { getApiErrorMessage, isRequestCanceled } from "@/lib/api-client";
import type { DocumentItem, PaginatedResponse } from "@/types/api";
import { toast } from "sonner";

export function useDocuments(entityType: string | undefined, entityId: string | undefined, pageNumber: number, pageSize: number) {
  const params = { entityType, entityId, pageNumber, pageSize };
  return useQuery({
    queryKey: [...QUERY_KEYS.documents.byEntity(entityType, entityId), pageNumber, pageSize],
    queryFn: ({ signal }) => documentsService.getDocuments(params, signal),
    placeholderData: (previousData) => previousData,
  });
}

export function useUploadDocument(entityType?: string, entityId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentsService.uploadFile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents.byEntity(entityType, entityId) });
      toast.success("Document uploaded");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to upload document")),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.deleteDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.documents.all });
      const previousQueries = queryClient.getQueriesData<PaginatedResponse<DocumentItem>>({
        queryKey: QUERY_KEYS.documents.all,
      });

      queryClient.setQueriesData<PaginatedResponse<DocumentItem>>({ queryKey: QUERY_KEYS.documents.all }, (current) => {
        if (!current) return current;
        const itemExists = current.items.some((item) => item.id === id);
        return {
          ...current,
          items: current.items.filter((item) => item.id !== id),
          totalCount: itemExists ? Math.max(0, current.totalCount - 1) : current.totalCount,
        };
      });

      return { previousQueries };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents.all });
      toast.success("Document deleted");
    },
    onError: (error, _id, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (!isRequestCanceled(error)) {
        toast.error(getApiErrorMessage(error, "Failed to delete document"));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents.all });
    },
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (id: string) => documentsService.getDownloadUrl(id),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
    onError: (error) => {
      if (!isRequestCanceled(error)) {
        toast.error(getApiErrorMessage(error, "Failed to generate download URL"));
      }
    },
  });
}
