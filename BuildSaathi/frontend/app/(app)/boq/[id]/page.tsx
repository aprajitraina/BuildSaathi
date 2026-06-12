import type { Metadata } from "next";
import { BOQDetailPage } from "@/modules/boq/components/boq-detail-page";

export const metadata: Metadata = {
  title: "BOQ Estimate",
};

interface Props {
  params: { id: string };
}

export default function BOQDetail({ params }: Props) {
  return <BOQDetailPage boqId={params.id} />;
}
