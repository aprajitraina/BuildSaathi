import Link from "next/link";
import { Building2, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Tender Discovery", href: "#features" },
    { label: "AI BOQ Estimator", href: "#features" },
    { label: "Project Tracker", href: "#features" },
    { label: "Billing & Payments", href: "#features" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      {/* Main grid */}
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-14 md:grid-cols-5 lg:px-6">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">BuildSaathi</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The contractor operating system for India. Discover tenders, estimate accurately,
            track projects, and get paid — all in one platform.
          </p>
          <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
              <a href="mailto:hello@buildsaathi.in" className="hover:text-foreground">
                hello@buildsaathi.in
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title} className="col-span-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              {title}
            </p>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} BuildSaathi Technologies Pvt. Ltd. All rights reserved.</p>
          <p>
            Made with ❤️ for contractors in{" "}
            <span className="font-medium text-foreground">Bharat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
