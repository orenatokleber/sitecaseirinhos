
-- sweet_types
CREATE TABLE public.sweet_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  weight_g numeric,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sweet_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sweet_types TO authenticated;
GRANT ALL ON public.sweet_types TO service_role;
ALTER TABLE public.sweet_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sweet_types public read" ON public.sweet_types FOR SELECT USING (true);
CREATE POLICY "sweet_types admin write" ON public.sweet_types FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_sweet_types_updated BEFORE UPDATE ON public.sweet_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- sweet_flavors
CREATE TABLE public.sweet_flavors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid NOT NULL REFERENCES public.sweet_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sweet_flavors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sweet_flavors TO authenticated;
GRANT ALL ON public.sweet_flavors TO service_role;
ALTER TABLE public.sweet_flavors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sweet_flavors public read" ON public.sweet_flavors FOR SELECT USING (true);
CREATE POLICY "sweet_flavors admin write" ON public.sweet_flavors FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_sweet_flavors_updated BEFORE UPDATE ON public.sweet_flavors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- sweet_packages
CREATE TABLE public.sweet_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid NOT NULL REFERENCES public.sweet_types(id) ON DELETE CASCADE,
  quantity int NOT NULL,
  price numeric NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(type_id, quantity)
);
GRANT SELECT ON public.sweet_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sweet_packages TO authenticated;
GRANT ALL ON public.sweet_packages TO service_role;
ALTER TABLE public.sweet_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sweet_packages public read" ON public.sweet_packages FOR SELECT USING (true);
CREATE POLICY "sweet_packages admin write" ON public.sweet_packages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_sweet_packages_updated BEFORE UPDATE ON public.sweet_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cake_addons
CREATE TABLE public.cake_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  pricing_type text NOT NULL DEFAULT 'fixed', -- 'fixed' or 'per_size'
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_addons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_addons TO authenticated;
GRANT ALL ON public.cake_addons TO service_role;
ALTER TABLE public.cake_addons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cake_addons public read" ON public.cake_addons FOR SELECT USING (true);
CREATE POLICY "cake_addons admin write" ON public.cake_addons FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cake_addons_updated BEFORE UPDATE ON public.cake_addons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cake_addon_prices
CREATE TABLE public.cake_addon_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.cake_addons(id) ON DELETE CASCADE,
  size_id uuid REFERENCES public.cake_sizes(id) ON DELETE CASCADE,
  price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX cake_addon_prices_fixed_uniq ON public.cake_addon_prices(addon_id) WHERE size_id IS NULL;
CREATE UNIQUE INDEX cake_addon_prices_per_size_uniq ON public.cake_addon_prices(addon_id, size_id) WHERE size_id IS NOT NULL;
GRANT SELECT ON public.cake_addon_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_addon_prices TO authenticated;
GRANT ALL ON public.cake_addon_prices TO service_role;
ALTER TABLE public.cake_addon_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cake_addon_prices public read" ON public.cake_addon_prices FOR SELECT USING (true);
CREATE POLICY "cake_addon_prices admin write" ON public.cake_addon_prices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cake_addon_prices_updated BEFORE UPDATE ON public.cake_addon_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
