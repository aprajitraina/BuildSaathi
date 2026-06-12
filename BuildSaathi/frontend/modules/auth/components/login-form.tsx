"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks/use-auth";

export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-5">
      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          className="h-10 bg-background border-border/70 focus-visible:ring-[#F97316]/30 focus-visible:border-[#F97316]/60 transition-colors rounded-lg"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-[#F97316] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className="h-10 bg-background border-border/70 focus-visible:ring-[#F97316]/30 focus-visible:border-[#F97316]/60 transition-colors rounded-lg"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="h-10 w-full font-semibold bg-[#F97316] text-white hover:bg-[#ea580c] border-0 shadow-sm shadow-[#F97316]/20 transition-all rounded-lg"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in…" : "Sign in to BuildSaathi"}
      </Button>

      {/* Demo hint */}
      <div className="rounded-xl border border-border/50 bg-muted/40 px-4 py-3">
        <p className="text-[11px] font-semibold text-foreground mb-0.5">Try demo account</p>
        <p className="text-[11px] text-muted-foreground">
          Email:{" "}
          <button
            type="button"
            className="font-mono text-[#F97316] hover:underline"
            onClick={() => setValue("email", "demo@buildsaathi.in")}
          >
            demo@buildsaathi.in
          </button>{" "}
          · Password:{" "}
          <button
            type="button"
            className="font-mono text-muted-foreground hover:text-[#F97316] transition-colors"
            onClick={() => setValue("password", "Demo@1234")}
          >
            Demo@1234
          </button>
        </p>
      </div>

      {/* Sign up link */}
      <p className="text-center text-xs text-muted-foreground">
        New to BuildSaathi?{" "}
        <Link href="/signup" className="font-semibold text-[#F97316] hover:underline">
          Create a free account
        </Link>
      </p>
    </form>
  );
}
