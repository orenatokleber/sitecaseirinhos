<?php
require_once 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_config':
        $stmt = $pdo->query("SELECT * FROM biolinks_config WHERE id = 1");
        $config = $stmt->fetch();
        echo json_encode($config);
        break;

    case 'save_config':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE biolinks_config SET 
            profile_name = ?, profile_desc = ?, profile_image = ?, 
            bg_color = ?, text_color = ?, btn_bg_color = ?, btn_text_color = ? 
            WHERE id = 1");
        $stmt->execute([
            $data['profile_name'], $data['profile_desc'], $data['profile_image'],
            $data['bg_color'], $data['text_color'], $data['btn_bg_color'], $data['btn_text_color']
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'get_links':
        $stmt = $pdo->query("SELECT * FROM biolinks ORDER BY sort_order ASC");
        $links = $stmt->fetchAll();
        echo json_encode($links);
        break;

    case 'save_link':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id']) && $data['id'] > 0) {
            $stmt = $pdo->prepare("UPDATE biolinks SET title = ?, url = ?, icon = ?, is_active = ? WHERE id = ?");
            $stmt->execute([$data['title'], $data['url'], $data['icon'], $data['is_active'], $data['id']]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO biolinks (title, url, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?)");
            // Get max order
            $maxOrder = $pdo->query("SELECT MAX(sort_order) FROM biolinks")->fetchColumn();
            $stmt->execute([$data['title'], $data['url'], $data['icon'], $data['is_active'], $maxOrder + 1]);
        }
        echo json_encode(['success' => true]);
        break;

    case 'delete_link':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("DELETE FROM biolinks WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'reorder_links':
        $data = json_decode(file_get_contents('php://input'), true);
        foreach ($data['order'] as $index => $id) {
            $stmt = $pdo->prepare("UPDATE biolinks SET sort_order = ? WHERE id = ?");
            $stmt->execute([$index, $id]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}
