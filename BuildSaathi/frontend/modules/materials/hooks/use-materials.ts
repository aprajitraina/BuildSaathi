import { useQuery } from "@tanstack/react-query";
import { materialsService } from "../services/materials-service";
import { QUERY_KEYS } from "@/lib/constants";

export function useMaterials(state?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.materials.all, state ?? "all"],
    queryFn: () => materialsService.getMaterials(state),
  });
}

export function useMaterialTrend(materialName?: string, state?: string) {
  return useQuery({
    queryKey: materialName ? [...QUERY_KEYS.materials.rates(materialName), state ?? "all"] : ["materials", "trend", "empty"],
    queryFn: () => materialsService.getRates(materialName!, state),
    enabled: !!materialName,
  });
}
