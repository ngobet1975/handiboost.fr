-- Migration: Add verified_at column to directories
ALTER TABLE directories ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
