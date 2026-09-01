<?php
session_start();

// Define a senha de acesso (mude para a senha que desejar!)
$senha_correta = 'caseirinhos2024';

// Processa o login
if (isset($_POST['senha'])) {
    if ($_POST['senha'] === $senha_correta) {
        $_SESSION['admin_logado'] = true;
    } else {
        $erro = "Senha incorreta!";
    }
}

// Processa o logout (basta acessar admin.php?logout=1)
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Se não estiver logado, exibe a tela de login
if (!isset($_SESSION['admin_logado']) || $_SESSION['admin_logado'] !== true) {
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Painel Caseirinhos</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Nunito', sans-serif;
            background: #fbf7ee;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .login-box {
            background: #fff;
            padding: 2.5rem;
            border-radius: 1.25rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            text-align: center;
            max-width: 400px;
            width: 90%;
            border: 1px solid #efe5d5;
        }
        .login-box h1 {
            font-family: 'Playfair Display', serif;
            color: #c3996b;
            margin-bottom: 0.5rem;
        }
        .login-box p {
            color: #8d7f72;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        input[type="password"] {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #efe5d5;
            border-radius: 0.5rem;
            font-family: 'Nunito', sans-serif;
            box-sizing: border-box;
            outline: none;
            font-size: 1rem;
        }
        input[type="password"]:focus {
            border-color: #c3996b;
        }
        button {
            width: 100%;
            padding: 0.9rem;
            background: #c3996b;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: bold;
            font-size: 1rem;
            font-family: 'Nunito', sans-serif;
            cursor: pointer;
            transition: 0.2s;
        }
        button:hover {
            background: #b0875b;
        }
        .error {
            color: #d94f4f;
            margin-bottom: 1rem;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>Caseirinhos</h1>
        <p>Acesso Restrito ao Painel</p>
        
        <?php if(isset($erro)) echo "<div class='error'>$erro</div>"; ?>

        <form method="POST">
            <div class="form-group">
                <input type="password" name="senha" placeholder="Digite a senha de acesso" required autofocus>
            </div>
            <button type="submit">Entrar no Painel</button>
        </form>
    </div>
</body>
</html>
<?php
    exit;
}

// Se chegou até aqui, está logado! Mostra o painel
require_once 'admin_painel.php';
?>
