-- ==========================================
-- STEP 10: INVITES TABLE
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  role text,
  org_id uuid,
  invited_by uuid,
  status text DEFAULT 'pending',
  created_at timestamp DEFAULT now()
);

-- ==========================================
-- STEP 11: ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 2. Basic Isolation Policies (Users can only see data from their own org)
CREATE POLICY "Users can see same org"
ON users FOR SELECT TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Sections org isolation"
ON sections FOR ALL TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Sessions org isolation"
ON sessions FOR ALL TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Attendance org isolation"
ON attendance FOR ALL TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Grades org isolation"
ON grades FOR ALL TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Invites org isolation"
ON invites FOR SELECT TO authenticated
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 3. Insert Policies (Prevent inserting data into other orgs)
CREATE POLICY "Insert own org sections"
ON sections FOR INSERT TO authenticated
WITH CHECK (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Insert own org sessions"
ON sessions FOR INSERT TO authenticated
WITH CHECK (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Insert own org attendance"
ON attendance FOR INSERT TO authenticated
WITH CHECK (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Insert own org grades"
ON grades FOR INSERT TO authenticated
WITH CHECK (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Insert own org invites (Admins Only)"
ON invites FOR INSERT TO authenticated
WITH CHECK (
  org_id = (SELECT org_id FROM users WHERE id = auth.uid()) 
  AND exists (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Admin Only Role-Based Controls (Example: Only Admins can delete sections)
CREATE POLICY "Admin only delete sections"
ON sections FOR DELETE TO authenticated
USING (exists (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Note: Ensure you review and add additional INSERT/UPDATE/DELETE policies 
-- based on specific business rules (e.g., Trainers can grade, Students only read).
