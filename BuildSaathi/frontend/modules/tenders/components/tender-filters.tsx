"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INDIAN_STATES, TENDER_CATEGORIES } from "@/lib/constants";
import type { TenderSearchParams } from "../services/tender-service";

interface TenderFiltersProps {
  filters: TenderSearchParams;
  onChange: (filters: TenderSearchParams) => void;
}

export function TenderFilters({ filters, onChange }: TenderFiltersProps) {
  const update = (patch: Partial<TenderSearchParams>) =>
    onChange({ ...filters, ...patch, pageNumber: 1 });

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Filters</h3>

      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-xs">Search</Label>
        <Input
          placeholder="Search tenders..."
          value={filters.query ?? ""}
          onChange={(e) => update({ query: e.target.value || undefined })}
        />
      </div>

      {/* State */}
      <div className="space-y-1.5">
        <Label className="text-xs">State</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={filters.state ?? ""}
          onChange={(e) => update({ state: e.target.value || undefined })}
        >
          <option value="">All States</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-xs">Category</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={filters.category ?? ""}
          onChange={(e) => update({ category: e.target.value || undefined })}
        >
          <option value="">All Categories</option>
          {TENDER_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Value Range */}
      <div className="space-y-1.5">
        <Label className="text-xs">Min Value (₹ Lakhs)</Label>
        <Input
          type="number"
          placeholder="0"
          value={filters.minValue ? filters.minValue / 100000 : ""}
          onChange={(e) =>
            update({ minValue: e.target.value ? Number(e.target.value) * 100000 : undefined })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Max Value (₹ Lakhs)</Label>
        <Input
          type="number"
          placeholder="Any"
          value={filters.maxValue ? filters.maxValue / 100000 : ""}
          onChange={(e) =>
            update({ maxValue: e.target.value ? Number(e.target.value) * 100000 : undefined })
          }
        />
      </div>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => onChange({ pageNumber: 1, pageSize: 20 })}
      >
        Reset Filters
      </Button>
    </div>
  );
}
