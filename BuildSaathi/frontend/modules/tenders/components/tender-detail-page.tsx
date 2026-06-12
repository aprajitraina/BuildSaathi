"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkCheck, Calculator, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useTender, useSaveTender } from "../hooks/use-tenders";
import { AISummaryPanel } from "./ai-summary-panel";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TenderDetailPageProps {
  tenderId: string;
}

export function TenderDetailPage({ tenderId }: TenderDetailPageProps) {
  const { data: tender, isLoading, isError } = useTender(tenderId);
  const saveMutation = useSaveTender();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 skeleton rounded" />
        <div className="h-8 w-3/4 skeleton rounded" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !tender) {
    return <EmptyState title="Tender not found" description="This tender may have been removed or expired." />;
  }

  const metadata = [
    { label: "Reference No.", value: tender.referenceNumber },
    { label: "Department", value: tender.department },
    { label: "Organization", value: tender.organization },
    { label: "State / Location", value: `${tender.state}${tender.district ? `, ${tender.district}` : ""}` },
    { label: "Category", value: tender.category },
    { label: "Estimated Value", value: formatCurrency(tender.estimatedValue) },
    { label: "EMD Amount", value: tender.emdAmount ? formatCurrency(tender.emdAmount) : "—" },
    { label: "Document Fee", value: tender.documentFee ? formatCurrency(tender.documentFee) : "Free" },
    { label: "Published", value: formatDate(tender.publishedDate) },
    { label: "Submission Deadline", value: formatDate(tender.submissionDeadline) },
    { label: "Opening Date", value: tender.openingDate ? formatDate(tender.openingDate) : "—" },
    { label: "Source Portal", value: tender.sourcePortal },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/tenders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Tenders
      </Link>

      {/* Title + Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-snug text-foreground">{tender.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{tender.department}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveMutation.mutate({ id: tender.id, isSaved: tender.isSaved })}
            disabled={saveMutation.isPending}
          >
            {tender.isSaved ? (
              <><BookmarkCheck className="mr-1.5 h-4 w-4 text-primary" /> Saved</>
            ) : (
              <><Bookmark className="mr-1.5 h-4 w-4" /> Save</>
            )}
          </Button>
          <Button asChild size="sm">
            <Link href={`/boq/new?tenderId=${tender.id}`}>
              <Calculator className="mr-1.5 h-4 w-4" />
              Create Estimate
            </Link>
          </Button>
          {tender.sourceUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a href={tender.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-3 lg:grid-cols-4">
        {metadata.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* AI Summary Panel */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">AI Tender Summary</h2>
        </div>
        <AISummaryPanel tenderId={tender.id} hasSummary={tender.hasSummary} />
      </div>
    </div>
  );
}
