"use client";

import { Sparkles, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenderSummary, useRequestSummary } from "../hooks/use-tenders";

interface AISummaryPanelProps {
  tenderId: string;
  hasSummary: boolean;
}

const TONE_LABELS = {
  high: { label: "Strong Match", color: "text-green-600 bg-green-50" },
  medium: { label: "Worth Reviewing", color: "text-yellow-600 bg-yellow-50" },
  low: { label: "Low Fit", color: "text-red-600 bg-red-50" },
} as const;

export function AISummaryPanel({ tenderId, hasSummary }: AISummaryPanelProps) {
  const { data: summary, isLoading } = useTenderSummary(tenderId);
  const requestSummary = useRequestSummary();

  // Summary not yet fetched or not available — show generate button
  if (!hasSummary && !summary && !isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <Sparkles className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">Get an instant AI summary</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Understand scope, risks, and eligibility in 60 seconds — no need to read the full PDF.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => requestSummary.mutate({ tenderId })}
          disabled={requestSummary.isPending}
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          {requestSummary.isPending ? "Generating..." : "Generate AI Summary"}
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading || requestSummary.isPending) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Reading tender document...
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 skeleton rounded" style={{ width: `${70 + i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const tone = TONE_LABELS[summary.recommendation];

  return (
    <div className="rounded-lg border border-primary/20 bg-card p-5 space-y-4">
      {/* Recommendation badge */}
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.color}`}>
          <TrendingUp className="mr-1 inline h-3 w-3" />
          {tone.label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            AI · {!summary.isAiGenerated && "Mock · "}{new Date(summary.generatedAt).toLocaleDateString("en-IN")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => requestSummary.mutate({ tenderId, forceRegenerate: true })}
            disabled={requestSummary.isPending}
          >
            Regenerate
          </Button>
        </div>
      </div>

      {/* Scope */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scope of Work</p>
        <p className="mt-1 text-sm text-foreground">{summary.scopeOfWork}</p>
      </div>

      {/* Key Requirements */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Requirements</p>
        <ul className="mt-1 space-y-1">
          {summary.keyRequirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Eligibility */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Eligibility Criteria</p>
        <ul className="mt-1 space-y-1">
          {summary.eligibilityCriteria.map((crit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
              {crit}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      {summary.keyRisks.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Risks</p>
          <ul className="mt-1 space-y-1">
            {summary.keyRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation reasoning */}
      <div className="rounded-md bg-muted/50 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">AI Recommendation: </span>
          {summary.recommendationReason}
        </p>
      </div>
    </div>
  );
}
