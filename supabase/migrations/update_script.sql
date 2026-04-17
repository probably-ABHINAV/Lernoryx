-- =======================================================================
-- ONLY RUN THIS SCRIPT IF YOU HAVE ALREADY GENERATED THE ORIGINAL SCHEMA
-- Contains safely structured delta-updates for adding the `UPDATE` Policies and `DEFAULT` states.
-- =======================================================================

-- 1. Add Default Fallback for New Users missing immediate assignments
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'pending';

-- 2. Add Explicit UPDATE RLS Policies matching your existing Org-Isolated architectures
CREATE POLICY "Update own org data" ON sections FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Update own org data" ON sessions FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Update own org data" ON attendance FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Update own org data" ON grades FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Update own org data" ON content FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

-- 3. Safety Check: Verify Storage Allocations (If they were missing from your first execution run)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- 4. Enable Authentication specific uploads to Storage
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
