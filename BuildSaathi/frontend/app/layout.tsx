import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BuildSaathi — Contractor Operating System",
    template: "%s | BuildSaathi",
  },
  description:
    "AI-powered platform for Indian contractors. Discover tenders, estimate costs, track projects, and manage payments — all in one place.",
  keywords: [
    "contractor management",
    "tender discovery",
    "BOQ estimator",
    "project tracking",
    "construction software India",
    "government tender",
  ],
  authors: [{ name: "BuildSaathi" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://buildsaathi.in",
    siteName: "BuildSaathi",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
      <body className={`${inter.variable} font-sans antialiased h-full overflow-hidden`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
