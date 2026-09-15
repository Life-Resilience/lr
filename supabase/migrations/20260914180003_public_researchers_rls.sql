-- Add public SELECT policy for researchers
CREATE POLICY "Public can view public researchers"
ON public.contributor_profiles FOR SELECT
USING (primary_role = 'Researcher' AND profile_visibility = 'Public');
