"use client";

import { useState } from "react";
import {
  FileText, AlertCircle, AlertTriangle, CheckCircle2, Cpu,
  ChevronDown, ChevronRight, Building2, Layers, HardHat,
  TrendingUp, Ruler, Calculator, X,
} from "lucide-react";
import type { ParsedEstimate, BOQItem } from "@/lib/excel-parser";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: decimals });
}

function fmtCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Categorize item description into a work type */
function detectWorkCategory(desc: string): { label: string; color: string } {
  const d = desc.toLowerCase();
  if (/earth|excavat|trenche/.test(d)) return { label: "Earthwork", color: "text-amber-400" };
  if (/cement concrete|c\.c\.|plain|pcc/.test(d)) return { label: "Plain Concrete", color: "text-blue-400" };
  if (/reinforced|rcc|r\.c\.c|beam|slab|column/.test(d)) return { label: "RCC Work", color: "text-violet-400" };
  if (/steel|reinforce|iron|rebar/.test(d)) return { label: "Steel Work", color: "text-[#F97316]" };
  if (/brick|masonry/.test(d)) return { label: "Masonry", color: "text-red-400" };
  if (/plaster|cement plast/.test(d)) return { label: "Plastering", color: "text-teal-400" };
  if (/distemper|paint|enamel/.test(d)) return { label: "Painting", color: "text-green-400" };
  if (/floor|flooring/.test(d)) return { label: "Flooring", color: "text-cyan-400" };
  if (/centering|shuttering|form work/.test(d)) return { label: "Shuttering", color: "text-indigo-400" };
  if (/filling|fill/.test(d)) return { label: "Filling", color: "text-yellow-400" };
  if (/grill|grills|m\.s\./i.test(d)) return { label: "MS Fabrication", color: "text-pink-400" };
  if (/plinth|protection/.test(d)) return { label: "Plinth Work", color: "text-emerald-400" };
  if (/carriage|transport|lead/.test(d)) return { label: "Carriage", color: "text-slate-400" };
  return { label: "Civil Work", color: "text-white/50" };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({
  label, value, sub, color = "orange",
}: { label: string; value: string; sub?: string; color?: "orange" | "violet" | "teal" | "blue" }) {
  const colors = {
    orange: { bg: "bg-[#F97316]/10", border: "border-[#F97316]/20", text: "text-[#F97316]", bar: "from-[#F97316]" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", bar: "from-violet-500" },
    teal: { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400", bar: "from-teal-500" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", bar: "from-blue-500" },
  }[color];

  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.bar} to-transparent`} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</p>
      <p className={`text-xl font-bold ${colors.text} leading-tight`}>{value}</p>
      {sub && <p className="text-[10px] text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function ItemRow({ item, idx }: { item: BOQItem; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const cat = detectWorkCategory(item.description);
  const hasSubSections = item.subSections.length > 0;
  const hasDetail = item.dimensionRows.length > 0 || hasSubSections;

  const totalAmount = hasSubSections
    ? item.subSections.reduce((s, ss) => s + (ss.amount ?? 0), 0)
    : item.amount;

  return (
    <div className="border-b border-white/[0.05] last:border-0">
      {/* Main row */}
      <div
        className={`flex items-start gap-3 px-4 py-3 transition-colors ${
          hasDetail ? "cursor-pointer hover:bg-white/[0.03]" : ""
        }`}
        onClick={() => hasDetail && setExpanded((v) => !v)}
      >
        {/* Row number */}
        <span className="shrink-0 w-7 text-center rounded bg-white/[0.05] px-1 py-0.5 text-[10px] font-bold text-white/30 mt-0.5">
          {item.sno}
        </span>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-xs font-medium text-white/70 leading-relaxed">{item.description}</p>
            <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          {hasSubSections && (
            <p className="text-[10px] text-white/30 mt-0.5">
              {item.subSections.length} sub-section{item.subSections.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="shrink-0 w-20 text-right hidden md:block">
          {hasSubSections ? (
            <span className="text-[10px] text-white/25 italic">multiple</span>
          ) : (
            <span className="text-xs font-semibold text-white/60">
              {item.quantity !== null ? fmtNum(item.quantity) : "—"}
              {item.unit && <span className="text-[10px] text-white/30 ml-1">{item.unit}</span>}
            </span>
          )}
        </div>

        {/* Rate */}
        <div className="shrink-0 w-24 text-right hidden lg:block">
          <span className="text-xs text-white/45">
            {item.rate !== null ? `₹${fmtNum(item.rate)}` : hasSubSections ? "—" : "—"}
          </span>
        </div>

        {/* Amount */}
        <div className="shrink-0 w-24 text-right">
          <span className={`text-xs font-bold ${totalAmount ? "text-white/75" : "text-white/25"}`}>
            {totalAmount !== null && totalAmount !== undefined ? `₹${fmtNum(totalAmount, 0)}` : "—"}
          </span>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 w-4">
          {hasDetail && (
            <ChevronRight
              className={`h-3 w-3 text-white/20 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="bg-white/[0.015] border-t border-white/[0.04] px-4 py-3 space-y-3">
          {/* Sub-sections */}
          {hasSubSections && (
            <div className="space-y-2">
              {item.subSections.map((ss) => (
                <div key={ss.sno} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#F97316]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#F97316]/80">
                        {item.sno}{ss.sno}
                      </span>
                      <p className="text-[10px] text-white/55">{ss.description || "Sub-section"}</p>
                    </div>
                    <span className="text-xs font-bold text-white/65 shrink-0">
                      {ss.amount !== null ? `₹${fmtNum(ss.amount, 0)}` : "—"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] text-white/35">
                    <span>Qty: <span className="text-white/55 font-medium">{fmtNum(ss.quantity)} {ss.unit}</span></span>
                    <span>Rate: <span className="text-white/55 font-medium">₹{fmtNum(ss.rate)}</span></span>
                  </div>
                  {/* Sub-section dimension rows */}
                  {ss.dimensionRows.length > 0 && <DimTable rows={ss.dimensionRows} />}
                </div>
              ))}
            </div>
          )}

          {/* Direct dimension rows */}
          {!hasSubSections && item.dimensionRows.length > 0 && (
            <DimTable rows={item.dimensionRows} />
          )}
        </div>
      )}
    </div>
  );
}

