create sequence if not exists public.contributions_seq start 1;

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  display_id text not null default 'LR-C-' || lpad(nextval('public.contributions_seq')::text, 3, '0'),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  title text not null,
  content text not null,
  metadata jsonb,
  status text not null default 'SUBMITTED',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.contributions enable row level security;

create policy "Users can insert their own contributions"
on public.contributions for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own contributions"
on public.contributions for select
to authenticated
using (auth.uid() = user_id);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  area text not null,
  reason text not null,
  experience text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.opportunities enable row level security;

create policy "Users can insert their own opportunities"
on public.opportunities for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own opportunities"
on public.opportunities for select
to authenticated
using (auth.uid() = user_id);
