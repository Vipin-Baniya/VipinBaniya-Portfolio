import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import ExperienceView from "@/components/public/ExperienceView";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles, contributions, and learnings.",
};

export default function Page() {
  return <PublicLayout active="experience"><ExperienceView /></PublicLayout>;
}
