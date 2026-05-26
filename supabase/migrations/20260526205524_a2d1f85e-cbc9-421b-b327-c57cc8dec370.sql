
-- =============== CAKE SIZES ===============
CREATE TABLE public.cake_sizes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  ring_size text,
  slices integer,
  weight_kg numeric(5,2),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_sizes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_sizes TO authenticated;
GRANT ALL ON public.cake_sizes TO service_role;
ALTER TABLE public.cake_sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cake sizes" ON public.cake_sizes FOR SELECT USING (true);
CREATE POLICY "Admins manage cake sizes" ON public.cake_sizes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============== CAKE CATEGORIES ===============
CREATE TABLE public.cake_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'standard', -- standard | addon
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_categories TO authenticated;
GRANT ALL ON public.cake_categories TO service_role;
ALTER TABLE public.cake_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cake categories" ON public.cake_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage cake categories" ON public.cake_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============== CAKE CATEGORY PRICES ===============
CREATE TABLE public.cake_category_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.cake_categories(id) ON DELETE CASCADE,
  size_id uuid NOT NULL REFERENCES public.cake_sizes(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, size_id)
);
GRANT SELECT ON public.cake_category_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_category_prices TO authenticated;
GRANT ALL ON public.cake_category_prices TO service_role;
ALTER TABLE public.cake_category_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cake prices" ON public.cake_category_prices FOR SELECT USING (true);
CREATE POLICY "Admins manage cake prices" ON public.cake_category_prices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============== CAKE FLAVORS ===============
CREATE TABLE public.cake_flavors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.cake_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_flavors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_flavors TO authenticated;
GRANT ALL ON public.cake_flavors TO service_role;
ALTER TABLE public.cake_flavors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cake flavors" ON public.cake_flavors FOR SELECT USING (true);
CREATE POLICY "Admins manage cake flavors" ON public.cake_flavors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============== CAKE RECTANGULAR ===============
CREATE TABLE public.cake_rectangular (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  dimensions text,
  slices integer,
  weight_kg numeric(5,2),
  class1_price numeric(10,2),
  class2_price numeric(10,2),
  note text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_rectangular TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_rectangular TO authenticated;
GRANT ALL ON public.cake_rectangular TO service_role;
ALTER TABLE public.cake_rectangular ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read rectangular cakes" ON public.cake_rectangular FOR SELECT USING (true);
CREATE POLICY "Admins manage rectangular cakes" ON public.cake_rectangular FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============== CAKE DECORATIONS ===============
CREATE TABLE public.cake_decorations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cake_decorations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cake_decorations TO authenticated;
GRANT ALL ON public.cake_decorations TO service_role;
ALTER TABLE public.cake_decorations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cake decorations" ON public.cake_decorations FOR SELECT USING (true);
CREATE POLICY "Admins manage cake decorations" ON public.cake_decorations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Triggers updated_at
CREATE TRIGGER trg_cake_sizes_updated BEFORE UPDATE ON public.cake_sizes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cake_categories_updated BEFORE UPDATE ON public.cake_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cake_category_prices_updated BEFORE UPDATE ON public.cake_category_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cake_flavors_updated BEFORE UPDATE ON public.cake_flavors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cake_rectangular_updated BEFORE UPDATE ON public.cake_rectangular FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cake_decorations_updated BEFORE UPDATE ON public.cake_decorations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== SEED ===============
-- Sizes
INSERT INTO public.cake_sizes (code, name, ring_size, slices, weight_kg, sort_order) VALUES
  ('P',  'P',  'aro 13', 10, 1.2, 1),
  ('M',  'M',  'aro 16', 20, 2.2, 2),
  ('G',  'G',  'aro 20', 30, 3.2, 3),
  ('XG', 'XG', 'aro 25', 40, 4.2, 4);

-- Categories
INSERT INTO public.cake_categories (slug, name, description, type, sort_order) VALUES
  ('classe-1', 'Classe 1', 'Bolos clássicos', 'standard', 1),
  ('classe-2', 'Classe 2', 'Bolos premium',  'standard', 2),
  ('coracao',  'Bolos Coração', 'Adicional para formato coração', 'addon', 3);

-- Prices - Classe 1
INSERT INTO public.cake_category_prices (category_id, size_id, price)
SELECT c.id, s.id,
  CASE s.code WHEN 'P' THEN 140 WHEN 'M' THEN 210 WHEN 'G' THEN 310 WHEN 'XG' THEN 410 END
FROM public.cake_categories c, public.cake_sizes s WHERE c.slug='classe-1' AND s.code IN ('P','M','G','XG');

-- Prices - Classe 2
INSERT INTO public.cake_category_prices (category_id, size_id, price)
SELECT c.id, s.id,
  CASE s.code WHEN 'P' THEN 160 WHEN 'M' THEN 245 WHEN 'G' THEN 360 WHEN 'XG' THEN 475 END
FROM public.cake_categories c, public.cake_sizes s WHERE c.slug='classe-2' AND s.code IN ('P','M','G','XG');

-- Prices - Coração (adicional)
INSERT INTO public.cake_category_prices (category_id, size_id, price)
SELECT c.id, s.id,
  CASE s.code WHEN 'P' THEN 30 WHEN 'M' THEN 40 WHEN 'G' THEN 70 ELSE 0 END
FROM public.cake_categories c, public.cake_sizes s WHERE c.slug='coracao' AND s.code IN ('P','M','G');

-- Flavors Classe 1
INSERT INTO public.cake_flavors (category_id, name, description, sort_order)
SELECT id, x.name, x.descr, x.ord FROM public.cake_categories c, (VALUES
  ('Brigadeiro Amargo',         'Massa chocolate, três camadas de brigadeiro amargo', 1),
  ('Brigadeiro ao Leite',       'Massa chocolate, três camadas de brigadeiro ao leite', 2),
  ('Dois Amores',               'Massa chocolate, uma camada de brigadeiro amargo e duas de brigadeiro ao leite', 3),
  ('Prestígio',                 'Massa chocolate, uma camada de brigadeiro e duas de cocada', 4),
  ('Doce de Leite',             'Massa chocolate, três camadas de brigadeiro amargo e duas de doce de leite (leite condensado cozido)', 5),
  ('Chocopink',                 'Massa chocolate, uma camada de brigadeiro amargo e duas de doce de brigadeiro rosa de morango', 6),
  ('Ninho',                     'Massa bauni, três camadas de brigadeiro de ninho', 7),
  ('Cocada com Doce de Leite',  'Massa bauni, três camadas de cocada com doce de leite', 8),
  ('Ninho com Doce de Leite',   'Massa bauni, três camadas de ninho com doce de leite', 9),
  ('Cenoura',                   'Massa cenoura, três camadas de brigadeiro ao leite', 10)
) AS x(name, descr, ord)
WHERE c.slug='classe-1';

-- Flavors Classe 2
INSERT INTO public.cake_flavors (category_id, name, description, sort_order)
SELECT id, x.name, x.descr, x.ord FROM public.cake_categories c, (VALUES
  ('Ninho com Nutella',                       'Massa chocolate, três camadas de ninho com nutella', 1),
  ('Maracujá com Chocolate',                  'Massa chocolate, três camadas de brigadeiro amargo e maracujá', 2),
  ('Brigadeiro com Caramelo Salgado e Amendoim','Massa chocolate, três camadas de brigadeiro amargo com caramelo salgado e amendoim', 3),
  ('Brigadeiro ao Leite com Morango (geleia caseira)', 'Massa chocolate, três camadas de brigadeiro ao leite com geleia caseira de morango', 4),
  ('Abacaxi com Ninho e Cocada',              'Massa bauni, duas camadas de ninho com abacaxi e uma de cocada', 5),
  ('Maracujá com Ninho',                      'Massa bauni, três camadas com brigadeiro de ninho e maracujá', 6),
  ('Ninho com Morango (geleia caseira)',      'Massa bauni, três camadas de ninho com geleia caseira de morango', 7),
  ('Ninho com Frutas Vermelhas (geleia caseira)', 'Massa bauni, três camadas de ninho com geleia caseira de frutas', 8),
  ('Pistache',                                'Massa bauni, três camadas de ninho com pasta de pistache e pistaches', 9),
  ('Nozes com Doce de Leite',                 'Massa bauni, três camadas de brigadeiro de nozes e doce de leite', 10),
  ('Avelã Branca com Ninho',                  'Massa bauni, três camadas de brigadeiro de ninho com pasta de avelã branca', 11)
) AS x(name, descr, ord)
WHERE c.slug='classe-2';

-- Rectangular
INSERT INTO public.cake_rectangular (name, dimensions, slices, weight_kg, class1_price, class2_price, note, sort_order) VALUES
  ('Retrô - Retangular',   '22 x 17cm', 26, 3.0, 300, 350, 'O bolo retrô pode ser decorado bem retrô :)', 1),
  ('Retangular - Corte',   '30 x 22cm', 50, 5.5, 440, 500, 'O bolo da conta é espatulado branco :)', 2);
