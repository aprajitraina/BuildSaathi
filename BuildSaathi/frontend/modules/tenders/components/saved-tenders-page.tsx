"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TenderCard } from "./tender-card";
import { useSavedTenders } from "../hooks/use-tenders";

export function SavedTendersPage() {
  const { data: tenders, isLoading } = useSavedTenders();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Tenders"
        description="Tenders you are tracking and evaluating."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !tenders?.length ? (
        <EmptyState
          icon={Bookmark}
          title="No saved tenders"
          description="Browse tenders and save the ones you want to track."
          action={
            <Link
              href="/tenders"
              className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Tenders
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      )}
    </div>
  );
}
