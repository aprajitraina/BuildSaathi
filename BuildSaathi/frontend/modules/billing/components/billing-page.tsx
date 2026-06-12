"use client";

import { Receipt, TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign, BarChart3 } from "lucide-react";
import { ModulePreviewLayout, GlowCard, AIInsightCard, MockBadge, AIBadge } from "@/components/shared/module-preview-layout";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

const CASHFLOW_DATA = [
  { month: "Jan", inflow: 420000, outflow: 280000 },
  { month: "Feb", inflow: 380000, outflow: 310000 },
  { month: "Mar", inflow: 650000, outflow: 420000 },
  { month: "Apr", inflow: 520000, outflow: 350000 },
  { month: "May", inflow: 710000, outflow: 480000 },
  { month: "Jun", inflow: 840000, outflow: 520000 },
];

const MOCK_INVOICES = [
  { number: "INV-2024-089", client: "UP PWD — NH44 Project", amount: "₹4,20,000", due: "3 days", status: "Overdue", age: 35 },
  { number: "INV-2024-091", client: "Agra Municipal Corp.", amount: "₹1,80,000", due: "12 days", status: "Sent", age: 8 },
  { number: "INV-2024-092", client: "Private Builder — Lucknow", amount: "₹65,000", due: "Paid", status: "Paid", age: 0 },
  { number: "INV-2024-093", client: "Kanpur Dev. Authority", amount: "₹2,10,000", due: "28 days", status: "Draft", age: 0 },
];

const GST_ROWS = [
  { period: "Q1 2024 (Apr–Jun)", igst: "₹2.4L", cgst: "₹1.2L", sgst: "₹1.2L", status: "Filed" },
  { period: "Q2 2024 (Jul–Sep)", igst: "₹3.1L", cgst: "₹1.55L", sgst: "₹1.55L", status: "Pending" },
];

function statusStyle(status: string) {
  const map: Record<string, string> = {
    Overdue: "bg-red-500/10 border-red-500/20 text-red-400",
    Sent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    Paid: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    Draft: "bg-white/5 border-white/10 text-white/35",
  };
  return map[status] ?? "bg-white/5 border-white/10 text-white/35";
}

function fmt(n: number) {
  return "₹" + (n / 100000).toFixed(1) + "L";
}

export function BillingPage() {
  return (
    <ModulePreviewLayout
      moduleName="Billing & Finance Hub"
      moduleIcon={Receipt}
      tagline="BuildSaathi Billing"
      description="Complete invoice lifecycle management, real-time cashflow tracking, GST compliance, overdue alerts, and AI-powered payment forecasting for your construction business."
      devProgress={65}
    >
      {/* ── Stat Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIInsightCard label="Total Receivables" value="₹8.75L" sub="4 open invoices" color="orange" />
        <AIInsightCard label="Overdue Amount" value="₹4.2L" sub="1 invoice overdue" color="violet" />
        <AIInsightCard label="Collected (Jun)" value="₹8.4L" sub="+18% vs May" color="teal" />
        <AIInsightCard label="GST Payable" value="₹3.1L" sub="Q2 — Pending" color="blue" />
      </div>

      {/* ── Recent Invoices ────────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-white/85">Recent Invoices</h3>
          </div>
          <MockBadge />
        </div>
        <div className="space-y-2.5">
          {MOCK_INVOICES.map((inv) => (
            <div key={inv.number} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/10">
                  <Receipt className="h-3.5 w-3.5 text-[#F97316]/60" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70">{inv.number}</p>
                  <p className="text-[10px] text-white/35">{inv.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white/70">{inv.amount}</p>
                  {inv.status !== "Paid" && inv.status !== "Draft" && (
                    <p className="text-[10px] text-white/30">Due in {inv.due}</p>
                  )}
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyle(inv.status)}`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Cashflow Chart + AI Insights ─────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cashflow Chart */}
        <GlowCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white/85">Cashflow (6 Months)</h3>
            </div>
            <MockBadge />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASHFLOW_DATA} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}
                  formatter={(v: number, name: string) => [fmt(v), name === "inflow" ? "Inflow" : "Outflow"]}
                />
                <Bar dataKey="inflow" fill="#F97316" radius={[3,3,0,0]} opacity={0.85} />
                <Bar dataKey="outflow" fill="#8b5cf6" radius={[3,3,0,0]} opacity={0.65} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-[10px] text-white/30">
            <div className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#F97316]" /> Inflow</div>
            <div className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-violet-500" /> Outflow</div>
          </div>
        </GlowCard>

        {/* AI Payment Insights */}
        <GlowCard accent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">Payment Intelligence</h3>
            </div>
            <AIBadge />
          </div>
          <div className="space-y-2.5">
            {[
              { icon: AlertTriangle, color: "text-red-400", text: "INV-2024-089 is 35 days overdue. Recommend follow-up call with UP PWD." },
              { icon: TrendingUp, color: "text-teal-400", text: "June collections 18% above forecast. Strong payment cycle this quarter." },
              { icon: Clock, color: "text-blue-400", text: "Q2 GST return due in 18 days. ₹3.1L payable. Schedule payment now." },
              { icon: CheckCircle2, color: "text-green-400", text: "Agra Municipal invoice likely to be paid on time based on payment history." },
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

      {/* ── GST Summary ───────────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-4 w-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-white/85">GST Summary</h3>
          <MockBadge />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Period", "IGST", "CGST", "SGST", "Status"].map((h) => (
                  <th key={h} className="pb-2 pr-4 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {GST_ROWS.map((row) => (
                <tr key={row.period} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-xs font-medium text-white/60">{row.period}</td>
                  <td className="py-3 pr-4 text-xs text-white/50">{row.igst}</td>
                  <td className="py-3 pr-4 text-xs text-white/50">{row.cgst}</td>
                  <td className="py-3 pr-4 text-xs text-white/50">{row.sgst}</td>
                  <td className="py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      row.status === "Filed"
                        ? "bg-teal-500/10 border-teal-500/20 text-teal-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* ── Payment Analytics ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Avg. Payment Cycle", value: "22 days", sub: "Industry: 45 days", good: true },
          { label: "Collection Rate", value: "94.2%", sub: "Last 12 months", good: true },
          { label: "Disputed Invoices", value: "2", sub: "₹85K in dispute", good: false },
          { label: "Next Expected", value: "₹1.8L", sub: "Agra Muni — 12 days", good: true },
        ].map((item) => (
          <GlowCard key={item.label} className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-1">{item.label}</p>
            <p className={`text-xl font-bold ${item.good ? "text-teal-400" : "text-amber-400"}`}>{item.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
          </GlowCard>
        ))}
      </div>
    </ModulePreviewLayout>
  );
}
