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
  
  BEGIN
    EXECUTE 'SELECT count(*) FROM public.research_areas WHERE is_public = true' INTO research_areas_count;
  EXCEPTION WHEN OTHERS THEN
    research_areas_count := 0;
  END;

  BEGIN
    EXECUTE 'SELECT count(*) FROM public.community_feedback WHERE status = ''PUBLISHED''' INTO published_responses_count;
  EXCEPTION WHEN OTHERS THEN
    published_responses_count := 0;
  END;

  RETURN json_build_object(
    'contributors', contributors_count,
    'contributions', contributions_count,
    'research_areas', research_areas_count,
    'published_responses', published_responses_count
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_table_names()
RETURNS table(table_name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT t.table_name::text FROM information_schema.tables t WHERE t.table_schema = 'public';
END;
$$;

CREATE OR REPLACE FUNCTION run_query_json(q text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  res json;
BEGIN
  EXECUTE 'SELECT json_agg(t) FROM (' || q || ') t' INTO res;
  RETURN res;
END;
$$;
