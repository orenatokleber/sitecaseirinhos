DROP POLICY IF EXISTS "Anyone can read rewards by code" ON public.campaign_rewards;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.campaign_rewards FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_rewards TO authenticated;
GRANT ALL ON public.campaign_rewards TO service_role;