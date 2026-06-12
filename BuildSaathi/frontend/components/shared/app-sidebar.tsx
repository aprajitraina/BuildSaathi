"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ESTIMATES_HREF,
  mainNavItems,
  settingsNavItem,
} from "@/lib/app-nav-config";
import { useAuthStore } from "@/modules/auth/store/auth-store";

function SoonBadge() {
  return (
    <span className="shrink-0 rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F97316]/70">
      Soon
    </span>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const contractor = useAuthStore((s) => s.contractor);

  const isActive = (href: string) => {
    if (href === ESTIMATES_HREF) return pathname.startsWith(ESTIMATES_HREF);
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className="hidden w-[220px] shrink-0 flex-col md:flex"
      style={{
        background: "linear-gradient(180deg, #1C1F2B 0%, #181b27 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-[58px] items-center px-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href={ESTIMATES_HREF}
          className="flex items-center gap-2.5 group select-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316] shadow-lg shadow-[#F97316]/30 transition-all duration-200 group-hover:scale-105 group-hover:shadow-[#F97316]/50">
            <HardHat className="h-4 w-4 text-white" />
          </div>
          <div className="leading-none">
            <span className="text-sm font-bold text-white tracking-tight">
              Build<span className="text-[#F97316]">Sathi</span>
            </span>
            <p className="text-[9px] text-white/35 tracking-wide mt-0.5 font-medium uppercase">
              Construction OS
            </p>
          </div>
        </Link>
      </div>

      <TooltipProvider delayDuration={200}>
        {/* Main nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pt-4 scrollbar-thin">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Navigation
          </p>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isPreview = item.isPreview;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-[rgba(249,115,22,0.14)] text-[#F97316]"
                        : isPreview
                        ? "text-white/40 hover:bg-white/[0.05] hover:text-white/65"
                        : "text-white/60 hover:bg-white/[0.07] hover:text-white/90"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-[5px] bottom-[5px] w-[3px] rounded-r-full bg-[#F97316]" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-[#F97316]" : isPreview ? "opacity-40" : "opacity-60"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isPreview && !active && <SoonBadge />}
                  </Link>
                </TooltipTrigger>
                {isPreview && !active && (
                  <TooltipContent
                    side="right"
                    className="max-w-[200px] text-left text-xs leading-snug"
                  >
                    Preview mode — module under development. Click to explore!
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom section — user + settings */}
        <div
          className="px-3 pb-4 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            href={settingsNavItem.href}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              isActive(settingsNavItem.href)
                ? "bg-[rgba(249,115,22,0.14)] text-[#F97316]"
                : "text-white/55 hover:bg-white/[0.07] hover:text-white/90"
            )}
          >
            {isActive(settingsNavItem.href) && (
              <span className="absolute left-0 top-[5px] bottom-[5px] w-[3px] rounded-r-full bg-[#F97316]" />
            )}
            <settingsNavItem.icon className="h-4 w-4 shrink-0 opacity-60" />
            <span>{settingsNavItem.label}</span>
          </Link>

          {/* User pill */}
          <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 bg-white/[0.04] border border-white/[0.05]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F97316]/20 text-[11px] font-bold text-[#F97316] uppercase shrink-0 ring-1 ring-[#F97316]/20">
              {contractor?.name?.charAt(0) ?? "C"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/75 leading-tight">
                {contractor?.name ?? "Contractor"}
              </p>
              <p className="truncate text-[10px] text-white/30 leading-tight">
                {contractor?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </aside>
  );
}
