// ==========================================================
// CASEIRINHOS - MOTOR DE CONTEÚDO, PÁGINAS E SEÇÕES
// ==========================================================

const DEFAULT_PAGE_SECTIONS = {
    // 1. PÁGINA INICIAL (index)
    index: [
        {
            section_key: 'home_hero',
            name: 'Hero (Banner Principal)',
            title: 'Doces que encantam e criam memórias',
            subtitle: 'Confeitaria artesanal com amor em cada detalhe. Bolos, doces finos e sobremesas para tornar seus momentos inesquecíveis.',
            script_text: 'Caseirinhos',
            content: '',
            image_url: 'images/caseirinhos-hero.webp',
            cta_text: 'Ver Cardápio Completo 🧁',
            cta_link: '/cardapio',
            sort_order: 0,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        },
        {
            section_key: 'home_features',
            name: 'Diferenciais (Badges)',
            title: 'Diferenciais da Confeitaria',
            subtitle: 'Feitos à mão com carinho e ingredientes selecionados',
            script_text: 'Nossos Valores',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 1,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        },
        {
            section_key: 'home_about',
            name: 'Sobre Nós (Resumo)',
            title: 'Uma História de Amor pela Confeitaria',
            subtitle: 'Conheça nossa trajetória e paixão pelos doces artesanais',
            script_text: 'Sobre nós',
            content: 'A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis. Cada bolo e docinho é feito com ingredientes selecionados, receitas de família e o carinho que só o artesanal pode oferecer.',
            image_url: 'images/confeiteira-sorrindo.jpg',
            cta_text: 'Conheça nossa história →',
            cta_link: '/nossa-historia',
            sort_order: 2,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        },
        {
            section_key: 'home_products',
            name: 'Vitrine de Produtos',
            title: 'Nossos Produtos',
            subtitle: 'Cada doce é uma obra de arte feita com ingredientes frescos e muito amor',
            script_text: 'Delícias',
            content: '',
            image_url: '',
            cta_text: 'Ver Cardápio Completo 🍰',
            cta_link: '/cardapio',
            sort_order: 3,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        },
        {
            section_key: 'home_testimonials',
            name: 'Depoimentos dos Clientes',
            title: 'O que nossos clientes dizem',
            subtitle: 'Depoimentos reais de quem provou e aprovou nossos doces',
            script_text: 'Amor em cada feedback',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 4,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        },
        {
            section_key: 'home_cta',
            name: 'Seção Delivery (CTA)',
            title: 'Peça pelo Delivery',
            subtitle: 'Consulte a disponibilidade da sua região',
            script_text: '',
            content: 'Bolos fresquinhos e doces artesanais entregues com carinho. Confira nosso cardápio de delivery e peça agora!',
            image_url: 'images/caseirinhos-58-Cqi9p00L.webp',
            cta_text: 'Fazer Pedido Online',
            cta_link: '/montar-pedido',
            sort_order: 5,
            is_visible: true,
            metadata: {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        }
    ],

    // 2. NOSSA HISTÓRIA (nossa_historia)
    nossa_historia: [
        {
            section_key: 'nh_hero',
            name: 'Banner Hero',
            title: 'Nossa História',
            subtitle: 'Mais do que doces, criamos memórias afetivas',
            script_text: 'Como tudo começou',
            content: 'Desde o início, nossa missão sempre foi levar alegria e sabor através da confeitaria artesanal.',
            image_url: 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/nossa-historia/1779822456701-4e2nzj.jpg',
            cta_text: 'Montar Encomenda',
            cta_link: '/montar-pedido',
            sort_order: 0,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'nh_story_part1',
            name: 'A Confeitaria (Parte 1)',
            title: 'O Começo de Tudo',
            subtitle: 'Amor e carinho em cada fornada',
            script_text: 'Origem',
            content: 'Tudo começou na cozinha de casa, com o aroma de bolo fresco e receitas tradicionais passadas por gerações. Cada ingrediente era escolhido a dedo para criar momentos especiais com a família e amigos.',
            image_url: 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/cardapio/cardapio_hero/1781027412146-9hjvbm.jpg',
            cta_text: '',
            cta_link: '',
            sort_order: 1,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'nh_story_part2',
            name: 'Dedicação e Qualidade (Parte 2)',
            title: 'Nossos Ingredientes & Amor',
            subtitle: 'Qualidade inegociável em cada receita',
            script_text: 'Tradição & Amor',
            content: 'Hoje a Caseirinhos cresceu, mas o compromisso continua o mesmo: qualidade sem atalhos, ingredientes nobres e atendimento carinhoso que faz você se sentir em casa.',
            image_url: 'images/caseirinhos-hero.webp',
            cta_text: 'Ver Nosso Cardápio',
            cta_link: '/cardapio',
            sort_order: 2,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'nh_quote',
            name: 'Citação da Confeiteira',
            title: 'Amor em forma de doce',
            subtitle: 'O segredo de uma receita inesquecível',
            script_text: 'Com carinho',
            content: '“Cozinhar é um ato de amor. Quando entregamos um bolo, estamos entregando uma celebração, um abraço e uma lembrança doce.”',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 3,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        }
    ],

    // 3. CARDÁPIO (cardapio)
    cardapio: [
        {
            section_key: 'menu_hero',
            name: 'Hero do Cardápio',
            title: 'Cardápio de Encomendas',
            subtitle: 'Bolos, doces finos, sobremesas e kits comemorativos sob medida para a sua celebração.',
            script_text: 'Tornando sua vida mais doce!',
            content: 'Selecione seu bolo favorito ou monte seu pedido online.',
            image_url: 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/cardapio/cardapio_hero/1781027412146-9hjvbm.jpg',
            cta_text: 'Montar Pedido Passo a Passo 🎂',
            cta_link: '/montar-pedido',
            sort_order: 0,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'menu_round',
            name: 'Tabela de Bolos Redondos',
            title: 'Bolos Redondos Decorados',
            subtitle: '3 camadas de massa fofinha e 2 camadas generosas de recheio',
            script_text: 'Nossos Queridinhos',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 1,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'menu_flavors',
            name: 'Sabores de Recheios',
            title: 'Sabores Tradicionais & Especiais',
            subtitle: 'Combinações irresistíveis preparadas com ingredientes nobres',
            script_text: 'Recheios Artesanais',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 2,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'menu_rect',
            name: 'Bolos Retangulares (Corte)',
            title: 'Bolos de Corte / Retangulares',
            subtitle: 'Ideais para grandes celebrações e muitos convidados',
            script_text: 'Rendimento Superior',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 3,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'menu_sweets',
            name: 'Docinhos de Festa',
            title: 'Doces Tradicionais & Gourmet',
            subtitle: 'O toque doce que não pode faltar na sua mesa',
            script_text: 'Pequenas Delícias',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 4,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'menu_decorations',
            name: 'Decorações & Adicionais',
            title: 'Personalizações & Extras',
            subtitle: 'Deixe seu bolo ainda mais exclusivo com topos, flores e confeitos especiais',
            script_text: 'Toque Final',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 5,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        }
    ],

    // 4. MONTAR PEDIDO (montar_pedido)
    montar_pedido: [
        {
            section_key: 'builder_hero',
            name: 'Banner & Introdução',
            title: 'Cardápio de Encomendas',
            subtitle: 'BEM-VINDO AO NOSSO CARDÁPIO DE DELÍCIAS!',
            script_text: 'Tornando sua vida mais doce!',
            content: 'Na Caseirinhos, cada doce é preparado com carinho para tornar seus momentos ainda mais especiais. Somos apaixonados por criar bolos, sobremesas e doces que unem sabor, qualidade e aquele toque caseiro que faz toda a diferença.',
            image_url: 'https://kmgiylrpkqtteyujiwpn.supabase.co/storage/v1/object/public/site-images/cardapio/cardapio_hero/1781027412146-9hjvbm.jpg',
            cta_text: '',
            cta_link: '',
            sort_order: 0,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'builder_step1',
            name: 'Passo 1: O que você vai pedir?',
            title: 'O que você vai pedir?',
            subtitle: 'Você pode selecionar mais de uma opção para fazer todo o pedido de uma só vez.',
            script_text: 'Passo 1',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 1,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'builder_step2',
            name: 'Passo 2: Detalhes do Pedido',
            title: 'Detalhes do pedido',
            subtitle: 'Personalize o formato, tamanho, massa, recheio e opcionais.',
            script_text: 'Passo 2',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 2,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'builder_step3',
            name: 'Passo 3: Dados & Entrega',
            title: 'Seus dados e entrega',
            subtitle: 'Informe seus dados de contato e data desejada para envio no WhatsApp.',
            script_text: 'Passo 3',
            content: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            sort_order: 3,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        }
    ],

    // 5. CONTATO (contato)
    contato: [
        {
            section_key: 'contact_hero',
            name: 'Banner Principal de Contato',
            title: 'Fale Conosco',
            subtitle: 'Estamos prontos para adoçar o seu dia!',
            script_text: 'Entre em contato',
            content: 'Tire dúvidas, faça orçamentos ou agende sua encomenda conosco.',
            image_url: '',
            cta_text: 'Chamar no WhatsApp',
            cta_link: 'https://wa.me/5511948598267',
            sort_order: 0,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'contact_info',
            name: 'Informações do Ateliê & Horários',
            title: 'Nosso Ateliê',
            subtitle: 'Venha nos visitar ou receba no conforto de sua casa',
            script_text: 'Localização & Horários',
            content: 'Rua Manucaia, 114 - Jardim dos Álamos, São Paulo - SP\nTerça a Sábado: 12h às 18h',
            image_url: '',
            cta_text: 'Como Chegar',
            cta_link: 'https://maps.google.com',
            sort_order: 1,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        },
        {
            section_key: 'contact_form',
            name: 'Formulário de Mensagens',
            title: 'Envie uma Mensagem',
            subtitle: 'Preencha os campos abaixo e entraremos em contato rapidamente.',
            script_text: 'Fale Direto',
            content: '',
            image_url: '',
            cta_text: 'Enviar Mensagem',
            cta_link: '',
            sort_order: 2,
            is_visible: true,
            metadata: { colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' } }
        }
    ]
};

// ==========================================================
// GERENCIADOR CENTRAL DE SEÇÕES (SectionManager)
// ==========================================================
const SectionManager = {
    STORAGE_PREFIX: 'caseirinhos_page_sections_',

    // Obter todas as seções de uma página específica
    getPageSections: function(pageKey) {
        pageKey = this.normalizePageKey(pageKey);
        const stored = localStorage.getItem(this.STORAGE_PREFIX + pageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
                }
            } catch (e) {
                console.error('Erro ao ler seções do localStorage:', e);
            }
        }
        // Retorna o padrão clonado
        return JSON.parse(JSON.stringify(DEFAULT_PAGE_SECTIONS[pageKey] || []));
    },

    // Salvar todas as seções de uma página
    savePageSections: function(pageKey, sections) {
        pageKey = this.normalizePageKey(pageKey);
        // Atualiza sort_order sequencial
        sections.forEach((sec, idx) => { sec.sort_order = idx; });
        localStorage.setItem(this.STORAGE_PREFIX + pageKey, JSON.stringify(sections));

        // Tenta sincronizar com a API PHP em segundo plano
        this.syncWithBackend(pageKey, sections);
        return sections;
    },

    // Atualizar uma única seção
    updateSection: function(pageKey, sectionKey, updatedData) {
        pageKey = this.normalizePageKey(pageKey);
        const sections = this.getPageSections(pageKey);
        const idx = sections.findIndex(s => s.section_key === sectionKey);
        if (idx !== -1) {
            sections[idx] = { ...sections[idx], ...updatedData };
            this.savePageSections(pageKey, sections);
            return sections[idx];
        }
        return null;
    },

    // Alternar visibilidade
    toggleVisibility: function(pageKey, sectionKey, isVisible) {
        pageKey = this.normalizePageKey(pageKey);
        const sections = this.getPageSections(pageKey);
        const sec = sections.find(s => s.section_key === sectionKey);
        if (sec) {
            sec.is_visible = isVisible;
            this.savePageSections(pageKey, sections);
            return true;
        }
        return false;
    },

    // Mover seção para cima ou para baixo
    moveSection: function(pageKey, sectionKey, direction) {
        pageKey = this.normalizePageKey(pageKey);
        const sections = this.getPageSections(pageKey);
        const idx = sections.findIndex(s => s.section_key === sectionKey);
        if (idx === -1) return false;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sections.length) return false;

        // Troca posições
        const temp = sections[idx];
        sections[idx] = sections[targetIdx];
        sections[targetIdx] = temp;

        this.savePageSections(pageKey, sections);
        return true;
    },

    // Criar nova seção
    createSection: function(pageKey, newSectionData) {
        pageKey = this.normalizePageKey(pageKey);
        const sections = this.getPageSections(pageKey);
        const key = newSectionData.section_key || ('sec_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
        
        const newSec = {
            section_key: key,
            name: newSectionData.name || 'Nova Seção',
            title: newSectionData.title || 'Título da Seção',
            subtitle: newSectionData.subtitle || '',
            script_text: newSectionData.script_text || '',
            content: newSectionData.content || '',
            image_url: newSectionData.image_url || '',
            cta_text: newSectionData.cta_text || '',
            cta_link: newSectionData.cta_link || '',
            sort_order: sections.length,
            is_visible: true,
            metadata: newSectionData.metadata || {
                colors: { bg_color: '', title_color: '', text_color: '', accent_color: '' }
            }
        };

        sections.push(newSec);
        this.savePageSections(pageKey, sections);
        return newSec;
    },

    // Excluir seção
    deleteSection: function(pageKey, sectionKey) {
        pageKey = this.normalizePageKey(pageKey);
        let sections = this.getPageSections(pageKey);
        sections = sections.filter(s => s.section_key !== sectionKey);
        this.savePageSections(pageKey, sections);
        return true;
    },

    // Restaurar padrões da página
    resetPageToDefaults: function(pageKey) {
        pageKey = this.normalizePageKey(pageKey);
        const defaults = JSON.parse(JSON.stringify(DEFAULT_PAGE_SECTIONS[pageKey] || []));
        localStorage.setItem(this.STORAGE_PREFIX + pageKey, JSON.stringify(defaults));
        return defaults;
    },

    // Sincronização assíncrona com a API PHP
    syncWithBackend: async function(pageKey, sections) {
        try {
            if (typeof fetch !== 'undefined') {
                const res = await fetch(`api/sections.php?page=${pageKey}`);
                if (res.ok) {
                    const data = await res.json();
                    // Se a API estiver ativa, enviamos as ordens atualizadas
                    fetch('api/sections.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'reorder',
                            page_key: pageKey,
                            order: sections.map(s => s.section_key)
                        })
                    }).catch(() => {});
                }
            }
        } catch (e) {
            // Silencioso se ambiente estático sem PHP
        }
    },

    // Normalizar chave da página
    normalizePageKey: function(key) {
        if (!key) return 'index';
        key = key.replace('.html', '').replace('/', '').replace(/-/g, '_');
        if (key === '' || key === 'home') return 'index';
        return key;
    },

    // Identificar a página atual a partir da URL
    detectCurrentPage: function() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('nossa-historia')) return 'nossa_historia';
        if (path.includes('cardapio')) return 'cardapio';
        if (path.includes('montar-pedido')) return 'montar_pedido';
        if (path.includes('contato')) return 'contato';
        return 'index';
    },

    // Aplicar personalizações dinâmicas no DOM da página
    applyToDom: function() {
        const pageKey = this.detectCurrentPage();
        const sections = this.getPageSections(pageKey);

        sections.forEach(sec => {
            // Localiza elemento por ID correspondente à section_key ou classes
            const el = document.getElementById(sec.section_key) || 
                       document.querySelector(`[data-section="${sec.section_key}"]`) ||
                       document.getElementById(sec.section_key.replace('_', '-'));

            if (el) {
                // 1. Visibilidade
                if (!sec.is_visible) {
                    el.style.display = 'none';
                } else {
                    el.style.display = '';
                }

                // 2. Cores personalizadas
                if (sec.metadata && sec.metadata.colors) {
                    const c = sec.metadata.colors;
                    if (c.bg_color) el.style.backgroundColor = c.bg_color;
                    if (c.text_color) el.style.color = c.text_color;
                    if (c.title_color) {
                        el.querySelectorAll('h1, h2, h3, h4').forEach(h => h.style.color = c.title_color);
                    }
                    if (c.accent_color) {
                        el.querySelectorAll('.font-script, .text-primary, .text-accent').forEach(a => a.style.color = c.accent_color);
                    }
                }

                // 3. Textos editados
                const titleEl = el.querySelector('[data-field="title"]') || el.querySelector('h1, h2');
                if (titleEl && sec.title) titleEl.innerText = sec.title;

                const subtitleEl = el.querySelector('[data-field="subtitle"]');
                if (subtitleEl && sec.subtitle) subtitleEl.innerText = sec.subtitle;

                const scriptEl = el.querySelector('[data-field="script"]') || el.querySelector('.font-script');
                if (scriptEl && sec.script_text) scriptEl.innerText = sec.script_text;

                const contentEl = el.querySelector('[data-field="content"]');
                if (contentEl && sec.content) contentEl.innerText = sec.content;

                // 4. Imagem
                const imgEl = el.querySelector('[data-field="image"]') || el.querySelector('img');
                if (imgEl && sec.image_url) imgEl.src = sec.image_url;

                // 5. Botão CTA
                const ctaEl = el.querySelector('[data-field="cta"]') || el.querySelector('.idx-cta-btn, .btn-primary, .nav-cta');
                if (ctaEl) {
                    if (sec.cta_text) ctaEl.innerText = sec.cta_text;
                    if (sec.cta_link) ctaEl.href = sec.cta_link;
                }
            }
        });
    }
};

