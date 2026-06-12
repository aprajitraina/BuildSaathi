import Link from "next/link";
import { CheckCircle2, HardHat, Zap, FileSearch, TrendingUp, Package } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "AI-powered estimation",
    desc: "Generate BOQ and cost estimates in minutes using live DSR rates.",
  },
  {
    icon: FileSearch,
    title: "Tender intelligence",
    desc: "Track tenders from 1,000+ government portals across all states.",
  },
  {
    icon: TrendingUp,
    title: "Project tracking",
    desc: "Manage milestones, progress, and site activities end-to-end.",
  },
  {
    icon: Package,
    title: "Material & billing",
    desc: "Rate benchmarking, invoicing, and payment tracking in one place.",
  },
];

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export function AuthSplitLayout({ children, heading, subheading }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── LEFT: Branding panel ──────────────────────── */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden px-10 py-10 lg:flex lg:w-[45%] xl:w-[48%]"
        style={{ background: "linear-gradient(160deg, #1C1F2B 0%, #232638 50%, #1a1d29 100%)" }}
      >
        {/* Blueprint grid */}
        <div className="absolute inset-0 blueprint-grid opacity-100" />
        {/* Orange glow */}
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[#F97316]/12 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#F97316]/6 blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 group w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316] shadow-lg shadow-[#F97316]/30 transition-transform group-hover:scale-105">
            <HardHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-tight leading-tight">
              Build<span className="text-[#F97316]">Sathi</span>
            </p>
            <p className="text-[10px] text-white/35 font-medium uppercase tracking-widest mt-0.5">
              Your Construction Partner
            </p>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]/70 mb-3">
              Contractor OS · 28 States
            </p>
            <h2 className="text-3xl font-bold leading-snug tracking-tight text-white xl:text-[2.1rem]">
              Manage your site, estimates
              {" "}
              <span className="text-[#F97316]">and tenders</span>
              {" "}— all in one place
            </h2>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F97316]/15">
                  <Icon className="h-3.5 w-3.5 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                  <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Mini dashboard preview */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wide">
                Live dashboard
              </p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400/80 font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Active tenders", value: "12", color: "text-[#F97316]" },
                { label: "Pending estimates", value: "3", color: "text-violet-400" },
                { label: "Invoices due", value: "₹4.6L", color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-[11px] text-white/45">{label}</span>
                  </div>
                  <span className={`text-[11px] font-bold tabular-nums ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust badge */}
        <div className="relative flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-white/25 shrink-0" />
          <p className="text-[10px] text-white/25 leading-relaxed">
            Trusted by contractors across 28 states · SOC 2 compliant infrastructure
          </p>
        </div>
      </div>

      {/* ── RIGHT: Auth form ──────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F8F9FA] dark:bg-background px-5 py-10 sm:px-8 lg:px-10">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316] shadow-md">
            <HardHat className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Build<span className="text-[#F97316]">Sathi</span>
            </span>
          </div>
        </Link>

        <div className="w-full max-w-[360px]">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{heading}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-card p-7 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
