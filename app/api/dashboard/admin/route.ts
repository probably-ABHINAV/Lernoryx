import { requireAuth } from "@/lib/requireAuth";
import { SectionsService } from "@/modules/sections/sections.service";
import { UsersService } from "@/modules/users/users.service";

export async function GET() {
  try {
    const user = await requireAuth();

    if (user?.role !== "admin" && user?.role !== "super_admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Combine queries concurrently for drastically faster processing
    const [sections, users] = await Promise.all([
      SectionsService.list({ profile: user } as any),
      UsersService.list({ profile: user } as any),
    ]);

    return Response.json(
      { success: true, data: { sections, users } },
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
