-- ========================================================
-- RPC FUNCTION TO SECURELY MARK SHARE COMPLETED BY ANON
-- ========================================================

CREATE OR REPLACE FUNCTION public.mark_share_completed(p_participation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update participation status to 'shared'
  UPDATE public.campaign_participations
  SET status = 'shared'
  WHERE id = p_participation_id;

  -- Update reward status to 'pending_validation'
  UPDATE public.campaign_rewards
  SET status = 'pending_validation'
  WHERE participation_id = p_participation_id;

  -- Log event for sharing
  INSERT INTO public.campaign_events (
    campaign_id, 
    participation_id, 
    event_type
  ) 
  SELECT 
    campaign_id, 
    p_participation_id, 
    'story_shared'
  FROM public.campaign_participations
  WHERE id = p_participation_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_share_completed TO anon;
GRANT EXECUTE ON FUNCTION public.mark_share_completed TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_share_completed TO service_role;
