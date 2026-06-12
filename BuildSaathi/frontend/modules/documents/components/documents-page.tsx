"use client";

import { FolderOpen, Search, FileText, FileImage, FileArchive, ScanLine, Cpu, FolderKanban, HardDrive, Shield } from "lucide-react";
import { ModulePreviewLayout, GlowCard, AIInsightCard, MockBadge, AIBadge } from "@/components/shared/module-preview-layout";

const FOLDERS = [
  { name: "Tender Documents", count: 38, size: "124 MB", icon: FileText, color: "text-[#F97316]", bg: "bg-[#F97316]/10" },
  { name: "Project Plans & DPR", count: 21, size: "86 MB", icon: FolderKanban, color: "text-violet-400", bg: "bg-violet-500/10" },
  { name: "Compliance Certificates", count: 14, size: "32 MB", icon: Shield, color: "text-teal-400", bg: "bg-teal-500/10" },
  { name: "Site Photos & Inspection", count: 95, size: "420 MB", icon: FileImage, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Contracts & Agreements", count: 9, size: "18 MB", icon: FileArchive, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const RECENT_DOCS = [
  { name: "NH-44 Phase2_BOQ_Final.xlsx", type: "BOQ", project: "NH-44 Widening", uploaded: "2 hours ago", size: "1.2 MB" },
  { name: "MuncipalWater_DPR_v3.pdf", type: "DPR", project: "Municipal Water", uploaded: "Yesterday", size: "8.4 MB" },
  { name: "SchoolRenovation_Completion_Cert.pdf", type: "Certificate", project: "School Block C", uploaded: "3 days ago", size: "0.3 MB" },
  { name: "Kanpur_Drain_SitePhoto_Jun24.zip", type: "Photos", project: "Drain Network", uploaded: "1 week ago", size: "45 MB" },
];

const AI_SEARCH_RESULTS = [
  { query: "contract value for NH-44 project", found: "INV-2024-089 · ₹4.2L · Section 4.2 of Agreement", file: "Contract_NH44_2024.pdf" },
  { query: "UP PWD tender eligibility criteria", found: "Annual Turnover ≥ ₹5Cr · Class I License required", file: "Tender_UPPWD_T-201.pdf" },
];

const STORAGE_DATA = [
  { label: "Tender Docs", pct: 18, color: "bg-[#F97316]" },
  { label: "Site Photos", pct: 61, color: "bg-violet-500" },
  { label: "Plans & DPR", pct: 12, color: "bg-teal-500" },
  { label: "Other", pct: 9, color: "bg-blue-500" },
];

export function DocumentsPage() {
  return (
    <ModulePreviewLayout
      moduleName="Smart Document Vault"
      moduleIcon={FolderOpen}
      tagline="BuildSaathi Documents"
      description="AI-powered document indexing with OCR, semantic search across your project files, automatic compliance tracking, and secure cloud storage for all construction documents."
      devProgress={48}
    >
      {/* ── Stat Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIInsightCard label="Total Documents" value="177" sub="5 folders" color="orange" />
        <AIInsightCard label="Storage Used" value="680 MB" sub="of 5 GB allocated" color="violet" />
        <AIInsightCard label="OCR Processed" value="142" sub="80% of vault" color="teal" />
        <AIInsightCard label="Expiring Soon" value="3" sub="Licenses / certs" color="blue" />
      </div>

      {/* ── Folder Tree + AI Search ────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Folder Overview */}
        <GlowCard className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">Document Folders</h3>
            </div>
            <MockBadge />
          </div>
          <div className="space-y-2">
            {FOLDERS.map((folder) => {
              const FIcon = folder.icon;
              return (
                <div key={folder.name} className="flex items-center justify-between rounded-lg px-3 py-2.5 border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${folder.bg} border border-white/[0.06]`}>
                      <FIcon className={`h-3.5 w-3.5 ${folder.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/65 group-hover:text-white/85 transition-colors">{folder.name}</p>
                      <p className="text-[10px] text-white/30">{folder.count} files</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30">{folder.size}</span>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* AI Semantic Search Preview */}
        <GlowCard accent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white/85">AI Smart Search</h3>
            </div>
            <AIBadge />
          </div>
          {/* Fake search bar */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-white/30 shrink-0" />
            <span className="text-xs text-white/30">Ask anything about your documents...</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/20">Sample AI Search Results</p>
          <div className="space-y-2.5">
            {AI_SEARCH_RESULTS.map((r) => (
              <div key={r.query} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <p className="text-[10px] font-semibold text-[#F97316]/70 mb-1">"{r.query}"</p>
                <p className="text-xs text-white/55 leading-relaxed mb-1.5">{r.found}</p>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-white/25" />
                  <span className="text-[10px] text-white/30">{r.file}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/25 leading-relaxed">
            AI searches across all indexed documents using semantic understanding — not just keyword matching.
          </p>
        </GlowCard>
      </div>

      {/* ── OCR Preview ───────────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <ScanLine className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white/85">OCR Document Processing</h3>
          <AIBadge />
          <MockBadge />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {/* Mock OCR card */}
          <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.06] p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-violet-400" />
              <p className="text-xs font-semibold text-white/70">MuncipalWater_DPR_v3.pdf</p>
            </div>
            <div className="space-y-1.5 text-xs text-white/40">
              <p className="font-semibold text-white/55">Extracted Key Fields:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>Project Value:</span><span className="text-white/65 font-medium">₹1.82 Crore</span>
                <span>Completion:</span><span className="text-white/65 font-medium">18 months</span>
                <span>Contractor Class:</span><span className="text-white/65 font-medium">Class A</span>
                <span>State:</span><span className="text-white/65 font-medium">Uttar Pradesh</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-white/[0.07]">
                <div className="h-full w-[92%] rounded-full bg-violet-500" />
              </div>
              <span className="text-[10px] text-violet-400 font-semibold">92% confidence</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/50">OCR Processing Queue</p>
            {[
              { file: "Contract_NH44_2024.pdf", status: "Completed", pct: 100 },
              { file: "Tender_UPPWD_T-201.pdf", status: "Processing", pct: 65 },
              { file: "SitePhoto_Jun24.zip", status: "Queued", pct: 0 },
            ].map((item) => (
              <div key={item.file} className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-white/55 truncate max-w-[140px]">{item.file}</p>
                  <span className={`text-[10px] font-semibold ${
                    item.status === "Completed" ? "text-teal-400" : item.status === "Processing" ? "text-[#F97316]" : "text-white/30"
                  }`}>{item.status}</span>
                </div>
                {item.pct > 0 && (
                  <div className="h-1 rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${item.pct === 100 ? "bg-teal-500" : "bg-[#F97316]"}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlowCard>

      {/* ── Recent Documents ──────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-white/85">Recently Uploaded</h3>
          </div>
          <MockBadge />
        </div>
        <div className="space-y-2">
          {RECENT_DOCS.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-white/25" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white/65">{doc.name}</p>
                  <p className="text-[10px] text-white/30">{doc.project} · {doc.uploaded}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[10px] text-white/25">{doc.size}</span>
                <span className="rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-2 py-0.5 text-[9px] font-bold text-[#F97316]/70">{doc.type}</span>
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Storage Breakdown ─────────────────────────────── */}
      <GlowCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-4 w-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-white/85">Storage Analytics</h3>
          <MockBadge />
        </div>
        <div className="flex items-center gap-6">
          {/* Bar */}
          <div className="flex-1">
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {STORAGE_DATA.map((item) => (
                <div key={item.label} className={`${item.color} opacity-80`} style={{ width: `${item.pct}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {STORAGE_DATA.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-[10px] text-white/40">{item.label} ({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-white/70">680 MB</p>
            <p className="text-xs text-white/30">of 5 GB used</p>
            <div className="mt-2 h-1.5 w-32 rounded-full bg-white/[0.07]">
              <div className="h-full w-[14%] rounded-full bg-teal-500" />
            </div>
            <p className="text-[10px] text-teal-400 mt-1">14% used — Plenty of space</p>
          </div>
        </div>
      </GlowCard>
    </ModulePreviewLayout>
  );
}
