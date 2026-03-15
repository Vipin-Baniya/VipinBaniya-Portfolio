import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import BlogView from "@/components/public/BlogView";
export const metadata: Metadata = { title: "Notes", description: "Engineering insights, learnings, and ideas." };
export default function BlogPage() {
  return <PublicLayout active="blog"><BlogView /></PublicLayout>;
}