function DimTable({ rows }: { rows: import("@/lib/excel-parser").DimensionRow[] }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-lg border border-white/[0.06]">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            {["Description", "No.", "L", "B", "H", "Calculated"].map((h) => (
              <th key={h} className="px-2 py-1.5 text-left font-bold uppercase tracking-wider text-white/20">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="px-2 py-1.5 text-white/50">{r.description || "—"}</td>
              <td className="px-2 py-1.5 text-white/40 tabular-nums">{r.count ?? "—"}</td>
              <td className="px-2 py-1.5 text-white/40 tabular-nums">{r.l ?? "—"}</td>
              <td className="px-2 py-1.5 text-white/40 tabular-nums">{r.b ?? "—"}</td>
              <td className="px-2 py-1.5 text-white/40 tabular-nums">{r.h ?? "—"}</td>
              <td className="px-2 py-1.5 text-teal-400/70 font-semibold tabular-nums">
                {r.calculated !== null ? fmtNum(r.calculated) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── AI Insights ──────────────────────────────────────────────────────────────

function generateInsights(estimate: ParsedEstimate): Array<{ icon: React.ElementType; text: string; color: string }> {
  const insights: Array<{ icon: React.ElementType; text: string; color: string }> = [];

  insights.push({ icon: CheckCircle2, text: `${estimate.itemCount} BOQ items detected and parsed`, color: "text-teal-400" });

  // Category breakdown
  const cats = new Map<string, number>();
  for (const item of estimate.items) {
    const { label } = detectWorkCategory(item.description);
    cats.set(label, (cats.get(label) ?? 0) + 1);
  }
  const topCat = [...cats.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    insights.push({ icon: Layers, text: `Most common work: ${topCat[0]} (${topCat[1]} items)`, color: "text-violet-400" });
  }

  // Dimension rows
  const totalDimRows = estimate.items.reduce(
    (s, it) => s + it.dimensionRows.length + it.subSections.reduce((ss, sub) => ss + sub.dimensionRows.length, 0),
    0
  );
  if (totalDimRows > 0) {
    insights.push({ icon: Ruler, text: `${totalDimRows} dimension breakdown rows parsed`, color: "text-blue-400" });
  }

  // Missing rates
  if (estimate.errors.filter((e) => e.type === "missing_rate").length > 0) {
    insights.push({
      icon: AlertTriangle,
      text: `${estimate.errors.filter((e) => e.type === "missing_rate").length} item(s) with missing rates detected`,
      color: "text-amber-400",
    });
  }

  // Contingencies
  if (estimate.contingencies !== null) {
    insights.push({
      icon: Calculator,
      text: `Contingencies: ${fmtCurrency(estimate.contingencies)} (${estimate.contingencyNote})`,
      color: "text-[#F97316]",
    });
  }

  // RCC items
  const rccItems = estimate.items.filter((it) => /reinforced|rcc|r\.c\.c|beam|slab/i.test(it.description));
  if (rccItems.length > 0) {
    const rccTotal = rccItems.reduce((s, it) => s + (it.amount ?? 0), 0);
    insights.push({ icon: HardHat, text: `RCC work: ${rccItems.length} items — ${fmtCurrency(rccTotal)} value`, color: "text-[#F97316]" });
  }

  return insights;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface EstimatePreviewProps {
  estimate: ParsedEstimate;
  fileName: string;
  onClose?: () => void;
}

export function EstimatePreview({ estimate, fileName, onClose }: EstimatePreviewProps) {
  const [activeTab, setActiveTab] = useState<"items" | "insights" | "validation">("items");
  const insights = generateInsights(estimate);

  return (
    <div className="w-full space-y-5">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#F97316]/20 bg-gradient-to-br from-[#1C1F2B] via-[#21253a] to-[#181b27] px-6 py-6">
        {/* Glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F97316]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-36 w-36 rounded-full bg-violet-500/5 blur-2xl" />
        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(249,115,22,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.07) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/15 border border-[#F97316]/20">
                <Building2 className="h-4.5 w-4.5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]/70">
                  Parsed Estimate
                </p>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-white/30" />
                  <span className="text-[11px] text-white/35">{fileName}</span>
                </div>
              </div>
            </div>
            <h1 className="text-base font-bold text-white/85 leading-snug max-w-2xl">
              {estimate.projectName || "Construction Estimate"}
            </h1>
            {estimate.scheme && (
              <p className="text-xs text-white/40 mt-1">Scheme: {estimate.scheme}</p>
            )}
            <p className="text-[10px] text-white/30 mt-1">
              Dimensions in: {estimate.dimensionUnit} · {estimate.rawRowCount} rows processed
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-colors"
              >
                <X className="h-3 w-3" /> Close
              </button>
            )}
            <div className="text-right">
              <p className="text-[10px] text-white/30">Net Total</p>
              <p className="text-2xl font-bold text-[#F97316]">
                {fmtCurrency(estimate.netTotal ?? estimate.subtotal)}
              </p>
              {estimate.estimatedCostText && (
                <p className="text-[10px] text-white/30 mt-0.5">
                  Stated: {estimate.estimatedCostText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard
          label="BOQ Items"
          value={String(estimate.itemCount)}
          sub={`${estimate.validItemCount} with complete data`}
          color="orange"
        />
        <SummaryCard
          label="Subtotal"
          value={fmtCurrency(estimate.subtotal)}
          sub="Before contingencies"
          color="violet"
        />
        <SummaryCard
          label="Contingencies"
          value={estimate.contingencies !== null ? fmtCurrency(estimate.contingencies) : "None"}
          sub={estimate.contingencyNote || "—"}
          color="teal"
        />
        <SummaryCard
          label="Net Estimate"
          value={fmtCurrency(estimate.netTotal ?? estimate.subtotal)}
          sub={`${estimate.errors.length} errors · ${estimate.warnings.length} warnings`}
          color="blue"
        />
      </div>

      {/* ── Tab Switcher ─────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
        {(["items", "insights", "validation"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-[#F97316]/15 border border-[#F97316]/20 text-[#F97316]"
                : "text-white/40 hover:text-white/65"
            }`}
          >
            {tab === "items" && `BOQ Items (${estimate.itemCount})`}
            {tab === "insights" && `AI Insights (${insights.length})`}
            {tab === "validation" && `Validation (${estimate.errors.length + estimate.warnings.length})`}
          </button>
        ))}
      </div>

      {/* ── BOQ Items Tab ────────────────────────────────────── */}
      {activeTab === "items" && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {/* Table header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="w-7 shrink-0 text-[9px] font-bold uppercase tracking-wider text-white/20 text-center">#</span>
            <span className="flex-1 text-[9px] font-bold uppercase tracking-wider text-white/20">Description</span>
            <span className="w-20 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-white/20 hidden md:block">Qty</span>
            <span className="w-24 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-white/20 hidden lg:block">Rate</span>
            <span className="w-24 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-white/20">Amount</span>
            <span className="w-4 shrink-0" />
          </div>

          {/* Items */}
          <div>
            {estimate.items.map((item, idx) => (
              <ItemRow key={item.sno} item={item} idx={idx} />
            ))}
          </div>

          {/* Footer totals */}
          <div className="border-t border-white/[0.08] bg-white/[0.02] px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 font-medium">Subtotal</span>
              <span className="text-sm font-bold text-white/70">{fmtCurrency(estimate.subtotal)}</span>
            </div>
            {estimate.contingencies !== null && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/35">{estimate.contingencyNote}</span>
                <span className="text-sm text-white/55">+ {fmtCurrency(estimate.contingencies)}</span>
              </div>
            )}
            {estimate.provisions.map((p) => (
              <div key={p.description} className="flex items-center justify-between">
                <span className="text-xs text-white/35">{p.description}</span>
                <span className="text-sm text-white/55">+ {fmtCurrency(p.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[#F97316]/20 pt-2">
              <span className="text-sm font-bold text-[#F97316]">Net Total</span>
              <span className="text-lg font-bold text-[#F97316]">
                {fmtCurrency(estimate.netTotal ?? estimate.subtotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Insights Tab ─────────────────────────────────── */}
      {activeTab === "insights" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-4 w-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-white/75">AI-Extracted Insights</h3>
            <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[9px] font-bold text-teal-400">
              Auto-generated
            </span>
          </div>
          {insights.map((ins, i) => {
            const InsIcon = ins.icon;
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 hover:bg-white/[0.05] transition-colors">
                <InsIcon className={`mt-0.5 h-4 w-4 shrink-0 ${ins.color}`} />
                <p className="text-sm text-white/60 leading-relaxed">{ins.text}</p>
              </div>
            );
          })}

          {/* Work category distribution */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <h4 className="text-xs font-semibold text-white/50 mb-3">Work Category Distribution</h4>
            <div className="space-y-2.5">
              {(() => {
                const cats = new Map<string, { count: number; amount: number; color: string }>();
                for (const item of estimate.items) {
                  const { label, color } = detectWorkCategory(item.description);
                  const amt = item.subSections.length
                    ? item.subSections.reduce((s, ss) => s + (ss.amount ?? 0), 0)
                    : (item.amount ?? 0);
                  const existing = cats.get(label);
                  if (existing) { existing.count++; existing.amount += amt; }
                  else cats.set(label, { count: 1, amount: amt, color });
                }
                return [...cats.entries()].sort((a, b) => b[1].amount - a[1].amount).map(([name, { count, amount, color }]) => {
                  const pct = estimate.subtotal > 0 ? (amount / estimate.subtotal) * 100 : 0;
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${color}`}>{name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30">{count} items</span>
                          <span className="text-xs font-bold text-white/55">{fmtCurrency(amount)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-current opacity-60"
                          style={{ width: `${Math.min(100, pct)}%`, color: color.replace("text-", "") }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Validation Tab ───────────────────────────────────── */}
      {activeTab === "validation" && (
        <div className="space-y-3">
          {estimate.errors.length === 0 && estimate.warnings.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-teal-500/20 bg-teal-500/[0.07] px-4 py-4">
              <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
              <p className="text-sm text-teal-300/80">No errors or warnings detected. Estimate looks clean!</p>
            </div>
          ) : (
            <>
              {estimate.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400/70 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {estimate.errors.length} Error{estimate.errors.length !== 1 ? "s" : ""}
                  </p>
                  {estimate.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-2.5">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      <p className="text-xs text-red-300/80">{err.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {estimate.warnings.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400/70 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> {estimate.warnings.length} Warning{estimate.warnings.length !== 1 ? "s" : ""}
                  </p>
                  {estimate.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2.5">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <p className="text-xs text-amber-300/80">{w.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
