-- ─── Add status column to invites if missing ───────────────────────────────
ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;

-- Generate token + expiry on insert
CREATE OR REPLACE FUNCTION set_invite_defaults()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.token     := encode(gen_random_bytes(32), 'hex');
  NEW.expires_at := NOW() + INTERVAL '7 days';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_invite_defaults_trigger ON public.invites;
CREATE TRIGGER set_invite_defaults_trigger
  BEFORE INSERT ON public.invites
  FOR EACH ROW EXECUTE FUNCTION set_invite_defaults();

-- ─── Org settings table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.org_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  timezone      TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  logo_url      TEXT,
  notify_email  BOOLEAN NOT NULL DEFAULT true,
  notify_before_session_minutes INTEGER NOT NULL DEFAULT 30,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS intentionality skipped for Clerk

-- Seed default settings for existing orgs
INSERT INTO public.org_settings (org_id)
SELECT id FROM public.organizations
ON CONFLICT (org_id) DO NOTHING;

-- Auto-create settings on new org creation
CREATE OR REPLACE FUNCTION create_org_settings()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.org_settings (org_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_org_created ON public.organizations;
CREATE TRIGGER on_org_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION create_org_settings();

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invites_token   ON public.invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_email   ON public.invites(email);
CREATE INDEX IF NOT EXISTS idx_invites_org     ON public.invites(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_org    ON public.activity_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_user   ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_action ON public.activity_logs(action);
