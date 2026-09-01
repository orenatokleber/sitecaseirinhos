<?php
// Configurações do Banco de Dados (Hostinger)
$host = 'localhost'; // Normalmente localhost na Hostinger
$db   = 'u960702577_sitecase'; // Substitua pelo nome do seu banco criado no hPanel
$user = 'u960702577_admin'; // Substitua pelo usuário do seu banco
$pass = 'Kleber23@23Kleber'; // Substitua pela senha
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
    // Para que o redirecionador (r.php) continue funcionando com os links salvos no código,
    // apenas definimos $pdo = null e evitamos travar o site todo.
    $pdo = null;
    
    // Só retorna JSON de erro e para se for uma chamada direta à API
    // (SCRIPT_NAME aponta para o script PHP real sendo executado, não a URL reescrita)
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $scriptFile = basename($_SERVER['SCRIPT_FILENAME'] ?? '');
    
    // Verifica se o script sendo executado é um arquivo da API (dentro de /api/)
    // e NÃO o redirecionador (r.php) que apenas inclui este arquivo
    $isApiCall = (strpos($scriptName, '/api/') !== false) || ($scriptFile === 'db.php');
    $isRedirector = ($scriptFile === 'r.php');
    
    if ($isApiCall && !$isRedirector) {
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Falha de conexão com o banco de dados.', 
            'detalhes' => $e->getMessage()
        ]);
        exit;
    }
}
?>

