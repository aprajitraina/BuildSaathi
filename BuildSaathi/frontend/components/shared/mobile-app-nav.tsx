"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ESTIMATES_HREF,
  mainNavItems,
  settingsNavItem,
} from "@/lib/app-nav-config";

export function MobileAppNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ESTIMATES_HREF) return pathname.startsWith(ESTIMATES_HREF);
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-b border-white/[0.07] bg-[#1C1F2B]/95 px-3 py-2.5 backdrop-blur-sm md:hidden">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isPreview = item.isPreview;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                active
                  ? "bg-[#F97316] text-white shadow-sm shadow-[#F97316]/20"
                  : isPreview
                  ? "border border-white/[0.08] bg-white/[0.03] text-white/35 hover:text-white/55"
                  : "bg-white/[0.06] text-white/50 hover:text-white/75"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {isPreview && !active && (
                <span className="rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-1 text-[8px] font-bold uppercase tracking-wider text-[#F97316]/60">
                  Soon
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href={settingsNavItem.href}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
            isActive(settingsNavItem.href)
              ? "bg-[#F97316] text-white shadow-sm"
              : "bg-white/[0.06] text-white/50 hover:text-white/75"
          )}
        >
          <settingsNavItem.icon className="h-3.5 w-3.5" />
          {settingsNavItem.label}
        </Link>
      </div>
    </div>
  );
}
