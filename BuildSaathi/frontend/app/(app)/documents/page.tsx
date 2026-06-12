import type { Metadata } from "next";
import { DocumentsPage } from "@/modules/documents/components/documents-page";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsRoute() {
  return <DocumentsPage />;
}
