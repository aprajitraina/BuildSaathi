"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, type LoginRequest, type RegisterRequest } from "../services/auth-service";
import { useAuthStore } from "../store/auth-store";
import { getApiErrorMessage } from "@/lib/api-client";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        contractor: response.contractor,
      });
      toast.success(`Welcome back, ${response.contractor.name}!`);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        contractor: response.contractor,
      });
      toast.success("Account created! Welcome to BuildSaathi.");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      router.push("/login");
    },
  });
}
