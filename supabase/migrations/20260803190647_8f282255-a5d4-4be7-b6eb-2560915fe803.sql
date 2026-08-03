CREATE TABLE public.bio_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bio_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bio_links TO authenticated;
GRANT ALL ON public.bio_links TO service_role;

ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bio links"
ON public.bio_links FOR SELECT
USING (true);

CREATE POLICY "Admins can manage bio links"
ON public.bio_links FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_bio_links_updated
BEFORE UPDATE ON public.bio_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();