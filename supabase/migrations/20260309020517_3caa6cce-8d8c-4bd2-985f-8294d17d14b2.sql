-- Enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

-- Tabela de roles de usuário
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função SECURITY DEFINER para verificar roles (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policies para user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TABELAS DE CONTEÚDO DO SITE
-- =============================================

-- Configurações gerais do site (contatos, redes sociais)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seções do site (hero, sobre, etc.)
CREATE TABLE public.site_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_link TEXT,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site sections"
ON public.site_sections FOR SELECT USING (true);

CREATE POLICY "Admins can update site sections"
ON public.site_sections FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Produtos do cardápio
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    price DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Depoimentos de clientes
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    stars INTEGER DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active testimonials"
ON public.testimonials FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Galeria de imagens
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active gallery images"
ON public.gallery_images FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery_images FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
BEFORE UPDATE ON public.site_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE BUCKET PARA UPLOADS
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'site-images' 
    AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'site-images' 
    AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'site-images' 
    AND public.has_role(auth.uid(), 'admin')
);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Configurações iniciais
INSERT INTO public.site_settings (key, value) VALUES
('contact', '{"phone": "5500000000000", "email": "contato@caseirinhos.com", "address": "Sua cidade - Estado", "instagram": "https://instagram.com/caseirinhos", "whatsapp": "5500000000000"}'),
('hours', '{"weekdays": "Ter a Sáb: 11h – 18h", "delivery": "Delivery a partir das 13h"}');

-- Seções do site
INSERT INTO public.site_sections (section_key, title, subtitle, content, cta_text, cta_link) VALUES
('hero', 'Mais do que doces, criamos memórias.', 'Confeitaria artesanal com amor em cada detalhe', NULL, 'Ver Cardápio', '/cardapio'),
('about_preview', 'Uma História de Amor pela Confeitaria', NULL, 'A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis. Com ingredientes selecionados e receitas desenvolvidas com carinho, cada criação é única — assim como cada cliente que nos escolhe para fazer parte dos seus momentos especiais.', 'Conheça nossa história', '/nossa-historia'),
('cta', 'Pronto para adoçar seu dia?', NULL, 'Entre em contato e faça sua encomenda. Transformamos seus momentos em memórias doces.', 'Fazer Pedido pelo WhatsApp', NULL);

-- Produtos iniciais (baseados no site atual)
INSERT INTO public.products (name, description, category, is_featured, sort_order) VALUES
('Bolo de Chocolate', 'Massa fofinha com recheio cremoso de chocolate belga', 'caseiros', true, 1),
('Bolo de Morango', 'Camadas de bolo branco com morangos frescos e chantilly', 'caseiros', true, 2),
('Fatia Prestígio', 'Chocolate com coco, perfeita para qualquer hora', 'fatias', false, 1),
('Fatia Red Velvet', 'Massa vermelha aveludada com cream cheese', 'fatias', false, 2),
('Bolo de Pote Brigadeiro', 'Camadas irresistíveis de bolo, brigadeiro e granulado', 'pote', false, 1),
('Bolo de Pote Ninho', 'Creme de leite ninho com pedaços de bolo', 'pote', false, 2),
('Brigadeiro Gourmet', 'Brigadeiro artesanal em diversos sabores', 'doces', true, 1),
('Beijinho', 'Tradicional doce de coco', 'doces', false, 2),
('Sobremesa de Morango', 'Creme, morangos e calda especial', 'sobremesas', false, 1);

-- Depoimentos iniciais
INSERT INTO public.testimonials (name, content, stars, sort_order) VALUES
('Maria Clara', 'Os bolos da Caseirinhos são os melhores que já provei! Cada pedido é uma experiência única.', 5, 1),
('João Pedro', 'Encomendei o bolo de casamento e superou todas as expectativas. Lindo e delicioso!', 5, 2),
('Ana Beatriz', 'Os doces finos para o chá de bebê ficaram perfeitos. Todos elogiaram!', 5, 3);