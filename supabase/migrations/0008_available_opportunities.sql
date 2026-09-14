create table if not exists public.available_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null default 'RESEARCH',
  status text not null default 'OPEN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.available_opportunities enable row level security;

create policy "Anyone can view open available opportunities"
on public.available_opportunities for select
using (status = 'OPEN');

create policy "Admins can manage available opportunities"
on public.available_opportunities
using (
  exists (select 1 from public.admins where email = auth.jwt()->>'email')
);
