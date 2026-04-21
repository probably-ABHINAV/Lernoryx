import { requireAuth } from "@/lib/requireAuth";
import { SectionsClient } from "./sections-client";
import { redirect } from "next/navigation";

export const metadata = { title: "My Sections — TMS" };

export default async function TrainerSectionsPage() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "trainer") redirect("/dashboard");
  return <SectionsClient />;
}
