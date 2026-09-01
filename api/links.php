<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ==========================================================
// GET: Listar todos os links curtos ou obter link específico
// ==========================================================
if ($method === 'GET') {
    $slug = $_GET['slug'] ?? null;

    try {
        if ($slug) {
            $stmt = $pdo->prepare("SELECT * FROM short_links WHERE slug = ? AND is_active = 1 LIMIT 1");
            $stmt->execute([$slug]);
            $link = $stmt->fetch();

            if ($link) {
                // Incrementa contador de cliques
                $upStmt = $pdo->prepare("UPDATE short_links SET clicks = clicks + 1 WHERE id = ?");
                $upStmt->execute([$link['id']]);

                echo json_encode([
                    'success' => true,
                    'data' => $link
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Link não encontrado ou inativo']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM short_links ORDER BY created_at DESC");
            $links = $stmt->fetchAll();

            foreach ($links as &$item) {
                $item['clicks'] = (int)$item['clicks'];
                $item['is_active'] = (bool)$item['is_active'];
                $item['redirect_type'] = (int)$item['redirect_type'];
            }

            echo json_encode([
                'success' => true,
                'count' => count($links),
                'data' => $links
            ]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar links: ' . $e->getMessage()]);
    }
    exit;
}

// ==========================================================
// POST: Ações (create, update, delete, toggle)
// ==========================================================
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Payload JSON inválido']);
        exit;
    }

    $action = $input['action'] ?? 'create';

    // 1. CRIAR LINK
    if ($action === 'create') {
        $slug = trim($input['slug'] ?? '');
        $title = trim($input['title'] ?? '');
        $target_url = trim($input['target_url'] ?? '');
        $redirect_type = (int)($input['redirect_type'] ?? 301);
        $is_active = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;

        // Sanitiza slug (letras, números, hífen)
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', $slug));

        if (empty($slug) || empty($target_url)) {
            http_response_code(400);
            echo json_encode(['error' => 'Slug e URL de destino são obrigatórios']);
            exit;
        }

        if (empty($title)) {
            $title = ucfirst($slug);
        }

        try {
            // Verifica se slug já existe
            $checkStmt = $pdo->prepare("SELECT id FROM short_links WHERE slug = ?");
            $checkStmt->execute([$slug]);
            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Este atalho / slug já está em uso. Escolha outro.']);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO short_links (slug, title, target_url, redirect_type, clicks, is_active)
                VALUES (?, ?, ?, ?, 0, ?)
            ");
            $stmt->execute([$slug, $title, $target_url, $redirect_type, $is_active]);

            echo json_encode([
                'success' => true,
                'message' => 'Redirecionamento criado com sucesso!',
                'id' => $pdo->lastInsertId(),
                'slug' => $slug
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar redirecionamento: ' . $e->getMessage()]);
        }
        exit;
    }

    // 2. ATUALIZAR LINK
    if ($action === 'update') {
        $id = $input['id'] ?? null;
        $slug = trim($input['slug'] ?? '');
        $title = trim($input['title'] ?? '');
        $target_url = trim($input['target_url'] ?? '');
        $redirect_type = (int)($input['redirect_type'] ?? 301);
        $is_active = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;

        if (!$id || empty($slug) || empty($target_url)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID, slug e URL de destino são obrigatórios']);
            exit;
        }

        $slug = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', $slug));

        try {
            // Verifica duplicidade em outro ID
            $checkStmt = $pdo->prepare("SELECT id FROM short_links WHERE slug = ? AND id != ?");
            $checkStmt->execute([$slug, $id]);
            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Este atalho / slug já pertence a outro redirecionamento.']);
                exit;
            }

            $stmt = $pdo->prepare("
                UPDATE short_links
                SET slug = ?, title = ?, target_url = ?, redirect_type = ?, is_active = ?
                WHERE id = ?
            ");
            $stmt->execute([$slug, $title, $target_url, $redirect_type, $is_active, $id]);

            echo json_encode([
                'success' => true,
                'message' => 'Redirecionamento atualizado com sucesso!'
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar link: ' . $e->getMessage()]);
        }
        exit;
    }

    // 3. ALTERNAR ATIVO / INATIVO
    if ($action === 'toggle') {
        $id = $input['id'] ?? null;
        $is_active = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : null;

        if (!$id || $is_active === null) {
            http_response_code(400);
            echo json_encode(['error' => 'ID e status is_active são obrigatórios']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE short_links SET is_active = ? WHERE id = ?");
            $stmt->execute([$is_active, $id]);

            echo json_encode([
                'success' => true,
                'message' => 'Status do link atualizado!'
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao alterar status: ' . $e->getMessage()]);
        }
        exit;
    }

    // 4. EXCLUIR LINK
    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID obrigatório para exclusão']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM short_links WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode([
                'success' => true,
                'message' => 'Redirecionamento excluído com sucesso!'
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao excluir link: ' . $e->getMessage()]);
        }
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
