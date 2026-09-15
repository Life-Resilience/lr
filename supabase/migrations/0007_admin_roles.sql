-- Migration 0007: Admin Roles & RLS Policies

create table if not exists public.admins (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert the default admin email from environment as a fallback
insert into public.admins (email) values ('admin@example.com') on conflict do nothing;

-- Admin can read/update all contributions
create policy "Admins can view all contributions"
on public.contributions for select
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );

create policy "Admins can update all contributions"
on public.contributions for update
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );

-- Admin can read all profiles
create policy "Admins can view all profiles"
on public.contributor_profiles for select
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );

create policy "Admins can update all profiles"
on public.contributor_profiles for update
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );

-- Admin can manage admin notes
create policy "Admins can manage admin notes"
on public.contribution_admin_notes for all
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );

-- Admin can view opportunities
create policy "Admins can view all opportunities"
on public.opportunities for select
to authenticated
using ( exists (select 1 from public.admins where email = auth.jwt()->>'email') );
