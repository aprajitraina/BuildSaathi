"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EstimateTypeCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  mailtoHref?: string;
  variant?: "default" | "guide";
  className?: string;
};

export function EstimateTypeCard({
  title,
  description,
  icon: Icon,
  href,
  mailtoHref,
  variant = "default",
  className,
}: EstimateTypeCardProps) {
  const isGuide = variant === "guide";

  const content = (
    <>
      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
          isGuide
            ? "bg-violet-50 dark:bg-violet-950/30 text-violet-500"
            : "bg-[#F97316]/10 text-[#F97316]"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}
      <h3 className="flex items-center gap-1 text-sm font-semibold tracking-tight text-foreground leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground flex-1">{description}</p>

      {/* CTA hint */}
      <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#F97316] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {isGuide ? "Read guide" : href ? "Start estimate" : "Get in touch"}
        <ArrowRight className="h-3 w-3" />
      </div>
    </>
  );

  const shell = cn(
    "group relative flex flex-col rounded-2xl border bg-card p-5 shadow-sm",
    "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
    isGuide
      ? "border-violet-200/60 dark:border-violet-800/30 hover:border-violet-300 dark:hover:border-violet-700/40"
      : "border-border/60 hover:border-[#F97316]/25",
    className
  );

  if (mailtoHref) {
    return <a href={mailtoHref} className={shell}>{content}</a>;
  }
  if (href) {
    return <Link href={href} className={shell}>{content}</Link>;
  }
  return <div className={shell}>{content}</div>;
}
