"use client";

import { Button } from "@/components/ui/button";

export default function AppSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">Unable to load this page</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Please try refreshing this module."}
      </p>
      <Button className="mt-4" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
