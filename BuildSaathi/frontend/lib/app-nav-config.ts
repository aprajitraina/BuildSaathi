import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileSearch,
  Calculator,
  FolderKanban,
  Package,
  Receipt,
  FolderOpen,
  Settings,
} from "lucide-react";

/** Opens email client — feature request / help (sidebar upcoming items). */
export const UPCOMING_FEATURE_MAILTO =
  "mailto:aprajitraina@gmail.com?subject=BuildSaathi%20Feature%20Request&body=Hi%20BuildSaathi%20team,%0A%0AI%20faced%20an%20issue%20with%20%5Bmention%20your%20problem%20here%5D.%20Please%20help%20me%20offline%20and%20we%20can%20do%20it%20online%20with%20your%20help.%0A%0AThanks";

export const UPCOMING_NAV_TOOLTIP =
  "This module is coming soon. Mail the owner to request access or report a need.";

export type NavItemDef = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When true, item is a clickable route. When false, renders as "Soon" disabled. */
  isActiveModule: boolean;
  /** When true, module is in preview/coming-soon mode — clickable but shows rich preview UI */
  isPreview?: boolean;
};

export const ESTIMATES_HREF = "/boq";

export const mainNavItems: NavItemDef[] = [
  { href: "/dashboard",   label: "Dashboard",  icon: LayoutDashboard, isActiveModule: true },
  { href: "/tenders",     label: "Tenders",    icon: FileSearch,      isActiveModule: true, isPreview: true },
  { href: ESTIMATES_HREF, label: "Estimates",  icon: Calculator,      isActiveModule: true },
  { href: "/projects",    label: "Projects",   icon: FolderKanban,    isActiveModule: true, isPreview: true },
  { href: "/materials",   label: "Materials",  icon: Package,         isActiveModule: true, isPreview: true },
  { href: "/billing",     label: "Billing",    icon: Receipt,         isActiveModule: true, isPreview: true },
  { href: "/documents",   label: "Documents",  icon: FolderOpen,      isActiveModule: true, isPreview: true },
];

export const settingsNavItem: NavItemDef = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
  isActiveModule: true,
};
