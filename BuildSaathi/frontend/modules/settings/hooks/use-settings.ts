import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService, type UpdateSettingsProfileRequest } from "../services/settings-service";
import { useAuthStore } from "@/modules/auth/store/auth-store";

const SETTINGS_PROFILE_KEY = ["settings", "profile"] as const;

export function useSettingsProfile() {
  return useQuery({
    queryKey: SETTINGS_PROFILE_KEY,
    queryFn: () => settingsService.getProfile(),
  });
}

export function useUpdateSettingsProfile() {
  const queryClient = useQueryClient();
  const updateContractor = useAuthStore((s) => s.updateContractor);

  return useMutation({
    mutationFn: (payload: UpdateSettingsProfileRequest) => settingsService.updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_PROFILE_KEY });
      updateContractor({
        name: profile.name,
        phone: profile.phone,
        companyName: profile.companyName,
        gstNumber: profile.gstNumber,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        preferredCategories: profile.preferredCategories,
      });
      toast.success("Settings updated");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });
}
