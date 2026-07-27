# Guia de Deploy na Hostinger - Caseirinhos

Este guia orienta o deploy completo da aplicação (Frontend React, Backend Fastify e Banco de Dados MySQL) nos servidores da Hostinger.

---

## 🗄️ 1. Banco de Dados MySQL
1. Acesse o painel da Hostinger e crie um banco de dados MySQL 8.
2. Anote as credenciais:
   - **Usuário**
   - **Senha**
   - **Nome do Banco**
   - **Host** (geralmente localhost se rodar no mesmo servidor ou o IP fornecido pela Hostinger)
3. Crie a string de conexão no formato:
   `mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO`

---

## 🚀 2. Backend (Node.js)
Se estiver utilizando a hospedagem Node.js da Hostinger ou uma VPS:

1. No painel da Hostinger, crie uma **Aplicação Node.js**.
2. Faça o upload dos arquivos da pasta `backend/` (exceto a pasta `node_modules`) e do diretório `prisma/` localizado na raiz do projeto.
3. No painel de configuração da aplicação Node.js na Hostinger, defina as seguintes **Variáveis de Ambiente**:
   - `PORT`: Porta configurada pela Hostinger (ou 3001).
   - `HOST`: `0.0.0.0`
   - `DATABASE_URL`: A string de conexão MySQL anotada no passo anterior.
   - `JWT_SECRET`: Uma chave aleatória e segura para assinar os tokens JWT.
   - `CORS_ORIGIN`: A URL do seu domínio frontend (ex: `https://caseirinhos.com`).
4. Abra o terminal SSH da Hostinger para a sua aplicação Node.js e execute os comandos:
   ```bash
   # Instalar dependências de produção
   npm install
   
   # Compilar o TypeScript do backend para JavaScript
   npm run build
   
   # Sincronizar o schema Prisma com o banco MySQL (criar tabelas automaticamente)
   npx prisma db push --schema=../prisma/schema.prisma
   
   # Popular o banco de dados com os dados iniciais do cardápio e administrador
   npx prisma db seed
   ```
5. Defina o arquivo de inicialização (Startup File) como `dist/server.js` no painel da Hostinger e inicie a aplicação.

---

## 🎨 3. Frontend (React)
O frontend é gerado como um site estático (Single Page Application), o que significa que ele pode ser hospedado de forma extremamente barata em qualquer pasta de site na Hostinger.

1. No seu ambiente local (computador), crie o arquivo `.env` na pasta `frontend/` ou garanta que ele possua a seguinte variável apontando para a API do backend de produção:
   ```env
   VITE_API_URL="https://api.seudominio.com"
   ```
2. No terminal local, navegue até a pasta `frontend` e gere a build de produção:
   ```bash
   npm run build
   ```
3. O comando acima gerará a pasta `frontend/dist/`.
4. Faça o upload de **todos os arquivos dentro da pasta `dist/`** diretamente para o diretório `public_html` do seu site na Hostinger (via Gerenciador de Arquivos do Painel ou FTP).
5. Certifique-se de configurar o roteamento do React Router adicionando um arquivo `.htaccess` no diretório `public_html` para evitar erros de 404 ao atualizar páginas internas:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```
