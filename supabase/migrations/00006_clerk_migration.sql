-- ==============================================================================
-- Migration: Clerk Authentication Integration & App-level RBAC Enabler
-- Drops all RLS policies, disables RLS, changes users.id from UUID to TEXT,
-- and removes all legacy auth triggers/tables.
-- ==============================================================================

-- 1. DISABLE RLS GLOBALLY
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE invites DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE content DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL RLS POLICIES (policies reference columns and block type changes)
-- Organizations
DROP POLICY IF EXISTS "Org isolation" ON organizations;

-- Users
DROP POLICY IF EXISTS "Users isolation" ON users;

-- Invites
DROP POLICY IF EXISTS "Generic Org Isolation" ON invites;

-- Sections
DROP POLICY IF EXISTS "Generic Org Isolation" ON sections;
DROP POLICY IF EXISTS "Insert own org data" ON sections;
DROP POLICY IF EXISTS "Update own org data" ON sections;
DROP POLICY IF EXISTS "Admin only delete" ON sections;

-- Enrollments
DROP POLICY IF EXISTS "Generic Org Isolation" ON enrollments;

-- Sessions
DROP POLICY IF EXISTS "Generic Org Isolation" ON sessions;
DROP POLICY IF EXISTS "Insert own org data" ON sessions;
DROP POLICY IF EXISTS "Update own org data" ON sessions;
DROP POLICY IF EXISTS "Admin only delete" ON sessions;

-- Attendance
DROP POLICY IF EXISTS "Generic Org Isolation" ON attendance;
DROP POLICY IF EXISTS "Insert own org data" ON attendance;
DROP POLICY IF EXISTS "Update own org data" ON attendance;
DROP POLICY IF EXISTS "Admin only delete" ON attendance;

-- Grades
DROP POLICY IF EXISTS "Generic Org Isolation" ON grades;
DROP POLICY IF EXISTS "Insert own org data" ON grades;
DROP POLICY IF EXISTS "Update own org data" ON grades;

-- Content
DROP POLICY IF EXISTS "Generic Org Isolation" ON content;
DROP POLICY IF EXISTS "Insert own org data" ON content;
DROP POLICY IF EXISTS "Update own org data" ON content;

-- Activity Logs
DROP POLICY IF EXISTS "Generic Org Isolation" ON activity_logs;

-- Storage
DROP POLICY IF EXISTS "Access own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Drop the helper function used by fix_rls.sql (if it was ever applied)
DROP FUNCTION IF EXISTS get_auth_org_id CASCADE;

-- 3. DROP OBSOLETE AUTH TRIGGERS & FUNCTIONS
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS handle_better_auth_signup CASCADE;

-- 4. DROP BETTER AUTH TABLES (IF EXISTS)
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- 5. DROP FOREIGN KEYS REFERENCING users.id
ALTER TABLE invites DROP CONSTRAINT IF EXISTS invites_invited_by_fkey;
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_created_by_fkey;
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_trainer_id_fkey;
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_student_id_fkey;
ALTER TABLE grades DROP CONSTRAINT IF EXISTS grades_student_id_fkey;
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_uploaded_by_fkey;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;

-- Drop PK constraint tying users to Supabase auth
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users DROP COLUMN IF EXISTS better_auth_id;

-- 6. TYPECAST ALL USER-REFERENCING COLUMNS FROM UUID -> TEXT
ALTER TABLE invites ALTER COLUMN invited_by TYPE TEXT USING invited_by::TEXT;
ALTER TABLE sections ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;
ALTER TABLE enrollments ALTER COLUMN student_id TYPE TEXT USING student_id::TEXT;
ALTER TABLE sessions ALTER COLUMN trainer_id TYPE TEXT USING trainer_id::TEXT;
ALTER TABLE attendance ALTER COLUMN student_id TYPE TEXT USING student_id::TEXT;
ALTER TABLE grades ALTER COLUMN student_id TYPE TEXT USING student_id::TEXT;
ALTER TABLE content ALTER COLUMN uploaded_by TYPE TEXT USING uploaded_by::TEXT;
ALTER TABLE activity_logs ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- 7. TYPECAST CORE USERS TABLE PK TO TEXT
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS upload_count INT DEFAULT 0;

-- 8. RE-ESTABLISH FOREIGN KEYS
ALTER TABLE invites ADD CONSTRAINT invites_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sections ADD CONSTRAINT sections_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE sessions ADD CONSTRAINT sessions_trainer_id_fkey FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE attendance ADD CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE grades ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE content ADD CONSTRAINT content_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 9. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
