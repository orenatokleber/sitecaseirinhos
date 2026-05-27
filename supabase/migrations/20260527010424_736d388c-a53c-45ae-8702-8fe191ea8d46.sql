
ALTER TABLE public.cake_categories ADD COLUMN IF NOT EXISTS image_url text;

INSERT INTO public.site_sections (section_key, title, subtitle, content, metadata)
SELECT v.section_key, v.title, v.subtitle, v.content, v.metadata::jsonb
FROM (VALUES
  ('cardapio_hero', 'Cardápio de Encomendas', 'Escolha o tamanho do seu bolo, depois o sabor perfeito para a sua celebração.', NULL, '{"script":"Nossas delícias"}'),
  ('cardapio_sizes', 'Bolos Decorados', 'com 3 camadas de recheio', '*Todos os bolos têm cerca de 10cm de altura · os pesos podem ter pequenas variações · todos são decorados com buttercream (creme caseiro de manteiga saborizado com baunilha).', '{"script":"Passo 1"}'),
  ('cardapio_addons', 'Bolos Coração', 'Adicional ao valor do bolo', NULL, '{"script":"Especial"}'),
  ('cardapio_rectangular', 'Bolos Retangulares', NULL, NULL, '{"script":"Especial"}'),
  ('cardapio_decorations', 'Decorações', 'Os valores das decorações são variáveis e podem ser consultados pelo site ou no nosso WhatsApp!', NULL, '{"script":"Galeria"}'),
  ('cardapio_order', 'Solicite seu orçamento', NULL, NULL, '{"script":"Orçamento"}')
) AS v(section_key, title, subtitle, content, metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_sections s WHERE s.section_key = v.section_key
);
