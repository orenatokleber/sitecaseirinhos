

## Sistema de Redirecionamento de Links (Pretty Links)

Sim, é totalmente possível. Vou criar um sistema completo de links curtos com rastreamento de cliques, similar ao Pretty Links do WordPress.

### O que será criado

1. **Tabela `redirects`** no banco de dados com: slug, URL destino, título, contagem de cliques, status ativo/inativo, datas
2. **Página de redirecionamento** (`/go/:slug`) que busca o destino, registra o clique e redireciona automaticamente
3. **Painel admin** (`/painel-admin/links`) para criar, editar, excluir e visualizar estatísticas dos links
4. **Tabela `redirect_clicks`** para rastreamento detalhado (referrer, user agent, data/hora)

### Funcionamento

```text
Usuário acessa:  caseirinhos.lovable.app/go/instagram
        ↓
App bus