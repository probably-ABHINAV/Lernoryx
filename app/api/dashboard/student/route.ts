import { requireAuth } from "@/lib/auth";
import { SessionsService } from "@/modules/sessions/sessions.service";
import { AttendanceService } from "@/modules/attendance/attendance.service";

export async function GET() {
  try {
    const { profile } = await requireAuth();

    if (profile?.role !== "student" && profile?.role !== "super_admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const [sessions, attendance] = await Promise.all([
      SessionsService.list({ profile } as any),
      AttendanceService.list({ profile } as any),
    ]);

    return Response.json(
      { success: true, data: { sessions, attendance } },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
