"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Building2, Construction, Droplets, Hammer, HelpCircle, Layers,
  Mail, Sparkles, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimationList } from "../hooks/use-estimation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EstimateTypeCard } from "./estimate-type-card";
import { EstimatesUploadPanel } from "./estimates-upload-panel";
import { EstimatePreview } from "./estimate-preview";
import { mailtoForEstimateInterest } from "../lib/estimate-mailto";
import { UPCOMING_FEATURE_MAILTO } from "@/lib/app-nav-config";
import type { ParsedEstimate } from "@/lib/excel-parser";

export function EstimatesLandingPage() {
  const { data: estimates, isLoading } = useEstimationList();
  const [parsedEstimate, setParsedEstimate] = useState<ParsedEstimate | null>(null);
  const [parsedFileName, setParsedFileName] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleParsed = (result: ParsedEstimate, file: File) => {
    setParsedEstimate(result);
    setParsedFileName(file.name);
    // Smooth scroll to the preview
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:grid-cols-[1fr_min(340px,100%)] lg:items-start">

        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="min-w-0 space-y-8">

          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-[#F97316]/15 bg-gradient-to-br from-[#1C1F2B] via-[#232638] to-[#1a1d2a] px-7 py-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#F97316]/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-[#F97316]/6 blur-2xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316] shadow-lg shadow-[#F97316]/25">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]/80">
                  BuildSaathi Estimates
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  What estimate are you looking for?
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
                  Create, review and manage construction estimates with AI-powered assistance.
                  Pick a type below or upload an existing BOQ / Excel file.
                </p>
                <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    <Sparkles className="h-3 w-3 text-violet-400" />
                    AI-powered estimation
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    Live DSR rates
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#F97316]/70">
                    Smart Excel Parser
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Parsed Estimate Preview ──────────────────── */}
          {parsedEstimate && (
            <section ref={previewRef} className="scroll-mt-4">
              <EstimatePreview
                estimate={parsedEstimate}
                fileName={parsedFileName}
                onClose={() => { setParsedEstimate(null); setParsedFileName(""); }}
              />
            </section>
          )}

          {/* Estimate type cards */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-2">
                Choose estimate type
              </h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <EstimateTypeCard
                title="Building Estimate"
                description="Residential or commercial building quantities using norms and RateMaster rates."
                icon={Building2}
                href="/boq/new?discipline=building"
              />
              <EstimateTypeCard
                title="Road Estimate"
                description="Highways, pavements, and alignment-based quantities. Tell us your scope."
                icon={Construction}
                mailtoHref={mailtoForEstimateInterest("Road estimate", "a road / highway / pavement estimate")}
              />
              <EstimateTypeCard
                title="Drainage & Culverts"
                description="Storm water, culverts, and drainage networks. Request support to model this."
                icon={Droplets}
                mailtoHref={mailtoForEstimateInterest("Drainage estimate", "drainage / culverts / storm water works")}
              />
              <EstimateTypeCard
                title="Renovation Estimate"
                description="Retrofit, repair, and finishing packages with measured quantities."
                icon={Hammer}
                mailtoHref={mailtoForEstimateInterest("Renovation estimate", "renovation / repair / retrofit works")}
              />
              <EstimateTypeCard
                title="Other Civil Works"
                description="Bridges, retaining walls, site development, or mixed packages."
                icon={Layers}
                mailtoHref={mailtoForEstimateInterest("Other civil works", "other civil / infrastructure works")}
              />
              <EstimateTypeCard
                title="Not sure? Guide me"
                description="Unsure which category fits? Read the quick guide or email us directly."
                icon={HelpCircle}
                variant="guide"
                href="#estimate-guide"
              />
            </div>
          </section>

          {/* Recent estimates */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Your recent estimates</h2>
              <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                <Link href="/boq/new">
                  New estimate
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[60px] skeleton rounded-xl" />
                ))}
              </div>
            ) : estimates?.length ? (
              <div className="overflow-hidden divide-y divide-border/40 rounded-2xl border border-border/60 bg-card shadow-sm">
                {estimates.map((est) => (
                  <Link
                    key={est.id}
                    href={`/boq/${est.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-muted/50 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F97316]/10">
                        <Building2 className="h-3.5 w-3.5 text-[#F97316]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-[#F97316] transition-colors">
                          {est.estimateType} · {est.projectType}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {est.location} · {est.itemCount} items · {formatDate(est.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                      {formatCurrency(est.totalAmount, "INR", true)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No estimates yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose a type above or upload an Excel/BOQ file to get started.
                  </p>
                </div>
                <Button asChild size="sm" className="bg-[#F97316] text-white hover:bg-[#ea580c] border-0 mt-1">
                  <Link href="/boq/new">Create first estimate</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Guide section */}
          <section id="estimate-guide" className="scroll-mt-24 rounded-2xl border border-border/60 bg-card px-6 py-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
              <Sparkles className="h-4 w-4 text-[#F97316]" />
              Quick guide: which type should I pick?
            </h2>
            <dl className="space-y-3 text-sm text-muted-foreground">
              {[
                { term: "Building", def: "New or vertical construction where plinth area and floors drive material norms (cement, steel, bricks)." },
                { term: "Road", def: "Linear projects: earthwork, GSB, WBM, bitumen layers, culverts along a chainage." },
                { term: "Drainage", def: "Underground pipes, manholes, box culverts, and outfalls." },
                { term: "Renovation", def: "Interior retrofit, structural repairs, or partial demolition-rebuild with measured items." },
              ].map(({ term, def }) => (
                <div key={term} className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-foreground w-24">{term}</dt>
                  <dd className="leading-relaxed">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Help CTA */}
          <section className="flex flex-col gap-3 rounded-2xl border border-[#F97316]/20 bg-gradient-to-br from-[#F97316]/[0.04] to-transparent px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Need something custom?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mail the BuildSaathi team for custom scopes, issues, or feature requests.
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 bg-[#F97316] text-white hover:bg-[#ea580c] border-0 shadow-sm shadow-[#F97316]/20"
            >
              <a href={UPCOMING_FEATURE_MAILTO} className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact owner
              </a>
            </Button>
          </section>
        </div>

        {/* ── RIGHT COLUMN (Upload) ────────────────────── */}
        <aside className="min-w-0">
          <EstimatesUploadPanel onParsed={handleParsed} />
        </aside>
      </div>
    </div>
  );
}
