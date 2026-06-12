"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, Bell, Mail, Rocket } from "lucide-react";
import { UPCOMING_FEATURE_MAILTO } from "@/lib/app-nav-config";

interface ModulePreviewLayoutProps {
  moduleName: string;
  moduleIcon: LucideIcon;
  tagline: string;
  description: string;
  devProgress?: number;
  children: React.ReactNode;
}

export function ModulePreviewLayout({
  moduleName,
  moduleIcon: Icon,
  tagline,
  description,
  devProgress = 72,
  children,
}: ModulePreviewLayoutProps) {
  return (
    <div className="w-full space-y-6">
      {/* ── Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#F97316]/20 bg-gradient-to-br from-[#1C1F2B] via-[#21253a] to-[#181b27] px-7 py-8">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F97316]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-[#F97316]/6 blur-2xl" />
        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/15 border border-[#F97316]/20">
                <Icon className="h-5 w-5 text-[#F97316]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F97316]/80">
                    {tagline}
                  </p>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400/80">
                    Module In Progress
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                  {moduleName}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/50 mb-5">{description}</p>

            {/* Not-in-production notice */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2.5 mb-5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/70" />
              <p className="text-xs text-amber-300/70 leading-relaxed">
                This module is currently not active in production. Explore mock previews and request early access below.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`${UPCOMING_FEATURE_MAILTO}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-[#F97316]/20 transition-all hover:bg-[#ea580c] hover:shadow-[#F97316]/30"
              >
                <Mail className="h-3.5 w-3.5" />
                Mail Owner
              </a>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/70 transition-all hover:bg-white/[0.1] hover:text-white">
                <Bell className="h-3.5 w-3.5" />
                Notify Me
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#F97316]/20 bg-[#F97316]/10 px-3.5 py-2 text-xs font-semibold text-[#F97316]/80 transition-all hover:bg-[#F97316]/15 hover:text-[#F97316]">
                <Rocket className="h-3.5 w-3.5" />
                Request Early Access
              </button>
            </div>
          </div>

          {/* Right — progress card */}
          <div className="shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 min-w-[180px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
              Development Progress
            </p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-[#F97316]">{devProgress}%</span>
              <span className="text-xs text-white/30 mb-1">complete</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#fb923c] transition-all duration-700"
                style={{ width: `${devProgress}%` }}
              />
            </div>
            <p className="mt-3 text-[10px] text-white/30 leading-relaxed">
              BuildSaathi OS v1.5
              <br />
              [{moduleName}]
            </p>
          </div>
        </div>
      </div>

      {/* ── Module-specific content ─────────────────────────── */}
      {children}
    </div>
  );
}

/** A reusable frosted glass "glow card" for preview widgets */
export function GlowCard({
  children,
  className = "",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        accent
          ? "border-[#F97316]/20 bg-gradient-to-br from-[#F97316]/[0.07] to-transparent shadow-[#F97316]/5 hover:shadow-[#F97316]/10"
          : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.12]"
      } ${className}`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F97316] to-[#F97316]/0" />
      )}
      {children}
    </div>
  );
}

/** A small AI-insight card */
export function AIInsightCard({
  label,
  value,
  sub,
  color = "orange",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "orange" | "violet" | "teal" | "blue";
}) {
  const colorMap = {
    orange: { bg: "bg-[#F97316]/10", text: "text-[#F97316]", border: "border-[#F97316]/15" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/15" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/15" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/15" },
  };
  const c = colorMap[color];
  return (
    <div className={`rounded-xl border p-4 ${c.border} ${c.bg}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      {sub && <p className="text-xs text-white/35 mt-0.5">{sub}</p>}
    </div>
  );
}

/** Mock badge */
export function MockBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-400/80">
      Mock Data
    </span>
  );
}

/** AI Assisted badge */
export function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-400/80">
      ✦ AI Assisted
    </span>
  );
}
