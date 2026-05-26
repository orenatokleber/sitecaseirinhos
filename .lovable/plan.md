
## Reestruturação do Cardápio de Encomendas

Vou refazer o sistema de cardápio para refletir a estrutura das imagens enviadas: o cliente escolhe primeiro o **tamanho** do bolo, depois o **sabor** (Clássico ou Premium), com tabelas de preço por categoria, além de seções dedicadas para Bolos Coração, Bolos Retangulares e Decorações.

---

### 1. Banco de dados (novas tabelas)

**`cake_sizes`** — tamanhos disponíveis (P, M, G, XG, Retangular, etc.)
- `code` (P, M, G, XG, RETRO, CORTE…)
- `name`, `ring_size` (ex: "aro 13" ou "22x17cm"), `slices`, `weight_kg`
- `sort_order`, `is_active`

**`cake_categories`** — categorias de sabor (Clássico / Premium / Coração)
- `name`, `slug`, `description`, `sort_order`, `is_active`
- `type` (`standard` para tabela P/M/G/XG, `addon` para "Coração" que soma valor)

**`cake_category_prices`** — preço de cada tamanho dentro da categoria
- `category_id`, `size_id`, `price` (ou `price_addon` para adicionais como Coração)

**`cake_flavors`** — sabores
- `category_id`, `name`, `description`, `sort_order`, `is_active`

**`cake_rectangular`** — bolos retangulares (preços por classe)
- `size_label` (Retrô / Retangular Corte), `dimensions`, `slices`, `weight_kg`
- `class1_price`, `class2_price`, `note`

**`cake_decorations`** — galeria de decorações (imagens)
- `image_url`, `title`, `sort_order`, `is_active`

Todas com GRANT apropriado, RLS pública para leitura e admin via `has_role`.

---

### 2. Painel admin — `/painel-admin/cardapio`

Refatoração da página atual em abas:
- **Tamanhos** — CRUD de `cake_sizes` (aro, fatias, kg)
- **Categorias & Preços** — CRUD de categorias e matriz de preço (linhas = tamanhos, colunas = categorias)
- **Sabores** — CRUD de sabores agrupados por categoria
- **Retangulares** — CRUD da tabela específica
- **Decorações** — upload de imagens para galeria
- **Observações** — texto livre (rodapé "*Todos os bolos têm 10cm de altura…")

---

### 3. Página pública — `/cardapio`

Fluxo na ordem das imagens:
1. **Bolos Decorados** — card com tamanhos P/M/G/XG + Retangulares (aro, fatias, kg)
2. **Classe 1 (Clássicos)** — tabela P/M/G/XG com preços + lista de sabores
3. **Classe 2 (Premium)** — tabela P/M/G/XG com preços + lista de sabores
4. **Bolos Coração** — tamanhos com adicional de preço (+R$30, +R$40…)
5. **Bolos Retangulares** — tabela específica (Retrô / Corte, Classe 1 / Classe 2)
6. **Decorações** — galeria de imagens com texto explicativo
7. **Formulário de encomenda** existente permanece ao final

Estética mantida (Playfair, Nunito, paleta turquesa/chocolate/dourado), com cards elegantes inspirados nas imagens (badge do tamanho à esquerda, info à direita).

---

### 4. Seed inicial

Popular as tabelas com os dados exatos das imagens enviadas (tamanhos, preços Classe 1 e 2, sabores listados, retangulares, etc.) para já entregar o cardápio funcional.

---

### Detalhes técnicos
- Novas tabelas em migração única (com GRANTs + RLS).
- Hooks em `src/hooks/useCardapio.ts` com React Query.
- Página `Cardapio.tsx` reescrita; admin `AdminCardapio.tsx` reescrito com Tabs.
- Componentes reutilizáveis: `<SizeCard>`, `<PriceTable>`, `<FlavorList>`.
- WhatsApp do pedido continua usando o número configurado em `site_settings`.

Posso seguir com a implementação?
