import type { Metadata } from "next";
import { TendersPage } from "@/modules/tenders/components/tenders-page";

export const metadata: Metadata = {
  title: "Tender Discovery",
};

export default function Tenders() {
  return <TendersPage />;
}
