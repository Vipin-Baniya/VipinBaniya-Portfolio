import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import ProjectDetailView from "@/components/public/ProjectDetailView";
import { getProjectMetadata } from "@/lib/seo";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  return getProjectMetadata(params.slug);
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <PublicLayout active="projects">
      <ProjectDetailView slug={params.slug} />
    </PublicLayout>
  );
}
