"use server";

import { requireAuth } from "@/lib/requireAuth";
import { createClient } from "@/lib/supabase/server";

export async function updateStreak() {
  const authUser = await requireAuth();
  if (authUser.profile.role !== "student") return null;
  const user = { id: authUser.id, orgId: authUser.org_id };
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("streaks")
    .select("*")
    .eq("student_id", user.id)
    .single();

  if (!existing) {
    await supabase.from("streaks").insert({
      student_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
      total_xp: 10,
      org_id: user.orgId,
    });
    return { streak: 1, xp: 10 };
  }

  const lastActive = existing.last_active_date;
  if (lastActive === today) return { streak: existing.current_streak, xp: existing.total_xp };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const isConsecutive = lastActive === yesterdayStr;
  const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
  const xpGained = newStreak >= 7 ? 50 : newStreak >= 3 ? 25 : 10;

  await supabase
    .from("streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existing.longest_streak),
      last_active_date: today,
      total_xp: existing.total_xp + xpGained,
    })
    .eq("student_id", user.id);

  return { streak: newStreak, xp: existing.total_xp + xpGained };
}
