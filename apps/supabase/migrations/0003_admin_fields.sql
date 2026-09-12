-- Add public-safe admin fields to contributions table
alter table public.contributions
add column if not exists reviewed_at timestamp with time zone,
add column if not exists admin_response text;

-- Create a separate table for internal admin notes so contributors can never read them
create table if not exists public.contribution_admin_notes (
  contribution_id uuid primary key references public.contributions(id) on delete cascade,
  internal_note text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on the new table
alter table public.contribution_admin_notes enable row level security;

-- Only admins (or nobody in the public API) can read/write this table. 
-- By NOT creating any policies for the 'authenticated' role or 'public', it defaults to deny all for regular users via PostgREST.
