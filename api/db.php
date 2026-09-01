<?php
// Configurações do Banco de Dados (Hostinger)
$host = 'localhost'; // Normalmente localhost na Hostinger
$db   = 'u960702577_sitecase'; // Substitua pelo nome do seu banco criado no hPanel
$user = 'u960702577_admin'; // Substitua pelo usuário do seu banco
$pass = 'SuaSenhaForteAqui123!'; // Substitua pela senha
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Em produção, não exiba o erro na tela, apenas retorne erro JSON genérico
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Falha de conexão com o banco de dados.']);
    exit;
}
?>
