"use client";

import { FileSearch, Cpu, TrendingUp, Trophy, Clock, ArrowRight, CheckCircle2, AlertTriangle, Target } from "lucide-react";
import { ModulePreviewLayout, GlowCard, AIInsightCard, MockBadge, AIBadge } from "@/components/shared/module-preview-layout";

const PIPELINE_TENDERS = [
  {
    id: "T-2024-089",
    title: "NH-48 Road Widening Package C",
    authority: "NHAI, UP Circle",
    value: "₹24.8Cr",
    deadline: "Jun 28, 2024",
    stage: "Applied",
    match: 94,
    daysLeft: 8,
  },
  {
    id: "T-2024-091",
    title: "Urban Water Supply Scheme — Meerut",
    authority: "Jal Nigam, UP",
    value: "₹8.2Cr",
    deadline: "Jul 5, 2024",
    stage: "Shortlisted",
    match: 88,
    daysLeft: 15,
  },
  {
    id: "T-2024-094",
    title: "District Hospital Boundary Wall",
    authority: "CPWD, Lucknow",
    value: "₹1.4Cr",
    deadline: "Jul 12, 2024",
    stage: "Evaluating",
    match: 76,
    daysLeft: 22,
  },
  {
    id: "T-2024-085",
    title: "School Campus Renovation — Phase 3",
    authority: "UP Basic Ed. Dept.",
    value: "₹85L",
    deadline: "Closed",
    stage: "Won",
    match: 100,
    daysLeft: 0,
  },
];

const APPROVAL_WORKFLOW = [
  { step: "Document Upload", status: "done", note: "BOQ, Eligibility, PAN uploaded" },
  { step: "Pre-qualification", status: "done", note: "Financial & technical PQ cleared" },
  { step: "Technical Bid", status: "active", note: "Bid under evaluation — 3 days ETA" },
  { step: "Financial Bid Opening", status: "pending", note: "Scheduled Jul 2, 2024" },
  { step: "Award / LoA", status: "pending", note: "Pending financial bid outcome" },
];

function stageStyle(stage: string) {
  const map: Record<string, string> = {
    Applied: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    Shortlisted: "bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]",
    Evaluating: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    Won: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    Lost: "bg-red-500/10 border-red-500/20 text-red-400",
  };
  return map[stage] ?? "bg-white/5 border-white/10 text-white/40";
}

function matchColor(pct: number) {
  if (pct >= 90) return "text-teal-400";
  if (pct >= 75) return "text-[#F97316]";
  return "text-amber-400";
}

