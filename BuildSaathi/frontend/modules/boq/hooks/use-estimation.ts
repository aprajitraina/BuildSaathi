import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import {
  estimationService,
  type CreateIntelligenceEstimateForm,
} from "../services/estimation-service";
import { getApiErrorMessage } from "@/lib/api-client";

export function useEstimationList() {
  return useQuery({
    queryKey: QUERY_KEYS.estimation.all,
    queryFn: () => estimationService.list(),
  });
}

export function useEstimation(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.estimation.detail(id),
    queryFn: () => estimationService.getById(id),
    enabled: !!id && id !== "new",
  });
}

export function useCreateEstimationFromForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIntelligenceEstimateForm) => estimationService.createFromForm(data),
    onSuccess: (estimate) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.estimation.all });
      toast.success("Estimate created from building norms");
      router.push(`/boq/${estimate.id}`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e, "Failed to create estimate")),
  });
}

export function useUploadEstimationDocx() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      location,
      estimateType,
      tenderId,
    }: {
      file: File;
      location: string;
      estimateType?: string;
      tenderId?: string;
    }) => estimationService.uploadDocx(file, location, estimateType, tenderId),
    onSuccess: (estimate) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.estimation.all });
      toast.success("Estimate imported from document");
      router.push(`/boq/${estimate.id}`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e, "Upload failed")),
  });
}

export function useValidateEstimation(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => estimationService.validate(estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.estimation.detail(estimateId) });
      toast.success("Validation complete");
    },
    onError: (e) => toast.error(getApiErrorMessage(e, "Validation failed")),
  });
}

export function useImproveEstimationAi(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => estimationService.improveWithAi(estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.estimation.detail(estimateId) });
      toast.success("AI normalization applied");
    },
    onError: (e) => toast.error(getApiErrorMessage(e, "AI improvement failed")),
  });
}
