<?php
// ==========================================================
// CASEIRINHOS - MOTOR DE REDIRECIONAMENTO DE LINKS (PRETTY LINKS)
// ==========================================================

$slug = $_GET['slug'] ?? '';
$slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9_-]/', '', $slug)));

if (empty($slug)) {
    header("Location: /");
    exit;
}

// Detecta a URL base do site para construir redirecionamentos absolutos
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'caseirinhos.com';
$baseUrl = $protocol . '://' . $host;

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
        'url' => $baseUrl . '/montar-pedido.html',
        'type' => 301
    ],
    'cardapio' => [
        'url' => $baseUrl . '/cardapio.html',
        'type' => 301
    ]
];

// Função auxiliar para fazer o redirecionamento
function doRedirect($url, $code = 301) {
    header("Location: " . $url, true, $code);
    exit;
}

// 1. Tenta consultar no banco de dados MySQL
if (file_exists(__DIR__ . '/api/db.php')) {
    try {
        require_once __DIR__ . '/api/db.php';
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT * FROM short_links WHERE slug = ? AND is_active = 1 LIMIT 1");
            $stmt->execute([$slug]);
            $link = $stmt->fetch();

            if ($link) {
                // Incrementa contador de cliques
                try {
                    $upStmt = $pdo->prepare("UPDATE short_links SET clicks = clicks + 1 WHERE id = ?");
                    $upStmt->execute([$link['id']]);
                } catch (\Exception $e) {
                    // Falha no contador não impede o redirecionamento
                }

                $targetUrl = $link['target_url'];
                $code = (int)($link['redirect_type'] ?? 301);
                
                // Se a URL de destino for relativa, converte para absoluta
                if (!preg_match('#^https?://#i', $targetUrl)) {
                    $targetUrl = $baseUrl . '/' . ltrim($targetUrl, '/');
                }
                
                doRedirect($targetUrl, $code);
            }
        }
    } catch (\Exception $e) {
        // Fallback silencioso — continua para os links padrão
    }
}

// 2. Se não encontrou no banco, verifica os fallbacks
if (isset($FALLBACK_LINKS[$slug])) {
    $item = $FALLBACK_LINKS[$slug];
    doRedirect($item['url'], $item['type']);
}

// 3. Se o slug não existir em nenhum lugar, redireciona para a home
header("Location: /");
exit;

