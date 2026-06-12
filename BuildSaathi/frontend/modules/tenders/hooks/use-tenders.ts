import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenderService, type TenderSearchParams } from "../services/tender-service";
import { QUERY_KEYS } from "@/lib/constants";

export function useTenders(params: TenderSearchParams) {
  const queryParams = { ...params } as Record<string, unknown>;
  return useQuery({
    queryKey: QUERY_KEYS.tenders.search(queryParams),
    queryFn: () => tenderService.search(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTender(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.tenders.detail(id),
    queryFn: () => tenderService.getById(id),
    enabled: !!id,
  });
}

export function useSavedTenders() {
  return useQuery({
    queryKey: QUERY_KEYS.tenders.saved,
    queryFn: () => tenderService.getSaved(),
  });
}

export function useSaveTender() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isSaved }: { id: string; isSaved: boolean }) =>
      isSaved ? tenderService.unsaveTender(id) : tenderService.saveTender(id),
    onSuccess: (_data, { id, isSaved }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenders.saved });
      // Optimistically update the tender detail cache
      queryClient.setQueryData(QUERY_KEYS.tenders.detail(id), (old: ReturnType<typeof useTender>["data"]) =>
        old ? { ...old, isSaved: !isSaved } : old
      );
      toast.success(isSaved ? "Tender removed from saved" : "Tender saved");
    },
    onError: () => {
      toast.error("Failed to update saved tender");
    },
  });
}

export function useTenderSummary(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.tenders.summary(id),
    queryFn: () => tenderService.getSummary(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // summaries are stable for 1 hour
  });
}

export function useRequestSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenderId, forceRegenerate = false }: { tenderId: string; forceRegenerate?: boolean }) =>
      tenderService.requestSummary(tenderId, forceRegenerate),
    onSuccess: (summary, variables) => {
      queryClient.setQueryData(QUERY_KEYS.tenders.summary(variables.tenderId), summary);
      toast.success("AI summary generated");
    },
    onError: () => {
      toast.error("Failed to generate summary. Please try again.");
    },
  });
}
