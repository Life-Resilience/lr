CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contributors_count integer;
  contributions_count integer;
  research_areas_count integer;
  published_responses_count integer;
  researchers_count integer;
BEGIN
  -- Count only active contributors, not researchers or admins (assuming standard roles)
  SELECT count(*) INTO contributors_count FROM public.contributor_profiles 
  WHERE primary_role = 'Contributor';
  
  -- Count only submitted or processed contributions, ignoring drafts
  SELECT count(*) INTO contributions_count FROM public.contributions 
  WHERE status != 'DRAFT';
  
  -- Count only public areas
  SELECT count(*) INTO research_areas_count FROM public.research_areas 
  WHERE is_public = true;
  
  -- Count only published feedback
  SELECT count(*) INTO published_responses_count FROM public.community_feedback 
  WHERE status = 'PUBLISHED';
  
  -- Count only public researchers
  SELECT count(*) INTO researchers_count FROM public.contributor_profiles 
  WHERE primary_role = 'Researcher' AND profile_visibility = 'Public';

  RETURN json_build_object(
    'contributors', contributors_count,
    'contributions', contributions_count,
    'research_areas', research_areas_count,
    'published_responses', published_responses_count,
    'researchers', researchers_count
  );
END;
$$;