// ==========================================================
// GERENCIADOR DINÂMICO DE MENU E CABEÇALHO (HeaderMenuManager)
// ==========================================================
const DEFAULT_MENU_CONFIG = {
    position: 'right', // 'left', 'center', 'right'
    style_theme: 'elegant', // 'elegant', 'pills', 'minimal', 'vibrant'
    items: [
        { id: 'm1', label: 'Início', url: '/', is_visible: true, icon: 'fa-house' },
        { id: 'm2', label: 'Nossa História', url: '/nossa-historia', is_visible: true, icon: 'fa-heart' },
        { id: 'm3', label: 'Cardápio', url: '/cardapio', is_visible: true, icon: 'fa-cake-candles' },
        { id: 'm4', label: 'Montar Pedido', url: '/montar-pedido', is_visible: true, icon: 'fa-shopping-bag' },
        { id: 'm5', label: 'Contato', url: '/contato', is_visible: true, icon: 'fa-envelope' }
    ]
};

const HeaderMenuManager = {
    STORAGE_KEY: 'caseirinhos_menu_config',

    getConfig: function() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && Array.isArray(parsed.items)) return parsed;
            } catch(e) {}
        }
        return JSON.parse(JSON.stringify(DEFAULT_MENU_CONFIG));
    },

    saveConfig: function(config) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
        return config;
    },

    resetToDefault: function() {
        const def = JSON.parse(JSON.stringify(DEFAULT_MENU_CONFIG));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
        return def;
    },

    applyToDom: function() {
        const config = this.getConfig();
        const navLinksEl = document.querySelector('.nav-links');
        const mobilePanelEl = document.querySelector('.mobile-menu-panel');

        if (!navLinksEl) return;

        // Current page path for active link
        const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

        // Apply theme and position classes to navLinksEl
        navLinksEl.className = 'nav-links nav-links-' + (config.position || 'right') + ' menu-style-' + (config.style_theme || 'elegant');

        // Render Desktop Items
        let desktopHtml = '';
        config.items.forEach(item => {
            if (item.is_visible) {
                const itemPath = item.url.replace(/\.html$/, '').replace(/\/$/, '') || '/';
                const isActive = (currentPath === itemPath || (itemPath !== '/' && currentPath.startsWith(itemPath)));
                desktopHtml += `<li><a href="${item.url}" class="${isActive ? 'active' : ''}">${item.label}</a></li>`;
            }
        });
        navLinksEl.innerHTML = desktopHtml;

        // Render Mobile Items
        if (mobilePanelEl) {
            let mobileHtml = `
                <div class="mobile-menu-header">
                    <img src="images/logo-DZPmG4Qm.png" alt="Caseirinhos">
                    <button class="mobile-menu-close" onclick="closeMobileMenu()"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
            config.items.forEach(item => {
                if (item.is_visible) {
                    const iconClass = item.icon || 'fa-link';
                    mobileHtml += `<a href="${item.url}" onclick="closeMobileMenu()"><i class="fa-solid ${iconClass}"></i> ${item.label}</a>`;
                }
            });
            mobilePanelEl.innerHTML = mobileHtml;
        }
    }
};

// Execução automática na inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    // Não executa no painel admin para não interferir na interface administrativa
    if (!window.location.pathname.includes('/admin')) {
        SectionManager.applyToDom();
        HeaderMenuManager.applyToDom();
    }
});
