import { apiClient } from "@/lib/api-client";
import type {
  EstimationEnvelope,
  IntelligenceEstimate,
  IntelligenceEstimateListItem,
} from "@/types/api";

function assertOk<T>(env: EstimationEnvelope<T>): T {
  if (!env.success || env.data == null) {
    const msg = env.errors?.length ? env.errors.join(" ") : "Request failed";
    throw new Error(msg);
  }
  return env.data;
}

export interface CreateIntelligenceEstimateForm {
  areaSqFt: number;
  location: string;
  floors?: number | null;
  finishType?: string | null;
  estimateType?: string;
  tenderId?: string;
}

export const estimationService = {
  async list(): Promise<IntelligenceEstimateListItem[]> {
    const { data } = await apiClient.get<EstimationEnvelope<IntelligenceEstimateListItem[]>>("/estimation");
    return assertOk(data);
  },

  async getById(id: string): Promise<IntelligenceEstimate> {
    const { data } = await apiClient.get<EstimationEnvelope<IntelligenceEstimate>>(`/estimation/${id}`);
    return assertOk(data);
  },

  async createFromForm(body: CreateIntelligenceEstimateForm): Promise<IntelligenceEstimate> {
    const { data } = await apiClient.post<EstimationEnvelope<IntelligenceEstimate>>("/estimation/form", body);
    return assertOk(data);
  },

  async uploadDocx(file: File, location: string, estimateType?: string, tenderId?: string): Promise<IntelligenceEstimate> {
    const form = new FormData();
    form.append("file", file);
    form.append("location", location);
    if (estimateType) form.append("estimateType", estimateType);
    if (tenderId) form.append("tenderId", tenderId);
    const { data } = await apiClient.post<EstimationEnvelope<IntelligenceEstimate>>("/estimation/upload", form);
    return assertOk(data);
  },

  async validate(estimateId: string): Promise<IntelligenceEstimate> {
    const { data } = await apiClient.post<EstimationEnvelope<IntelligenceEstimate>>("/estimation/validate", {
      estimateId,
    });
    return assertOk(data);
  },

  async improveWithAi(estimateId: string): Promise<IntelligenceEstimate> {
    const { data } = await apiClient.post<EstimationEnvelope<IntelligenceEstimate>>("/estimation/improve-ai", {
      estimateId,
    });
    return assertOk(data);
  },
};
