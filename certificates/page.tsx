import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import CertificatesView from "@/components/public/CertificatesView";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Verified skills and completed programs.",
};

export default function Page() {
  return <PublicLayout active="certificates"><CertificatesView /></PublicLayout>;
}