export function TendersPage() {
  return (
    <ModulePreviewLayout
      moduleName="Tender Intelligence Hub"
      moduleIcon={FileSearch}
      tagline="BuildSaathi Tenders"
      description="AI-powered tender discovery, bid tracking pipeline, approval workflow automation, and win-rate analytics — built to help contractors find and win more government tenders."
      devProgress={80}
    >
      {/* ── Stat Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIInsightCard label="Active Bids" value="3" sub="₹34.4Cr in pipeline" color="orange" />
        <AIInsightCard label="Win Rate" value="68%" sub="vs 42% industry avg" color="teal" />
        <AIInsightCard label="Upcoming Deadlines" value="2" sub="Within 10 days" color="violet" />
        <AIInsightCard label="Tenders Won (YTD)" value="5" sub="₹12.8Cr value" color="blue" />
      </div>

      {/* ── Tender Pipeline Board ──────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-white/85">Active Bid Pipeline</h3>
          </div>
          <MockBadge />
        </div>
        <div className="space-y-3">
          {PIPELINE_TENDERS.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white/30">{t.id}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${stageStyle(t.stage)}`}>
                      {t.stage}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white/80 leading-snug">{t.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">{t.authority}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-white/70">{t.value}</p>
                  {t.daysLeft > 0 && (
                    <p className={`text-[10px] mt-0.5 ${t.daysLeft <= 10 ? "text-amber-400" : "text-white/30"}`}>
                      {t.daysLeft}d left
                    </p>
                  )}
                </div>
              </div>
              {/* AI Match Score */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-white/25">AI Match</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${t.match >= 90 ? "bg-teal-500" : t.match >= 75 ? "bg-[#F97316]" : "bg-amber-500"}`}
                    style={{ width: `${t.match}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${matchColor(t.match)}`}>{t.match}%</span>
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Approval Workflow + AI Recommendations ──────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Approval Workflow */}
        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white/85">Bid Approval Workflow</h3>
            <MockBadge />
          </div>
          <p className="text-[10px] text-white/30 mb-3 font-medium uppercase tracking-wider">NH-48 Road Widening Package C</p>
          <div className="relative space-y-0">
            {APPROVAL_WORKFLOW.map((step, i) => (
              <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Connector line */}
                {i < APPROVAL_WORKFLOW.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-white/[0.06]" />
                )}
                {/* Status icon */}
                <div className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  step.status === "done"
                    ? "bg-teal-500/20 border border-teal-500/30"
                    : step.status === "active"
                    ? "bg-[#F97316]/20 border-2 border-[#F97316]/50"
                    : "bg-white/[0.05] border border-white/[0.1]"
                }`}>
                  {step.status === "done" && <CheckCircle2 className="h-3 w-3 text-teal-400" />}
                  {step.status === "active" && <div className="h-2 w-2 rounded-full bg-[#F97316] animate-pulse" />}
                  {step.status === "pending" && <div className="h-1.5 w-1.5 rounded-full bg-white/20" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${
                    step.status === "done" ? "text-teal-400" : step.status === "active" ? "text-[#F97316]" : "text-white/35"
                  }`}>{step.step}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{step.note}</p>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* AI Recommendation Panel */}
        <GlowCard accent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">AI Bid Advisor</h3>
            </div>
            <AIBadge />
          </div>
          <div className="space-y-2.5">
            {[
              { icon: Trophy, color: "text-[#F97316]", text: "NH-48 Package C: 94% match. Strong fit based on your NH-44 track record and Class I license." },
              { icon: AlertTriangle, color: "text-amber-400", text: "Urban Water Scheme: GST compliance certificate expires Aug 2024. Renew before financial bid." },
              { icon: TrendingUp, color: "text-teal-400", text: "Win probability for CPWD projects: 71% based on your last 8 bids. Consider prioritizing." },
              { icon: Clock, color: "text-blue-400", text: "2 tender deadlines in the next 10 days. Prepare documents 3 days early to avoid portal congestion." },
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
      </div>

      {/* ── Win Rate Analytics ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Avg Bid Value", value: "₹6.9Cr", sub: "Per tender bid" },
          { label: "Technical Score", value: "82/100", sub: "Avg NHAI scoring" },
          { label: "L1 Wins", value: "3 of 5", sub: "Lowest bidder wins" },
          { label: "Next Deadline", value: "8 days", sub: "NH-48 Technical Bid" },
        ].map((item) => (
          <GlowCard key={item.label} className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-white/75">{item.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
          </GlowCard>
        ))}
      </div>

      {/* ── Smart Discovery Teaser ────────────────────────── */}
      <GlowCard accent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/15 border border-[#F97316]/20">
            <FileSearch className="h-5 w-5 text-[#F97316]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/85">Smart Tender Discovery</h3>
            <p className="mt-1 text-xs text-white/40 leading-relaxed max-w-xl">
              AI-powered matching engine that scans GeM, CPWD, NIC, and state portals daily — alerting you only to tenders that match your license class, trade, and financial capacity. Never miss a relevant tender again.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["GeM Integration", "CPWD Portal", "NIC e-Tender", "State PWD", "Real-time Alerts"].map((tag) => (
                <span key={tag} className="rounded-full border border-[#F97316]/15 bg-[#F97316]/[0.07] px-2.5 py-1 text-[10px] font-medium text-[#F97316]/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 px-3 py-1.5 text-xs font-bold text-[#F97316]/70">
              Coming Q3 <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </GlowCard>
    </ModulePreviewLayout>
  );
}
