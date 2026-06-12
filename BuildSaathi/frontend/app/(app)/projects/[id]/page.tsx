import type { Metadata } from "next";
import { ProjectDetailPage } from "@/modules/projects/components/project-detail-page";

export const metadata: Metadata = {
  title: "Project Detail",
};

interface Props {
  params: { id: string };
}

export default function ProjectDetailRoute({ params }: Props) {
  return <ProjectDetailPage projectId={params.id} />;
}
