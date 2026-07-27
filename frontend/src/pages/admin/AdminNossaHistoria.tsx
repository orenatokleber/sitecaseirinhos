import { useState, useEffect } from "react";
import { useSiteSections, useUpdateSiteSection } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface ValueItem { title: string; desc: string; }
interface NHData {
  hero: { image_url: string; script: string; title: string };
  block1: { image_url: string; script: string; title: string; paragraph1: string; paragraph2: string };
  block2: { image_url: string; paragraph1: string; paragraph2: string };
  values: { script: string; title: string; items: ValueItem[] };
}

const DEFAULT: NHData = {
  hero: { image_url: "", script: "Nossa", title: "História" },
  block1: { image_url: "", script: "O começo", title: "De uma cozinha caseira para o seu coração", paragraph1: "", paragraph2: "" },
  block2: { image_url: "", paragraph1: "", paragraph2: "" },
  values: { script: "Nossos valores", title: "O que nos move", items: [] },
};

const AdminNossaHistoria = () => {
  const { data: sections, isLoading } = useSiteSections();
  const updateSection = useUpdateSiteSection();
  const [data, setData] = useState<NHData>(DEFAULT);

  useEffect(() => {
    const meta = sections?.nossa_historia?.metadata as any;
    if (meta) {
      setData({
        hero: { ...DEFAULT.hero, ...(meta.hero || {}) },
        block1: { ...DEFAULT.block1, ...(meta.block1 || {}) },
        block2: { ...DEFAULT.block2, ...(meta.block2 || {}) },
        values: {
          script: meta.values?.script ?? DEFAULT.values.script,
          title: meta.values?.title ?? DEFAULT.values.title,
          items: Array.isArray(meta.values?.items) ? meta.values.items : [],
        },
      });
    }
  }, [sections]);

  const handleSave = () => {
    const existing = sections?.nossa_historia?.metadata || {};
    updateSection.mutate({
      sectionKey: "nossa_historia",
      updates: { metadata: { ...existing, ...data } },
    });
  };

  const updateValueItem = (idx: number, patch: Partial<ValueItem>) => {
    setData((d) => ({
      ...d,
      values: { ...d.values, items: d.values.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) },
    }));
  };

  const addValueItem = () => {
    setData((d) => ({ ...d, values: { ...d.values, items: [...d.values.items, { title: "", desc: "" }] } }));
  };

  const removeValueItem = (idx: number) => {
    setData((d) => ({ ...d, values: { ...d.values, items: d.values.items.filter((_, i) => i !== idx) } }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Página Nossa História</h1>
        <p className="text-muted-foreground">Edite imagens e textos da página de história</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* HERO */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Principal (Hero)</CardTitle>
            <CardDescription>Imagem de capa e título da página. Use o cortador para posicionar a imagem como deseja.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <ImageUpload
                value={data.hero.image_url}
                onChange={(url) => setData({ ...data, hero: { ...data.hero, image_url: url } })}
                folder="nossa-historia"
                aspectRatio={16 / 9}
                recommendedSize="1920×1080px (16:9)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto Script (acima)</Label>
                <Input value={data.hero.script} onChange={(e) => setData({ ...data, hero: { ...data.hero, script: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BLOCK 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 1 — Imagem à esquerda</CardTitle>
            <CardDescription>Primeira seção com imagem e dois parágrafos. Posicione a imagem ao cortar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imagem</Label>
              <ImageUpload
                value={data.block1.image_url}
                onChange={(url) => setData({ ...data, block1: { ...data.block1, image_url: url } })}
                folder="nossa-historia"
                aspectRatio={4 / 5}
                recommendedSize="800×1000px (4:5)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Script (acima do título)</Label>
                <Input value={data.block1.script} onChange={(e) => setData({ ...data, block1: { ...data.block1, script: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={data.block1.title} onChange={(e) => setData({ ...data, block1: { ...data.block1, title: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Parágrafo 1</Label>
              <Textarea rows={4} value={data.block1.paragraph1} onChange={(e) => setData({ ...data, block1: { ...data.block1, paragraph1: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Parágrafo 2</Label>
              <Textarea rows={4} value={data.block1.paragraph2} onChange={(e) => setData({ ...data, block1: { ...data.block1, paragraph2: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        {/* BLOCK 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 2 — Imagem à direita</CardTitle>
            <CardDescription>Segunda seção com dois parágrafos e imagem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imagem</Label>
              <ImageUpload
                value={data.block2.image_url}
                onChange={(url) => setData({ ...data, block2: { ...data.block2, image_url: url } })}
                folder="nossa-historia"
                aspectRatio={4 / 5}
                recommendedSize="800×1000px (4:5)"
              />
            </div>
            <div className="space-y-2">
              <Label>Parágrafo 1</Label>
              <Textarea rows={4} value={data.block2.paragraph1} onChange={(e) => setData({ ...data, block2: { ...data.block2, paragraph1: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>Parágrafo 2</Label>
              <Textarea rows={4} value={data.block2.paragraph2} onChange={(e) => setData({ ...data, block2: { ...data.block2, paragraph2: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        {/* VALUES */}
        <Card>
          <CardHeader>
            <CardTitle>Nossos Valores</CardTitle>
            <CardDescription>Cards de valores exibidos no final da página.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Script</Label>
                <Input value={data.values.script} onChange={(e) => setData({ ...data, values: { ...data.values, script: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={data.values.title} onChange={(e) => setData({ ...data, values: { ...data.values, title: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-3">
              {data.values.items.map((it, idx) => (
                <div key={idx} className="border border-border rounded-md p-3 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Item {idx + 1}</span>
                    <Button size="icon" variant="ghost" onClick={() => removeValueItem(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input placeholder="Título" value={it.title} onChange={(e) => updateValueItem(idx, { title: e.target.value })} />
                  <Textarea placeholder="Descrição" rows={2} value={it.desc} onChange={(e) => updateValueItem(idx, { desc: e.target.value })} />
                </div>
              ))}
              <Button variant="outline" onClick={addValueItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Adicionar valor
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={updateSection.isPending} size="lg">
          {updateSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Página
        </Button>
      </div>
    </div>
  );
};

export default AdminNossaHistoria;
