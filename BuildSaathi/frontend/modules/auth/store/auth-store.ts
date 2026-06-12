import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContractorProfile } from "@/types/api";
import { clearAuthTokens, setAccessTokenCookie, setAuthTokens, clearAccessTokenCookie } from "@/lib/token-storage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  contractor: ContractorProfile | null;
  isAuthenticated: boolean;

  setAuth: (params: {
    accessToken: string;
    refreshToken: string;
    contractor: ContractorProfile;
  }) => void;
  updateContractor: (contractor: Partial<ContractorProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      contractor: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, contractor }) => {
        setAuthTokens(accessToken, refreshToken);
        set({ accessToken, refreshToken, contractor, isAuthenticated: true });
      },

      updateContractor: (partial) =>
        set((state) => ({
          contractor: state.contractor ? { ...state.contractor, ...partial } : null,
        })),

      clearAuth: () => {
        clearAuthTokens();
        set({ accessToken: null, refreshToken: null, contractor: null, isAuthenticated: false });
      },
    }),
    {
      name: "buildsaathi-auth",
      // Only persist tokens + contractor; derive isAuthenticated on rehydration
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        contractor: state.contractor,
        isAuthenticated: !!state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessTokenCookie(state.accessToken);
        } else {
          clearAccessTokenCookie();
        }
      },
    }
  )
);
