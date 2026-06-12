"use client";

import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  Bell,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useDashboard } from "../hooks/use-dashboard";
import { formatCurrency, formatDate } from "@/lib/utils";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${
        accent
          ? "border-[#F97316]/20 bg-gradient-to-br from-[#F97316]/5 to-transparent"
          : "border-border/60"
      }`}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#F97316] to-[#F97316]/20" />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              accent ? "text-[#F97316]" : "text-foreground"
            }`}
          >
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            accent ? "bg-[#F97316]/10 text-[#F97316]" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function AIBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/40 px-2.5 py-1">
      <Sparkles className="h-3 w-3 text-violet-500" />
      <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}

export function DashboardPage() {
  const contractor = useAuthStore((s) => s.contractor);
  const { data, isLoading } = useDashboard();

  const firstName = contractor?.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Active Tenders",
      value: isLoading ? "—" : data?.activeTendersCount ?? 0,
      sub: "Open for bidding",
      icon: FileText,
      accent: false,
    },
    {
      label: "Active Projects",
      value: isLoading ? "—" : data?.activeProjectsCount ?? 0,
      sub: "Currently executing",
      icon: Activity,
      accent: false,
    },
    {
      label: "Payment Due",
      value: isLoading ? "—" : formatCurrency(data?.paymentDueAmount ?? 0, "INR", true),
      sub: "Outstanding receivables",
      icon: TrendingUp,
      accent: true,
    },
    {
      label: "Unread Alerts",
      value: isLoading ? "—" : data?.unreadNotificationsCount ?? 0,
      sub: "Need attention",
      icon: Bell,
      accent: false,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#F97316]/15 bg-gradient-to-br from-[#1C1F2B] via-[#232638] to-[#1C1F2B] px-7 py-8 shadow-md">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F97316]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#F97316]/5 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]/80">
              BuildSaathi Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1.5 max-w-md text-sm text-white/50 leading-relaxed">
              Here&apos;s an overview of your construction business today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              asChild
              size="sm"
              className="bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg shadow-[#F97316]/20 border-0"
            >
              <Link href="/boq/new">
                <Calculator className="mr-1.5 h-3.5 w-3.5" />
                New Estimate
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/boq">
                View Estimates
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            icon={s.icon}
            accent={s.accent}
          />
        ))}
      </div>

      {/* Quick actions + AI suggestions row */}
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        {/* Upcoming deadlines */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h2>
            </div>
          </div>
          <div className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 skeleton mx-4 my-2 rounded-lg" />
              ))
            ) : data?.upcomingDeadlines?.length ? (
              data.upcomingDeadlines.map((d) => (
                <Link
                  key={d.tenderId}
                  href={`/tenders/${d.tenderId}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/50 group"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-[#F97316] transition-colors">
                      {d.tenderTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Due {formatDate(d.deadline)}</p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      d.daysRemaining <= 3
                        ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                        : d.daysRemaining <= 7
                        ? "bg-orange-50 text-[#F97316] dark:bg-orange-950/40"
                        : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    }`}
                  >
                    {d.daysRemaining}d left
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </div>

        {/* AI suggestions panel */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-violet-200/50 dark:border-violet-800/30 bg-gradient-to-br from-violet-50/80 to-white dark:from-violet-950/20 dark:to-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AIBadge text="AI Powered" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">AI Estimation Copilot</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Get instant BOQ suggestions, DSR rate hints, and quantity estimates powered by AI.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 w-full bg-[#F97316] text-white hover:bg-[#ea580c] border-0 shadow-sm shadow-[#F97316]/20"
            >
              <Link href="/boq/new">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Start AI Estimate
              </Link>
            </Button>
          </div>

          {/* Recent activity widget */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {data?.recentActivity?.length ? (
                data.recentActivity.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F97316] shrink-0" />
                    <div>
                      <p className="text-xs text-foreground leading-snug">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
