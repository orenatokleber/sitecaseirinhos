<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo | Caseirinhos a Confeitaria</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Nunito:wght@300;400;500;600;700;800&family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-main: #fbf7ee;
            --bg-sidebar: #faf6ed;
            --card-bg: #ffffff;
            --border-color: #efe5d5;
            --border-hover: #dfceb7;
            
            --text-main: #2d231b;
            --text-muted: #8d7f72;
            --text-light: #ab9f93;
            
            --accent-gold: #c3996b;
            --accent-gold-hover: #b0875b;
            --accent-light: #f5ece0;
            --accent-icon-bg: #f7efe4;
            
            --primary-teal: #24dbba;
            --primary-teal-dark: #1cb59a;
            
            --green: #2e9e66;
            --red: #d94f4f;
            
            --shadow-subtle: 0 2px 10px rgba(45, 35, 27, 0.03);
            --shadow-hover: 0 8px 24px rgba(45, 35, 27, 0.07);
            --radius-card: 1.25rem;
            --radius-pill: 9999px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Nunito', -apple-system, sans-serif;
            background: var(--bg-main);
            color: var(--text-main);
            display: flex;
            height: 100vh;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; }

        /* ===== SIDEBAR ELEGANTE ===== */
        .sidebar {
            width: 260px;
            background: var(--bg-sidebar);
            border-right: 1px solid var(--border-color);
            display: none;
            flex-direction: column;
            flex-shrink: 0;
            user-select: none;
        }

        .sidebar-brand {
            height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 1.5rem;
            text-align: center;
        }

        .sidebar-brand-title {
            font-family: 'Dancing Script', cursive;
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--accent-gold);
            line-height: 1;
            letter-spacing: 0.5px;
        }

        .sidebar-brand-sub {
            font-size: 0.6875rem;
            font-weight: 800;
            letter-spacing: 0.25em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 0.2rem;
        }

        .sidebar-menu {
            flex: 1;
            padding: 1rem 1.125rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            overflow-y: auto;
        }

        .menu-item {
            display: flex;
            align-items: center;
            gap: 0.875rem;
            padding: 0.8125rem 1.125rem;
            border-radius: var(--radius-pill);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9375rem;
            color: var(--text-muted);
            transition: all 0.2s ease;
            cursor: pointer;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
        }

        .menu-item i {
            width: 20px;
            text-align: center;
            font-size: 1rem;
            color: var(--text-muted);
            transition: color 0.2s ease;
        }

        .menu-item:hover {
            color: var(--text-main);
            background: rgba(195, 153, 107, 0.08);
        }

        .menu-item:hover i {
            color: var(--accent-gold);
        }

        .menu-item.active {
            background: var(--accent-gold);
            color: #ffffff;
            font-weight: 700;
            box-shadow: 0 4px 14px rgba(195, 153, 107, 0.35);
        }

        .menu-item.active i {
            color: #ffffff;
        }

        .sidebar-bottom {
            padding: 1.25rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .btn-live-site {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.65rem 1rem;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.8125rem;
            color: var(--accent-gold);
            border-radius: var(--radius-pill);
            background: var(--accent-light);
            transition: all 0.2s ease;
        }
        .btn-live-site:hover {
            background: var(--accent-gold);
            color: #ffffff;
        }

        /* ===== MAIN AREA ===== */
        .main-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            background: var(--bg-main);
        }

        .mobile-topbar {
            height: 64px;
            background: var(--bg-sidebar);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.25rem;
        }

        .mobile-brand {
            font-family: 'Dancing Script', cursive;
            font-size: 1.85rem;
            color: var(--accent-gold);
            font-weight: 700;
        }

        .main-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 2.5rem 3rem;
        }

        @media (max-width: 768px) {
            .main-scroll { padding: 1.5rem 1.25rem; }
        }

        /* ===== CABEÇALHO DA SEÇÃO PRINCIPAL ===== */
        .page-intro {
            margin-bottom: 2.25rem;
        }

        .page-intro h1 {
            font-size: 2.25rem;
            color: var(--text-main);
            line-height: 1.15;
            font-weight: 600;
        }

        .page-intro p {
            font-size: 0.9375rem;
            color: var(--text-muted);
            margin-top: 0.35rem;
        }

        /* ===== GRADE DE PÁGINAS (ESTILO DESIGN REFERÊNCIA) ===== */
        .pages-grid {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 1.5rem;
            max-width: 1280px;
        }

        @media (min-width: 640px) {
            .pages-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
            .pages-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .page-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-card);
            padding: 1.625rem;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 155px;
            box-shadow: var(--shadow-subtle);
            position: relative;
            text-decoration: none;
        }

        .page-card:hover {
            transform: translateY(-3px);
            border-color: var(--border-hover);
            box-shadow: var(--shadow-hover);
        }

        .page-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
        }

        .page-card-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: var(--accent-icon-bg);
            color: var(--accent-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.15rem;
            transition: all 0.2s ease;
        }

        .page-card:hover .page-card-icon {
            background: var(--accent-gold);
            color: #ffffff;
        }

        .page-card-chevron {
            color: var(--text-light);
            font-size: 0.875rem;
            transition: transform 0.2s ease, color 0.2s ease;
        }

        .page-card:hover .page-card-chevron {
            color: var(--accent-gold);
            transform: translateX(4px);
        }

        .page-card-body h3 {
            font-size: 1.15rem;
            color: var(--text-main);
            margin-bottom: 0.35rem;
            font-weight: 700;
        }

        .page-card-body p {
            font-size: 0.84rem;
            color: var(--text-muted);
            line-height: 1.45;
        }

        /* ===== DRILL DOWN: EDITOR DE SEÇÕES DA PÁGINA ESCOLHIDA ===== */
        .page-editor-view {
            display: none;
            max-width: 960px;
        }
        .page-editor-view.active { display: block; }

        .editor-top-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.75rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .btn-back-pages {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #ffffff;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            padding: 0.55rem 1.25rem;
            border-radius: var(--radius-pill);
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-back-pages:hover {
            border-color: var(--accent-gold);
            color: var(--accent-gold);
            transform: translateX(-2px);
        }

        .sections-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .section-item-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-card);
            overflow: hidden;
            box-shadow: var(--shadow-subtle);
            transition: all 0.2s ease;
        }

        .section-item-card:hover {
            border-color: var(--border-hover);
        }

        .section-item-card.is-hidden {
            opacity: 0.6;
            background: #f7f3ea;
        }

        .section-header-bar {
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            cursor: pointer;
            user-select: none;
        }

        .sec-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 1;
            min-width: 0;
        }

        .sec-arrows {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .sec-arrow-btn {
            background: #ffffff;
            border: 1px solid var(--border-color);
            width: 26px;
            height: 22px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.625rem;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .sec-arrow-btn:hover:not(:disabled) {
            background: var(--accent-gold);
            color: #ffffff;
            border-color: var(--accent-gold);
        }
        .sec-arrow-btn:disabled {
            opacity: 0.25;
            cursor: not-allowed;
        }

        .sec-title-group h4 {
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 0.15rem;
        }

        .sec-title-group p {
            font-size: 0.8125rem;
            color: var(--text-muted);
        }

        .sec-right {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        /* SWITCH TOGGLE */
        .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: #e5ded3;
            transition: .3s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input:checked + .slider { background-color: var(--accent-gold); }
        input:checked + .slider:before { transform: translateX(20px); }

        /* FORMULÁRIO INTERNO DE EDIÇÃO */
        .section-edit-drawer {
            display: none;
            padding: 1.75rem;
            border-top: 1px solid var(--border-color);
            background: #ffffff;
            gap: 1.25rem;
            flex-direction: column;
        }
        .section-edit-drawer.open { display: flex; }

        .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }
        @media (min-width: 640px) {
            .form-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .form-grid-4 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.875rem;
        }
        @media (min-width: 768px) {
            .form-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .form-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
        }

        .form-input {
            width: 100%;
            padding: 0.6875rem 0.875rem;
            border: 1px solid var(--border-color);
            border-radius: 0.625rem;
            font-family: 'Nunito', sans-serif;
            font-size: 0.875rem;
            outline: none;
            background: #ffffff;
            color: var(--text-main);
            transition: all 0.2s ease;
        }
        .form-input:focus {
            border-color: var(--accent-gold);
            box-shadow: 0 0 0 3px rgba(195, 153, 107, 0.15);
        }

        .color-box {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 0.625rem;
            padding: 0.35rem 0.5rem;
        }
        .color-box input[type="color"] {
            width: 28px;
            height: 28px;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 4px;
        }
        .color-box input[type="text"] {
            border: none;
            outline: none;
            font-family: monospace;
            font-size: 0.8125rem;
            width: 100%;
            color: var(--text-main);
        }

        /* BUTTONS */
        .btn-luxury {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1.35rem;
            border-radius: var(--radius-pill);
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            font-size: 0.875rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        .btn-gold {
            background: var(--accent-gold);
            color: #ffffff;
            box-shadow: 0 3px 10px rgba(195, 153, 107, 0.3);
        }
        .btn-gold:hover {
            background: var(--accent-gold-hover);
            transform: translateY(-1px);
        }
        .btn-subtle {
            background: #ffffff;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
        }
        .btn-subtle:hover {
            border-color: var(--accent-gold);
            color: var(--accent-gold);
        }
        .btn-danger-subtle {
            background: rgba(217, 79, 79, 0.08);
            border: 1px solid rgba(217, 79, 79, 0.25);
            color: var(--red);
        }
        .btn-danger-subtle:hover {
            background: var(--red);
            color: #ffffff;
        }

        /* TOAST */
        .toast-popup {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--text-main);
            color: #ffffff;
            padding: 0.875rem 1.5rem;
            border-radius: 0.875rem;
            font-weight: 700;
            font-size: 0.875rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.65rem;
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }
        .toast-popup.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .toast-popup.success { background: var(--green); }

        /* MODAL */
        .modal-wrap {
            position: fixed;
            inset: 0;
            background: rgba(45, 35, 27, 0.45);
            backdrop-filter: blur(4px);
            z-index: 1200;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
        }
        .modal-wrap.open { display: flex; }
        .modal-box {
            background: #ffffff;
            border-radius: var(--radius-card);
            max-width: 580px;
            width: 100%;
            padding: 2rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            max-height: 90vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        @media (min-width: 768px) {
            .sidebar { display: flex; }
            .mobile-topbar { display: none; }
        }
    </style>
</head>
<body>

    <!-- ===== SIDEBAR ===== -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="sidebar-brand-title">Caseirinhos</span>
            <span class="sidebar-brand-sub">ADMIN</span>
        </div>

        <nav class="sidebar-menu">
            <button class="menu-item" onclick="switchMainTab('dashboard')" id="menu-dashboard">
                <i class="fa-solid fa-house"></i> Dashboard
            </button>
            <button class="menu-item active" onclick="switchMainTab('pages')" id="menu-pages">
                <i class="fa-solid fa-layer-group"></i> Páginas
            </button>
            <button class="menu-item" onclick="switchMainTab('testimonials')" id="menu-testimonials">
                <i class="fa-solid fa-comment-dots"></i> Depoimentos
            </button>
            <button class="menu-item" onclick="switchMainTab('seo')" id="menu-seo">
                <i class="fa-solid fa-magnifying-glass"></i> SEO
            </button>
            <button class="menu-item" onclick="switchMainTab('links')" id="menu-links">
                <i class="fa-solid fa-link"></i> Links
            </button>
            <button class="menu-item" onclick="switchMainTab('biolinks')" id="menu-biolinks">
                <i class="fa-brands fa-instagram"></i> Biolinks
            </button>
        </nav>

        <div class="sidebar-bottom">
            <a href="/" target="_blank" class="btn-live-site">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Site ao Vivo
            </a>
            <a href="admin.php?logout=1" class="btn-live-site" style="background: rgba(217, 79, 79, 0.08); color: var(--red); margin-top: 0.5rem;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair do Painel
            </a>
        </div>
    </aside>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="main-wrapper">
        <!-- Topbar Mobile -->
        <div class="mobile-topbar">
            <span class="mobile-brand">Caseirinhos</span>
            <div style="display:flex; gap:0.5rem;">
                <a href="admin.php?logout=1" class="btn-luxury btn-danger-subtle" style="padding:0.4rem 0.8rem; font-size:0.75rem; text-decoration:none;"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
                <button class="btn-luxury btn-subtle" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="switchMainTab('pages')">Páginas</button>
                <a href="/" target="_blank" class="btn-luxury btn-gold" style="padding:0.4rem 0.8rem; font-size:0.75rem;"><i class="fa-solid fa-eye"></i></a>
            </div>
        </div>

        <div class="main-scroll">
            
            <!-- ============================================== -->
            <!-- ABA: PÁGINAS (VISÃO GERAL DOS CARDS)           -->
            <!-- ============================================== -->
            <div id="view-pages-grid">
                <div class="page-intro">
                    <h1>Páginas</h1>
                    <p>Escolha uma página do site para administrar.</p>
                </div>

                <div class="pages-grid">
                    <!-- 1. Página Inicial -->
                    <div class="page-card" onclick="openPageEditor('index', 'Página Inicial', 'Edite as seções da home (hero, sobre, delivery, etc).')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-solid fa-house"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Página Inicial</h3>
                            <p>Edite as seções da home (hero, sobre, delivery, etc).</p>
                        </div>
                    </div>

                    <!-- 2. Nossa História -->
                    <div class="page-card" onclick="openPageEditor('nossa_historia', 'Nossa História', 'Edite textos, imagens e valores da página Nossa História.')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-regular fa-heart"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Nossa História</h3>
                            <p>Edite textos, imagens e valores da página Nossa História.</p>
                        </div>
                    </div>

                    <!-- 3. Cardápio -->
                    <div class="page-card" onclick="openPageEditor('cardapio', 'Cardápio', 'Gerencie o cardápio de encomendas.')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-solid fa-utensils"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Cardápio</h3>
                            <p>Gerencie o cardápio de encomendas.</p>
                        </div>
                    </div>

                    <!-- 4. Montar Pedido -->
                    <div class="page-card" onclick="openPageEditor('montar_pedido', 'Montar Pedido', 'Edite textos e imagens da página de montar pedido.')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-solid fa-cake-candles"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Montar Pedido</h3>
                            <p>Edite textos e imagens da página de montar pedido.</p>
                        </div>
                    </div>

                    <!-- 5. Galeria -->
                    <div class="page-card" onclick="openPageEditor('nossa_historia', 'Galeria de Fotos', 'Adicione e organize as fotos da galeria.')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-regular fa-image"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Galeria</h3>
                            <p>Adicione e organize as fotos da galeria.</p>
                        </div>
                    </div>

                    <!-- 6. Blog -->
                    <div class="page-card" onclick="showToast('Módulo de Blog integrado!')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-solid fa-book-open"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Blog</h3>
                            <p>Gerencie os posts do blog.</p>
                        </div>
                    </div>

                    <!-- 7. Contato -->
                    <div class="page-card" onclick="openPageEditor('contato', 'Contato', 'Edite as informações de contato (via Configurações).')">
                        <div class="page-card-top">
                            <div class="page-card-icon">
                                <i class="fa-regular fa-envelope"></i>
                            </div>
                            <i class="fa-solid fa-chevron-right page-card-chevron"></i>
                        </div>
                        <div class="page-card-body">
                            <h3>Contato</h3>
                            <p>Edite as informações de contato (via Configurações).</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- DRILL DOWN: EDITOR DE SEÇÕES DA PÁGINA         -->
            <!-- ============================================== -->
            <div id="view-page-editor" class="page-editor-view">
                <div class="editor-top-actions">
                    <button type="button" class="btn-back-pages" onclick="closePageEditor()">
                        <i class="fa-solid fa-arrow-left"></i> Voltar para Páginas
                    </button>

                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <button type="button" class="btn-luxury btn-subtle" onclick="openNewSectionModal()">
                            <i class="fa-solid fa-plus"></i> Nova Seção
                        </button>
                        <button type="button" class="btn-luxury btn-subtle" onclick="resetCurrentPageSections()">
                            <i class="fa-solid fa-rotate-left"></i> Restaurar Padrões
                        </button>
                        <a id="btnLivePagePreview" href="/" target="_blank" class="btn-luxury btn-gold">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Página
                        </a>
                    </div>
                </div>

                <div class="page-intro" style="margin-bottom:1.5rem;">
                    <h1 id="editorPageTitle">Página Inicial</h1>
                    <p id="editorPageDesc">Edite os textos, fotos, cores e organize a ordem das seções.</p>
                </div>

                <!-- Pilha de Seções -->
                <div class="sections-stack" id="sectionsStackContainer">
                    <!-- Injetado dinamicamente via JS -->
                </div>
            </div>

            <!-- ============================================== -->
            <!-- ABA: LINKS & REDIRECIONAMENTOS (PRETTY LINKS)  -->
            <!-- ============================================== -->
            <div id="view-links" style="display:none; max-width:1100px;">
                <div class="editor-top-actions">
                    <div class="page-intro" style="margin-bottom:0;">
                        <h1>Redirecionamentos de Links</h1>
                        <p>Crie links curtos personalizados e rastreie cliques (estilo Pretty Links)</p>
                    </div>

                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <button type="button" class="btn-luxury btn-gold" onclick="openNewLinkModal()">
                            <i class="fa-solid fa-plus"></i> Novo Link
                        </button>
                    </div>
                </div>

                <!-- Barra de Busca e Filtro -->
                <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
                    <div style="position:relative; flex:1; max-width:400px;">
                        <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:1rem; top:50%; transform:translateY(-50%); color:var(--text-light); font-size:0.85rem;"></i>
                        <input type="text" id="linkSearchInput" oninput="renderLinksList(this.value)" placeholder="Buscar por título, atalho ou URL..." class="form-input" style="padding-left:2.5rem; border-radius:var(--radius-pill);">
                    </div>
                    <div style="font-size:0.8125rem; color:var(--text-muted); font-weight:700;" id="linksCountBadge">
                        4 links cadastrados
                    </div>
                </div>

                <!-- Lista de Links Cadastrados -->
                <div class="sections-stack" id="linksListContainer">
                    <!-- Injetado dinamicamente via JS -->
                </div>
            </div>

            <!-- ============================================== -->
            <!-- ABA: BIOLINKS                                  -->
            <!-- ============================================== -->
            <div id="view-biolinks" style="display:none; max-width:1100px;">
                <div class="editor-top-actions">
                    <div class="page-intro" style="margin-bottom:0;">
                        <h1>Página de Biolinks</h1>
                        <p>Gerencie sua página pública de links (Linktree)</p>
                        <a href="links.php" target="_blank" style="display:inline-block; margin-top:0.5rem; color:var(--accent-gold); font-weight:bold; font-size:0.9rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Página Pública</a>
                    </div>
                    <button type="button" class="btn-luxury btn-gold" onclick="openBiolinkModal()">
                        <i class="fa-solid fa-plus"></i> Novo Botão de Link
                    </button>
                </div>

                <div style="background:#fff; padding:1.5rem; border-radius:var(--radius-card); border:1px solid var(--border-color); margin-bottom:2rem;">
                    <h3 style="margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-palette"></i> Configurações do Perfil</h3>
                    <form id="biolinksConfigForm" onsubmit="saveBiolinksConfig(event)" class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">Nome do Perfil</label>
                            <input type="text" id="bio_name" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">URL da Foto de Perfil</label>
                            <input type="text" id="bio_image" class="form-input">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label">Descrição Breve</label>
                            <input type="text" id="bio_desc" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cor de Fundo da Página</label>
                            <div class="color-box">
                                <input type="color" id="bio_bg_color">
                                <input type="text" id="bio_bg_color_text" oninput="document.getElementById('bio_bg_color').value=this.value">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cor do Texto da Página</label>
                            <div class="color-box">
                                <input type="color" id="bio_text_color">
                                <input type="text" id="bio_text_color_text" oninput="document.getElementById('bio_text_color').value=this.value">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cor de Fundo dos Botões</label>
                            <div class="color-box">
                                <input type="color" id="bio_btn_bg">
                                <input type="text" id="bio_btn_bg_text" oninput="document.getElementById('bio_btn_bg').value=this.value">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cor do Texto dos Botões</label>
                            <div class="color-box">
                                <input type="color" id="bio_btn_text">
                                <input type="text" id="bio_btn_text_text" oninput="document.getElementById('bio_btn_text').value=this.value">
                            </div>
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1; margin-top:1rem;">
                            <button type="submit" class="btn-luxury btn-gold">Salvar Configurações</button>
                        </div>
                    </form>
                </div>

                <h3 style="margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-list-ul"></i> Seus Botões (Arraste para ordenar)</h3>
                <div class="sections-stack" id="biolinksListContainer">
                    <!-- JS vai preencher -->
                </div>
            </div>

            <!-- MODAL DE BIOLINK -->
            <div class="modal-wrap" id="modalBiolink">
                <div class="modal-box">
                    <h3 style="font-size:1.5rem; color:var(--accent-gold);"><i class="fa-solid fa-link"></i> Editar Botão</h3>
                    <form id="formBiolink" onsubmit="saveBiolink(event)" style="display:flex; flex-direction:column; gap:1.25rem;">
                        <input type="hidden" id="biolink_id" value="0">
                        <div class="form-group">
                            <label class="form-label">Título do Botão</label>
                            <input type="text" id="biolink_title" class="form-input" required placeholder="Ex: Fazer Pedido">
                        </div>
                        <div class="form-group">
                            <label class="form-label">URL de Destino</label>
                            <input type="text" id="biolink_url" class="form-input" required placeholder="https://...">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Classe do Ícone (FontAwesome)</label>
                            <input type="text" id="biolink_icon" class="form-input" placeholder="fa-whatsapp">
                            <small style="color:var(--text-light); margin-top:0.3rem;">Ex: fa-whatsapp, fa-instagram, fa-cake-candles</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Visibilidade</label>
                            <label class="switch">
                                <input type="checkbox" id="biolink_active" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div style="display:flex; gap:1rem; justify-content:flex-end; margin-top:1rem;">
                            <button type="button" class="btn-luxury btn-subtle" onclick="document.getElementById('modalBiolink').classList.remove('open')">Cancelar</button>
                            <button type="submit" class="btn-luxury btn-gold">Salvar Botão</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- OUTRAS ABAS (Dashboard, etc.)                  -->
            <!-- ============================================== -->
            <div id="view-dashboard" style="display:none;">
                <div class="page-intro">
                    <h1>Dashboard</h1>
                    <p>Visão geral do Caseirinhos Confeitaria</p>
                </div>
                <div style="background:#fff; border:1px solid var(--border-color); border-radius:var(--radius-card); padding:2rem; box-shadow:var(--shadow-subtle);">
                    <h3 style="font-size:1.35rem; margin-bottom:0.75rem; color:var(--text-main);">👋 Olá! Bem-vindo ao Painel da Caseirinhos.</h3>
                    <p style="color:var(--text-muted); line-height:1.7; margin-bottom:1.5rem;">
                        Utilize a aba <strong>Páginas</strong> para customizar qualquer texto, imagem, cor ou botão de qualquer página do seu site, ou acesse <strong>Links</strong> para criar redirecionamentos curtos!
                    </p>
                    <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                        <button class="btn-luxury btn-gold" onclick="switchMainTab('pages')">
                            <i class="fa-solid fa-layer-group"></i> Ver Páginas
                        </button>
                        <button class="btn-luxury btn-subtle" onclick="switchMainTab('links')">
                            <i class="fa-solid fa-link"></i> Gerenciar Links
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: CRIAR / EDITAR REDIRECIONAMENTO (LINK)  -->
    <!-- ============================================== -->
    <div id="linkModal" class="modal-wrap">
        <div class="modal-box">
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                <h3 style="font-size:1.35rem;" id="linkModalTitle">Novo Redirecionamento</h3>
                <button onclick="closeLinkModal()" class="btn-luxury btn-subtle" style="padding:0.4rem 0.8rem;"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <input type="hidden" id="editLinkId" value="">

            <div class="form-group">
                <label class="form-label">Título / Identificação do Link *</label>
                <input type="text" id="linkTitleInput" class="form-input" placeholder="Ex: WhatsApp Oficial Atendimento">
            </div>

            <div class="form-group">
                <label class="form-label">Atalho / Slug Amigável (URL Curta) *</label>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-family:monospace; font-size:0.875rem; color:var(--text-muted); background:var(--accent-icon-bg); padding:0.6875rem 0.875rem; border-radius:0.625rem; border:1px solid var(--border-color); white-space:nowrap;" id="slugDomainPrefix">caseirinhos.com/</span>
                    <input type="text" id="linkSlugInput" class="form-input" placeholder="whatsapp" oninput="sanitizeSlug(this)" style="font-family:monospace; font-weight:700;">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">URL de Destino (Para onde redirecionar) *</label>
                <input type="url" id="linkTargetInput" class="form-input" placeholder="https://wa.me/5511948598267 ou https://instagram.com/...">
            </div>

            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Tipo de Redirecionamento</label>
                    <select id="linkTypeSelect" class="form-input" style="cursor:pointer;">
                        <option value="301">301 (Redirecionamento Permanente - Recomendado)</option>
                        <option value="302">302 (Redirecionamento Temporário)</option>
                    </select>
                </div>
                <div class="form-group" style="justify-content:center;">
                    <label class="form-label">Status</label>
                    <label style="display:flex; align-items:center; gap:0.6rem; cursor:pointer; margin-top:0.4rem; font-weight:700; font-size:0.875rem;">
                        <input type="checkbox" id="linkActiveCheckbox" checked style="width:18px; height:18px; accent-color:var(--accent-gold);">
                        Link Ativo e Redirecionando
                    </label>
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
                <button type="button" class="btn-luxury btn-subtle" onclick="closeLinkModal()">Cancelar</button>
                <button type="button" class="btn-luxury btn-gold" onclick="submitLinkModal()">Salvar Redirecionamento</button>
            </div>
        </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: CRIAR NOVA SEÇÃO                        -->
    <!-- ============================================== -->
    <div id="newSectionModal" class="modal-wrap">
        <div class="modal-box">
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                <h3 style="font-size:1.35rem;">Criar Nova Seção</h3>
                <button onclick="closeNewSectionModal()" class="btn-luxury btn-subtle" style="padding:0.4rem 0.8rem;"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="form-group">
                <label class="form-label">Nome da Seção (Exibição interna) *</label>
                <input type="text" id="newSecName" class="form-input" placeholder="Ex: Banner Promocional de Páscoa">
            </div>

            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Título Principal *</label>
                    <input type="text" id="newSecTitle" class="form-input" placeholder="Ex: Especial de Páscoa 🐰">
                </div>
                <div class="form-group">
                    <label class="form-label">Texto Cursivo / Script</label>
                    <input type="text" id="newSecScript" class="form-input" placeholder="Ex: Edição Limitada">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Subtítulo</label>
                <input type="text" id="newSecSubtitle" class="form-input" placeholder="Ex: Garanta sua encomenda com antecedência">
            </div>

            <div class="form-group">
                <label class="form-label">Texto / Parágrafo</label>
                <textarea id="newSecContent" class="form-input" rows="3" placeholder="Descrição ou mensagem especial..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">URL da Imagem</label>
                <input type="text" id="newSecImage" class="form-input" placeholder="images/exemplo.webp ou https://...">
            </div>

            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Texto do Botão (CTA)</label>
                    <input type="text" id="newSecCtaText" class="form-input" placeholder="Ex: Fazer Pedido Online">
                </div>
                <div class="form-group">
                    <label class="form-label">Link do Botão</label>
                    <input type="text" id="newSecCtaLink" class="form-input" placeholder="Ex: /montar-pedido">
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
                <button type="button" class="btn-luxury btn-subtle" onclick="closeNewSectionModal()">Cancelar</button>
                <button type="button" class="btn-luxury btn-gold" onclick="submitNewSection()">Criar Seção</button>
            </div>
        </div>
    </div>

    <!-- TOAST POPUP -->
    <div id="toastPopup" class="toast-popup">
        <i class="fa-solid fa-circle-check"></i>
        <span id="toastPopupMsg">Salvo com sucesso!</span>
    </div>

    <!-- Scripts -->
    <script src="assets/app.js"></script>
    <script src="assets/cardapio.js"></script>
    <script>
        let currentEditingPageKey = 'index';

        const PAGE_DESTINATIONS = {
            'index': '/',
            'nossa_historia': '/nossa-historia',
            'cardapio': '/cardapio',
            'montar_pedido': '/montar-pedido',
            'contato': '/contato'
        };

        function switchMainTab(tabKey) {
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            const activeBtn = document.getElementById('menu-' + tabKey);
            if (activeBtn) activeBtn.classList.add('active');

            // Oculta todas as visualizações principais
            document.getElementById('view-pages-grid').style.display = 'none';
            document.getElementById('view-page-editor').classList.remove('active');
            document.getElementById('view-dashboard').style.display = 'none';
            document.getElementById('view-links').style.display = 'none';
            if(document.getElementById('view-biolinks')) document.getElementById('view-biolinks').style.display = 'none';

            if (tabKey === 'pages') {
                document.getElementById('view-pages-grid').style.display = 'block';
            } else if (tabKey === 'dashboard') {
                document.getElementById('view-dashboard').style.display = 'block';
            } else if (tabKey === 'biolinks') {
                document.getElementById('view-biolinks').style.display = 'block';
                loadBiolinksConfig();
                loadBiolinksList();
            } else if (tabKey === 'links') {
                document.getElementById('view-links').style.display = 'block';
                renderLinksList();
            } else {
                showToast(`Módulo "${tabKey}" selecionado.`);
            }
        }

        // ==========================================================
        // LINK MANAGER (PRETTY LINKS - REDIRECIONAMENTOS)
        // ==========================================================
        const LinkManager = {
            STORAGE_KEY: 'caseirinhos_short_links',
            DEFAULT_LINKS: [
                {
                    id: 1,
                    slug: 'whatsapp',
                    title: 'WhatsApp Oficial de Atendimento',
                    target_url: 'https://wa.me/5511948598267?text=Olá! Vim pelo link do site da Caseirinhos.',
                    redirect_type: 301,
                    clicks: 48,
                    is_active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    slug: 'instagram',
                    title: 'Perfil Oficial no Instagram',
                    target_url: 'https://instagram.com/caseirinhosaconfeitaria',
                    redirect_type: 301,
                    clicks: 112,
                    is_active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    slug: 'delivery',
                    title: 'Cardápio de Delivery (InstaDelivery)',
                    target_url: 'https://instadelivery.com.br/caseirinhosaconfeitaria',
                    redirect_type: 302,
                    clicks: 79,
                    is_active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    slug: 'encomendas',
                    title: 'Montador de Pedido Passo a Passo',
                    target_url: '/montar-pedido',
                    redirect_type: 301,
                    clicks: 35,
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            ],

            getLinks() {
                try {
                    const saved = localStorage.getItem(this.STORAGE_KEY);
                    if (saved) return JSON.parse(saved);
                } catch(e) {}
                this.saveLinks(this.DEFAULT_LINKS);
                return this.DEFAULT_LINKS;
            },

            saveLinks(links) {
                try {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(links));
                } catch(e) {}
            },

            createLink(linkData) {
                const links = this.getLinks();
                const newId = Date.now();
                const newLink = {
                    id: newId,
                    slug: linkData.slug.toLowerCase().trim(),
                    title: linkData.title.trim(),
                    target_url: linkData.target_url.trim(),
                    redirect_type: parseInt(linkData.redirect_type) || 301,
                    clicks: 0,
                    is_active: linkData.is_active !== false,
                    created_at: new Date().toISOString()
                };

                links.unshift(newLink);
                this.saveLinks(links);
                this.syncWithBackend('create', newLink);
                return newLink;
            },

            updateLink(id, linkData) {
                const links = this.getLinks();
                const index = links.findIndex(l => l.id == id);
                if (index === -1) return false;

                links[index] = {
                    ...links[index],
                    slug: linkData.slug.toLowerCase().trim(),
                    title: linkData.title.trim(),
                    target_url: linkData.target_url.trim(),
                    redirect_type: parseInt(linkData.redirect_type) || 301,
                    is_active: linkData.is_active !== false,
                    updated_at: new Date().toISOString()
                };

                this.saveLinks(links);
                this.syncWithBackend('update', links[index]);
                return links[index];
            },

            toggleLink(id, isActive) {
                const links = this.getLinks();
                const link = links.find(l => l.id == id);
                if (link) {
                    link.is_active = isActive;
                    this.saveLinks(links);
                    this.syncWithBackend('toggle', { id, is_active: isActive });
                }
            },

            deleteLink(id) {
                let links = this.getLinks();
                links = links.filter(l => l.id != id);
                this.saveLinks(links);
                this.syncWithBackend('delete', { id });
            },

            syncWithBackend(action, data) {
                fetch('api/links.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, ...data })
                }).catch(() => {});
            }
        };

        // Renderização dos links na interface
        function renderLinksList(searchFilter = '') {
            const container = document.getElementById('linksListContainer');
            if (!container) return;

            let links = LinkManager.getLinks();
            if (searchFilter) {
                const q = searchFilter.toLowerCase();
                links = links.filter(l => l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q) || l.target_url.toLowerCase().includes(q));
            }

            document.getElementById('linksCountBadge').innerText = `${links.length} link${links.length !== 1 ? 's' : ''} cadastrado${links.length !== 1 ? 's' : ''}`;

            if (links.length === 0) {
                container.innerHTML = `
                    <div style="background:#fff; border:1px solid var(--border-color); border-radius:var(--radius-card); padding:3rem 2rem; text-align:center;">
                        <i class="fa-solid fa-link" style="font-size:2.5rem; color:var(--accent-gold); opacity:0.4; margin-bottom:1rem;"></i>
                        <h3 style="font-size:1.2rem; margin-bottom:0.5rem;">Nenhum redirecionamento encontrado</h3>
                        <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:1.5rem;">Crie seu primeiro link curto amigável para divulgar nas redes sociais.</p>
                        <button class="btn-luxury btn-gold" onclick="openNewLinkModal()"><i class="fa-solid fa-plus"></i> Novo Link</button>
                    </div>
                `;
                return;
            }

            const origin = window.location.origin;

            container.innerHTML = links.map(link => {
                const shortUrl = `${origin}/${link.slug}`;
                const testUrl = `r.php?slug=${link.slug}`;

                return `
                    <div class="section-item-card ${!link.is_active ? 'is-hidden' : ''}" style="padding:1.35rem 1.65rem;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
                            
                            <!-- Lado Esquerdo: Título, Slug e Destino -->
                            <div style="flex:1; min-width:260px;">
                                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; flex-wrap:wrap;">
                                    <h4 style="font-size:1.1rem; color:var(--text-main); font-weight:700;">${link.title}</h4>
                                    <span style="font-size:0.7rem; font-weight:800; padding:0.15rem 0.5rem; border-radius:0.35rem; background:var(--accent-icon-bg); color:var(--accent-gold);">
                                        ${link.redirect_type || 301} ${link.redirect_type == 302 ? 'Temporário' : 'Permanente'}
                                    </span>
                                    <span style="font-size:0.7rem; font-weight:800; padding:0.15rem 0.5rem; border-radius:0.35rem; background:${link.is_active ? 'rgba(46,158,102,0.1)' : 'rgba(217,79,79,0.1)'}; color:${link.is_active ? 'var(--green)' : 'var(--red)'};">
                                        ${link.is_active ? '● Ativo' : '○ Inativo'}
                                    </span>
                                </div>

                                <!-- Linha do Link Curto -->
                                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap;">
                                    <span style="font-family:monospace; font-weight:700; font-size:0.875rem; color:var(--accent-gold); background:#faf5ed; padding:0.3rem 0.65rem; border-radius:0.5rem; border:1px solid #efe4d3;">
                                        /${link.slug}
                                    </span>
                                    <button class="btn-luxury btn-subtle" style="padding:0.25rem 0.65rem; font-size:0.75rem;" onclick="copyShortLink('${link.slug}')" title="Copiar link completo">
                                        <i class="fa-regular fa-copy"></i> Copiar Link
                                    </button>
                                </div>

                                <!-- Destino -->
                                <div style="font-size:0.8125rem; color:var(--text-muted); display:flex; align-items:center; gap:0.4rem; word-break:break-all;">
                                    <i class="fa-solid fa-arrow-turn-down" style="transform:rotate(-90deg); font-size:0.7rem; color:var(--text-light);"></i>
                                    <span>Destino:</span>
                                    <a href="${link.target_url}" target="_blank" style="color:var(--text-main); text-decoration:underline; font-weight:600;">
                                        ${link.target_url}
                                    </a>
                                </div>
                            </div>

                            <!-- Lado Direito: Cliques, Toggle e Ações -->
                            <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
                                <div style="text-align:center; padding:0.4rem 0.85rem; background:#fff; border:1px solid var(--border-color); border-radius:0.75rem; min-width:85px;">
                                    <div style="font-size:1.15rem; font-weight:800; color:var(--text-main);">${link.clicks || 0}</div>
                                    <div style="font-size:0.6875rem; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Cliques</div>
                                </div>

                                <label class="switch" title="Ativar ou desativar este redirecionamento">
                                    <input type="checkbox" ${link.is_active ? 'checked' : ''} onchange="handleToggleLink(${link.id}, this.checked)">
                                    <span class="slider"></span>
                                </label>

                                <div style="display:flex; gap:0.4rem;">
                                    <a href="${testUrl}" target="_blank" class="btn-luxury btn-subtle" style="padding:0.45rem 0.75rem;" title="Testar Redirecionamento">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                    <button class="btn-luxury btn-subtle" style="padding:0.45rem 0.75rem;" onclick="openEditLinkModal(${link.id})" title="Editar Link">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button class="btn-luxury btn-danger-subtle" style="padding:0.45rem 0.75rem;" onclick="handleDeleteLink(${link.id}, '${link.title}')" title="Excluir Link">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                `;
            }).join('');
        }

        function sanitizeSlug(input) {
            input.value = input.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        }

        function copyShortLink(slug) {
            const url = `${window.location.origin}/${slug}`;
            navigator.clipboard.writeText(url).then(() => {
                showToast(`Link copiado: ${url}`);
            }).catch(() => {
                // Fallback para input manual
                prompt('Copie o link abaixo:', url);
            });
        }

        function openNewLinkModal() {
            document.getElementById('linkModalTitle').innerText = 'Novo Redirecionamento (Pretty Link)';
            document.getElementById('editLinkId').value = '';
            document.getElementById('linkTitleInput').value = '';
            document.getElementById('linkSlugInput').value = '';
            document.getElementById('linkTargetInput').value = '';
            document.getElementById('linkTypeSelect').value = '301';
            document.getElementById('linkActiveCheckbox').checked = true;
            document.getElementById('linkModal').classList.add('open');
        }

        function openEditLinkModal(id) {
            const links = LinkManager.getLinks();
            const link = links.find(l => l.id == id);
            if (!link) return;

            document.getElementById('linkModalTitle').innerText = 'Editar Redirecionamento';
            document.getElementById('editLinkId').value = link.id;
            document.getElementById('linkTitleInput').value = link.title;
            document.getElementById('linkSlugInput').value = link.slug;
            document.getElementById('linkTargetInput').value = link.target_url;
            document.getElementById('linkTypeSelect').value = link.redirect_type || 301;
            document.getElementById('linkActiveCheckbox').checked = link.is_active !== false;
            document.getElementById('linkModal').classList.add('open');
        }

        function closeLinkModal() {
            document.getElementById('linkModal').classList.remove('open');
        }

        function submitLinkModal() {
            const id = document.getElementById('editLinkId').value;
            const title = document.getElementById('linkTitleInput').value.trim();
            let slug = document.getElementById('linkSlugInput').value.trim().toLowerCase();
            const target_url = document.getElementById('linkTargetInput').value.trim();
            const redirect_type = document.getElementById('linkTypeSelect').value;
            const is_active = document.getElementById('linkActiveCheckbox').checked;

            if (!slug || !target_url) {
                alert('O atalho (slug) e a URL de destino são obrigatórios.');
                return;
            }

            slug = slug.replace(/[^a-z0-9_-]/g, '');

            // Verifica duplicidade de slug
            const links = LinkManager.getLinks();
            const duplicate = links.find(l => l.slug === slug && l.id != id);
            if (duplicate) {
                alert(`O atalho "${slug}" já está em uso pelo link "${duplicate.title}". Escolha outro.`);
                return;
            }

            const payload = {
                title: title || slug,
                slug,
                target_url,
                redirect_type,
                is_active
            };

            if (id) {
                LinkManager.updateLink(id, payload);
                showToast('Redirecionamento atualizado com sucesso!');
            } else {
                LinkManager.createLink(payload);
                showToast('Redirecionamento criado com sucesso!');
            }

            closeLinkModal();
            renderLinksList();
        }

        function handleToggleLink(id, isActive) {
            LinkManager.toggleLink(id, isActive);
            renderLinksList();
            showToast(`Link ${isActive ? 'ativado' : 'desativado'}!`);
        }

        function handleDeleteLink(id, title) {
            if (confirm(`Deseja realmente excluir o redirecionamento "${title}"?`)) {
                LinkManager.deleteLink(id);
                renderLinksList();
                showToast('Redirecionamento excluído!');
            }
        }

        function openPageEditor(pageKey, pageTitle, pageDesc) {
            currentEditingPageKey = pageKey;
            
            document.getElementById('view-pages-grid').style.display = 'none';
            document.getElementById('view-dashboard').style.display = 'none';
            
            const editorView = document.getElementById('view-page-editor');
            editorView.classList.add('active');

            document.getElementById('editorPageTitle').innerText = pageTitle;
            document.getElementById('editorPageDesc').innerText = pageDesc;

            const liveBtn = document.getElementById('btnLivePagePreview');
            if (liveBtn) liveBtn.href = PAGE_DESTINATIONS[pageKey] || '/';

            renderPageSectionsStack();
        }

        function closePageEditor() {
            document.getElementById('view-page-editor').classList.remove('active');
            document.getElementById('view-pages-grid').style.display = 'block';
        }

        function showToast(msg, isSuccess = true) {
            const toast = document.getElementById('toastPopup');
            document.getElementById('toastPopupMsg').innerText = msg;
            toast.className = 'toast-popup show ' + (isSuccess ? 'success' : '');
            setTimeout(() => { toast.classList.remove('show'); }, 3000);
        }

        // ==========================================
        // RENDERIZAR PILHA DE SEÇÕES DA PÁGINA ATIVA
        // ==========================================
        function renderPageSectionsStack() {
            const container = document.getElementById('sectionsStackContainer');
            const sections = SectionManager.getPageSections(currentEditingPageKey);

            if (!container) return;

            if (sections.length === 0) {
                container.innerHTML = `
                    <div style="background:#fff; border:1px solid var(--border-color); border-radius:var(--radius-card); padding:3rem 2rem; text-align:center;">
                        <i class="fa-solid fa-layer-group" style="font-size:2.5rem; color:var(--accent-gold); opacity:0.4; margin-bottom:1rem;"></i>
                        <h3 style="font-size:1.2rem; margin-bottom:0.5rem;">Nenhuma seção encontrada nesta página</h3>
                        <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:1.5rem;">Clique no botão abaixo para adicionar a primeira seção.</p>
                        <button class="btn-luxury btn-gold" onclick="openNewSectionModal()"><i class="fa-solid fa-plus"></i> Criar Seção</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = sections.map((sec, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === sections.length - 1;
                const colors = sec.metadata?.colors || {};
                const isHidden = !sec.is_visible;

                return `
                    <div class="section-item-card ${isHidden ? 'is-hidden' : ''}" id="sec-card-${sec.section_key}">
                        <!-- Cabeçalho -->
                        <div class="section-header-bar" onclick="toggleEditDrawer('${sec.section_key}')">
                            <div class="sec-left">
                                <div class="sec-arrows" onclick="event.stopPropagation()">
                                    <button class="sec-arrow-btn" title="Mover para cima" ${isFirst ? 'disabled' : ''} onclick="handleMoveSec('${sec.section_key}', 'up')">
                                        <i class="fa-solid fa-chevron-up"></i>
                                    </button>
                                    <button class="sec-arrow-btn" title="Mover para baixo" ${isLast ? 'disabled' : ''} onclick="handleMoveSec('${sec.section_key}', 'down')">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </button>
                                </div>

                                <div class="sec-title-group">
                                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                                        <h4>${sec.name || sec.title || 'Seção sem título'}</h4>
                                        <span style="font-size:0.75rem; background:var(--accent-icon-bg); color:var(--accent-gold); padding:0.15rem 0.5rem; border-radius:0.35rem; font-weight:700;">#${idx + 1}</span>
                                        ${isHidden ? '<span style="font-size:0.7rem; background:rgba(217,79,79,0.1); color:var(--red); padding:0.15rem 0.5rem; border-radius:0.35rem; font-weight:700;">Oculta</span>' : '<span style="font-size:0.7rem; background:rgba(46,158,102,0.1); color:var(--green); padding:0.15rem 0.5rem; border-radius:0.35rem; font-weight:700;">Visível</span>'}
                                    </div>
                                    <p>${sec.title ? `<strong>Título:</strong> ${sec.title}` : `ID: ${sec.section_key}`}</p>
                                </div>
                            </div>

                            <div class="sec-right" onclick="event.stopPropagation()">
                                <label class="switch" title="Exibir ou ocultar esta seção na página">
                                    <input type="checkbox" ${sec.is_visible ? 'checked' : ''} onchange="handleToggleSec('${sec.section_key}', this.checked)">
                                    <span class="slider"></span>
                                </label>
                                <button class="btn-luxury btn-subtle" style="padding:0.4rem 0.8rem;" onclick="toggleEditDrawer('${sec.section_key}')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Gaveta de Edição Detalhada -->
                        <div class="section-edit-drawer" id="drawer-${sec.section_key}">
                            <div class="form-grid-2">
                                <div class="form-group">
                                    <label class="form-label">Nome da Seção (Painel)</label>
                                    <input type="text" class="form-input" value="${sec.name || ''}" id="in-name-${sec.section_key}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Texto Cursivo / Script</label>
                                    <input type="text" class="form-input" value="${sec.script_text || ''}" id="in-script-${sec.section_key}">
                                </div>
                            </div>

                            <div class="form-grid-2">
                                <div class="form-group">
                                    <label class="form-label">Título Principal</label>
                                    <input type="text" class="form-input" value="${sec.title || ''}" id="in-title-${sec.section_key}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Subtítulo</label>
                                    <input type="text" class="form-input" value="${sec.subtitle || ''}" id="in-subtitle-${sec.section_key}">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Texto Principal / Conteúdo</label>
                                <textarea class="form-input" rows="3" id="in-content-${sec.section_key}">${sec.content || ''}</textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">URL da Imagem</label>
                                <input type="text" class="form-input" value="${sec.image_url || ''}" id="in-img-${sec.section_key}">
                            </div>

                            <div class="form-grid-2">
                                <div class="form-group">
                                    <label class="form-label">Texto do Botão (CTA)</label>
                                    <input type="text" class="form-input" value="${sec.cta_text || ''}" id="in-cta-text-${sec.section_key}" placeholder="Ex: Ver Cardápio">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Link do Botão</label>
                                    <input type="text" class="form-input" value="${sec.cta_link || ''}" id="in-cta-link-${sec.section_key}" placeholder="Ex: /cardapio">
                                </div>
                            </div>

                            <!-- Cores -->
                            <div class="form-group">
                                <label class="form-label">Personalização de Cores da Seção</label>
                                <div class="form-grid-4">
                                    <div class="form-group">
                                        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">Cor de Fundo</span>
                                        <div class="color-box">
                                            <input type="color" value="${colors.bg_color || '#ffffff'}" onchange="document.getElementById('in-color-bg-${sec.section_key}').value = this.value">
                                            <input type="text" value="${colors.bg_color || ''}" placeholder="Padrão" id="in-color-bg-${sec.section_key}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">Cor do Título</span>
                                        <div class="color-box">
                                            <input type="color" value="${colors.title_color || '#2d231b'}" onchange="document.getElementById('in-color-title-${sec.section_key}').value = this.value">
                                            <input type="text" value="${colors.title_color || ''}" placeholder="Padrão" id="in-color-title-${sec.section_key}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">Cor do Texto</span>
                                        <div class="color-box">
                                            <input type="color" value="${colors.text_color || '#8d7f72'}" onchange="document.getElementById('in-color-text-${sec.section_key}').value = this.value">
                                            <input type="text" value="${colors.text_color || ''}" placeholder="Padrão" id="in-color-text-${sec.section_key}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">Cor de Destaque</span>
                                        <div class="color-box">
                                            <input type="color" value="${colors.accent_color || '#c3996b'}" onchange="document.getElementById('in-color-accent-${sec.section_key}').value = this.value">
                                            <input type="text" value="${colors.accent_color || ''}" placeholder="Padrão" id="in-color-accent-${sec.section_key}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Botões de Ação -->
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:1.25rem;">
                                <button type="button" class="btn-luxury btn-danger-subtle" onclick="handleDeleteSec('${sec.section_key}', '${sec.name || sec.title}')">
                                    <i class="fa-solid fa-trash"></i> Excluir Seção
                                </button>
                                <div style="display:flex; gap:0.75rem;">
                                    <button type="button" class="btn-luxury btn-subtle" onclick="toggleEditDrawer('${sec.section_key}')">Fechar</button>
                                    <button type="button" class="btn-luxury btn-gold" onclick="handleSaveSec('${sec.section_key}')">
                                        <i class="fa-solid fa-floppy-disk"></i> Salvar Seção
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function toggleEditDrawer(secKey) {
            const drawer = document.getElementById('drawer-' + secKey);
            if (drawer) drawer.classList.toggle('open');
        }

        function handleMoveSec(secKey, direction) {
            const ok = SectionManager.moveSection(currentEditingPageKey, secKey, direction);
            if (ok) {
                renderPageSectionsStack();
                showToast(`Seção movida para ${direction === 'up' ? 'cima' : 'baixo'}!`);
            }
        }

        function handleToggleSec(secKey, isVisible) {
            SectionManager.toggleVisibility(currentEditingPageKey, secKey, isVisible);
            renderPageSectionsStack();
            showToast(`Seção ${isVisible ? 'exibida' : 'ocultada'} com sucesso!`);
        }

        function handleSaveSec(secKey) {
            const name = document.getElementById('in-name-' + secKey)?.value.trim();
            const script_text = document.getElementById('in-script-' + secKey)?.value.trim();
            const title = document.getElementById('in-title-' + secKey)?.value.trim();
            const subtitle = document.getElementById('in-subtitle-' + secKey)?.value.trim();
            const content = document.getElementById('in-content-' + secKey)?.value.trim();
            const image_url = document.getElementById('in-img-' + secKey)?.value.trim();
            const cta_text = document.getElementById('in-cta-text-' + secKey)?.value.trim();
            const cta_link = document.getElementById('in-cta-link-' + secKey)?.value.trim();

            const bg_color = document.getElementById('in-color-bg-' + secKey)?.value.trim();
            const title_color = document.getElementById('in-color-title-' + secKey)?.value.trim();
            const text_color = document.getElementById('in-color-text-' + secKey)?.value.trim();
            const accent_color = document.getElementById('in-color-accent-' + secKey)?.value.trim();

            const updatedData = {
                name,
                script_text,
                title,
                subtitle,
                content,
                image_url,
                cta_text,
                cta_link,
                metadata: {
                    colors: { bg_color, title_color, text_color, accent_color }
                }
            };

            SectionManager.updateSection(currentEditingPageKey, secKey, updatedData);
            renderPageSectionsStack();
            showToast('Seção salva com sucesso!');
        }

        function handleDeleteSec(secKey, name) {
            if (confirm(`Deseja realmente excluir a seção "${name}"?`)) {
                SectionManager.deleteSection(currentEditingPageKey, secKey);
                renderPageSectionsStack();
                showToast(`Seção "${name}" excluída!`);
            }
        }

        function resetCurrentPageSections() {
            if (confirm('Restaurar todas as seções padrão desta página?')) {
                SectionManager.resetPageToDefaults(currentEditingPageKey);
                renderPageSectionsStack();
                showToast('Página restaurada para o padrão!');
            }
        }

        // ==========================================
        // MODAL DE NOVA SEÇÃO
        // ==========================================
        function openNewSectionModal() {
            document.getElementById('newSectionModal').classList.add('open');
            document.getElementById('newSecName').value = '';
            document.getElementById('newSecTitle').value = '';
            document.getElementById('newSecScript').value = '';
            document.getElementById('newSecSubtitle').value = '';
            document.getElementById('newSecContent').value = '';
            document.getElementById('newSecImage').value = '';
            document.getElementById('newSecCtaText').value = '';
            document.getElementById('newSecCtaLink').value = '';
        }

        function closeNewSectionModal() {
            document.getElementById('newSectionModal').classList.remove('open');
        }

        function submitNewSection() {
            const name = document.getElementById('newSecName').value.trim();
            const title = document.getElementById('newSecTitle').value.trim();
            const script_text = document.getElementById('newSecScript').value.trim();
            const subtitle = document.getElementById('newSecSubtitle').value.trim();
            const content = document.getElementById('newSecContent').value.trim();
            const image_url = document.getElementById('newSecImage').value.trim();
            const cta_text = document.getElementById('newSecCtaText').value.trim();
            const cta_link = document.getElementById('newSecCtaLink').value.trim();

            if (!name && !title) {
                alert('Informe pelo menos o nome ou título da seção.');
                return;
            }

            SectionManager.createSection(currentEditingPageKey, {
                name: name || title,
                title: title || name,
                script_text,
                subtitle,
                content,
                image_url,
                cta_text,
                cta_link
            });

            closeNewSectionModal();
            renderPageSectionsStack();
            showToast('Nova seção criada com sucesso!');
        }
        // ==========================================================
        // BIOLINKS MANAGER
        // ==========================================================
        function loadBiolinksConfig() {
            fetch("api/biolinks.php?action=get_config")
                .then(r => r.json())
                .then(data => {
                    if(!data) return;
                    document.getElementById("bio_name").value = data.profile_name || "";
                    document.getElementById("bio_desc").value = data.profile_desc || "";
                    document.getElementById("bio_image").value = data.profile_image || "";
                    
                    document.getElementById("bio_bg_color").value = data.bg_color || "#fbf7ee";
                    document.getElementById("bio_bg_color_text").value = data.bg_color || "#fbf7ee";
                    
                    document.getElementById("bio_text_color").value = data.text_color || "#2d231b";
                    document.getElementById("bio_text_color_text").value = data.text_color || "#2d231b";
                    
                    document.getElementById("bio_btn_bg").value = data.btn_bg_color || "#c3996b";
                    document.getElementById("bio_btn_bg_text").value = data.btn_bg_color || "#c3996b";
                    
                    document.getElementById("bio_btn_text").value = data.btn_text_color || "#ffffff";
                    document.getElementById("bio_btn_text_text").value = data.btn_text_color || "#ffffff";
                });
        }

        function saveBiolinksConfig(e) {
            e.preventDefault();
            const data = {
                profile_name: document.getElementById("bio_name").value,
                profile_desc: document.getElementById("bio_desc").value,
                profile_image: document.getElementById("bio_image").value,
                bg_color: document.getElementById("bio_bg_color").value,
                text_color: document.getElementById("bio_text_color").value,
                btn_bg_color: document.getElementById("bio_btn_bg").value,
                btn_text_color: document.getElementById("bio_btn_text").value
            };
            fetch("api/biolinks.php?action=save_config", {
                method: "POST",
                body: JSON.stringify(data)
            }).then(() => showToast("Configurações salvas!"));
        }

        function loadBiolinksList() {
            fetch("api/biolinks.php?action=get_links")
                .then(r => r.json())
                .then(links => {
                    const container = document.getElementById("biolinksListContainer");
                    container.innerHTML = "";
                    if(links.length === 0) {
                        container.innerHTML = "<p style='color:var(--text-muted);'>Nenhum botão cadastrado ainda.</p>";
                        return;
                    }
                    links.forEach(link => {
                        const div = document.createElement("div");
                        div.className = "section-item-card";
                        if(link.is_active != 1) div.classList.add("is-hidden");
                        div.innerHTML = `
                            <div class="section-header-bar">
                                <div class="sec-left">
                                    <div class="page-card-icon" style="width:36px; height:36px; font-size:1rem;"><i class="fa-brands ${link.icon || 'fa-link'}"></i></div>
                                    <div class="sec-title-group">
                                        <h4>${link.title}</h4>
                                        <p>${link.url}</p>
                                    </div>
                                </div>
                                <div class="sec-right">
                                    <button class="btn-luxury btn-subtle" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="editBiolink(${link.id}, '${link.title.replace(/'/g, "\\'")}', '${link.url.replace(/'/g, "\\'")}', '${link.icon || ""}', ${link.is_active})"><i class="fa-solid fa-pen"></i> Editar</button>
                                    <button class="btn-luxury btn-danger-subtle" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="deleteBiolink(${link.id})"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                });
        }

        function openBiolinkModal() {
            document.getElementById("biolink_id").value = "0";
            document.getElementById("biolink_title").value = "";
            document.getElementById("biolink_url").value = "";
            document.getElementById("biolink_icon").value = "";
            document.getElementById("biolink_active").checked = true;
            document.getElementById("modalBiolink").classList.add("open");
        }

        function editBiolink(id, title, url, icon, active) {
            document.getElementById("biolink_id").value = id;
            document.getElementById("biolink_title").value = title;
            document.getElementById("biolink_url").value = url;
            document.getElementById("biolink_icon").value = icon;
            document.getElementById("biolink_active").checked = (active == 1);
            document.getElementById("modalBiolink").classList.add("open");
        }

        function saveBiolink(e) {
            e.preventDefault();
            const data = {
                id: document.getElementById("biolink_id").value,
                title: document.getElementById("biolink_title").value,
                url: document.getElementById("biolink_url").value,
                icon: document.getElementById("biolink_icon").value,
                is_active: document.getElementById("biolink_active").checked ? 1 : 0
            };
            fetch("api/biolinks.php?action=save_link", {
                method: "POST",
                body: JSON.stringify(data)
            }).then(() => {
                document.getElementById("modalBiolink").classList.remove("open");
                showToast("Botão salvo com sucesso!");
                loadBiolinksList();
            });
        }

        function deleteBiolink(id) {
            if(confirm("Tem certeza que deseja excluir este botão?")) {
                fetch("api/biolinks.php?action=delete_link", {
                    method: "POST",
                    body: JSON.stringify({id: id})
                }).then(() => {
                    showToast("Botão excluído!");
                    loadBiolinksList();
                });
            }
        }
    </script>
</body>
</html>
