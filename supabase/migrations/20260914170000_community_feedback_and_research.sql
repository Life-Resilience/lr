CREATE TABLE IF NOT EXISTS public.research_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  is_public boolean default true,
  status text not null default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.research_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view public research areas"
ON public.research_areas FOR SELECT
USING (is_public = true);

-- Insert existing research areas
INSERT INTO public.research_areas (title, slug, description, status) VALUES
('Social Engineering & Impersonation Attacks', 'social-engineering', 'An investigation into how attackers manipulate human psychology to bypass technical security controls.', 'COMPLETED'),
('Phishing', 'phishing', 'Analyzing the evolution of deceptive communications across email, SMS, and messaging platforms.', 'IN PROGRESS'),
('Malware', 'malware', 'Studying the deployment vectors and execution patterns of malicious software affecting end users.', 'PENDING'),
('Digital Fraud', 'digital-fraud', 'Examining the systemic mechanisms behind financial exploitation, payment vulnerabilities, and synthetic fraud at scale.', 'PENDING'),
('Identity Security', 'identity-security', 'Investigating vulnerabilities in authentication protocols, credential theft, and decentralized access management.', 'PENDING')
ON CONFLICT (slug) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.community_feedback (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid references public.contributor_profiles(id) on delete cascade not null,
  research_area_id uuid references public.research_areas(id) on delete set null,
  contribution_id uuid references public.contributions(id) on delete set null,
  response text not null,
  attribution_preference text default 'Anonymous',
  status text not null default 'SUBMITTED', -- SUBMITTED, UNDER REVIEW, PUBLISHED, REJECTED
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

ALTER TABLE public.community_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributors can view their own feedback"
ON public.community_feedback FOR SELECT
TO authenticated
USING (contributor_id IN (SELECT id FROM public.contributor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Contributors can insert their own feedback"
ON public.community_feedback FOR INSERT
TO authenticated
WITH CHECK (contributor_id IN (SELECT id FROM public.contributor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view published feedback"
ON public.community_feedback FOR SELECT
USING (status = 'PUBLISHED');

-- Make the two users "Public" "Researchers"
UPDATE public.contributor_profiles 
SET profile_visibility = 'Public', primary_role = 'Researcher'
WHERE id IN (
  SELECT id FROM public.contributor_profiles LIMIT 2
);

CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  contributors_count integer;
  contributions_count integer;
  research_areas_count integer;
  published_responses_count integer;
BEGIN
  SELECT count(*) INTO contributors_count FROM public.contributor_profiles;
  SELECT count(*) INTO contributions_count FROM public.contributions WHERE status NOT IN ('DRAFT');
  SELECT count(*) INTO research_areas_count FROM public.research_areas WHERE is_public = true;
  SELECT count(*) INTO published_responses_count FROM public.community_feedback WHERE status = 'PUBLISHED';

  RETURN json_build_object(
    'contributors', contributors_count,
    'contributions', contributions_count,
    'research_areas', research_areas_count,
    'published_responses', published_responses_count
  );
END;
$$;
