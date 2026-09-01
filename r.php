<?php
// ==========================================================
// CASEIRINHOS - MOTOR DE REDIRECIONAMENTO DE LINKS (PRETTY LINKS)
// ==========================================================

$slug = $_GET['slug'] ?? '';
$slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9_-]/', '', $slug)));

if (empty($slug)) {
    header("Location: index.html");
    exit;
}

// Links padrão de fallback (caso o banco não esteja configurado)
$FALLBACK_LINKS = [
    'whatsapp' => [
        'url' => 'https://wa.me/5511948598267?text=Ol%C3%A1!%20Vim%20pelo%20link%20do%20site%20da%20Caseirinhos.',
        'type' => 301
    ],
    'instagram' => [
        'url' => 'https://instagram.com/caseirinhosaconfeitaria',
        'type' => 301
    ],
    'delivery' => [
        'url' => 'https://instadelivery.com.br/caseirinhosaconfeitaria',
        'type' => 302
    ],
    'encomendas' => [
        'url' => 'montar-pedido.html',
        'type' => 301
    ],
    'cardapio' => [
        'url' => 'cardapio.html',
        'type' => 301
    ]
];

// Tenta consultar no banco de dados MySQL
if (file_exists('api/db.php')) {
    try {
        require_once 'api/db.php';
        if (isset($pdo)) {
            $stmt = $pdo->prepare("SELECT * FROM short_links WHERE slug = ? AND is_active = 1 LIMIT 1");
            $stmt->execute([$slug]);
            $link = $stmt->fetch();

            if ($link) {
                // Incrementa contador de cliques
                $upStmt = $pdo->prepare("UPDATE short_links SET clicks = clicks + 1 WHERE id = ?");
                $upStmt->execute([$link['id']]);

                $targetUrl = $link['target_url'];
                $code = (int)($link['redirect_type'] ?? 301);
                
                header("Location: " . $targetUrl, true, $code);
                exit;
            }
        }
    } catch (\Exception $e) {
        // Fallback silencioso
    }
}

// Se não encontrou no banco, verifica os fallbacks
if (isset($FALLBACK_LINKS[$slug])) {
    $item = $FALLBACK_LINKS[$slug];
    header("Location: " . $item['url'], true, $item['type']);
    exit;
}

// Se o slug não existir, redireciona para a home
header("Location: index.html");
exit;
