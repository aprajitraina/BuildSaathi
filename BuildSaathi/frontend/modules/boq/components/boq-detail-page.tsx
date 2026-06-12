"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardCheck, FileUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  useCreateEstimationFromForm,
  useEstimation,
  useImproveEstimationAi,
  useUploadEstimationDocx,
  useValidateEstimation,
} from "../hooks/use-estimation";
import { useSearchParams } from "next/navigation";
import { INDIAN_STATES } from "@/lib/constants";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";

const ESTIMATE_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Institutional",
  "Other",
] as const;

interface BOQDetailPageProps {
  boqId: string;
}

export function BOQDetailPage({ boqId }: BOQDetailPageProps) {
  const searchParams = useSearchParams();
  const tenderId = searchParams.get("tenderId") ?? undefined;
  const isNew = boqId === "new";
  const { data: estimate, isLoading } = useEstimation(boqId);
  const createForm = useCreateEstimationFromForm();
  const uploadDoc = useUploadEstimationDocx();
  const validate = useValidateEstimation(boqId);
  const improveAi = useImproveEstimationAi(boqId);

  const [tab, setTab] = useState<"form" | "upload">("form");
  const [form, setForm] = useState({
    areaSqFt: 1200,
    location: "Uttar Pradesh",
    floors: 2 as number | "",
    finishType: "Standard",
    estimateType: "Residential",
  });
  const [uploadLocation, setUploadLocation] = useState("Uttar Pradesh");
  const [uploadEstimateType, setUploadEstimateType] = useState("Residential");
  const [file, setFile] = useState<File | null>(null);

  if (isNew) {
    return (
      <div className="space-y-6">
        <Link href="/boq" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to estimates
        </Link>
        <PageHeader
          title="New intelligent estimate"
          description="Building MVP: norms-based quantities (cement, steel, bricks) with RateMaster rates for your state, or import a Word BOQ."
        />

        <div className="flex gap-2 border-b border-border pb-2">
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "form" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("form")}
          >
            Structured form
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("upload")}
          >
            Upload .docx
          </button>
        </div>

        {tab === "form" ? (
          <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plinth area (sq ft)</label>
              <input
                type="number"
                min={1}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.areaSqFt}
                onChange={(e) => setForm((f) => ({ ...f, areaSqFt: Number(e.target.value) }))}
              />
              <p className="text-xs text-muted-foreground">Used with building norms (cement 0.4 bag/sq ft, steel 3.5 kg/sq ft, bricks 8/sq ft).</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">State (for rates)</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Floors</label>
                <input
                  type="number"
                  min={0}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.floors}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, floors: e.target.value === "" ? "" : Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Finish</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  placeholder="e.g. Premium"
                  value={form.finishType}
                  onChange={(e) => setForm((f) => ({ ...f, finishType: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estimate type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={form.estimateType}
                onChange={(e) => setForm((f) => ({ ...f, estimateType: e.target.value }))}
              >
                {ESTIMATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {tenderId && <p className="text-xs text-muted-foreground">Linked tender: {tenderId}</p>}
            <Button
              className="w-full"
              disabled={createForm.isPending || !form.location || form.areaSqFt <= 0}
              onClick={() =>
                createForm.mutate({
                  areaSqFt: form.areaSqFt,
                  location: form.location,
                  floors: form.floors === "" ? undefined : form.floors,
                  finishType: form.finishType || undefined,
                  estimateType: form.estimateType,
                  tenderId,
                })
              }
            >
              {createForm.isPending ? "Creating…" : "Generate estimate"}
            </Button>
          </div>
        ) : (
          <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Word document (.docx)</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground hover:bg-muted/50">
                <FileUp className="mb-2 h-8 w-8 opacity-60" />
                {file ? file.name : "Click to select BOQ / estimate table"}
                <input
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">State (for validation / rates)</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={uploadLocation}
                onChange={(e) => setUploadLocation(e.target.value)}
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estimate type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={uploadEstimateType}
                onChange={(e) => setUploadEstimateType(e.target.value)}
              >
                {ESTIMATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="w-full"
              disabled={uploadDoc.isPending || !file}
              onClick={() => {
                if (!file) return;
                uploadDoc.mutate({ file, location: uploadLocation, estimateType: uploadEstimateType, tenderId });
              }}
            >
              {uploadDoc.isPending ? "Importing…" : "Import from document"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 skeleton rounded" />
        <div className="h-8 w-1/2 skeleton rounded" />
        <div className="h-64 skeleton rounded-lg" />
      </div>
    );
  }

  if (!estimate) return null;

  const errorWarnings = estimate.warnings.filter((w) => w.level === "Error");
  const infoWarnings = estimate.warnings.filter((w) => w.level !== "Error");

  return (
    <div className="space-y-6">
      <Link href="/boq" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to estimates
      </Link>
      <PageHeader
        title={`${estimate.estimateType} · ${estimate.projectType}`}
        description={`${estimate.location} · ${estimate.sourceType} · ${estimate.areaSqFt > 0 ? `${estimate.areaSqFt.toLocaleString()} sq ft` : "Imported BOQ"}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => validate.mutate()} disabled={validate.isPending}>
              <ClipboardCheck className="mr-1.5 h-4 w-4" />
              {validate.isPending ? "Validating…" : "Validate"}
            </Button>
            <Button size="sm" variant="default" onClick={() => improveAi.mutate()} disabled={improveAi.isPending}>
              <Sparkles className="mr-1.5 h-4 w-4" />
              {improveAi.isPending ? "AI…" : "Improve with AI"}
            </Button>
          </div>
        }
      />

      {(errorWarnings.length > 0 || infoWarnings.length > 0) && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold">Checks &amp; warnings</h3>
          <ul className="space-y-1.5 text-sm">
            {errorWarnings.map((w) => (
              <li key={w.id} className="text-destructive">
                <span className="font-medium">Error:</span> {w.message}
              </li>
            ))}
            {infoWarnings.map((w) => (
              <li key={w.id} className="text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2 text-right">Rate</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {estimate.items
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((row) => (
                  <tr key={row.id} className="bg-card">
                    <td className="px-3 py-2">
                      <div className="font-medium text-foreground">{row.itemName}</div>
                      {row.normalizedName && row.normalizedName !== row.itemName && (
                        <div className="text-xs text-muted-foreground">Normalized: {row.normalizedName}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.quantity}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.unit}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.rate, "INR", true)}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">
                      {formatCurrency(row.amount, "INR", true)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <p className="mt-3 text-2xl font-bold tabular-nums">{formatCurrency(estimate.totalAmount, "INR", true)}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Run <strong>Validate</strong> for quantity × rate checks and missing items. Use <strong>Improve with AI</strong> for normalization via the FastAPI service.
          </p>
          {estimate.floors != null && (
            <p className="mt-3 text-xs text-muted-foreground">Floors recorded: {estimate.floors}</p>
          )}
          {estimate.finishType && (
            <p className="text-xs text-muted-foreground">Finish: {estimate.finishType}</p>
          )}
        </div>
      </div>
    </div>
  );
}
