import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import TestimonialsView from "@/components/public/TestimonialsView";
export const metadata: Metadata = { title: "Testimonials", description: "What collaborators and mentors say." };
export default function TestimonialsPage() {
  return <PublicLayout active="testimonials"><TestimonialsView /></PublicLayout>;
}
