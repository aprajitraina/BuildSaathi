"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "₹",
    period: "/month",
    description: "For contractors just exploring the platform",
    features: [
      "5 tender alerts per month",
      "Basic tender discovery",
      "Contractor profile",
      "1 BOQ estimate",
      "Community support",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 999,
    yearlyPrice: 749,
    currency: "₹",
    period: "/month",
    description: "For active contractors bidding on tenders regularly",
    features: [
      "Unlimited tender discovery",
      "20 AI summaries per month",
      "Full BOQ estimator with DSR rates",
      "Tender deadline alerts + WhatsApp",
      "AI estimation copilot",
      "Export to PDF",
      "Priority email support",
    ],
    cta: "Start Pro trial",
    href: "/signup?plan=pro",
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Business",
    monthlyPrice: 2999,
    yearlyPrice: 2249,
    currency: "₹",
    period: "/month",
    description: "For established firms managing multiple projects",
    features: [
      "Everything in Pro",
      "Project milestone tracker",
      "Invoice & payment tracking",
      "Secure document vault",
      "Material price tracker",
      "Up to 5 team members",
      "Dedicated onboarding call",
    ],
    cta: "Start Business trial",
    href: "/signup?plan=business",
    highlighted: false,
  },
];

export function LandingPricing() {
  const [yearly, setYearly] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-24" ref={ref}>
      <div className="container mx-auto px-4 lg:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-muted-foreground">Start free. No credit card needed.</p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                !yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Annual
              <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                −25%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.highlighted
                  ? "border-primary/50 bg-primary/5 shadow-lg ring-1 ring-primary/20"
                  : "border-border/70 bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
                    <Zap className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-foreground">{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.currency}{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-through">
                    ₹{plan.monthlyPrice}/mo billed monthly
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="mt-7 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                size="sm"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Need a custom plan for a large firm or government department?{" "}
          <a href="mailto:hello@buildsaathi.in" className="font-medium text-primary hover:underline">
            Contact us
          </a>
        </motion.p>
      </div>
    </section>
  );
}
