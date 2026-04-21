-- ─── Feature flags table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  -- NULL org_id = platform-wide default
  flag_name   TEXT NOT NULL,
  enabled     BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_by  TEXT REFERENCES public.users(id),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, flag_name),
  UNIQUE NULLS NOT DISTINCT (org_id, flag_name)
);

-- ─── Org status column ──────────────────────────────────────────────────────
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'deleted')),
  ADD COLUMN IF NOT EXISTS suspended_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by  TEXT REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS plan          TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS seat_limit    INTEGER NOT NULL DEFAULT 10;

-- ─── Platform activity log view (cross-org) ─────────────────────────────────
-- Super admin reads activity_logs with no RLS (service role) — no view needed,
-- but create a helpful index for filtering by date range
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_org_action ON public.activity_logs(org_id, action);

-- ─── Platform health snapshots (optional persistent cache) ──────────────────
CREATE TABLE IF NOT EXISTS public.health_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_at  TIMESTAMPTZ DEFAULT NOW(),
  db_latency_ms   INTEGER,
  auth_latency_ms INTEGER,
  storage_latency_ms INTEGER,
  status      TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'degraded', 'down'))
);

-- Keep only last 1000 snapshots
CREATE OR REPLACE FUNCTION trim_health_snapshots()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.health_snapshots
  WHERE id IN (
    SELECT id FROM public.health_snapshots
    ORDER BY checked_at DESC
    OFFSET 1000
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trim_health_after_insert
  AFTER INSERT ON public.health_snapshots
  FOR EACH ROW EXECUTE FUNCTION trim_health_snapshots();

-- ─── Seed default feature flags ─────────────────────────────────────────────
INSERT INTO public.feature_flags (org_id, flag_name, enabled, description)
VALUES
  (NULL, 'assignments',     true,  'Assignment creation and submission workflow'),
  (NULL, 'leaderboard',     true,  'Section leaderboard visible to students'),
  (NULL, 'streaks',         true,  'XP and streak gamification for students'),
  (NULL, 'announcements',   true,  'Trainer batch announcements'),
  (NULL, 'export_csv',      true,  'Admin CSV export feature'),
  (NULL, 'org_settings',    true,  'Organization settings page for admins')
ON CONFLICT DO NOTHING;

-- ─── RLS: feature_flags readable by all authenticated users ─────────────────
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_flags_select" ON public.feature_flags FOR SELECT
  USING (true); -- All authenticated users can read flags
