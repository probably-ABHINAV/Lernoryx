"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/requireAuth";

type ImpersonateRole = "admin" | "trainer" | "student" | "super_admin";

export async function setImpersonateRole(role: ImpersonateRole) {
  // Verify the caller is actually a super admin
  const user = await requireAuth();
  if (user.role !== "super_admin") {
      throw new Error("Unauthorized");
  }

  const cookieStore = await cookies();

  if (role === "super_admin") {
    cookieStore.delete("tms_impersonate_role");
  } else {
    cookieStore.set("tms_impersonate_role", role, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,    // 8 hours max impersonation session
    });
  }

  revalidatePath("/", "layout");
}

export async function clearImpersonation() {
  const user = await requireAuth();
  if (user.role !== "super_admin") {
      throw new Error("Unauthorized");
  }
  const cookieStore = await cookies();
  cookieStore.delete("tms_impersonate_role");
  revalidatePath("/", "layout");
}
