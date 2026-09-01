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
// GET: Listar seções (com filtro opcional por ?page=...)
// ==========================================================
if ($method === 'GET') {
    $pageKey = $_GET['page'] ?? null;

    try {
        if ($pageKey) {
            $stmt = $pdo->prepare("SELECT * FROM site_sections WHERE page_key = ? ORDER BY sort_order ASC");
            $stmt->execute([$pageKey]);
        } else {
            $stmt = $pdo->query("SELECT * FROM site_sections ORDER BY page_key ASC, sort_order ASC");
        }

        $sections = $stmt->fetchAll();
        foreach ($sections as &$sec) {
            if (!empty($sec['metadata']) && is_string($sec['metadata'])) {
                $sec['metadata'] = json_decode($sec['metadata'], true);
            }
            $sec['is_visible'] = (bool)$sec['is_visible'];
            $sec['sort_order'] = (int)$sec['sort_order'];
        }

        echo json_encode([
            'success' => true,
            'page' => $pageKey,
            'count' => count($sections),
            'data' => $sections
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao buscar seções: ' . $e->getMessage()]);
    }
    exit;
}

// ==========================================================
// POST: Ações (update, reorder, toggle, create, delete)
// ==========================================================
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Payload JSON inválido']);
        exit;
    }

    $action = $input['action'] ?? 'update';

    // 1. REORDENAR SEÇÕES DE UMA PÁGINA
    if ($action === 'reorder') {
        $keys = $input['order'] ?? []; // Array de section_key ordenadas: ['home_hero', 'home_features', ...]
        $pageKey = $input['page_key'] ?? null;

        if (!is_array($keys) || empty($keys)) {
            http_response_code(400);
            echo json_encode(['error' => 'Array de ordem vazio ou inválido']);
            exit;
        }

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE site_sections SET sort_order = ? WHERE section_key = ?");
            foreach ($keys as $index => $key) {
                $stmt->execute([$index, $key]);
            }
            $pdo->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Ordem das seções atualizada com sucesso!',
                'order' => $keys
            ]);
        } catch (\PDOException $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao reordenar: ' . $e->getMessage()]);
        }
        exit;
    }

    // 2. ALTERNAR VISIBILIDADE
    if ($action === 'toggle_visibility') {
        $key = $input['section_key'] ?? '';
        $isVisible = isset($input['is_visible']) ? ($input['is_visible'] ? 1 : 0) : null;

        if (empty($key) || $isVisible === null) {
            http_response_code(400);
            echo json_encode(['error' => 'section_key e is_visible são obrigatórios']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE site_sections SET is_visible = ? WHERE section_key = ?");
            $stmt->execute([$isVisible, $key]);
            echo json_encode([
                'success' => true,
                'message' => 'Visibilidade atualizada com sucesso!',
                'section_key' => $key,
                'is_visible' => (bool)$isVisible
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao alternar visibilidade: ' . $e->getMessage()]);
        }
        exit;
    }

    // 3. CRIAR NOVA SEÇÃO
    if ($action === 'create') {
        $pageKey = $input['page_key'] ?? 'index';
        $key = $input['section_key'] ?? ('sec_' . time() . '_' . rand(100, 999));
        $name = $input['name'] ?? 'Nova Seção Personalizada';
        $title = $input['title'] ?? 'Título da Seção';
        $subtitle = $input['subtitle'] ?? '';
        $script_text = $input['script_text'] ?? '';
        $content = $input['content'] ?? '';
        $image_url = $input['image_url'] ?? '';
        $cta_text = $input['cta_text'] ?? '';
        $cta_link = $input['cta_link'] ?? '';
        $metadata = json_encode($input['metadata'] ?? [
            'colors' => [
                'bg_color' => '',
                'title_color' => '',
                'text_color' => '',
                'accent_color' => ''
            ]
        ]);

        try {
            // Obter maior sort_order atual para a página
            $maxStmt = $pdo->prepare("SELECT MAX(sort_order) as max_order FROM site_sections WHERE page_key = ?");
            $maxStmt->execute([$pageKey]);
            $maxOrder = (int)($maxStmt->fetch()['max_order'] ?? 0) + 1;

            $stmt = $pdo->prepare("
                INSERT INTO site_sections (page_key, section_key, name, title, subtitle, script_text, content, image_url, cta_text, cta_link, sort_order, is_visible, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            ");
            $stmt->execute([$pageKey, $key, $name, $title, $subtitle, $script_text, $content, $image_url, $cta_text, $cta_link, $maxOrder, $metadata]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Seção criada com sucesso!',
                'id' => $pdo->lastInsertId(),
                'section_key' => $key,
                'page_key' => $pageKey
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar seção: ' . $e->getMessage()]);
        }
        exit;
    }

    // 4. EXCLUIR SEÇÃO
    if ($action === 'delete') {
        $key = $input['section_key'] ?? '';
        if (empty($key)) {
            http_response_code(400);
            echo json_encode(['error' => 'Chave da seção obrigatória para exclusão']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM site_sections WHERE section_key = ?");
            $stmt->execute([$key]);
            echo json_encode([
                'success' => true,
                'message' => 'Seção excluída com sucesso!',
                'section_key' => $key
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao excluir seção: ' . $e->getMessage()]);
        }
        exit;
    }

    // 5. ATUALIZAR SEÇÃO (UPDATE DEFAULT)
    $key = $input['section_key'] ?? '';
    if (empty($key)) {
        http_response_code(400);
        echo json_encode(['error' => 'Chave da seção (section_key) não informada']);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if (isset($input['name'])) { $fields[] = "name = ?"; $params[] = $input['name']; }
        if (isset($input['title'])) { $fields[] = "title = ?"; $params[] = $input['title']; }
        if (isset($input['subtitle'])) { $fields[] = "subtitle = ?"; $params[] = $input['subtitle']; }
        if (isset($input['script_text'])) { $fields[] = "script_text = ?"; $params[] = $input['script_text']; }
        if (isset($input['content'])) { $fields[] = "content = ?"; $params[] = $input['content']; }
        if (isset($input['image_url'])) { $fields[] = "image_url = ?"; $params[] = $input['image_url']; }
        if (isset($input['cta_text'])) { $fields[] = "cta_text = ?"; $params[] = $input['cta_text']; }
        if (isset($input['cta_link'])) { $fields[] = "cta_link = ?"; $params[] = $input['cta_link']; }
        if (isset($input['is_visible'])) { $fields[] = "is_visible = ?"; $params[] = $input['is_visible'] ? 1 : 0; }
        if (isset($input['sort_order'])) { $fields[] = "sort_order = ?"; $params[] = (int)$input['sort_order']; }
        if (isset($input['metadata'])) { 
            $fields[] = "metadata = ?"; 
            $params[] = is_string($input['metadata']) ? $input['metadata'] : json_encode($input['metadata']); 
        }

        if (empty($fields)) {
            echo json_encode(['success' => true, 'message' => 'Nenhuma alteração enviada']);
            exit;
        }

        $params[] = $key;
        $sql = "UPDATE site_sections SET " . implode(', ', $fields) . " WHERE section_key = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode([
            'success' => true,
            'message' => 'Seção salva com sucesso!',
            'section_key' => $key
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao salvar seção: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
