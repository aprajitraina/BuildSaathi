"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "BuildSaathi changed how we chase tenders. The AI summary saves us 2–3 hours per bid — we just read the 1-page brief and decide. We've won 3 contracts in the last quarter that we wouldn't have found without it.",
    name: "Rajeev Sharma",
    role: "Director, Sharma Construction Pvt. Ltd.",
    location: "Lucknow, UP",
    avatar: "RS",
    avatarColor: "bg-blue-500",
  },
  {
    quote:
      "The BOQ estimator with DSR rates is exactly what we needed. Earlier I had to call 3 people to get accurate rates. Now it's built in. The PDF export is clean enough to submit directly with the bid.",
    name: "Priya Nambiar",
    role: "Owner, Nambiar Infra Works",
    location: "Kochi, Kerala",
    avatar: "PN",
    avatarColor: "bg-violet-500",
  },
  {
    quote:
      "We were managing 6 projects on spreadsheets and WhatsApp. BuildSaathi brought everything — milestones, billing, documents — under one roof. Our collections have improved 40% since using it.",
    name: "Santosh Desai",
    role: "MD, Desai Engineering Co.",
    location: "Pune, Maharashtra",
    avatar: "SD",
    avatarColor: "bg-emerald-500",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-muted/30 py-24" ref={ref}>
      <div className="container mx-auto px-4 lg:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contractors who use it, swear by it
          </h2>
          <p className="mt-3 text-muted-foreground">Real stories from contractors across India.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col rounded-xl border border-border/70 bg-background p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatarColor}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Used by contractors in{" "}
          <span className="font-semibold text-foreground">
            UP, Maharashtra, Gujarat, Karnataka, Tamil Nadu
          </span>{" "}
          and 23 more states.
        </motion.div>
      </div>
    </section>
  );
}
