import { apiClient } from "@/lib/api-client";

export interface SettingsProfile {
  contractorId: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstNumber?: string;
  panNumber?: string;
  city: string;
  state: string;
  address?: string;
  preferredCategories: string[];
}

export interface UpdateSettingsProfileRequest {
  name: string;
  phone: string;
  companyName: string;
  gstNumber?: string;
  panNumber?: string;
  city: string;
  state: string;
  address?: string;
  preferredCategories?: string[];
}

export const settingsService = {
  async getProfile(): Promise<SettingsProfile> {
    const response = await apiClient.get<SettingsProfile>("/settings/profile");
    return response.data;
  },

  async updateProfile(payload: UpdateSettingsProfileRequest): Promise<SettingsProfile> {
    const response = await apiClient.put<SettingsProfile>("/settings/profile", payload);
    return response.data;
  },
};
