-- =======================================================================
-- ADD UPLOAD TRACKING METRICS
-- Implements backend security restrictions against abuse and spam via API usage
-- =======================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS upload_count INT DEFAULT 0;
