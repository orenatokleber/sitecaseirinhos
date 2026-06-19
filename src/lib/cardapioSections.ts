export type CardapioSectionCfg = {
  key: string;
  label: string;
  hint: string;
  aspect: number;
  size: string;
  simplified?: boolean;
};

export const CARDAPIO_SECTIONS: CardapioSectionCfg[] = [
  { key: "cardapio_hero", label: "Hero (topo da página)", hint: "Título principal, subtítulo, script, observação e imagem", aspect: 16 / 9, size: "1600×900px" },
  { key: "cardapio_sizes", label: "Bolos Decorados (Passo 1)", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_categories", label: "Categorias de Sabores (Classe 1, 2...)", hint: "Visibilidade da seção de sabores por categoria", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_addons", label: "Bolos Coração", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_rectangular", label: "Bolos Retangulares", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_sweets", label: "Doces para Festas", hint: "Título, subtítulo e visibilidade da seção de doces", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_decorations", label: "Decorações - Bolos Redondos (Adicionais)", hint: "Título e subtítulo da seção de adicionais para bolos redondos", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_decorations_rect", label: "Decorações - Bolos Retangulares (Adicionais)", hint: "Título e subtítulo da seção de adicionais para bolos retangulares", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_order", label: "Solicite seu orçamento", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
];

export function getOrderedSectionKeys(byKey: Record<string, any>): string[] {
  const withPos = CARDAPIO_SECTIONS.map((cfg, defaultIdx) => {
    const meta = byKey[cfg.key]?.metadata || {};
    const pos = typeof meta.position === "number" ? meta.position : defaultIdx;
    return { key: cfg.key, pos, defaultIdx };
  });
  withPos.sort((a, b) => a.pos - b.pos || a.defaultIdx - b.defaultIdx);
  return withPos.map((x) => x.key);
}
