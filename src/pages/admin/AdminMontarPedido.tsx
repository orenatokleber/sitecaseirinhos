import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Save } from "lucide-react";
import {
  useSiteSectionsList,
  useUpdateSiteSection,
  useCreateSiteSection,
} from "@/hooks/useSiteContent";

type SectionCfg = {
  key: string;
  label: string;
  hint: string;
  showScript?: boolean;
  /** Seção do cardápio usada como conteúdo padrão hoje na página */
  fallbackKey?: string;
  defaults?: { script?: string; title?: string; subtitle?: string; content?: string };
};

const PEDIDO_SECTIONS: SectionCfg[] = [
  {
    key: "pedido_hero",
    label: "🏪 Hero da Loja",
    hint: "Banner principal no topo da página — título, subtítulo, texto e imagem de fundo.",
    showScript: true,
    fallbackKey: "cardapio_hero",
    defaults: {
      script: "Passo a passo",
      title: "Monte seu Pedido",
      subtitle: "Escolha seus favoritos, personalize e envie tudo pelo WhatsApp",
    },
  },
  {
    key: "pedido_tab_round",
    label: "🎂 Aba — Bolos Redondos",
    hint: "Título da aba de bolos redondos (ex: 'Bolos Artesanais'). Deixe vazio para o padrão 'Bolos Redondos'.",
    defaults: { title: "Bolos Redondos" },
  },
  {
    key: "pedido_tab_rect",
    label: "📐 Aba — Bolos Retangulares",
    hint: "Título da aba de bolos retangulares. Deixe vazio para o padrão.",
    defaults: { title: "Bolos Retangulares" },
  },
  {
    key: "pedido_tab_sweets",
    label: "🍬 Aba — Doces",
    hint: "Título da aba de doces. Deixe vazio para o padrão.",
    defaults: { title: "Doces" },
  },
  {
    key: "pedido_size",
    label: "📏 Modal — Tamanho (bolo redondo)",
    hint: "Título da seção de tamanho no modal de personalização.",
    fallbackKey: "cardapio_sizes",
    defaults: { title: "Tamanho" },
  },
  {
    key: "pedido_round_line",
    label: "🎨 Grid — Info bolos redondos",
    hint: "Texto informativo exibido acima do grid de bolos redondos (ex: regras de encomenda, prazos).",
    defaults: { title: "Linha e sabor" },
  },
  {
    key: "pedido_round_addons",
    label: "✨ Modal — Adicionais (bolo redondo)",
    hint: "Título da seção de adicionais no modal de bolos redondos.",
    fallbackKey: "cardapio_decorations",
    defaults: { title: "Adicionais" },
  },
  {
    key: "pedido_rect",
    label: "📐 Grid — Info bolos retangulares",
    hint: "Texto informativo e imagem fallback para bolos retangulares. A imagem será usada nos cards de retangulares que não possuem imagem própria.",
    fallbackKey: "cardapio_rectangular",
    defaults: { title: "Modelo" },
  },
  {
    key: "pedido_rect_line",
    label: "🏷️ Modal — Linha (bolo retangular)",
    hint: "Título da seção de escolha de linha (Tradicional/Premium) no modal de retangulares.",
    defaults: { title: "Linha" },
  },
  {
    key: "pedido_rect_addons",
    label: "✨ Modal — Adicionais (bolo retangular)",
    hint: "Título da seção de adicionais no modal de retangulares.",
    fallbackKey: "cardapio_decorations_rect",
    defaults: { title: "Adicionais" },
  },
  {
    key: "pedido_sweets",
    label: "🍬 Grid — Info doces",
    hint: "Texto informativo exibido acima do grid de doces (ex: pacotes disponíveis, prazos).",
    fallbackKey: "cardapio_sweets",
    defaults: {
      title: "Doces para festa",
      content: "Vendidos em pacotes de 25, 50 ou 100 unidades",
    },
  },
];

