-- ========================================================
-- SECURITY AND EXTERNAL COUPON INTEGRATIONS FOR SURPRESA
-- ========================================================

-- 1. Alter campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN require_access_token boolean NOT NULL DEFAULT false,
ADD COLUMN external_menu_url text;

-- 2. Alter campaign_prizes table
ALTER TABLE public.campaign_prizes
ADD COLUMN static_coupon_code text;

-- 3. Create campaign_access_tokens table
CREATE TABLE public.campaign_access_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  used_at timestamptz,
  used_by_whatsapp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_access_tokens_campaign ON public.campaign_access_tokens(campaign_id);
CREATE INDEX idx_access_tokens_token ON public.campaign_access_tokens(token);

GRANT SELECT, INSERT ON public.campaign_access_tokens TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_access_tokens TO authenticated;
GRANT ALL ON public.campaign_access_tokens TO service_role;

ALTER TABLE public.campaign_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read token status"
ON public.campaign_access_tokens FOR SELECT
USING (true);

CREATE POLICY "Admins manage access tokens"
ON public.campaign_access_tokens FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Create campaign_prize_coupons table (Pool of unique codes)
CREATE TABLE public.campaign_prize_coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prize_id uuid NOT NULL REFERENCES public.campaign_prizes(id) ON DELETE CASCADE,
  coupon_code text NOT NULL,
  is_used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  used_by_participation_id uuid REFERENCES public.campaign_participations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_prize_coupon UNIQUE (prize_id, coupon_code)
);

CREATE INDEX idx_prize_coupons_prize ON public.campaign_prize_coupons(prize_id);
CREATE INDEX idx_prize_coupons_code ON public.campaign_prize_coupons(coupon_code);

GRANT SELECT ON public.campaign_prize_coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_prize_coupons TO authenticated;
GRANT ALL ON public.campaign_prize_coupons TO service_role;

ALTER TABLE public.campaign_prize_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read coupons"
ON public.campaign_prize_coupons FOR SELECT
USING (true);

CREATE POLICY "Admins manage coupons"
ON public.campaign_prize_coupons FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Alter campaign_rewards table
ALTER TABLE public.campaign_rewards
ADD COLUMN external_coupon_code text;

