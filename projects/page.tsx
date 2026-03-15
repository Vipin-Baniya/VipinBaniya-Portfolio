import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import ProjectsView from "@/components/public/ProjectsView";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering projects — systems, AI, full stack, and power infrastructure.",
};

export default function ProjectsPage() {
  return <PublicLayout active="projects"><ProjectsView /></PublicLayout>;
}
