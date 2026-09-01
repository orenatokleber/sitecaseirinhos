<?php
require_once 'api/db.php';

// Busca configurações
$stmtConfig = $pdo->query("SELECT * FROM biolinks_config WHERE id = 1");
$config = $stmtConfig->fetch();

// Se não houver config, define padrões
if (!$config) {
    $config = [
        'profile_name' => 'Caseirinhos',
        'profile_desc' => 'Adoçando seus momentos especiais!',
        'profile_image' => 'images/confeiteira-sorrindo.jpg',
        'bg_color' => '#fbf7ee',
        'text_color' => '#2d231b',
        'btn_bg_color' => '#c3996b',
        'btn_text_color' => '#ffffff'
    ];
}

// Busca links ativos
$stmtLinks = $pdo->query("SELECT * FROM biolinks WHERE is_active = 1 ORDER BY sort_order ASC");
$links = $stmtLinks->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($config['profile_name']) ?> | Links</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: <?= htmlspecialchars($config['bg_color']) ?>;
            --text-color: <?= htmlspecialchars($config['text_color']) ?>;
            --btn-bg: <?= htmlspecialchars($config['btn_bg_color']) ?>;
            --btn-text: <?= htmlspecialchars($config['btn_text_color']) ?>;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 3rem 1.5rem;
        }

        .profile-container {
            text-align: center;
            margin-bottom: 2rem;
            animation: fadeInDown 0.8s ease;
        }

        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--btn-bg);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }

        .profile-name {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .profile-desc {
            font-size: 1rem;
            opacity: 0.9;
            max-width: 400px;
            margin: 0 auto;
        }

        .links-container {
            width: 100%;
            max-width: 500px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            animation: fadeInUp 0.8s ease;
        }

        .link-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 1.1rem 1.5rem;
            background-color: var(--btn-bg);
            color: var(--btn-text);
            text-decoration: none;
            border-radius: 999px;
            font-weight: 600;
            font-size: 1.05rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            overflow: hidden;
        }

        .link-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            filter: brightness(1.05);
        }

        .link-icon {
            position: absolute;
            left: 1.5rem;
            font-size: 1.25rem;
        }

        .footer {
            margin-top: 3rem;
            font-size: 0.85rem;
            opacity: 0.7;
            text-align: center;
            font-family: 'Playfair Display', serif;
        }
        
        .footer a {
            color: inherit;
            text-decoration: none;
            font-weight: bold;
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

    <div class="profile-container">
        <?php if($config['profile_image']): ?>
            <img src="<?= htmlspecialchars($config['profile_image']) ?>" alt="Perfil" class="profile-image">
        <?php endif; ?>
        <h1 class="profile-name"><?= htmlspecialchars($config['profile_name']) ?></h1>
        <p class="profile-desc"><?= htmlspecialchars($config['profile_desc']) ?></p>
    </div>

    <div class="links-container">
        <?php foreach ($links as $link): ?>
            <a href="<?= htmlspecialchars($link['url']) ?>" class="link-btn" target="_blank" rel="noopener noreferrer">
                <?php if($link['icon']): ?>
                    <i class="fa-brands <?= htmlspecialchars($link['icon']) ?> link-icon"></i>
                <?php endif; ?>
                <span><?= htmlspecialchars($link['title']) ?></span>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="footer">
        Feito com <i class="fa-solid fa-heart" style="color:var(--btn-bg); font-size:0.75rem;"></i> por <a href="index.html"><?= htmlspecialchars($config['profile_name']) ?></a>
    </div>

</body>
</html>
