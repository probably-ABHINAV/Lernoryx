import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { UsersRepo } from "@/modules/users/users.repo";
import { ActivityService } from "@/modules/activity/activity.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth();
    const { profile } = authUser;
    
    // Safety Isolation check
    if (!profile?.org_id) {
      return NextResponse.json({ error: "No organization boundary detected" }, { status: 403 });
    }

    // Process physical usage constraint protections BEFORE analyzing heavy buffers
    const currentUploads = await UsersRepo.getUploadCount(authUser.id);
    if (currentUploads >= 10) {
      return NextResponse.json({ error: "Upload limit reached" }, { status: 429 });
    }

    // Extract generalized multipart payload bounds
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sectionId = formData.get("section_id") as string;
    
    if (!file || !sectionId) {
      return NextResponse.json({ error: "Missing required payload parameters" }, { status: 400 });
    }

    // Constraint 1: Absolute File Boundaries (5MB mapped dynamically via environment blocks)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File exactly exceeds extreme 5MB constraint limits" }, { status: 400 });
    }

    // Constraint 2: Content MIME Parsing Native Protections
    const safeTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!safeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid generic file type provided." }, { status: 400 });
    }

    // Constraint 3: Multi-tenant Absolute Bucket Pathing
    const supabase = await createClient();
    const ext = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const storagePath = `${profile.org_id}/${sectionId}/${safeName}`;

    // Convert internal blob interface into an ArrayBuffer strictly bound for backend HTTP Supabase transactions
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('content')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false // Prevent explicit overriding
      });

    if (uploadError) {
      throw uploadError;
    }

    // Log Activity Context naturally mapping down onto the global tracking tables
    await ActivityService.log({
      userId: authUser.id,
      action: "UPLOAD_FILE",
      orgId: profile.org_id,
      metadata: { file: file.name, size: file.size, path: storagePath }
    });

    // Enforce scaling limitation cost checks
    await UsersRepo.incrementUploadCount(authUser.id);

    return NextResponse.json({ success: true, path: uploadData.path });

  } catch (error: any) {
    console.error("Upload execution rejected: ", error);
    return NextResponse.json({ error: error.message || "Failed to process upload payload" }, { status: 500 });
  }
}
