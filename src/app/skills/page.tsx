import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import SkillsView from "@/components/public/SkillsView";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technologies, tools, and domains — AI/ML, full stack, power systems, and more.",
};

export default function SkillsPage() {
  return <PublicLayout active="skills"><SkillsView /></PublicLayout>;
}
