import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import AchievementsView from "@/components/public/AchievementsView";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Hackathons, awards, research, and recognition.",
};

export default function Page() {
  return <PublicLayout active="achievements"><AchievementsView /></PublicLayout>;
}
