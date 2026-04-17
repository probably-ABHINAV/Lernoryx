import { createClient } from "@/lib/supabase/server";

interface ActivityParams {
  userId: string;
  action: string;
  metadata?: any;
  orgId?: string;
}

/**
 * Global Activity Tracking Log Service
 */
export class ActivityService {
  static async log(params: ActivityParams) {
    const supabase = await createClient();
    
    // Explicit fail-safe insertion blocking hard crashing on pure tracking events
    const { error } = await supabase.from("activity_logs").insert({
      user_id: params.userId,
      action: params.action,
      metadata: params.metadata || {},
      org_id: params.orgId || null,
    });
    
    if (error) {
      console.warn("Soft fail on activity logging: ", error);
    }
  }
}
