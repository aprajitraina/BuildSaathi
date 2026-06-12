import type { Metadata } from "next";
import { SavedTendersPage } from "@/modules/tenders/components/saved-tenders-page";

export const metadata: Metadata = {
  title: "Saved Tenders",
};

export default function SavedTenders() {
  return <SavedTendersPage />;
}
