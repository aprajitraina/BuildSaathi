"use client";

import { useCallback, useState } from "react";
import { FileUp, Loader2, Sparkles, FileText, CheckCircle2, Cpu, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDIAN_STATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUploadEstimationDocx } from "../hooks/use-estimation";
import { parseEstimateFile, isSupportedFile, type ParsedEstimate } from "@/lib/excel-parser";

// Animated parsing steps shown while the file is being processed
const PARSE_STEPS = [
  "Reading file structure…",
  "Detecting column headers…",
  "Extracting project metadata…",
  "Parsing BOQ line items…",
  "Computing dimension breakdowns…",
  "Validating quantities & rates…",
  "Running AI insight analysis…",
  "Finalising estimate…",
];

interface EstimatesUploadPanelProps {
  /** Called when local Excel parsing completes */
  onParsed?: (result: ParsedEstimate, file: File) => void;
}

export function EstimatesUploadPanel({ onParsed }: EstimatesUploadPanelProps) {
  const upload = useUploadEstimationDocx();
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("Uttar Pradesh");
  const [isDragging, setIsDragging] = useState(false);

  // Local parse state
  const [parsing, setParsing] = useState(false);
  const [parseStep, setParseStep] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedEstimate | null>(null);

  const isExcel = (f: File) => isSupportedFile(f);
  const isDocx = (f: File) => f.name.toLowerCase().endsWith(".docx");

  // ── Local Excel parse ──────────────────────────────────────────────────────
  async function runLocalParse(f: File) {
    if (!isExcel(f)) return; // only parse Excel files locally

    setParsing(true);
    setParseError(null);
    setParsed(null);
    setParseStep(0);

    try {
      // Animate through steps while parsing
      let step = 0;
      const stepInterval = setInterval(() => {
        step++;
        if (step < PARSE_STEPS.length - 1) setParseStep(step);
        else clearInterval(stepInterval);
      }, 280);

      const result = await parseEstimateFile(f);

      clearInterval(stepInterval);
      setParseStep(PARSE_STEPS.length - 1);

      await new Promise((r) => setTimeout(r, 400)); // brief pause for last step
      setParsed(result);
      setParsing(false);

      if (onParsed) onParsed(result, f);
    } catch (err) {
      setParsing(false);
      setParseError(err instanceof Error ? err.message : "Failed to parse file");
    }
  }

  // ── File selection handlers ────────────────────────────────────────────────
  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setParsed(null);
    setParseError(null);
    if (isExcel(f)) runLocalParse(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.09] bg-[#1C1F2B] shadow-xl lg:sticky lg:top-4 overflow-hidden">
      {/* Orange accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#F97316] via-[#F97316]/60 to-transparent" />

      <div className="p-5">
        {/* Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/10 border border-[#F97316]/15 text-[#F97316]">
            <FileUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85 leading-tight">
              Upload BOQ / Estimate File
            </h3>
            <p className="text-xs text-white/35 mt-0.5 leading-snug">
              Upload your existing BOQ to review, validate and improve it with AI.
            </p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById("estimates-boq-file")?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("estimates-boq-file")?.click();
            }
          }}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-7 text-center transition-all duration-200",
            isDragging
              ? "border-[#F97316] bg-[#F97316]/[0.07] scale-[1.01]"
              : file
              ? parsed
                ? "border-teal-500/40 bg-teal-500/[0.05]"
                : "border-[#F97316]/30 bg-[#F97316]/[0.03]"
              : "border-white/[0.1] bg-white/[0.02] hover:border-[#F97316]/30 hover:bg-[#F97316]/[0.03]"
          )}
        >
          {parsing ? (
            // ── AI Parsing animation ────────────────────────────
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#F97316]/20 animate-ping" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316]/15 border border-[#F97316]/25">
                  <Cpu className="h-5 w-5 text-[#F97316] animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70">Analysing BOQ…</p>
                <p className="text-[10px] text-[#F97316]/70 mt-1 transition-all duration-300">
                  {PARSE_STEPS[parseStep]}
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full max-w-[180px] h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#fb923c] transition-all duration-300"
                  style={{ width: `${((parseStep + 1) / PARSE_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : parsed ? (
            // ── Parse success ────────────────────────────────────
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-teal-400" />
              <p className="text-xs font-semibold text-white/70">Parsed successfully</p>
              <p className="text-[10px] text-teal-400/70">
                {parsed.itemCount} items · {parsed.errors.length} errors
              </p>
              <p className="text-[10px] text-white/35 truncate max-w-full" title={file?.name}>
                {file?.name}
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); setParsed(null); }}
                className="text-[10px] text-white/30 hover:text-[#F97316] transition-colors mt-0.5"
              >
                Change file
              </button>
            </div>
          ) : file ? (
            // ── File selected (non-Excel or post-clear) ───────────
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/15 border border-[#F97316]/20">
                <FileText className="h-5 w-5 text-[#F97316]" />
              </div>
              <p className="text-xs font-semibold text-white/70">File selected</p>
              <p className="text-[10px] text-white/35 truncate max-w-full" title={file.name}>
                {file.name}
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-[10px] text-white/30 hover:text-[#F97316] transition-colors mt-0.5"
              >
                Remove file
              </button>
            </div>
          ) : (
            // ── Default empty state ──────────────────────────────
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                isDragging ? "bg-[#F97316]/15 text-[#F97316]" : "bg-white/[0.06] text-white/30"
              )}>
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Drop your file here</p>
                <p className="text-xs text-white/30 mt-0.5">or click to browse</p>
              </div>
            </div>
          )}

          <input
            id="estimates-boq-file"
            type="file"
            accept=".xlsx,.xls,.xlsm,.xlsb,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={onFileInput}
          />
        </div>

        {/* Parse error */}
        {parseError && (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-2">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
            <p className="text-[11px] text-red-300/80">{parseError}</p>
          </div>
        )}

        {/* Format note */}
        <p className="mt-2.5 text-[10px] text-white/25 text-center">
          Supported: <span className="font-semibold text-white/50">.xlsx .xls .docx</span> · Max 10 MB
        </p>

        {/* State selector */}
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-medium text-white/60" htmlFor="upload-state">
            State (for rate validation)
          </label>
          <select
            id="upload-state"
            className="flex h-9 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 transition-shadow"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s} className="bg-[#1C1F2B] text-white">{s}</option>
            ))}
          </select>
        </div>

        {/* CTA — Upload to API (for docx) or submit parsed estimate */}
        <Button
          className="mt-4 w-full bg-[#F97316] text-white hover:bg-[#ea580c] border-0 shadow-sm shadow-[#F97316]/20 font-semibold"
          disabled={!file || upload.isPending || parsing}
          onClick={() => {
            if (!file) return;
            if (isDocx(file)) {
              upload.mutate({ file, location, estimateType: "Residential" });
            }
            // For Excel files, parsing is already done — scroll to preview
            if (parsed && onParsed) onParsed(parsed, file);
          }}
        >
          {upload.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
          ) : parsing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Parsing…</>
          ) : parsed ? (
            "View Parsed Estimate ↓"
          ) : (
            "Upload & Analyse with AI"
          )}
        </Button>

        {/* AI note */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-violet-500/[0.07] border border-violet-500/20 p-3">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
          <p className="text-[11px] text-white/40 leading-relaxed">
            Excel files are parsed instantly in your browser. AI will validate quantities,
            detect work categories, and suggest improvements using live DSR rates.
          </p>
        </div>
      </div>
    </div>
  );
}
