"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPreview } from "./product-preview";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const BADGES = [
  "GePNIC • State portals • CPWD",
  "AI-powered summaries",
  "DSR-accurate estimates",
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 md:pt-32 lg:min-h-screen lg:flex lg:items-center">
      {/* Background layers */}
      <div className="absolute inset-0 hero-grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Eyebrow pill */}
            <motion.div {...fadeUp(0)}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Built for Indian contractors in 28 states
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              The Operating System{" "}
              <span className="text-gradient">for Contractors</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p {...fadeUp(0.2)} className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Discover government tenders, estimate costs with DSR rates, track projects and collect payments —
              all in one place. Powered by AI built for India.
            </motion.p>

            {/* Feature pills */}
            <motion.div {...fadeUp(0.3)} className="mt-5 flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border/80 bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(0.35)} className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2 shadow-md glow-primary-sm">
                <Link href="/signup">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 border-border/80"
              >
                <Link href="#preview">
                  <Play className="h-4 w-4 fill-current" />
                  See it in action
                </Link>
              </Button>
            </motion.div>

            {/* Social proof line */}
            <motion.div {...fadeUp(0.45)} className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🧑‍💼", "👷", "🏗️", "👩‍💼"].map((emoji, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-sm shadow-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">12,000+</span> contractors across India
              </p>
            </motion.div>
          </div>

          {/* Right — product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <ProductPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
