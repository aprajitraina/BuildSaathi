"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  Building2,
  BellRing,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  dividerAfter?: boolean;
  danger?: boolean;
};

export function AppTopbar() {
  const contractor = useAuthStore((s) => s.contractor);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = contractor?.name
    ? contractor.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "C";

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const menuItems: MenuItem[] = [
    {
      label: "My Account",
      icon: User,
      href: "/settings",
    },
    {
      label: "Profile Settings",
      icon: Settings,
      href: "/settings",
      dividerAfter: true,
    },
    {
      label: "Organization",
      icon: Building2,
      href: "/settings",
    },
    {
      label: "Notifications",
      icon: BellRing,
      href: "/notifications",
      dividerAfter: true,
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: "/billing",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      action: () =>
        window.open(
          "mailto:aprajitraina@gmail.com?subject=BuildSaathi%20Support",
          "_blank"
        ),
      dividerAfter: true,
    },
    {
      label: "Logout",
      icon: LogOut,
      action: handleLogout,
      danger: true,
    },
  ];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#1C1F2B]/95 backdrop-blur-sm px-5 md:px-6">
      {/* Left — breadcrumb placeholder */}
      <div className="flex items-center gap-2" />

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full text-white/40 hover:text-white/80 hover:bg-white/[0.07]"
          onClick={() => router.push("/notifications")}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F97316]" />
        </Button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1 pl-1.5 pr-2.5 transition-all duration-150",
              open
                ? "border-[#F97316]/40 bg-[#F97316]/10 shadow-sm shadow-[#F97316]/10"
                : "border-white/[0.12] bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]"
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F97316]/20 text-[10px] font-bold text-[#F97316] uppercase ring-1 ring-[#F97316]/20">
              {initials}
            </div>
            <span className="hidden text-xs font-medium text-white/75 md:block">
              {contractor?.name?.split(" ")[0] ?? "Contractor"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-white/40 hidden md:block transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
              <div
                className="overflow-hidden rounded-xl border border-white/[0.1] shadow-2xl shadow-black/50"
                style={{ background: "linear-gradient(180deg, #1e2130 0%, #191c28 100%)" }}
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F97316]/20 text-sm font-bold text-[#F97316] uppercase ring-2 ring-[#F97316]/20">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/90 leading-tight">
                      {contractor?.name ?? "Contractor"}
                    </p>
                    <p className="truncate text-[10px] text-white/40 leading-tight mt-0.5">
                      {contractor?.email ?? ""}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx}>
                        <button
                          onClick={() => {
                            setOpen(false);
                            if (item.action) item.action();
                            else if (item.href) router.push(item.href);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2 text-xs transition-colors group",
                            item.danger
                              ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                              : "text-white/55 hover:bg-white/[0.06] hover:text-white/90"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-colors",
                              item.danger ? "text-red-400/70 group-hover:text-red-400" : "opacity-60 group-hover:opacity-90"
                            )}
                          />
                          <span className="flex-1 text-left font-medium">{item.label}</span>
                          {!item.danger && (
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                          )}
                        </button>
                        {item.dividerAfter && (
                          <div className="my-1 mx-3 border-t border-white/[0.06]" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.07] px-4 py-2">
                  <p className="text-[10px] text-white/20">BuildSaathi OS v1.5</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
