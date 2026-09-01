<?php
header('Content-Type: application/json');
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cria tabela de configurações do cardápio se não existir
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `cardapio_config` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `config_key` varchar(50) NOT NULL UNIQUE,
            `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (\PDOException $e) {}

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT data FROM cardapio_config WHERE config_key = 'full_cardapio'");
        $row = $stmt->fetch();
        if ($row && !empty($row['data'])) {
            echo $row['data'];
        } else {
            // Retorna vazio ou fallback
            echo json_encode(['status' => 'empty']);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao carregar cardápio: ' . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhum dado recebido']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO cardapio_config (config_key, data)
            VALUES ('full_cardapio', ?)
            ON DUPLICATE KEY UPDATE data = VALUES(data)
        ");
        $stmt->execute([$rawInput]);
        echo json_encode(['success' => true, 'message' => 'Cardápio salvo com sucesso!']);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao salvar cardápio: ' . $e->getMessage()]);
    }
}
?>
