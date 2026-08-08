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

const PEDIDO_SECTIONS = [
  {
    key: "pedido_hero",
    label: "Topo da página",
    hint: "Script, título, subtítulo, texto informativo e imagem no topo de /montar-pedido.",
    showScript: true,
  },
  {
    key: "pedido_kind",
    label: "Passo 1 — O que você deseja?",
    hint: "Título e observação do passo de escolha entre bolo redondo, retangular ou doces.",
  },
  {
    key: "pedido_size",
    label: "Passo 2 — Tamanho (bolo redondo)",
    hint: "Título, observação e imagem do passo de tamanhos.",
  },
  {
    key: "pedido_round_line",
    label: "Passo 3 — Linha e sabor (bolo redondo)",
    hint: "Título, observação e imagem do passo de linha (Tradicional/Premium) e sabores.",
  },
  {
    key: "pedido_round_addons",
    label: "Passo 4 — Adicionais (bolo redondo)",
    hint: "Título, observação e imagem dos adicionais de bolos redondos.",
  },
  {
    key: "pedido_rect",
    label: "Passo 2 — Modelo (bolo retangular)",
    hint: "Título, observação e imagem do passo de modelos retangulares.",
  },
  {
    key: "pedido_rect_line",
    label: "Passo 3 — Linha (bolo retangular)",
    hint: "Título, observação e imagem do passo de linha dos retangulares.",
  },
  {
    key: "pedido_rect_addons",
    label: "Passo 4 — Adicionais (bolo retangular)",
    hint: "Título, observação e imagem dos adicionais de bolos retangulares.",
  },
  {
    key: "pedido_sweets",
    label: "Doces para festa",
    hint: "Aparece em todos os fluxos (bolo redondo, retangular e doces). Título, observação e imagem.",
  },
] as const;

const stripPublicUrl = (u: string | null | undefined): string => {
  if (!u) return "";
  const m = u.match(/\/site-images\/(.+)$/);
  return m ? m[1] : u;
};

const SectionEditor = ({
  cfg,
  section,
  onSave,
}: {
  cfg: { key: string; label: string; hint: string; showScript?: boolean };
  section: any;
  onSave: (u: any) => void;
}) => {
  const initial = section || {};
  const [row, setRow] = useState({
    title: initial.title || "",
    subtitle: initial.subtitle || "",
    content: initial.content || "",
    image_url: stripPublicUrl(initial.image_url),
    script: (initial.metadata as any)?.script || "",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{cfg.label}</CardTitle>
        <p className="text-xs text-muted-foreground">{cfg.hint}</p>
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
        <h1 className="font-display text-3xl text-foreground">Montar Pedido</h1>
        <p className="mt-1 text-muted-foreground">
          Edite os textos e imagens da página onde o cliente monta o pedido. Se um campo ficar vazio,
          o conteúdo do cardápio é usado como padrão.
        </p>
      </div>

      {PEDIDO_SECTIONS.map((cfg) => (
        <SectionEditor
          key={cfg.key}
          cfg={cfg}
          section={byKey[cfg.key]}
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
