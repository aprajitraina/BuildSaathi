import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  boqService,
  type CreateBOQRequest,
  type CreateLineItemRequest,
  type RequestAIEstimateRequest
} from "../services/boq-service";
import { QUERY_KEYS } from "@/lib/constants";

export function useBOQList() {
  return useQuery({
    queryKey: QUERY_KEYS.boq.all,
    queryFn: () => boqService.list(),
  });
}

export function useBOQ(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.boq.detail(id),
    queryFn: () => boqService.getById(id),
    enabled: !!id && id !== "new",
  });
}

export function useCreateBOQ() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBOQRequest) => boqService.create(data),
    onSuccess: (boq) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.all });
      toast.success("Estimate created");
      router.push(`/boq/${boq.id}`);
    },
    onError: () => {
      toast.error("Failed to create estimate");
    },
  });
}

export function useDeleteBOQ() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => boqService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.all });
      toast.success("Estimate deleted");
      router.push("/boq");
    },
    onError: () => {
      toast.error("Failed to delete estimate");
    },
  });
}

export function useUpdateBOQ(boqId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBOQRequest) => boqService.update(boqId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.detail(boqId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.all });
      toast.success("Estimate updated");
    },
    onError: () => {
      toast.error("Failed to update estimate");
    },
  });
}

export function useAddLineItem(boqId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLineItemRequest) => boqService.addLineItem(boqId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.detail(boqId) });
    },
    onError: () => {
      toast.error("Failed to add line item");
    },
  });
}

export function useUpdateLineItem(boqId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lineItemId, data }: { lineItemId: string; data: CreateLineItemRequest }) =>
      boqService.updateLineItem(boqId, lineItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.detail(boqId) });
      toast.success("Line item updated");
    },
    onError: () => {
      toast.error("Failed to update line item");
    },
  });
}

export function useDeleteLineItem(boqId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lineItemId: string) => boqService.deleteLineItem(boqId, lineItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boq.detail(boqId) });
      toast.success("Line item removed");
    },
  });
}

export function useDSRRates(state: string, query?: string) {
  return useQuery({
    queryKey: ["dsr-rates", state, query],
    queryFn: () => boqService.getDSRRates({ state, query }),
    enabled: !!state,
    staleTime: 30 * 60 * 1000,
  });
}

export function useExportBOQPdf(boqId: string) {
  return useMutation({
    mutationFn: () => boqService.exportPdf(boqId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `boq-${boqId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("BOQ PDF exported");
    },
    onError: () => {
      toast.error("Failed to export BOQ PDF");
    },
  });
}

export function useRequestAIEstimate(boqId: string) {
  return useMutation({
    mutationFn: (data?: RequestAIEstimateRequest) => boqService.requestAIEstimate(boqId, data),
    onSuccess: (result) => {
      toast.success(`Received ${result.suggestedItems.length} AI suggestions`);
    },
    onError: () => {
      toast.error("Failed to generate AI suggestions");
    },
  });
}
