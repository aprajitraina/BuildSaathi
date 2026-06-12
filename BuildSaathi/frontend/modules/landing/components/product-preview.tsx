"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, AlertCircle, Sparkles, IndianRupee } from "lucide-react";

const TENDERS = [
  { title: "NH-44 Road Widening — NHAI", dept: "NHAI, Lucknow", value: "₹4.2 Cr", status: "active", badge: "bg-green-500/15 text-green-600" },
  { title: "Municipal Water Supply Phase 2", dept: "Jal Nigam, UP", value: "₹1.8 Cr", status: "deadline", badge: "bg-amber-500/15 text-amber-600" },
  { title: "District Hospital Renovation", dept: "PWD, Maharashtra", value: "₹92 L", status: "new", badge: "bg-blue-500/15 text-blue-600" },
];

const PROJECTS = [
  { name: "Ring Road Phase 1", progress: 68, color: "bg-blue-500" },
  { name: "Bridge Culvert MP-7", progress: 41, color: "bg-violet-500" },
];

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Outer glow */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent blur-2xl" />

      {/* Dashboard window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative overflow-hidden rounded-xl border border-border/70 bg-background shadow-2xl"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/40 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <div className="ml-3 flex-1 rounded-md bg-muted px-3 py-0.5 text-center text-[11px] text-muted-foreground">
            app.buildsaathi.in
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-12 flex-col items-center gap-3 border-r border-border/60 bg-muted/20 py-4 sm:flex">
            {["📋", "🏗️", "💰", "📦", "📄"].map((icon, i) => (
              <div
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors ${
                  i === 0 ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden p-3.5 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-foreground">Active Tenders</p>
                <p className="text-[10px] text-muted-foreground">3 matching your profile</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-medium text-primary">
                <Sparkles className="h-2.5 w-2.5" />
                AI Ready
              </div>
            </div>

            {/* Tender rows */}
            <div className="space-y-1.5">
              {TENDERS.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2 hover:border-primary/20 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-foreground">{t.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{t.dept}</p>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    <span className="font-semibold text-[10px] text-foreground">{t.value}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${t.badge}`}>
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom widgets */}
            <div className="grid grid-cols-2 gap-2">
              {/* Project progress */}
              <div className="rounded-md border border-border/60 bg-muted/20 p-2.5 space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-foreground">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  Projects
                </div>
                {PROJECTS.map((p) => (
                  <div key={p.name} className="space-y-0.5">
                    <p className="truncate text-[9px] text-muted-foreground">{p.name}</p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${p.color}`}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground">{p.progress}%</p>
                  </div>
                ))}
              </div>

              {/* Payment widget */}
              <div className="rounded-md border border-amber-200/60 bg-amber-50/40 p-2.5 space-y-1.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                  <IndianRupee className="h-3 w-3" />
                  Payment Due
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground">Invoice #1042</span>
                    <span className="text-[10px] font-bold text-foreground">₹3.4L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground">Invoice #1039</span>
                    <span className="text-[10px] font-bold text-foreground">₹1.2L</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-2.5 w-2.5" />
                  2 overdue
                </div>
              </div>
            </div>

            {/* AI summary badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-2 rounded-md border border-blue-200/60 bg-blue-50/40 px-2.5 py-1.5 dark:border-blue-900/40 dark:bg-blue-950/20"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="h-3 w-3" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-foreground">AI Summary ready for NH-44</p>
                <p className="text-[9px] text-muted-foreground">Scope · Risks · Eligibility · Recommendation</p>
              </div>
              <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-green-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating stat badges */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute -right-4 top-16 hidden rounded-lg border border-border/70 bg-background px-3 py-2 shadow-lg sm:block"
      >
        <p className="text-[10px] font-semibold text-foreground">₹4.2 Cr</p>
        <p className="text-[9px] text-muted-foreground">highest active bid</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}
        className="absolute -left-4 bottom-20 hidden rounded-lg border border-border/70 bg-background px-3 py-2 shadow-lg sm:block"
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-[10px] font-semibold text-foreground">3 new tenders</p>
        </div>
        <p className="text-[9px] text-muted-foreground">matching your profile</p>
      </motion.div>
    </div>
  );
}
