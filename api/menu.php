<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/menu_config.json';

$defaultConfig = [
    'position' => 'right',
    'style_theme' => 'elegant',
    'items' => [
        ['id' => 'm1', 'label' => 'Início', 'url' => '/', 'is_visible' => true, 'icon' => 'fa-house'],
        ['id' => 'm2', 'label' => 'Nossa História', 'url' => '/nossa-historia', 'is_visible' => true, 'icon' => 'fa-heart'],
        ['id' => 'm3', 'label' => 'Cardápio', 'url' => '/cardapio', 'is_visible' => true, 'icon' => 'fa-cake-candles'],
        ['id' => 'm4', 'label' => 'Montar Pedido', 'url' => '/montar-pedido', 'is_visible' => true, 'icon' => 'fa-shopping-bag'],
        ['id' => 'm5', 'label' => 'Contato', 'url' => '/contato', 'is_visible' => true, 'icon' => 'fa-envelope']
    ]
];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        $json = json_decode($content, true);
        if ($json && isset($json['items']) && is_array($json['items'])) {
            echo json_encode(['success' => true, 'data' => $json]);
            exit;
        }
    }
    echo json_encode(['success' => true, 'data' => $defaultConfig]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['items']) || !is_array($input['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos do menu']);
        exit;
    }

    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents($dataFile, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'data' => $input]);
    exit;
}
?>
