-- Rename the table that held Participant Interests
ALTER TABLE IF EXISTS public.opportunities RENAME TO participant_interests;

-- Rename the table that held Admin-posted Opportunities
ALTER TABLE IF EXISTS public.available_opportunities RENAME TO opportunities;

-- Drop old RLS policies for available_opportunities (now opportunities)
DROP POLICY IF EXISTS "Anyone can view open available opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can manage available opportunities" ON public.opportunities;

-- Recreate RLS policies for opportunities
CREATE POLICY "Anyone can view open opportunities" 
ON public.opportunities FOR SELECT 
USING (status = 'OPEN' OR status = 'PUBLISHED');

CREATE POLICY "Admins can manage opportunities" 
ON public.opportunities 
USING (
  exists (select 1 from public.admins where email = auth.jwt()->>'email')
);

-- Recreate RLS policies for participant_interests (formerly opportunities)
-- (assuming there were some, if not, create them)
ALTER TABLE public.participant_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own interests" ON public.participant_interests;
CREATE POLICY "Users can insert their own interests" 
ON public.participant_interests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own interests" ON public.participant_interests;
CREATE POLICY "Users can view their own interests" 
ON public.participant_interests FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage participant interests" ON public.participant_interests;
CREATE POLICY "Admins can manage participant interests" 
ON public.participant_interests 
USING (
  exists (select 1 from public.admins where email = auth.jwt()->>'email')
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'SUBMITTED',
  content text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage applications" 
ON public.applications 
USING (
  exists (select 1 from public.admins where email = auth.jwt()->>'email')
);
