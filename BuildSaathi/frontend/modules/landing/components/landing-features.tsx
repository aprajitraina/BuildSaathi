"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileSearch, Calculator, FolderKanban, Sparkles, Package, Receipt,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileSearch,
    tag: "Tender Discovery",
    title: "Every relevant tender, in one feed",
    description:
      "One unified view of government tenders from GePNIC, state portals, CPWD, and railways. Smart filters by state, category, and value range. Daily digest straight to WhatsApp.",
    color: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    highlight: true,
  },
  {
    icon: Sparkles,
    tag: "AI Copilot",
    title: "Understand a 30-page tender in 60 seconds",
    description:
      "GPT-4o reads the full tender document and returns scope, eligibility, EMD requirements, key risks, and a recommendation — in plain language.",
    color: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    highlight: false,
  },
  {
    icon: Calculator,
    tag: "BOQ Estimator",
    title: "DSR-accurate cost estimates, instantly",
    description:
      "Build Bill of Quantities with current state DSR rates. AI suggests line items based on work category. Export as PDF for submission in minutes.",
    color: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    highlight: false,
  },
  {
    icon: FolderKanban,
    tag: "Project Tracker",
    title: "Milestone tracking for every active project",
    description:
      "Set milestones, track site progress, upload completion photos, and share progress reports with clients. Never miss a billing stage again.",
    color: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    highlight: false,
  },
  {
    icon: Package,
    tag: "Material Intel",
    title: "Know material prices before they hit you",
    description:
      "Live cement, steel, sand, and aggregate rates from your district. Compare vendors, track price trends, and protect your margins before finalising BOQs.",
    color: "from-rose-500/20 to-pink-500/5",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    highlight: false,
  },
  {
    icon: Receipt,
    tag: "Billing & Vault",
    title: "Invoices, payments, and documents in one place",
    description:
      "Raise invoices, track payment status, receive overdue alerts, and store all your tender documents, certificates, and contracts securely.",
    color: "from-sky-500/20 to-indigo-500/5",
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
    highlight: false,
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 ${
        feature.highlight ? "ring-1 ring-primary/30" : ""
      }`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative">
        {/* Tag */}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {feature.tag}
        </span>

        {/* Icon */}
        <div className={`mt-3 flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}>
          <Icon className={`h-5 w-5 ${feature.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-base font-bold leading-snug text-foreground group-hover:text-foreground">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>

        {/* Arrow */}
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Learn more
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </motion.div>
  );
}

export function LandingFeatures() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Platform
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything a contractor needs.
            <br />
            <span className="text-gradient">Nothing they don&apos;t.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            From bid discovery to final payment — BuildSaathi covers every critical workflow
            so you can focus on building, not paperwork.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.tag} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
