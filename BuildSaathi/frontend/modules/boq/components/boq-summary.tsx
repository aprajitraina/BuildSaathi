"use client";

import { formatCurrency } from "@/lib/utils";
import type { BOQ } from "@/types/api";

interface BOQSummaryProps {
  boq: BOQ;
}

export function BOQSummary({ boq }: BOQSummaryProps) {
  const baseTotal = boq.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const overhead = baseTotal * (boq.overheadPercent / 100);
  const contingency = baseTotal * (boq.contingencyPercent / 100);
  const grandTotal = baseTotal + overhead + contingency;

  const rows = [
    { label: "Base Cost", value: baseTotal, muted: false },
    { label: `Overhead (${boq.overheadPercent}%)`, value: overhead, muted: true },
    { label: `Contingency (${boq.contingencyPercent}%)`, value: contingency, muted: true },
  ];

  return (
    <div className="sticky top-4 space-y-1 rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Cost Summary</h3>

      <div className="space-y-2">
        {rows.map(({ label, value, muted }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
            <span className={muted ? "text-muted-foreground" : "font-medium text-foreground"}>
              {formatCurrency(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold text-foreground">Grand Total</span>
        <span className="text-base font-bold text-primary">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        {boq.lineItems.length} line items · {boq.state} DSR rates
      </p>
    </div>
  );
}
