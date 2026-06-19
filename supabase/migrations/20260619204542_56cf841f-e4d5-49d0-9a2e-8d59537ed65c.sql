UPDATE public.cake_addons SET pricing_type = 'fixed' WHERE pricing_type = 'from';
ALTER TABLE public.cake_addons DROP CONSTRAINT IF EXISTS cake_addons_pricing_type_check;
ALTER TABLE public.cake_addons ADD CONSTRAINT cake_addons_pricing_type_check CHECK (pricing_type IN ('fixed', 'per_size', 'consult'));