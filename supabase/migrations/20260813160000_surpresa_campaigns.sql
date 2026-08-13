-- =============================================
-- SURPRESA DA CASEIRINHOS
-- Sistema de Campanhas e Recompensas
-- =============================================

-- =============== CAMPAIGNS ===============
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  mechanic_type text NOT NULL DEFAULT 'wheel',  -- wheel, scratch, box, quiz
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'draft',  -- draft, active, paused, ended
  rules jsonb NOT NULL DEFAULT '{}',
  instagram jsonb NOT NULL DEFAULT '{}',  -- { handle, hashtag }
  require_story_share boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaigns_status_check CHECK (status IN ('draft', 'active', 'paused', 'ended')),
  CONSTRAINT campaigns_mechanic_check CHECK (mechanic_type IN ('wheel', 'scratch', 'box', 'quiz', 'code'))
);

GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active campaigns"
ON public.campaigns FOR SELECT
USING (true);

CREATE POLICY "Admins manage campaigns"
ON public.campaigns FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_campaigns_updated
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== CAMPAIGN PRIZES ===============
CREATE TABLE public.campaign_prizes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  emoji text NOT NULL DEFAULT '🎁',
  prize_type text NOT NULL DEFAULT 'discount_fixed',
  -- discount_fixed, discount_pct, free_product, bonus_points, free_shipping, special
  value numeric(10,2),  -- R$ amount or % amount
  product_name text,  -- for free_product type
  min_purchase numeric(10,2) DEFAULT 0,
  validity_days integer NOT NULL DEFAULT 7,
  probability_pct numeric(5,2) NOT NULL DEFAULT 0,
  stock_total integer,  -- null = unlimited
  stock_used integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  color text NOT NULL DEFAULT '#E8A87C',  -- hex for wheel segment
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_prizes_type_check CHECK (
    prize_type IN ('discount_fixed', 'discount_pct', 'free_product', 'bonus_points', 'free_shipping', 'special')
  ),
  CONSTRAINT campaign_prizes_probability_check CHECK (probability_pct >= 0 AND probability_pct <= 100),
  CONSTRAINT campaign_prizes_stock_check CHECK (stock_total IS NULL OR stock_used <= stock_total)
);

CREATE INDEX idx_campaign_prizes_campaign ON public.campaign_prizes(campaign_id);

GRANT SELECT ON public.campaign_prizes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_prizes TO authenticated;
GRANT ALL ON public.campaign_prizes TO service_role;

ALTER TABLE public.campaign_prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active prizes"
ON public.campaign_prizes FOR SELECT
USING (true);

CREATE POLICY "Admins manage prizes"
ON public.campaign_prizes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_campaign_prizes_updated
BEFORE UPDATE ON public.campaign_prizes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== CAMPAIGN PARTICIPATIONS ===============
CREATE TABLE public.campaign_participations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  prize_id uuid REFERENCES public.campaign_prizes(id) ON DELETE SET NULL,
  participant_name text NOT NULL,
  participant_whatsapp text NOT NULL,  -- stored as hash
  source text NOT NULL DEFAULT 'package',  -- package, counter, flyer, card, table, instagram
  ip_address text,
  user_agent text,
  fingerprint text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT participations_status_check CHECK (
    status IN ('completed', 'shared', 'validated', 'redeemed', 'expired', 'cancelled')
  )
);

-- CRITICAL: Prevent same WhatsApp from participating twice in same campaign
CREATE UNIQUE INDEX idx_unique_participation
ON public.campaign_participations(campaign_id, participant_whatsapp);

CREATE INDEX idx_participations_campaign ON public.campaign_participations(campaign_id);
CREATE INDEX idx_participations_whatsapp ON public.campaign_participations(participant_whatsapp);

GRANT SELECT, INSERT ON public.campaign_participations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_participations TO authenticated;
GRANT ALL ON public.campaign_participations TO service_role;

ALTER TABLE public.campaign_participations ENABLE ROW LEVEL SECURITY;

-- Anon can only insert (participate), not read others' data
CREATE POLICY "Anon can create participations"
ON public.campaign_participations FOR INSERT
TO anon
WITH CHECK (true);

-- Anon cannot SELECT (prevents enumeration)
-- Service role handles reads during Edge Function execution

CREATE POLICY "Admins can read all participations"
ON public.campaign_participations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage participations"
ON public.campaign_participations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== CAMPAIGN REWARDS ===============
CREATE TABLE public.campaign_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participation_id uuid NOT NULL REFERENCES public.campaign_participations(id) ON DELETE CASCADE UNIQUE,
  reward_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending_share',
  -- pending_share, pending_validation, validated, redeemed, expired, cancelled
  validated_at timestamptz,
  validated_by uuid REFERENCES auth.users(id),
  redeemed_at timestamptz,
  redeemed_by uuid REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL,
  loyalty_points_awarded integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rewards_status_check CHECK (
    status IN ('pending_share', 'pending_validation', 'validated', 'redeemed', 'expired', 'cancelled')
  )
);

