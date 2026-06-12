"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/60 to-slate-950" />
      <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute inset-0 hero-grid-bg opacity-10" />

      <div className="container relative mx-auto px-4 text-center lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to win more tenders?
          </h2>

          <p className="mt-5 text-lg text-slate-300">
            Join 12,000+ contractors across India who use BuildSaathi to discover opportunities,
            estimate accurately, and get paid faster.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-white text-slate-900 hover:bg-slate-100"
            >
              <Link href="/signup">
                Start free — no card needed
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Free forever on Starter plan. Pro trial includes all features for 14 days.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
