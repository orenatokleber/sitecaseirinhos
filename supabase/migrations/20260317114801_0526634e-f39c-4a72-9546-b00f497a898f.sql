
-- Create redirects table
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  destination_url text NOT NULL,
  title text,
  is_active boolean NOT NULL DEFAULT true,
  total_clicks integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create redirect_clicks table
CREATE TABLE public.redirect_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  redirect_id uuid NOT NULL REFERENCES public.redirects(id) ON DELETE CASCADE,
  referrer text,
  user_agent text,
  clicked_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirect_clicks ENABLE ROW LEVEL SECURITY;

-- Redirects policies
CREATE POLICY "Admins can manage redirects" ON public.redirects FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can read active redirects" ON public.redirects FOR SELECT TO anon, authenticated USING (is_active = true);

-- Redirect clicks policies
CREATE POLICY "Anyone can insert clicks" ON public.redirect_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read clicks" ON public.redirect_clicks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to increment click count
CREATE OR REPLACE FUNCTION public.increment_redirect_clicks(redirect_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.redirects SET total_clicks = total_clicks + 1 WHERE id = redirect_id;
$$;

-- Updated_at trigger
CREATE TRIGGER update_redirects_updated_at BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
