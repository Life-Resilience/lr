-- 1. Revert any researchers incorrectly assigned by the previous LIMIT 2 logic
UPDATE public.contributor_profiles 
SET profile_visibility = 'LR administrators only', primary_role = 'Contributor'
WHERE primary_role = 'Researcher' AND profile_visibility = 'Public';

-- 2. Assign the intended researchers deterministically by name
UPDATE public.contributor_profiles 
SET profile_visibility = 'Public', primary_role = 'Researcher'
WHERE name ILIKE '%Jothish%' OR name ILIKE '%Karthik%';
