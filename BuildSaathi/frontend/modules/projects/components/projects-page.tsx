"use client";

import { FolderKanban, Cpu, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { ModulePreviewLayout, GlowCard, AIInsightCard, MockBadge, AIBadge } from "@/components/shared/module-preview-layout";

const MOCK_PROJECTS = [
  { name: "NH-44 Road Widening — Phase 2", location: "Agra, UP", progress: 82, budget: "₹4.2Cr", status: "On Track", color: "teal" },
  { name: "Municipal Water Supply Scheme", location: "Meerut, UP", progress: 45, budget: "₹1.8Cr", status: "At Risk", color: "amber" },
  { name: "Govt. School Renovation Block C", location: "Lucknow, UP", progress: 100, budget: "₹65L", status: "Complete", color: "green" },
  { name: "Industrial Estate Drain Network", location: "Kanpur, UP", progress: 18, budget: "₹2.1Cr", status: "Started", color: "blue" },
];

const TIMELINE_PHASES = [
  { label: "Q2 2024", sub: "Beta Phase (Active)", active: true },
  { label: "Q3 2024", sub: "Material & Budget Integration", active: false },
  { label: "Q4 2024", sub: "Advanced Reporting & AI Insights", active: false },
];

const RESOURCE_ROWS = [
  { role: "Concrete Lead", site: "NH-44 Widening", util: 95 },
  { role: "Crane Operator", site: "Municipal Water", util: 60 },
  { role: "Safety Inspector", site: "All Sites", util: 80 },
  { role: "Site Engineer", site: "Drain Network", util: 40 },
];

function progressColor(p: number) {
  if (p >= 100) return "bg-teal-500";
  if (p >= 60) return "bg-[#F97316]";
  if (p >= 30) return "bg-amber-500";
  return "bg-blue-500";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    "On Track": "border-teal-500/25 bg-teal-500/10 text-teal-400",
    "At Risk": "border-amber-500/25 bg-amber-500/10 text-amber-400",
    "Complete": "border-green-500/25 bg-green-500/10 text-green-400",
    "Started": "border-blue-500/25 bg-blue-500/10 text-blue-400",
  };
  return map[status] ?? "border-white/10 bg-white/5 text-white/50";
}

export function ProjectsPage() {
  return (
    <ModulePreviewLayout
      moduleName="Projects Command Center"
      moduleIcon={FolderKanban}
      tagline="BuildSaathi Projects"
      description="Track active construction sites with real-time milestones, AI-driven insights, budget health monitoring, and resource allocation — all in one command center."
      devProgress={72}
    >
      {/* ── Stat Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIInsightCard label="Active Projects" value="4" sub="2 on track" color="orange" />
        <AIInsightCard label="Budget Utilized" value="68%" sub="₹6.3Cr of ₹9.2Cr" color="violet" />
        <AIInsightCard label="Overall Progress" value="61%" sub="Across all sites" color="teal" />
        <AIInsightCard label="Overdue Tasks" value="3" sub="Needs attention" color="blue" />
      </div>

      {/* ── Site Progress Cards ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-white/70">Site Progress Overview</h2>
          <MockBadge />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {MOCK_PROJECTS.map((proj) => (
            <GlowCard key={proj.name} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/85 leading-snug">{proj.name}</p>
                  <p className="text-xs text-white/35 mt-0.5">{proj.location}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusBadge(proj.status)}`}>
                  {proj.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/40">Progress</span>
                <span className="text-xs font-bold text-white/70">{proj.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${progressColor(proj.progress)}`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/35">
                <span>Contract Value</span>
                <span className="font-semibold text-white/65">{proj.budget}</span>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* ── AI Insights + Resource Allocation ─────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* AI Project Insights */}
        <GlowCard accent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">AI Project Insights</h3>
            </div>
            <AIBadge />
          </div>
          <div className="space-y-2.5">
            {[
              { icon: AlertTriangle, color: "text-amber-400", text: "Municipal Water project is 15 days behind schedule. Recommend resource boost." },
              { icon: TrendingUp, color: "text-teal-400", text: "NH-44 Widening is 8% ahead of target. Budget savings of ₹18L projected." },
              { icon: CheckCircle2, color: "text-green-400", text: "School Renovation complete. Final inspection pending sign-off." },
              { icon: Clock, color: "text-blue-400", text: "Drain Network groundwork starting. Monsoon risk window: 45 days." },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div key={i} className="flex items-start gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2.5">
                  <ItemIcon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.color}`} />
                  <p className="text-xs leading-relaxed text-white/50">{item.text}</p>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* Resource Allocation */}
        <GlowCard className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white/85">Resource Allocation</h3>
            <MockBadge />
          </div>
          <div className="space-y-3">
            {RESOURCE_ROWS.map((row) => (
              <div key={row.role}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs font-medium text-white/70">{row.role}</p>
                    <p className="text-[10px] text-white/35">{row.site}</p>
                  </div>
                  <span className="text-xs font-bold text-white/55">{row.util}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${row.util >= 85 ? "bg-amber-500" : "bg-violet-500"}`}
                    style={{ width: `${row.util}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* ── Budget Health ─────────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-[#F97316]" />
          <h3 className="text-sm font-semibold text-white/85">Budget Health</h3>
          <MockBadge />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total Contract", value: "₹9.15Cr", sub: "All projects" },
            { label: "Spent to Date", value: "₹6.3Cr", sub: "68.9%" },
            { label: "Remaining", value: "₹2.85Cr", sub: "31.1% buffer" },
            { label: "Projected Savings", value: "₹22L", sub: "2.4% of total" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/[0.04] border border-white/[0.07] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-white/80">{item.value}</p>
              <p className="text-[10px] text-white/35 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Feature Roadmap Timeline ────────────────────────── */}
      <GlowCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Feature Roadmap Preview</h3>
        <div className="relative flex items-start gap-4 overflow-x-auto pb-2">
          {/* Line */}
          <div className="absolute left-0 right-0 top-[18px] h-0.5 bg-gradient-to-r from-[#F97316] via-white/10 to-white/5" />
          {TIMELINE_PHASES.map((phase, i) => (
            <div key={i} className="relative shrink-0 flex flex-col items-center gap-2" style={{ minWidth: 160 }}>
              <div className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${
                phase.active
                  ? "border-[#F97316] bg-[#F97316]/20 text-[#F97316]"
                  : "border-white/15 bg-white/[0.04] text-white/30"
              }`}>
                {i + 1}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${phase.active ? "text-[#F97316]" : "text-white/40"}`}>{phase.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{phase.sub}</p>
                {phase.active && (
                  <span className="mt-1 inline-block rounded-full bg-[#F97316]/15 border border-[#F97316]/20 px-2 py-0.5 text-[9px] font-bold text-[#F97316]/80 uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlowCard>
    </ModulePreviewLayout>
  );
}
