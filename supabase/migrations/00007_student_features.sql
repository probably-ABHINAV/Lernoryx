-- ─── Queries table (student → trainer Q&A) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.queries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id    UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  student_id    TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT,
  answered_by   TEXT REFERENCES public.users(id),
  answered_at   TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered')),
  org_id        UUID NOT NULL REFERENCES public.organizations(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Assignments table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id    UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      TIMESTAMPTZ,
  created_by    TEXT NOT NULL REFERENCES public.users(id),
  org_id        UUID NOT NULL REFERENCES public.organizations(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Submissions table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id     TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_url       TEXT,
  notes          TEXT,
  grade          NUMERIC,
  feedback       TEXT,
  graded_by      TEXT REFERENCES public.users(id),
  graded_at      TIMESTAMPTZ,
  status         TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
  org_id         UUID NOT NULL REFERENCES public.organizations(id),
  submitted_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- ─── Streaks table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streaks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  current_streak  INTEGER NOT NULL DEFAULT 0,
  longest_streak  INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  total_xp        INTEGER NOT NULL DEFAULT 0,
  org_id          UUID NOT NULL REFERENCES public.organizations(id)
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_queries_section    ON public.queries(section_id);
CREATE INDEX IF NOT EXISTS idx_queries_student    ON public.queries(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_section ON public.assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_streaks_student    ON public.streaks(student_id);

-- RLS is intentionally skipped here as it is globally disabled for Clerk integration in 00006_clerk_migration.
