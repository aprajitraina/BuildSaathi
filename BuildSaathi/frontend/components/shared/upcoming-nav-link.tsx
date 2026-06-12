"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UPCOMING_FEATURE_MAILTO, UPCOMING_NAV_TOOLTIP } from "@/lib/app-nav-config";

type UpcomingNavLinkProps = {
  label: string;
  icon: LucideIcon;
  className?: string;
};

export function UpcomingNavLink({ label, icon: Icon, className }: UpcomingNavLinkProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <a
          href={UPCOMING_FEATURE_MAILTO}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            "cursor-pointer text-muted-foreground/80 hover:bg-muted/80 hover:text-foreground",
            "border border-transparent",
            className
          )}
        >
          <Icon className="h-4 w-4 shrink-0 opacity-60" />
          <span className="flex-1 truncate">{label}</span>
          <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            Upcoming
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[220px] text-left leading-snug">
        {UPCOMING_NAV_TOOLTIP}
      </TooltipContent>
    </Tooltip>
  );
}
