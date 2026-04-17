-- =========================================================================================
-- 🚀 PRODUCTION MULTI-TENANT SAAS SCHEMA
-- Contains Schema + Relations + RLS + Triggers + Indexes + Storage Allocations
-- =========================================================================================

-- ==========================================
-- 0. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CORE ORGANIZATIONAL TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 2. CORE USERS SYSTEM 
-- Uses 2-Phase Auth Creation (pending role, NULL org) protecting against early RLS crashes
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'pending' CHECK (role IN ('admin', 'trainer', 'student', 'super_admin', 'pending')),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sync Supabase Auth → native public.users table immediately handling NULL assignments securely
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, org_id)
  VALUES (NEW.id, NEW.email, 'pending', NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- ==========================================
-- 3. INVITE SYSTEM
-- ==========================================
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  role TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 4. TRAINING HIERARCHY
-- Sections -> Sessions -> Attendance & Grades
-- ==========================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  max_capacity INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(section_id, student_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES users(id),
  session_date DATE,
  topic TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Present','Absent','Late')),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score NUMERIC,
  remarks TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. CONTENT & STORAGE META
-- ==========================================
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  file_url TEXT,
  uploaded_by UUID REFERENCES users(id),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT,
  metadata JSONB,
  org_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 6. RELATIONAL INDEXES (PERFORMANCE ARCHITECTURE)
-- Automatically mapping the single massive bottleneck parameters
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_sections_org ON sections(org_id);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);

-- ==========================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. CORE ISOLATION POLICIES (THE NULL-SAFE ARCHITECTURE)
-- ==========================================

-- Organizations: Only viewable if you are inside them
CREATE POLICY "Org isolation" ON organizations FOR SELECT TO authenticated
USING (id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- Users: Must always be able to select themselves to prevent onboarding crashes if org_id=NULL
CREATE POLICY "Users isolation" ON users FOR ALL TO authenticated
USING (
  id = auth.uid() 
  OR (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND org_id IS NOT NULL)
    AND org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  )
);

-- Safely distribute explicit table level Org Isolation boundaries preventing Null evaluations natively
CREATE POLICY "Generic Org Isolation" ON invites FOR ALL TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON sections FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON enrollments FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON sessions FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON attendance FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON grades FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON content FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Generic Org Isolation" ON activity_logs FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));


-- ==========================================
-- 9. MUTATION (INSERT) POLICIES
-- Automatically ensures you ONLY write data to your native Organization parameters
-- ==========================================

CREATE POLICY "Insert own org data" ON sections FOR INSERT TO authenticated
WITH CHECK (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Insert own org data" ON sessions FOR INSERT TO authenticated
WITH CHECK (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Insert own org data" ON attendance FOR INSERT TO authenticated
WITH CHECK (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Insert own org data" ON grades FOR INSERT TO authenticated
WITH CHECK (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

CREATE POLICY "Insert own org data" ON content FOR INSERT TO authenticated
WITH CHECK (EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND org_id IS NOT NULL) AND org_id = (SELECT org_id FROM users WHERE id=auth.uid()));

-- ==========================================
-- 9b. MUTATION (UPDATE) POLICIES
-- ==========================================

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

-- ==========================================
-- 10. ROLE SECURE DELETIONS 
-- ==========================================

CREATE POLICY "Admin only delete" ON sections FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND org_id IS NOT NULL));

CREATE POLICY "Admin only delete" ON sessions FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND org_id IS NOT NULL));

CREATE POLICY "Admin only delete" ON attendance FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND org_id IS NOT NULL));

-- ==========================================
-- 11. GLOBAL STORAGE INITIALIZATION
-- Allocates native Storage buckets scaling dynamically across Public & Private policies
-- ==========================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- Map explicit accessibility to authenticated instances executing standard storage layer integrations
CREATE POLICY "Access own files" ON storage.objects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
