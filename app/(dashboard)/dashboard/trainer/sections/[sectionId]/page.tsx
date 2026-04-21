import { requireAuth } from "@/lib/requireAuth";
import { SectionDetailClient } from "./section-detail-client";
import { redirect } from "next/navigation";

export default async function SectionDetailPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") redirect("/dashboard");
  const { sectionId } = await params;
  return <SectionDetailClient sectionId={sectionId} />;
}