-- 6. Update the select_prize_atomically function to validate tokens and select external coupons
CREATE OR REPLACE FUNCTION public.select_prize_atomically(
  p_campaign_id uuid,
  p_participant_name text,
  p_participant_whatsapp text,
  p_source text DEFAULT 'package',
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_fingerprint text DEFAULT NULL,
  p_access_token text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_campaign record;
  v_prize record;
  v_participation_id uuid;
  v_reward_code text;
  v_external_coupon_code text;
  v_expires_at timestamptz;
  v_rand numeric;
  v_cumulative numeric := 0;
  v_existing record;
  v_code_attempts integer := 0;
  v_code_exists boolean;
  v_token_record record;
  v_coupon_record record;
BEGIN
  -- 1. Lock and validate campaign
  SELECT * INTO v_campaign
  FROM public.campaigns
  WHERE id = p_campaign_id
    AND status = 'active'
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at >= now())
  FOR SHARE;

  IF v_campaign IS NULL THEN
    RETURN jsonb_build_object('error', 'campaign_not_found', 'message', 'Campanha não encontrada ou inativa.');
  END IF;

  -- 2. Validate Access Token if required
  IF v_campaign.require_access_token THEN
    IF p_access_token IS NULL OR p_access_token = '' THEN
      RETURN jsonb_build_object('error', 'token_required', 'message', 'Um link de acesso válido é obrigatório para esta campanha.');
    END IF;

    SELECT * INTO v_token_record
    FROM public.campaign_access_tokens
    WHERE campaign_id = p_campaign_id AND token = p_access_token
    FOR UPDATE;

    IF v_token_record IS NULL THEN
      RETURN jsonb_build_object('error', 'invalid_token', 'message', 'Link de acesso inválido para esta campanha.');
    END IF;

    IF v_token_record.used_at IS NOT NULL THEN
      RETURN jsonb_build_object('error', 'token_already_used', 'message', 'Este link de acesso já foi utilizado para girar a roleta.');
    END IF;
  END IF;

  -- 3. Check for existing participation (fallback checks if WhatsApp participated already)
  SELECT * INTO v_existing
  FROM public.campaign_participations
  WHERE campaign_id = p_campaign_id
    AND participant_whatsapp = p_participant_whatsapp;

  IF v_existing IS NOT NULL THEN
    DECLARE
      v_existing_reward record;
      v_existing_prize record;
    BEGIN
      SELECT * INTO v_existing_reward
      FROM public.campaign_rewards
      WHERE participation_id = v_existing.id;

      SELECT * INTO v_existing_prize
      FROM public.campaign_prizes
      WHERE id = v_existing.prize_id;

      RETURN jsonb_build_object(
        'error', 'already_participated',
        'message', 'Você já participou desta campanha!',
        'participation_id', v_existing.id,
        'reward_code', COALESCE(v_existing_reward.external_coupon_code, v_existing_reward.reward_code, ''),
        'prize_name', COALESCE(v_existing_prize.name, ''),
        'prize_emoji', COALESCE(v_existing_prize.emoji, '🎁'),
        'expires_at', COALESCE(v_existing_reward.expires_at::text, ''),
        'reward_status', COALESCE(v_existing_reward.status, '')
      );
    END;
  END IF;

  -- 4. Select prize using weighted probability with row locking
  v_rand := random() * 100;

  FOR v_prize IN
    SELECT *
    FROM public.campaign_prizes
    WHERE campaign_id = p_campaign_id
      AND is_active = true
      AND (stock_total IS NULL OR stock_used < stock_total)
    ORDER BY sort_order
    FOR UPDATE
  LOOP
    v_cumulative := v_cumulative + v_prize.probability_pct;
    IF v_rand <= v_cumulative THEN
      UPDATE public.campaign_prizes
      SET stock_used = stock_used + 1
      WHERE id = v_prize.id;
      EXIT;
    END IF;
  END LOOP;

  IF v_prize IS NULL THEN
    SELECT * INTO v_prize
    FROM public.campaign_prizes
    WHERE campaign_id = p_campaign_id
      AND is_active = true
      AND (stock_total IS NULL OR stock_used < stock_total)
    ORDER BY probability_pct DESC
    LIMIT 1
    FOR UPDATE;

    IF v_prize IS NULL THEN
      RETURN jsonb_build_object('error', 'no_prizes_available', 'message', 'Não há prêmios disponíveis no momento.');
    END IF;

    UPDATE public.campaign_prizes
    SET stock_used = stock_used + 1
    WHERE id = v_prize.id;
  END IF;

  -- 5. Generate unique reward code (internal reference)
  LOOP
    v_code_attempts := v_code_attempts + 1;
    v_reward_code := 'CASE-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));

    SELECT EXISTS(SELECT 1 FROM public.campaign_rewards WHERE reward_code = v_reward_code)
    INTO v_code_exists;

    EXIT WHEN NOT v_code_exists OR v_code_attempts > 10;
  END LOOP;

  -- 6. Calculate expiration
  v_expires_at := now() + (v_prize.validity_days || ' days')::interval;

  -- 7. Create participation
  INSERT INTO public.campaign_participations (
    campaign_id, prize_id, participant_name, participant_whatsapp,
    source, ip_address, user_agent, fingerprint, status
  ) VALUES (
    p_campaign_id, v_prize.id, p_participant_name, p_participant_whatsapp,
    p_source, p_ip_address, p_user_agent, p_fingerprint, 'completed'
  ) RETURNING id INTO v_participation_id;

  -- 8. Select and reserve External Coupon Code from Pool or Static Coupon
  -- Check if there are unused pool coupons for this prize
  SELECT * INTO v_coupon_record
  FROM public.campaign_prize_coupons
  WHERE prize_id = v_prize.id AND is_used = false
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE;

  IF v_coupon_record IS NOT NULL THEN
    -- Mark pool coupon as used
    UPDATE public.campaign_prize_coupons
    SET is_used = true,
        used_at = now(),
        used_by_participation_id = v_participation_id
    WHERE id = v_coupon_record.id;
    
    v_external_coupon_code := v_coupon_record.coupon_code;
  ELSIF v_prize.static_coupon_code IS NOT NULL AND v_prize.static_coupon_code != '' THEN
    -- Use the static coupon code
    v_external_coupon_code := v_prize.static_coupon_code;
  ELSE
    -- Fallback to the generated reward code
    v_external_coupon_code := v_reward_code;
  END IF;

  -- 9. Create reward
  INSERT INTO public.campaign_rewards (
    participation_id, reward_code, external_coupon_code, status, expires_at
  ) VALUES (
    v_participation_id, v_reward_code, v_external_coupon_code,
    CASE WHEN v_campaign.require_story_share THEN 'pending_share' ELSE 'validated' END,
    v_expires_at
  );

  -- 10. Mark access token as used
  IF v_campaign.require_access_token AND v_token_record.id IS NOT NULL THEN
    UPDATE public.campaign_access_tokens
    SET used_at = now(),
        used_by_whatsapp = p_participant_whatsapp
    WHERE id = v_token_record.id;
  END IF;

  -- 11. Log event
  INSERT INTO public.campaign_events (
    campaign_id, participation_id, event_type, metadata, ip_address, user_agent
  ) VALUES (
    p_campaign_id, v_participation_id, 'prize_awarded',
    jsonb_build_object(
      'prize_id', v_prize.id, 
      'prize_name', v_prize.name, 
      'reward_code', v_reward_code, 
      'external_coupon_code', v_external_coupon_code,
      'access_token_used', p_access_token
    ),
    p_ip_address, p_user_agent
  );

  -- 12. Return result
  RETURN jsonb_build_object(
    'success', true,
    'participation_id', v_participation_id,
    'prize', jsonb_build_object(
      'id', v_prize.id,
      'name', v_prize.name,
      'description', v_prize.description,
      'emoji', v_prize.emoji,
      'prize_type', v_prize.prize_type,
      'value', v_prize.value,
      'product_name', v_prize.product_name,
      'min_purchase', v_prize.min_purchase,
      'color', v_prize.color
    ),
    'reward_code', v_external_coupon_code, -- Return the external coupon code to show the user
    'expires_at', v_expires_at,
    'require_story_share', v_campaign.require_story_share
  );
END;
$$;
