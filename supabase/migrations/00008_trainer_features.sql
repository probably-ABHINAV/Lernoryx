-- ─── Session notes ─────────────────────────────────────────────────────────
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─── Announcements table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  trainer_id  TEXT NOT NULL REFERENCES public.users(id),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  org_id      UUID NOT NULL REFERENCES public.organizations(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_section ON public.announcements(section_id);

-- RLS is intentionally skipped here as it is globally disabled for Clerk integration in 00006_clerk_migration.
