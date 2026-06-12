import type { Metadata } from "next";
import { TenderDetailPage } from "@/modules/tenders/components/tender-detail-page";

export const metadata: Metadata = {
  title: "Tender Details",
};

interface Props {
  params: { id: string };
}

export default function TenderDetail({ params }: Props) {
  return <TenderDetailPage tenderId={params.id} />;
}
