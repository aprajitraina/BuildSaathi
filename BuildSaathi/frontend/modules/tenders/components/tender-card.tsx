"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Tender } from "@/types/api";
import { useSaveTender } from "../hooks/use-tenders";

interface TenderCardProps {
  tender: Tender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const saveMutation = useSaveTender();
  const daysToDeadline = Math.ceil(
    (new Date(tender.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tenders/${tender.id}`} className="flex-1 min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
            {tender.title}
          </h3>
        </Link>
        <button
          onClick={() => saveMutation.mutate({ id: tender.id, isSaved: tender.isSaved })}
          disabled={saveMutation.isPending}
          className="shrink-0 rounded p-1 text-muted-foreground hover:text-primary"
        >
          {tender.isSaved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Department */}
      <p className="mt-1 truncate text-xs text-muted-foreground">{tender.department}</p>

      {/* Metadata grid */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Value</p>
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(tender.estimatedValue, "INR", true)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">State</p>
          <p className="text-sm font-medium text-foreground">{tender.state}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Category</p>
          <p className="text-sm font-medium text-foreground">{tender.category}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Deadline</p>
          <p
            className={cn(
              "text-sm font-medium",
              daysToDeadline <= 3 ? "text-red-600" : daysToDeadline <= 7 ? "text-yellow-600" : "text-foreground"
            )}
          >
            {formatDate(tender.submissionDeadline)}
          </p>
        </div>
      </div>

      {/* Footer badges */}
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {tender.sourcePortal}
        </span>
        {tender.hasSummary && (
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <Sparkles className="h-2.5 w-2.5" />
            AI Summary
          </span>
        )}
        {daysToDeadline <= 5 && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
            {daysToDeadline}d left
          </span>
        )}
      </div>
    </div>
  );
}
