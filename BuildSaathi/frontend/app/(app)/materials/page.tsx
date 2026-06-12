import type { Metadata } from "next";
import { MaterialsPage } from "@/modules/materials/components/materials-page";

export const metadata: Metadata = {
  title: "Materials",
};

export default function MaterialsRoute() {
  return <MaterialsPage />;
}
