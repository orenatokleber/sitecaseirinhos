-- ==========================================================
-- Banco de Dados: `caseirinhos_db`
-- Sistema Oficial Caseirinhos Confeitaria
-- ==========================================================

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admin_users` (`username`, `password_hash`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE `username`=`username`;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`name`) VALUES
('Bolos'),
('Doces'),
('Bebidas');

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `image_url`, `is_active`) VALUES
(1, 'Bolo de Chocolate', 'Massa fofinha com brigadeiro 50% artesanal', 85.00, 'images/caseirinhos-85-BAdeE1vG.webp', 1),
(2, 'Doces Finos', 'Caixa com 25 unidades sortidas', 75.00, 'images/caseirinhos-40-QcHgBh9d.webp', 1),
(1, 'Bolos de Pote', 'Camadas irresistíveis de bolo, creme e cobertura', 18.00, 'images/caseirinhos-4-DToG5u2V.webp', 1),
(2, 'Fatias Gourmet', 'Porções individuais perfeitas para qualquer momento', 22.00, 'images/caseirinhos-118-C43iFQeZ.webp', 1);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PREPARING','DELIVERED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- Tabela de Gestão de Páginas e Seções do Site
-- ==========================================================
CREATE TABLE IF NOT EXISTS `site_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(50) NOT NULL DEFAULT 'index',
  `section_key` varchar(50) NOT NULL UNIQUE,
  `name` varchar(150) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `script_text` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `cta_text` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_key`),
  KEY `idx_order` (`page_key`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEÇÕES PADRÃO - PÁGINA INICIAL (index)
INSERT INTO `site_sections` (`page_key`, `section_key`, `name`, `title`, `subtitle`, `script_text`, `content`, `image_url`, `cta_text`, `cta_link`, `sort_order`, `is_visible`, `metadata`) VALUES
('index', 'home_hero', 'Hero (Banner Principal)', 'Doces que encantam e criam memórias', 'Confeitaria artesanal com amor em cada detalhe. Bolos, doces finos e sobremesas para tornar seus momentos inesquecíveis.', 'Caseirinhos', NULL, 'images/caseirinhos-hero.webp', 'Ver Cardápio Completo 🧁', 'cardapio.html', 0, 1, '{"colors":{"bg_color":"","title_color":"","text_color":"","accent_color":""}}'),
('index', 'home_features', 'Diferenciais (Badges)', 'Diferenciais da Confeitaria', 'Feitos à mão com carinho e ingredientes selecionados', 'Nossos Valores', NULL, NULL, NULL, NULL, 1, 1, '{"colors":{}}'),
('index', 'home_about', 'Sobre Nós (Resumo)', 'Uma História de Amor pela Confeitaria', 'Conheça nossa trajetória e paixão pelos doces artesanais', 'Sobre nós', 'A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis. Cada bolo e docinho é feito com ingredientes selecionados, receitas de família e o carinho que só o artesanal pode oferecer.', 'images/confeiteira-sorrindo.jpg', 'Conheça nossa história →', 'nossa-historia.html', 2, 1, '{"colors":{"bg_color":"","text_color":"","accent_color":""}}'),
('index', 'home_products', 'Vitrine de Produtos', 'Nossos Produtos', 'Cada doce é uma obra de arte feita com ingredientes frescos e muito amor', 'Delícias', NULL, NULL, 'Ver Cardápio Completo 🍰', 'cardapio.html', 3, 1, '{"colors":{}}'),
('index', 'home_testimonials', 'Depoimentos dos Clientes', 'O que nossos clientes dizem', 'Depoimentos reais de quem provou e aprovou nossos doces', 'Amor em cada feedback', NULL, NULL, NULL, NULL, 4, 1, '{"colors":{}}'),
('index', 'home_cta', 'Seção Delivery (CTA)', 'Peça pelo Delivery', 'Consulte a disponibilidade da sua região', NULL, 'Bolos fresquinhos e doces artesanais entregues com carinho. Confira nosso cardápio de delivery e peça agora!', 'images/caseirinhos-58-Cqi9p00L.webp', 'Fazer Pedido Online', 'montar-pedido.html', 5, 1, '{"colors":{"bg_color":"","text_color":"","accent_color":""}}')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- SEÇÕES PADRÃO - NOSSA HISTÓRIA (nossa-historia)
INSERT INTO `site_sections` (`page_key`, `section_key`, `name`, `title`, `subtitle`, `script_text`, `content`, `image_url`, `cta_text`, `cta_link`, `sort_order`, `is_visible`, `metadata`) VALUES
('nossa_historia', 'nh_hero', 'Banner Hero', 'Nossa História', 'Mais do que doces, criamos memórias afetivas', 'Como tudo começou', 'Desde o início, nossa missão sempre foi levar alegria e sabor através da confeitaria artesanal.', 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/nossa-historia/1779822456701-4e2nzj.jpg', 'Montar Encomenda', 'montar-pedido.html', 0, 1, '{"colors":{}}'),
('nossa_historia', 'nh_story_part1', 'A Confeitaria (Parte 1)', 'O Começo de Tudo', 'Amor e carinho em cada fornada', 'Origem', 'Tudo começou na cozinha de casa, com o aroma de bolo fresco e receitas tradicionais passadas por gerações. Cada ingrediente era escolhido a dedo.', 'images/hero-cake.webp', NULL, NULL, 1, 1, '{"colors":{}}'),
('nossa_historia', 'nh_story_part2', 'Dedicação e Qualidade (Parte 2)', 'Nossos Ingredientes & Amor', 'Qualidade inegociável em cada receita', 'Tradição & Amor', 'Hoje a Caseirinhos cresceu, mas o compromisso continua o mesmo: qualidade sem atalhos, ingredientes nobres e atendimento carinhoso.', 'images/caseirinhos-hero.webp', 'Ver Nosso Cardápio', 'cardapio.html', 2, 1, '{"colors":{}}'),
('nossa_historia', 'nh_quote', 'Citação da Confeiteira', 'Amor em forma de doce', 'O segredo de uma receita inesquecível', 'Com carinho', '\"Cozinhar é um ato de amor. Quando entregamos um bolo, estamos entregando uma celebração.\"', NULL, NULL, NULL, 3, 1, '{"colors":{}}')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- SEÇÕES PADRÃO - CARDÁPIO (cardapio)
INSERT INTO `site_sections` (`page_key`, `section_key`, `name`, `title`, `subtitle`, `script_text`, `content`, `image_url`, `cta_text`, `cta_link`, `sort_order`, `is_visible`, `metadata`) VALUES
('cardapio', 'menu_hero', 'Hero do Cardápio', 'Cardápio de Encomendas', 'Bolos, doces finos, sobremesas e kits comemorativos sob medida para a sua celebração.', 'Tornando sua vida mais doce!', 'Selecione seu bolo favorito ou monte seu pedido online.', 'images/hero-cake.webp', 'Montar Pedido Passo a Passo 🎂', 'montar-pedido.html', 0, 1, '{"colors":{}}'),
('cardapio', 'menu_round', 'Tabela de Bolos Redondos', 'Bolos Redondos Decorados', '3 camadas de massa fofinha e 2 camadas generosas de recheio', 'Nossos Queridinhos', NULL, NULL, NULL, NULL, 1, 1, '{"colors":{}}'),
('cardapio', 'menu_flavors', 'Sabores de Recheios', 'Sabores Tradicionais & Especiais', 'Combinações irresistíveis preparadas com ingredientes nobres', 'Recheios Artesanais', NULL, NULL, NULL, NULL, 2, 1, '{"colors":{}}'),
('cardapio', 'menu_rect', 'Bolos Retangulares (Corte)', 'Bolos de Corte / Retangulares', 'Ideais para grandes celebrações e muitos convidados', 'Rendimento Superior', NULL, NULL, NULL, NULL, 3, 1, '{"colors":{}}'),
('cardapio', 'menu_sweets', 'Docinhos de Festa', 'Doces Tradicionais & Gourmet', 'O toque doce que não pode faltar na sua mesa', 'Pequenas Delícias', NULL, NULL, NULL, NULL, 4, 1, '{"colors":{}}'),
('cardapio', 'menu_decorations', 'Decorações & Adicionais', 'Personalizações & Extras', 'Deixe seu bolo ainda mais exclusivo com topos, flores e confeitos especiais', 'Toque Final', NULL, NULL, NULL, NULL, 5, 1, '{"colors":{}}')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- SEÇÕES PADRÃO - MONTAR PEDIDO (montar-pedido)
INSERT INTO `site_sections` (`page_key`, `section_key`, `name`, `title`, `subtitle`, `script_text`, `content`, `image_url`, `cta_text`, `cta_link`, `sort_order`, `is_visible`, `metadata`) VALUES
('montar_pedido', 'builder_hero', 'Banner & Introdução', 'Cardápio de Encomendas', 'BEM-VINDO AO NOSSO CARDÁPIO DE DELÍCIAS!', 'Tornando sua vida mais doce!', 'Na Caseirinhos, cada doce é preparado com carinho para tornar seus momentos ainda mais especiais. Somos apaixonados por criar bolos, sobremesas e doces que unem sabor, qualidade e aquele toque caseiro que faz toda a diferença.', 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/cardapio/cardapio_hero/1781027412146-9hjvbm.jpg', NULL, NULL, 0, 1, '{"colors":{}}'),
('montar_pedido', 'builder_step1', 'Passo 1: O que você vai pedir?', 'O que você vai pedir?', 'Você pode selecionar mais de uma opção para fazer todo o pedido de uma só vez.', 'Passo 1', NULL, NULL, NULL, NULL, 1, 1, '{"colors":{}}'),
('montar_pedido', 'builder_step2', 'Passo 2: Detalhes do Pedido', 'Detalhes do pedido', 'Personalize o formato, tamanho, massa, recheio e opcionais.', 'Passo 2', NULL, NULL, NULL, NULL, 2, 1, '{"colors":{}}'),
('montar_pedido', 'builder_step3', 'Passo 3: Dados & Entrega', 'Seus dados e entrega', 'Informe seus dados de contato e data desejada para envio no WhatsApp.', 'Passo 3', NULL, NULL, NULL, NULL, 3, 1, '{"colors":{}}')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- SEÇÕES PADRÃO - CONTATO (contato)
INSERT INTO `site_sections` (`page_key`, `section_key`, `name`, `title`, `subtitle`, `script_text`, `content`, `image_url`, `cta_text`, `cta_link`, `sort_order`, `is_visible`, `metadata`) VALUES
('contato', 'contact_hero', 'Banner Principal de Contato', 'Fale Conosco', 'Estamos prontos para adoçar o seu dia!', 'Entre em contato', 'Tire dúvidas, faça orçamentos ou agende sua encomenda conosco.', NULL, 'Chamar no WhatsApp', 'https://wa.me/5511948598267', 0, 1, '{"colors":{}}'),
('contato', 'contact_info', 'Informações do Ateliê & Horários', 'Nosso Ateliê', 'Venha nos visitar ou receba no conforto de sua casa', 'Localização & Horários', 'Rua Manucaia, 114 - Jardim dos Álamos, São Paulo - SP\nTerça a Sábado: 12h às 18h', NULL, 'Como Chegar', 'https://maps.google.com', 1, 1, '{"colors":{}}'),
('contato', 'contact_form', 'Formulário de Mensagens', 'Envie uma Mensagem', 'Preencha os campos abaixo e entraremos em contato rapidamente.', 'Fale Direto', NULL, NULL, 'Enviar Mensagem', NULL, 2, 1, '{"colors":{}}')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- ==========================================================
-- Tabela de Redirecionamentos de Links (Pretty Links)
-- ==========================================================
CREATE TABLE IF NOT EXISTS `short_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL UNIQUE,
  `title` varchar(200) NOT NULL,
  `target_url` text NOT NULL,
  `redirect_type` int(3) NOT NULL DEFAULT 301,
  `clicks` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `short_links` (`slug`, `title`, `target_url`, `redirect_type`, `clicks`, `is_active`) VALUES
('whatsapp', 'WhatsApp Oficial de Atendimento', 'https://wa.me/5511948598267?text=Ol%C3%A1!%20Vim%20pelo%20link%20do%20site%20da%20Caseirinhos.', 301, 48, 1),
('instagram', 'Perfil Oficial no Instagram', 'https://instagram.com/caseirinhosaconfeitaria', 301, 112, 1),
('delivery', 'Cardápio de Delivery (InstaDelivery)', 'https://instadelivery.com.br/caseirinhosaconfeitaria', 302, 79, 1),
('encomendas', 'Montador de Pedido Passo a Passo', 'montar-pedido.html', 301, 35, 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

