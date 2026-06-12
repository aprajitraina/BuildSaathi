import type { Metadata } from "next";
import { BOQListPage } from "@/modules/boq/components/boq-list-page";

export const metadata: Metadata = {
  title: "Estimates",
};

export default function BOQ() {
  return <BOQListPage />;
}
