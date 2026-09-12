-- Migration 0006: Add expanded onboarding fields to contributor_profiles

alter table public.contributor_profiles
  add column if not exists preferred_name text,
  add column if not exists age_range text,
  add column if not exists country text,
  add column if not exists language text,
  add column if not exists primary_role text,
  add column if not exists field text,
  add column if not exists experience_level text,
  add column if not exists organization_type text,
  add column if not exists why_lr text,
  add column if not exists research_interests jsonb default '[]'::jsonb,
  add column if not exists contribution_experience text,
  add column if not exists profile_visibility text default 'LR administrators only',
  add column if not exists attribution_preference text default 'My name',
  add column if not exists onboarding_status text default 'PENDING',
  add column if not exists onboarding_completed_at timestamp with time zone,
  add column if not exists onboarding_dismissed_at timestamp with time zone;

-- Backfill onboarding_status based on legacy boolean columns
update public.contributor_profiles
set onboarding_status = 'COMPLETED'
where onboarding_completed = true and (onboarding_status is null or onboarding_status = 'PENDING');

update public.contributor_profiles
set onboarding_status = 'DISMISSED'
where onboarding_dismissed = true and (onboarding_status is null or onboarding_status = 'PENDING');
