"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const METRICS = [
  { value: 2400, suffix: "+ Cr", label: "Tenders tracked annually", prefix: "₹" },
  { value: 12000, suffix: "+", label: "Contractors registered", prefix: "" },
  { value: 28, suffix: "", label: "States covered", prefix: "" },
  { value: 99.9, suffix: "%", label: "Platform uptime", prefix: "" },
];

function AnimatedNumber({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplay(current);
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const formatted = target % 1 !== 0
    ? display.toFixed(1)
    : Math.floor(display).toLocaleString("en-IN");

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function MetricsStrip() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-14">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-10 hero-grid-bg" />

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <AnimatedNumber target={m.value} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-1.5 text-sm text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Trusted by contractors across Uttar Pradesh, Maharashtra, Gujarat, Rajasthan and 24 more states.
        </p>
      </div>
    </section>
  );
}