const stripPublicUrl = (u: string | null | undefined): string => {
  if (!u) return "";
  const m = u.match(/\/site-images\/(.+)$/);
  return m ? m[1] : u;
};

const SectionEditor = ({
  cfg,
  section,
  fallback,
  onSave,
}: {
  cfg: SectionCfg;
  section: any;
  fallback: any;
  onSave: (u: any) => void;
}) => {
  const own = section || {};
  const fb = fallback || {};
  const d = cfg.defaults || {};

  // Mostra exatamente o que já aparece hoje na página: valor próprio → herdado do cardápio → padrão
  const pick = (field: string, fallbackValue?: string) =>
    own[field] || fb[field] || fallbackValue || "";

  const [row, setRow] = useState({
    title: pick("title", d.title),
    subtitle: pick("subtitle", d.subtitle),
    content: pick("content", d.content),
    image_url: stripPublicUrl(own.image_url || fb.image_url),
    script: (own.metadata as any)?.script || d.script || "",
  });

  const inherited = !own.title && !own.subtitle && !own.content && !own.image_url;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{cfg.label}</CardTitle>
        <p className="text-xs text-muted-foreground">{cfg.hint}</p>
        {inherited && (
          <p className="text-xs text-accent">
            Conteúdo atual vindo do cardápio/padrão. Ao salvar, ele passa a ser exclusivo desta
            página.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {cfg.showScript && (
          <div>
            <Label className="text-xs">Script (texto pequeno acima do título)</Label>
            <Input
              value={row.script}
              onChange={(e) => setRow({ ...row, script: e.target.value })}
              placeholder="Ex: Passo a passo"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={row.title} onChange={(e) => setRow({ ...row, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Subtítulo</Label>
            <Input
              value={row.subtitle}
              onChange={(e) => setRow({ ...row, subtitle: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Observação / texto adicional</Label>
          <Textarea
            rows={3}
            value={row.content}
            onChange={(e) => setRow({ ...row, content: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">Imagem (opcional) — escolha deitada (16:9) ou em pé (9:16)</Label>
          <ImageUpload
            value={row.image_url}
            onChange={(url) => setRow({ ...row, image_url: url })}
            folder={`montar-pedido/${cfg.key}`}
            allowOrientationChoice
            recommendedSize="16:9 ou 9:16"
          />
        </div>
        <Button
          size="sm"
          onClick={() =>
            onSave({
              title: row.title || null,
              subtitle: row.subtitle || null,
              content: row.content || null,
              image_url: row.image_url || null,
              metadata: {
                ...(section?.metadata || {}),
                ...(cfg.showScript ? { script: row.script || null } : {}),
              },
            })
          }
        >
          <Save className="mr-1 h-4 w-4" /> Salvar seção
        </Button>
      </CardContent>
    </Card>
  );
};

const AdminMontarPedido = () => {
  const { data: sections = [], isLoading } = useSiteSectionsList();
  const update = useUpdateSiteSection();
  const create = useCreateSiteSection();

  if (isLoading) return <Loader2 className="animate-spin" />;

  const byKey: Record<string, any> = {};
  (sections as any[]).forEach((s) => {
    byKey[s.section_key] = s;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Montar Pedido — Catálogo</h1>
        <p className="mt-1 text-muted-foreground">
          Configure o visual da loja: hero, abas de categoria, textos informativos e títulos dos modais.
          Os produtos e preços são gerenciados na seção <strong>Cardápio</strong>.
        </p>
      </div>

      {PEDIDO_SECTIONS.map((cfg) => (
        <SectionEditor
          key={cfg.key}
          cfg={cfg}
          section={byKey[cfg.key]}
          fallback={cfg.fallbackKey ? byKey[cfg.fallbackKey] : null}
          onSave={(updates) => {
            if (byKey[cfg.key]) update.mutate({ sectionKey: cfg.key, updates });
            else create.mutate({ section_key: cfg.key, ...updates });
          }}
        />
      ))}
    </div>
  );
};

export default AdminMontarPedido;
