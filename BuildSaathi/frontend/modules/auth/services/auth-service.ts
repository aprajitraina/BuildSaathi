import { apiClient } from "@/lib/api-client";
import type { AuthResponse } from "@/types/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  state: string;
  city: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async refresh(refreshToken?: string): Promise<Pick<AuthResponse, "accessToken" | "refreshToken">> {
    const response = await apiClient.post("/auth/refresh", refreshToken ? { refreshToken } : {});
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getMe(): Promise<AuthResponse["contractor"]> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
