import axios, { type AxiosInstance, type AxiosError } from "axios";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/lib/token-storage";

// Central Axios instance — all API calls go through this.
// Auth token injection and refresh are handled here.
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — inject Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const payload = refreshToken ? { refreshToken } : {};

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          payload,
          { withCredentials: true }
        );

        setAuthTokens(data.accessToken, data.refreshToken ?? null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch {
        clearAuthTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };

// Typed API error helper
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export function isApiError(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error);
}

export function isRequestCanceled(error: unknown): boolean {
  return isApiError(error) && error.code === "ERR_CANCELED";
}

export function getApiErrorMessage(error: unknown, fallback = "An unexpected error occurred."): string {
  if (isRequestCanceled(error)) {
    return "Request cancelled.";
  }

  if (isApiError(error)) {
    const payload = error.response?.data;
    if (payload?.detail) return payload.detail;
    if (payload?.title) return payload.title;
    const firstValidationError = payload?.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : undefined;
    if (firstValidationError) return firstValidationError;
    if (typeof error.message === "string" && error.message.trim().length > 0) return error.message;
  }
  if (error instanceof Error && error.message.trim().length > 0) return error.message;
  return fallback;
}
