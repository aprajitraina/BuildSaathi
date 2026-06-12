"use client";

import { Package, TrendingUp, TrendingDown, Cpu, AlertCircle, ShoppingCart, Truck } from "lucide-react";
import { ModulePreviewLayout, GlowCard, AIInsightCard, MockBadge, AIBadge } from "@/components/shared/module-preview-layout";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const TREND_DATA = [
  { month: "Jan", cement: 380, steel: 62, sand: 28 },
  { month: "Feb", cement: 395, steel: 65, sand: 27 },
  { month: "Mar", cement: 410, steel: 68, sand: 30 },
  { month: "Apr", cement: 402, steel: 71, sand: 29 },
  { month: "May", cement: 420, steel: 69, sand: 32 },
  { month: "Jun", cement: 435, steel: 74, sand: 31 },
];

const INVENTORY_ITEMS = [
  { name: "OPC Cement (53 Grade)", category: "Binding", stock: 840, unit: "bags", alert: false, trend: "up" },
  { name: "TMT Steel Bars (Fe500)", category: "Structural", stock: 12, unit: "MT", alert: true, trend: "up" },
  { name: "River Sand (M-Sand)", category: "Aggregate", stock: 220, unit: "cft", alert: false, trend: "down" },
  { name: "20mm Crushed Stone", category: "Aggregate", stock: 510, unit: "cft", alert: false, trend: "stable" },
  { name: "Red Clay Bricks", category: "Masonry", stock: 4200, unit: "nos", alert: false, trend: "stable" },
  { name: "PVC Water Pipes 4\"", category: "Plumbing", stock: 8, unit: "pcs", alert: true, trend: "down" },
];

const SUPPLIERS = [
  { name: "Ramesh Steel & Co.", category: "Steel", location: "Kanpur, UP", rating: 4.8, status: "Active" },
  { name: "Shiv Cement Depot", category: "Cement", location: "Agra, UP", rating: 4.5, status: "Active" },
  { name: "GreenAgg Quarries", category: "Aggregates", location: "Noida, UP", rating: 4.2, status: "Pending" },
];

const PROCUREMENT_ROWS = [
  { material: "TMT Steel Fe500", qty: "5 MT", vendor: "Ramesh Steel", po: "PO-2024-089", eta: "2 days", status: "In Transit" },
  { material: "OPC Cement 53G", qty: "200 bags", vendor: "Shiv Depot", po: "PO-2024-090", eta: "Today", status: "Delivered" },
  { material: "M-Sand Fine", qty: "100 cft", vendor: "GreenAgg", po: "PO-2024-091", eta: "4 days", status: "Ordered" },
];

export function MaterialsPage() {
  return (
    <ModulePreviewLayout
      moduleName="Materials Intelligence"
      moduleIcon={Package}
      tagline="BuildSaathi Materials"
      description="Real-time inventory tracking, AI-driven demand forecasting, supplier management, and material price trend analytics across all your construction sites."
      devProgress={58}
    >
      {/* ── Stat Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIInsightCard label="Total SKUs Tracked" value="148" sub="6 low-stock alerts" color="orange" />
        <AIInsightCard label="Monthly Spend" value="₹12.4L" sub="+8% vs last month" color="violet" />
        <AIInsightCard label="Active Suppliers" value="23" sub="3 pending approval" color="teal" />
        <AIInsightCard label="Price Alerts" value="5" sub="Cement up 12%" color="blue" />
      </div>

      {/* ── Inventory Table ─────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-white/85">Inventory Overview</h3>
          </div>
          <MockBadge />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Material", "Category", "Stock", "Unit", "Status"].map((h) => (
                  <th key={h} className="pb-2 pr-4 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {INVENTORY_ITEMS.map((item) => (
                <tr key={item.name} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      {item.alert && <AlertCircle className="h-3 w-3 shrink-0 text-amber-400" />}
                      <span className="text-xs font-medium text-white/70">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-white/35">{item.category}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-sm font-bold ${item.alert ? "text-amber-400" : "text-white/70"}`}>
                      {item.stock.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-white/35">{item.unit}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      {item.trend === "up" && <TrendingUp className="h-3 w-3 text-teal-400" />}
                      {item.trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
                      <span className={`text-[10px] font-semibold ${
                        item.alert ? "text-amber-400" : "text-teal-400"
                      }`}>
                        {item.alert ? "Low Stock" : "OK"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* ── Price Trend Chart + AI Forecast ──────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Price trend */}
        <GlowCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white/85">Price Trends (₹/unit)</h3>
            </div>
            <MockBadge />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Line type="monotone" dataKey="cement" stroke="#F97316" strokeWidth={2} dot={false} name="Cement (₹/bag)" />
                <Line type="monotone" dataKey="steel" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Steel (₹/kg)" />
                <Line type="monotone" dataKey="sand" stroke="#14b8a6" strokeWidth={2} dot={false} name="Sand (₹/cft)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        {/* AI Demand Forecast */}
        <GlowCard accent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">AI Demand Forecast</h3>
            </div>
            <AIBadge />
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Based on your active projects and historical consumption patterns:
          </p>
          <div className="space-y-2.5">
            {[
              { mat: "OPC Cement", forecast: "1,200 bags", when: "Next 30 days", urgency: "Medium" },
              { mat: "TMT Steel Fe500", forecast: "8 MT", when: "Next 14 days", urgency: "High" },
              { mat: "M-Sand Fine", forecast: "300 cft", when: "Next 30 days", urgency: "Low" },
              { mat: "PVC Pipes 4\"", forecast: "40 pcs", when: "Next 7 days", urgency: "High" },
            ].map((row) => (
              <div key={row.mat} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-white/65">{row.mat}</p>
                  <p className="text-[10px] text-white/30">{row.when}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white/65">{row.forecast}</p>
                  <span className={`text-[10px] font-semibold ${
                    row.urgency === "High" ? "text-amber-400" : row.urgency === "Medium" ? "text-[#F97316]" : "text-teal-400"
                  }`}>{row.urgency}</span>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* ── Procurement Tracking ──────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-4 w-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-white/85">Active Procurement Orders</h3>
          <MockBadge />
        </div>
        <div className="space-y-2.5">
          {PROCUREMENT_ROWS.map((row) => (
            <div key={row.po} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 shrink-0 text-white/25" />
                <div>
                  <p className="text-xs font-medium text-white/70">{row.material}</p>
                  <p className="text-[10px] text-white/30">{row.po} · {row.vendor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-white/60">{row.qty}</p>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <span className="text-[10px] text-white/30">ETA: {row.eta}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    row.status === "Delivered" ? "bg-teal-500/15 text-teal-400"
                    : row.status === "In Transit" ? "bg-blue-500/15 text-blue-400"
                    : "bg-amber-500/15 text-amber-400"
                  }`}>{row.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Supplier Cards ─────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white/70">Top Suppliers</h3>
          <MockBadge />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {SUPPLIERS.map((sup) => (
            <GlowCard key={sup.name} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/15 text-sm font-bold text-[#F97316]">
                  {sup.name[0]}
                </div>
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  sup.status === "Active" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>{sup.status}</span>
              </div>
              <p className="text-sm font-semibold text-white/80">{sup.name}</p>
              <p className="text-xs text-white/35 mt-0.5">{sup.category} · {sup.location}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[#F97316] text-xs">★</span>
                <span className="text-xs font-bold text-white/60">{sup.rating}</span>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </ModulePreviewLayout>
  );
}
