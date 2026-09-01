<?php
require_once 'api/db.php';

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `biolinks_config` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `profile_name` varchar(100) NOT NULL DEFAULT 'Caseirinhos',
          `profile_desc` varchar(255) DEFAULT 'Adoçando seus momentos especiais!',
          `profile_image` varchar(255) DEFAULT 'images/confeiteira-sorrindo.jpg',
          `bg_color` varchar(20) DEFAULT '#fbf7ee',
          `text_color` varchar(20) DEFAULT '#2d231b',
          `btn_bg_color` varchar(20) DEFAULT '#c3996b',
          `btn_text_color` varchar(20) DEFAULT '#ffffff',
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("INSERT IGNORE INTO `biolinks_config` (`id`, `profile_name`) VALUES (1, 'Caseirinhos')");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `biolinks` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `title` varchar(100) NOT NULL,
          `url` text NOT NULL,
          `icon` varchar(50) DEFAULT 'fa-link',
          `sort_order` int(11) NOT NULL DEFAULT 0,
          `is_active` tinyint(1) NOT NULL DEFAULT 1,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $check = $pdo->query("SELECT COUNT(*) FROM biolinks")->fetchColumn();
    if ($check == 0) {
        $pdo->exec("
            INSERT INTO `biolinks` (`title`, `url`, `icon`, `sort_order`) VALUES
            ('Cardápio Completo', 'cardapio.html', 'fa-cake-candles', 0),
            ('Fazer Encomenda', 'montar-pedido.html', 'fa-whatsapp', 1),
            ('Nosso Instagram', 'https://instagram.com/caseirinhosaconfeitaria', 'fa-instagram', 2);
        ");
    }

    echo "<h1>Sucesso! Tabelas de Biolinks criadas com sucesso!</h1><p>Você já pode fechar esta página.</p>";

} catch (PDOException $e) {
    echo "<h1>Erro ao criar tabelas:</h1><p>" . $e->getMessage() . "</p>";
}
?>
