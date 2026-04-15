
CREATE TABLE public.delivery_popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  popup_type text NOT NULL DEFAULT 'banner',
  image_url text,
  coupon_code text,
  discount_text text,
  bg_color text DEFAULT '#40e0d0',
  text_color text DEFAULT '#ffffff',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage delivery popups"
  ON public.delivery_popups FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read active delivery popups"
  ON public.delivery_popups FOR SELECT
  TO public
  USING (is_active = true);
