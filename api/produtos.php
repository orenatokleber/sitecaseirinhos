<?php
header('Content-Type: application/json');
require_once 'db.php';

// Habilita CORS se for testar de outro domínio
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Listar todos os produtos
    try {
        // Usa join para pegar o nome da categoria
        $stmt = $pdo->query("
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.is_active = 1
        ");
        $products = $stmt->fetchAll();
        echo json_encode($products);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch products: ' . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Adicionar um novo produto (apenas exemplo, requereria autenticação em prod)
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['name'], $input['price'], $input['category_id'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['name'], 
                $input['description'] ?? '', 
                $input['price'], 
                $input['category_id'],
                $input['image_url'] ?? ''
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add product']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
    }
}
?>
