create table if not exists public.contributor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  email text,
  age text,
  study_work text,
  study_work_details text,
  discovery_source text,
  discovery_details text,
  onboarding_completed boolean default false not null,
  onboarding_dismissed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contributor_profiles enable row level security;

create policy "Users can read their own profile"
on public.contributor_profiles for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own profile"
on public.contributor_profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own profile"
on public.contributor_profiles for update
to authenticated
using (auth.uid() = user_id);