CREATE INDEX idx_rewards_code ON public.campaign_rewards(reward_code);
CREATE INDEX idx_rewards_participation ON public.campaign_rewards(participation_id);
CREATE INDEX idx_rewards_status ON public.campaign_rewards(status);

GRANT SELECT ON public.campaign_rewards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_rewards TO authenticated;
GRANT ALL ON public.campaign_rewards TO service_role;

ALTER TABLE public.campaign_rewards ENABLE ROW LEVEL SECURITY;

-- Anon can read their own reward by code (needed for the public page)
CREATE POLICY "Anyone can read rewards by code"
ON public.campaign_rewards FOR SELECT
USING (true);

CREATE POLICY "Admins manage rewards"
ON public.campaign_rewards FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== CAMPAIGN EVENTS (Analytics) ===============
CREATE TABLE public.campaign_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  participation_id uuid REFERENCES public.campaign_participations(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  -- qr_scanned, page_opened, form_started, participation_completed,
  -- prize_awarded, story_shared, story_validated, reward_redeemed, new_purchase
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_campaign ON public.campaign_events(campaign_id);
CREATE INDEX idx_events_type ON public.campaign_events(event_type);
CREATE INDEX idx_events_created ON public.campaign_events(created_at);

GRANT INSERT ON public.campaign_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_events TO authenticated;
GRANT ALL ON public.campaign_events TO service_role;

ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can create events"
ON public.campaign_events FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admins can read events"
ON public.campaign_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage events"
ON public.campaign_events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============== ATOMIC PRIZE SELECTION FUNCTION ===============
-- This function handles race conditions for stock management
-- Uses SELECT ... FOR UPDATE to prevent two users from getting the last prize
CREATE OR REPLACE FUNCTION public.select_prize_atomically(
  p_campaign_id uuid,
  p_participant_name text,
  p_participant_whatsapp text,
  p_source text DEFAULT 'package',
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_fingerprint text DEFAULT NULL
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
  v_expires_at timestamptz;
  v_rand numeric;
  v_cumulative numeric := 0;
  v_existing record;
  v_code_attempts integer := 0;
  v_code_exists boolean;
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

  -- 2. Check for existing participation
  SELECT * INTO v_existing
  FROM public.campaign_participations
  WHERE campaign_id = p_campaign_id
    AND participant_whatsapp = p_participant_whatsapp;

  IF v_existing IS NOT NULL THEN
    -- Return existing reward if any
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
        'reward_code', COALESCE(v_existing_reward.reward_code, ''),
        'prize_name', COALESCE(v_existing_prize.name, ''),
        'prize_emoji', COALESCE(v_existing_prize.emoji, '🎁'),
        'expires_at', COALESCE(v_existing_reward.expires_at::text, ''),
        'reward_status', COALESCE(v_existing_reward.status, '')
      );
    END;
  END IF;

  -- 3. Select prize using weighted probability with row locking
  v_rand := random() * 100;

  FOR v_prize IN
    SELECT *
    FROM public.campaign_prizes
    WHERE campaign_id = p_campaign_id
      AND is_active = true
      AND (stock_total IS NULL OR stock_used < stock_total)
    ORDER BY sort_order
    FOR UPDATE  -- Lock rows to prevent race condition
  LOOP
    v_cumulative := v_cumulative + v_prize.probability_pct;
    IF v_rand <= v_cumulative THEN
      -- Found our prize, update stock
      UPDATE public.campaign_prizes
      SET stock_used = stock_used + 1
      WHERE id = v_prize.id;
      EXIT;
    END IF;
  END LOOP;

  -- If no prize selected (shouldn't happen if probabilities sum to 100)
  IF v_prize IS NULL THEN
    -- Fallback: pick any available prize
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

  -- 4. Generate unique reward code
  LOOP
    v_code_attempts := v_code_attempts + 1;
    v_reward_code := 'CASE-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));

    SELECT EXISTS(SELECT 1 FROM public.campaign_rewards WHERE reward_code = v_reward_code)
    INTO v_code_exists;

    EXIT WHEN NOT v_code_exists OR v_code_attempts > 10;
  END LOOP;

  -- 5. Calculate expiration
  v_expires_at := now() + (v_prize.validity_days || ' days')::interval;

  -- 6. Create participation
  INSERT INTO public.campaign_participations (
    campaign_id, prize_id, participant_name, participant_whatsapp,
    source, ip_address, user_agent, fingerprint, status
  ) VALUES (
    p_campaign_id, v_prize.id, p_participant_name, p_participant_whatsapp,
    p_source, p_ip_address, p_user_agent, p_fingerprint, 'completed'
  ) RETURNING id INTO v_participation_id;

  -- 7. Create reward
  INSERT INTO public.campaign_rewards (
    participation_id, reward_code, status, expires_at
  ) VALUES (
    v_participation_id, v_reward_code,
    CASE WHEN v_campaign.require_story_share THEN 'pending_share' ELSE 'validated' END,
    v_expires_at
  );

  -- 8. Log event
  INSERT INTO public.campaign_events (
    campaign_id, participation_id, event_type, metadata, ip_address, user_agent
  ) VALUES (
    p_campaign_id, v_participation_id, 'prize_awarded',
    jsonb_build_object('prize_id', v_prize.id, 'prize_name', v_prize.name, 'reward_code', v_reward_code),
    p_ip_address, p_user_agent
  );

  -- 9. Return result
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
    'reward_code', v_reward_code,
    'expires_at', v_expires_at,
    'require_story_share', v_campaign.require_story_share
  );
END;
$$;

-- Grant execute to service_role (Edge Functions) and anon (via RPC)
GRANT EXECUTE ON FUNCTION public.select_prize_atomically TO service_role;
GRANT EXECUTE ON FUNCTION public.select_prize_atomically TO anon;

-- =============== SEED: Surpresa de Agosto ===============
INSERT INTO public.campaigns (name, slug, description, mechanic_type, starts_at, ends_at, status, require_story_share, instagram)
VALUES (
  'Surpresa de Agosto',
  'surpresa-de-agosto',
  'Escaneie o QR Code da sua embalagem e descubra seu presente da Caseirinhos!',
  'wheel',
  '2026-08-01T00:00:00-03:00',
  '2026-08-31T23:59:59-03:00',
  'active',
  true,
  '{"handle": "@caseirinhosaconfeitaria", "hashtag": "#SurpresaCaseirinhos"}'
);

-- Insert prizes for the campaign
WITH campaign AS (
  SELECT id FROM public.campaigns WHERE slug = 'surpresa-de-agosto'
)
INSERT INTO public.campaign_prizes (campaign_id, name, description, emoji, prize_type, value, product_name, min_purchase, validity_days, probability_pct, stock_total, sort_order, is_active, color)
SELECT
  campaign.id,
  x.name, x.description, x.emoji, x.prize_type, x.value, x.product_name,
  x.min_purchase, x.validity_days, x.probability_pct, x.stock_total, x.sort_order, true, x.color
FROM campaign, (VALUES
  ('R$ 5 OFF',          'Desconto de R$ 5 no seu próximo pedido',          '💰', 'discount_fixed', 5.00,  NULL,              30.00,  7,  25.0, NULL, 1,  '#F4A460'),
  ('R$ 10 OFF',         'Desconto de R$ 10 no seu próximo pedido',         '🤑', 'discount_fixed', 10.00, NULL,              50.00,  7,  10.0, NULL, 2,  '#E8A87C'),
  ('10% OFF',           '10% de desconto no seu próximo pedido',           '✨', 'discount_pct',   10.00, NULL,              30.00,  7,  15.0, NULL, 3,  '#85CDCA'),
  ('15% OFF',           '15% de desconto no seu próximo pedido',           '🌟', 'discount_pct',   15.00, NULL,              50.00,  7,   8.0, NULL, 4,  '#D4A574'),
  ('Brownie Grátis',    'Um delicioso brownie grátis no seu próximo pedido','🍫', 'free_product',   0.00,  'Brownie',         30.00,  7,  15.0, 100,  5,  '#8B6F47'),
  ('Cupcake Grátis',    'Um cupcake grátis no seu próximo pedido',         '🧁', 'free_product',   0.00,  'Cupcake',         30.00,  7,  12.0, 80,   6,  '#DDA0DD'),
  ('Bolo de Pote Grátis','Bolo de pote grátis no seu próximo pedido',      '🍰', 'free_product',   0.00,  'Bolo de Pote',    40.00,  7,   5.0, 50,   7,  '#FFB6C1'),
  ('Frete Grátis',      'Frete grátis no seu próximo pedido por delivery', '🚗', 'free_shipping',  0.00,  NULL,              30.00,  7,   5.0, NULL, 8,  '#87CEEB'),
  ('Pontos Extras',     '+50 pontos no seu programa de fidelidade',        '⭐', 'bonus_points',   50.00, NULL,               0.00,  30,  3.0, NULL, 9,  '#FFD700'),
  ('Prêmio Especial',   'Um presente exclusivo da Caseirinhos!',           '🎁', 'special',        0.00,  'Produto Surpresa', 0.00,  14,  2.0, 20,   10, '#FF69B4')
) AS x(name, description, emoji, prize_type, value, product_name, min_purchase, validity_days, probability_pct, stock_total, sort_order, color);
