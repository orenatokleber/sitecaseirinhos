import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Plus, Trash2, Cake, Tag, Star, Square, Image as ImageIcon, Save, FileText } from "lucide-react";
import { useSiteSectionsList, useUpdateSiteSection, useCreateSiteSection } from "@/hooks/useSiteContent";

import {
  useCakeSizes,
  useUpsertCakeSize,
  useDeleteCakeSize,
  useCakeCategories,
  useUpsertCakeCategory,
  useDeleteCakeCategory,
  useCakePrices,
  useUpsertCakePrice,
  useCakeFlavors,
  useUpsertCakeFlavor,
  useDeleteCakeFlavor,
  useCakeRectangular,
  useUpsertCakeRectangular,
  useDeleteCakeRectangular,
  useCakeDecorations,
  useUpsertCakeDecoration,
  useDeleteCakeDecoration,
  CakeSize,
  CakeCategory,
  CakeFlavor,
  CakeRectangular,
} from "@/hooks/useCardapio";

const AdminCardapio = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Cardápio de Encomendas
        </h1>
        <p className="text-muted-foreground">
          Gerencie tamanhos, categorias, sabores, retangulares e decorações.
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="content"><FileText className="w-4 h-4 mr-1" /> Conteúdo</TabsTrigger>
          <TabsTrigger value="sizes"><Cake className="w-4 h-4 mr-1" /> Tamanhos</TabsTrigger>
          <TabsTrigger value="categories"><Tag className="w-4 h-4 mr-1" /> Categorias & Preços</TabsTrigger>
          <TabsTrigger value="flavors"><Star className="w-4 h-4 mr-1" /> Sabores</TabsTrigger>
          <TabsTrigger value="rectangular"><Square className="w-4 h-4 mr-1" /> Retangulares</TabsTrigger>
          <TabsTrigger value="decorations"><ImageIcon className="w-4 h-4 mr-1" /> Decorações</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6"><ContentPanel /></TabsContent>
        <TabsContent value="sizes" className="mt-6"><SizesPanel /></TabsContent>
        <TabsContent value="categories" className="mt-6"><CategoriesPanel /></TabsContent>
        <TabsContent value="flavors" className="mt-6"><FlavorsPanel /></TabsContent>
        <TabsContent value="rectangular" className="mt-6"><RectangularPanel /></TabsContent>
        <TabsContent value="decorations" className="mt-6"><DecorationsPanel /></TabsContent>
      </Tabs>

    </div>
  );
};

/* ─── SIZES ─── */
const SizesPanel = () => {
  const { data: sizes = [], isLoading } = useCakeSizes();
  const upsert = useUpsertCakeSize();
  const del = useDeleteCakeSize();
  const [newRow, setNewRow] = useState<Partial<CakeSize>>({ code: "", name: "", ring_size: "", slices: 0, weight_kg: 0, sort_order: 0, is_active: true });

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <Card>
      <CardHeader><CardTitle>Tamanhos de bolo</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {sizes.map((s) => <SizeRow key={s.id} size={s} onSave={(row) => upsert.mutate(row)} onDelete={() => del.mutate(s.id)} />)}

        <div className="border-t pt-4">
          <Label className="text-xs font-semibold uppercase tracking-wide">Adicionar tamanho</Label>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-2 items-end">
            <div><Label className="text-xs">Código</Label><Input placeholder="P" value={newRow.code || ""} onChange={(e) => setNewRow({ ...newRow, code: e.target.value, name: e.target.value })} /></div>
            <div><Label className="text-xs">Aro / Dim.</Label><Input placeholder="aro 13" value={newRow.ring_size || ""} onChange={(e) => setNewRow({ ...newRow, ring_size: e.target.value })} /></div>
            <div><Label className="text-xs">Fatias</Label><Input type="number" value={newRow.slices ?? ""} onChange={(e) => setNewRow({ ...newRow, slices: parseInt(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Peso (kg)</Label><Input type="number" step="0.1" value={newRow.weight_kg ?? ""} onChange={(e) => setNewRow({ ...newRow, weight_kg: parseFloat(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Ordem</Label><Input type="number" value={newRow.sort_order ?? 0} onChange={(e) => setNewRow({ ...newRow, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <Button disabled={!newRow.code} onClick={() => { upsert.mutate(newRow as any); setNewRow({ code: "", name: "", ring_size: "", slices: 0, weight_kg: 0, sort_order: 0, is_active: true }); }}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SizeRow = ({ size, onSave, onDelete }: { size: CakeSize; onSave: (r: any) => void; onDelete: () => void }) => {
  const [row, setRow] = useState(size);
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-2 items-end pb-3 border-b border-border/50">
      <div><Label className="text-xs">Código</Label><Input value={row.code} onChange={(e) => setRow({ ...row, code: e.target.value })} /></div>
      <div><Label className="text-xs">Aro / Dim.</Label><Input value={row.ring_size || ""} onChange={(e) => setRow({ ...row, ring_size: e.target.value })} /></div>
      <div><Label className="text-xs">Fatias</Label><Input type="number" value={row.slices ?? ""} onChange={(e) => setRow({ ...row, slices: parseInt(e.target.value) || 0 })} /></div>
      <div><Label className="text-xs">Peso (kg)</Label><Input type="number" step="0.1" value={row.weight_kg ?? ""} onChange={(e) => setRow({ ...row, weight_kg: parseFloat(e.target.value) || 0 })} /></div>
      <div><Label className="text-xs">Ordem</Label><Input type="number" value={row.sort_order} onChange={(e) => setRow({ ...row, sort_order: parseInt(e.target.value) || 0 })} /></div>
      <div className="flex items-center gap-2 pb-2"><input type="checkbox" checked={row.is_active} onChange={(e) => setRow({ ...row, is_active: e.target.checked })} /> <Label className="text-xs">Ativo</Label></div>
      <div className="flex gap-1">
        <Button size="sm" onClick={() => onSave({ ...row, name: row.name || row.code })}><Save className="w-4 h-4" /></Button>
        <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

/* ─── CATEGORIES + PRICES MATRIX ─── */
const CategoriesPanel = () => {
  const { data: categories = [], isLoading } = useCakeCategories();
  const { data: sizes = [] } = useCakeSizes();
  const { data: prices = [] } = useCakePrices();
  const upsertCat = useUpsertCakeCategory();
  const delCat = useDeleteCakeCategory();
  const upsertPrice = useUpsertCakePrice();
  const [newCat, setNewCat] = useState({ slug: "", name: "", description: "", type: "standard" as "standard" | "addon", sort_order: 0, is_active: true });

  const getPrice = (catId: string, sizeId: string) =>
    prices.find((p) => p.category_id === catId && p.size_id === sizeId)?.price ?? 0;

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          sizes={sizes}
          getPrice={getPrice}
          onSaveCat={(row) => upsertCat.mutate(row)}
          onDeleteCat={() => delCat.mutate(cat.id)}
          onSavePrice={(sizeId, price) => upsertPrice.mutate({ category_id: cat.id, size_id: sizeId, price })}
        />
      ))}

      <Card>
        <CardHeader><CardTitle className="text-base">Nova categoria</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div><Label className="text-xs">Slug</Label><Input value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} /></div>
            <div><Label className="text-xs">Nome</Label><Input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} /></div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select value={newCat.type} onValueChange={(v) => setNewCat({ ...newCat, type: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Padrão (preço total)</SelectItem>
                  <SelectItem value="addon">Adicional (+R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Ordem</Label><Input type="number" value={newCat.sort_order} onChange={(e) => setNewCat({ ...newCat, sort_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <div><Label className="text-xs">Descrição</Label><Input value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} /></div>
          <Button disabled={!newCat.slug || !newCat.name} onClick={() => { upsertCat.mutate(newCat as any); setNewCat({ slug: "", name: "", description: "", type: "standard", sort_order: 0, is_active: true }); }}>
            <Plus className="w-4 h-4 mr-1" /> Criar categoria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CategoryCard = ({
  category, sizes, getPrice, onSaveCat, onDeleteCat, onSavePrice,
}: {
  category: CakeCategory;
  sizes: CakeSize[];
  getPrice: (catId: string, sizeId: string) => number;
  onSaveCat: (row: any) => void;
  onDeleteCat: () => void;
  onSavePrice: (sizeId: string, price: number) => void;
}) => {
  const [cat, setCat] = useState(category);
  const [localPrices, setLocalPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    sizes.forEach((s) => { m[s.id] = getPrice(category.id, s.id); });
    return m;
  });

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
          <div><Label className="text-xs">Nome</Label><Input value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value })} /></div>
          <div><Label className="text-xs">Slug</Label><Input value={cat.slug} onChange={(e) => setCat({ ...cat, slug: e.target.value })} /></div>
          <div>
            <Label className="text-xs">Tipo</Label>
            <Select value={cat.type} onValueChange={(v) => setCat({ ...cat, type: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="addon">Adicional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Ordem</Label><Input type="number" value={cat.sort_order} onChange={(e) => setCat({ ...cat, sort_order: parseInt(e.target.value) || 0 })} /></div>
          <div className="flex gap-1">
            <Button size="sm" onClick={() => onSaveCat(cat)}><Save className="w-4 h-4" /></Button>
            <Button size="sm" variant="destructive" onClick={onDeleteCat}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="mt-2"><Label className="text-xs">Descrição</Label><Input value={cat.description || ""} onChange={(e) => setCat({ ...cat, description: e.target.value })} /></div>
        <div className="mt-3">
          <Label className="text-xs">Imagem da seção (opcional)</Label>
          <ImageUpload value={cat.image_url || ""} onChange={(url) => setCat({ ...cat, image_url: url })} folder="cardapio/categorias" aspectRatio={16 / 9} recommendedSize="1280×720px" />
        </div>
      </CardHeader>

      <CardContent>
        <Label className="text-xs uppercase font-semibold">Preço por tamanho {cat.type === "addon" && "(adicional ao bolo)"}</Label>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-2">
          {sizes.map((s) => (
            <div key={s.id}>
              <Label className="text-xs">{s.code}</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  step="0.01"
                  value={localPrices[s.id] ?? 0}
                  onChange={(e) => setLocalPrices({ ...localPrices, [s.id]: parseFloat(e.target.value) || 0 })}
                  onBlur={() => onSavePrice(s.id, localPrices[s.id] || 0)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── FLAVORS ─── */
const FlavorsPanel = () => {
  const { data: categories = [] } = useCakeCategories();
  const { data: flavors = [], isLoading } = useCakeFlavors();
  const upsert = useUpsertCakeFlavor();
  const del = useDeleteCakeFlavor();
  const [newFlavor, setNewFlavor] = useState<{ category_id: string; name: string; description: string }>({ category_id: "", name: "", description: "" });

  if (isLoading) return <Loader2 className="animate-spin" />;

  const standardCats = categories.filter((c) => c.type === "standard");

  return (
    <div className="space-y-6">
      {standardCats.map((cat) => (
        <Card key={cat.id}>
          <CardHeader><CardTitle>{cat.name}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {flavors.filter((f) => f.category_id === cat.id).map((f) => (
              <FlavorRow key={f.id} flavor={f} onSave={(r) => upsert.mutate(r)} onDelete={() => del.mutate(f.id)} />
            ))}
            <div className="border-t pt-3">
              <Label className="text-xs uppercase font-semibold">Adicionar sabor a {cat.name}</Label>
              <div className="space-y-2 mt-2">
                <Input placeholder="Nome (ex: Brigadeiro Amargo)" value={newFlavor.category_id === cat.id ? newFlavor.name : ""} onChange={(e) => setNewFlavor({ category_id: cat.id, name: e.target.value, description: newFlavor.category_id === cat.id ? newFlavor.description : "" })} />
                <Textarea rows={2} placeholder="Descrição (massa, recheios...)" value={newFlavor.category_id === cat.id ? newFlavor.description : ""} onChange={(e) => setNewFlavor({ ...newFlavor, category_id: cat.id, description: e.target.value })} />
                <Button size="sm" disabled={newFlavor.category_id !== cat.id || !newFlavor.name} onClick={() => { upsert.mutate({ category_id: cat.id, name: newFlavor.name, description: newFlavor.description, sort_order: flavors.filter((f) => f.category_id === cat.id).length + 1, is_active: true }); setNewFlavor({ category_id: "", name: "", description: "" }); }}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const FlavorRow = ({ flavor, onSave, onDelete }: { flavor: CakeFlavor; onSave: (r: any) => void; onDelete: () => void }) => {
  const [row, setRow] = useState(flavor);
  return (
    <div className="border border-border/40 rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_60px_auto] gap-2 items-end">
        <div><Label className="text-xs">Nome</Label><Input value={row.name} onChange={(e) => setRow({ ...row, name: e.target.value })} /></div>
        <div><Label className="text-xs">Ordem</Label><Input type="number" value={row.sort_order} onChange={(e) => setRow({ ...row, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="flex items-center gap-1 pb-2"><input type="checkbox" checked={row.is_active} onChange={(e) => setRow({ ...row, is_active: e.target.checked })} /> <Label className="text-xs">Ativo</Label></div>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(row)}><Save className="w-4 h-4" /></Button>
          <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
      <Textarea rows={2} value={row.description || ""} onChange={(e) => setRow({ ...row, description: e.target.value })} />
    </div>
  );
};

/* ─── RECTANGULAR ─── */
const RectangularPanel = () => {
  const { data: items = [], isLoading } = useCakeRectangular();
  const upsert = useUpsertCakeRectangular();
  const del = useDeleteCakeRectangular();
  const [newRow, setNewRow] = useState<Partial<CakeRectangular>>({ name: "", dimensions: "", slices: 0, weight_kg: 0, class1_price: 0, class2_price: 0, note: "", sort_order: 0, is_active: true });

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-4">
      {items.map((r) => <RectangularRow key={r.id} row={r} onSave={(x) => upsert.mutate(x)} onDelete={() => del.mutate(r.id)} />)}
      <Card>
        <CardHeader><CardTitle className="text-base">Adicionar retangular</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div><Label className="text-xs">Nome</Label><Input value={newRow.name || ""} onChange={(e) => setNewRow({ ...newRow, name: e.target.value })} /></div>
            <div><Label className="text-xs">Dimensões</Label><Input value={newRow.dimensions || ""} onChange={(e) => setNewRow({ ...newRow, dimensions: e.target.value })} /></div>
            <div><Label className="text-xs">Fatias</Label><Input type="number" value={newRow.slices ?? 0} onChange={(e) => setNewRow({ ...newRow, slices: parseInt(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Peso (kg)</Label><Input type="number" step="0.1" value={newRow.weight_kg ?? 0} onChange={(e) => setNewRow({ ...newRow, weight_kg: parseFloat(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Classe 1 (R$)</Label><Input type="number" step="0.01" value={newRow.class1_price ?? 0} onChange={(e) => setNewRow({ ...newRow, class1_price: parseFloat(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Classe 2 (R$)</Label><Input type="number" step="0.01" value={newRow.class2_price ?? 0} onChange={(e) => setNewRow({ ...newRow, class2_price: parseFloat(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Ordem</Label><Input type="number" value={newRow.sort_order ?? 0} onChange={(e) => setNewRow({ ...newRow, sort_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <Input placeholder="Observação (ex: O bolo retrô pode ser decorado bem retrô :))" value={newRow.note || ""} onChange={(e) => setNewRow({ ...newRow, note: e.target.value })} />
          <Button disabled={!newRow.name} onClick={() => { upsert.mutate(newRow as any); setNewRow({ name: "", dimensions: "", slices: 0, weight_kg: 0, class1_price: 0, class2_price: 0, note: "", sort_order: 0, is_active: true }); }}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const RectangularRow = ({ row, onSave, onDelete }: { row: CakeRectangular; onSave: (r: any) => void; onDelete: () => void }) => {
  const [r, setR] = useState(row);
  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><Label className="text-xs">Nome</Label><Input value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} /></div>
          <div><Label className="text-xs">Dimensões</Label><Input value={r.dimensions || ""} onChange={(e) => setR({ ...r, dimensions: e.target.value })} /></div>
          <div><Label className="text-xs">Fatias</Label><Input type="number" value={r.slices ?? 0} onChange={(e) => setR({ ...r, slices: parseInt(e.target.value) || 0 })} /></div>
          <div><Label className="text-xs">Peso (kg)</Label><Input type="number" step="0.1" value={r.weight_kg ?? 0} onChange={(e) => setR({ ...r, weight_kg: parseFloat(e.target.value) || 0 })} /></div>
          <div><Label className="text-xs">Classe 1 (R$)</Label><Input type="number" step="0.01" value={r.class1_price ?? 0} onChange={(e) => setR({ ...r, class1_price: parseFloat(e.target.value) || 0 })} /></div>
          <div><Label className="text-xs">Classe 2 (R$)</Label><Input type="number" step="0.01" value={r.class2_price ?? 0} onChange={(e) => setR({ ...r, class2_price: parseFloat(e.target.value) || 0 })} /></div>
          <div><Label className="text-xs">Ordem</Label><Input type="number" value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: parseInt(e.target.value) || 0 })} /></div>
          <div className="flex items-center gap-1 pb-2"><input type="checkbox" checked={r.is_active} onChange={(e) => setR({ ...r, is_active: e.target.checked })} /> <Label className="text-xs">Ativo</Label></div>
        </div>
        <Input value={r.note || ""} onChange={(e) => setR({ ...r, note: e.target.value })} placeholder="Observação" />
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(r)}><Save className="w-4 h-4 mr-1" /> Salvar</Button>
          <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4 mr-1" /> Remover</Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── DECORATIONS ─── */
const DecorationsPanel = () => {
  const { data: items = [], isLoading } = useCakeDecorations();
  const upsert = useUpsertCakeDecoration();
  const del = useDeleteCakeDecoration();
  const [newImage, setNewImage] = useState("");
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Adicionar decoração</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Título (opcional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <ImageUpload value={newImage} onChange={setNewImage} folder="cardapio/decoracoes" aspectRatio={1} recommendedSize="800×800px" />
          <Button disabled={!newImage} onClick={() => { upsert.mutate({ title: newTitle || null, image_url: newImage, sort_order: items.length + 1, is_active: true } as any); setNewImage(""); setNewTitle(""); }}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((d) => (
          <Card key={d.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={d.image_url} alt={d.title || "Decoração"} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <CardContent className="p-3 space-y-2">
              {d.title && <p className="text-xs font-semibold truncate">{d.title}</p>}
              <Button size="sm" variant="destructive" className="w-full" onClick={() => del.mutate(d.id)}><Trash2 className="w-4 h-4 mr-1" /> Remover</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AdminCardapio;

/* ─── CONTENT (títulos / subtítulos / observações / imagens) ─── */
const CARDAPIO_SECTIONS: Array<{ key: string; label: string; hint: string; aspect: number; size: string; simplified?: boolean }> = [
  { key: "cardapio_hero", label: "Hero (topo da página)", hint: "Título principal, subtítulo, script, observação e imagem", aspect: 16 / 9, size: "1600×900px" },
  { key: "cardapio_sizes", label: "Bolos Decorados (Passo 1)", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_addons", label: "Bolos Coração", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_rectangular", label: "Bolos Retangulares", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_decorations", label: "Decorações", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
  { key: "cardapio_order", label: "Solicite seu orçamento", hint: "Observação e imagem", aspect: 16 / 9, size: "1280×720px", simplified: true },
];

const ContentPanel = () => {
  const { data: sections = [], isLoading } = useSiteSectionsList();
  const update = useUpdateSiteSection();
  const create = useCreateSiteSection();

  if (isLoading) return <Loader2 className="animate-spin" />;

  const byKey: Record<string, any> = {};
  sections.forEach((s: any) => { byKey[s.section_key] = s; });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Edite observações e imagens de cada seção do cardápio.
      </p>
      {CARDAPIO_SECTIONS.map((cfg) => {
        const sec = byKey[cfg.key];
        return (
          <SectionEditor
            key={cfg.key}
            cfg={cfg}
            section={sec}
            onSave={(updates) => {
              if (sec) update.mutate({ sectionKey: cfg.key, updates });
              else create.mutate({ section_key: cfg.key, ...updates });
            }}
          />
        );
      })}
    </div>
  );
};

const stripPublicUrl = (u: string | null | undefined): string => {
  if (!u) return "";
  const m = u.match(/\/site-images\/(.+)$/);
  return m ? m[1] : u;
};

const SectionEditor = ({
  cfg, section, onSave,
}: { cfg: { key: string; label: string; hint: string; aspect: number; size: string; simplified?: boolean }; section: any; onSave: (u: any) => void }) => {
  const initial = section || { title: "", subtitle: "", content: "", image_url: "", metadata: {} };
  const [row, setRow] = useState({
    title: initial.title || "",
    subtitle: initial.subtitle || "",
    content: initial.content || "",
    image_url: stripPublicUrl(initial.image_url),
    script: (initial.metadata as any)?.script || "",
  });
  const simplified = cfg.simplified;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{cfg.label}</CardTitle>
        <p className="text-xs text-muted-foreground">{cfg.hint}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!simplified && (
          <div>
            <Label className="text-xs">Script (texto pequeno)</Label>
            <Input value={row.script} onChange={(e) => setRow({ ...row, script: e.target.value })} placeholder="Ex: Passo 1" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={row.title} onChange={(e) => setRow({ ...row, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Subtítulo</Label>
            <Input value={row.subtitle} onChange={(e) => setRow({ ...row, subtitle: e.target.value })} />
          </div>
        </div>
        <div>
          <Label className="text-xs">Observação / texto adicional</Label>
          <Textarea rows={3} value={row.content} onChange={(e) => setRow({ ...row, content: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Imagem (opcional)</Label>
          <ImageUpload value={row.image_url} onChange={(url) => setRow({ ...row, image_url: url })} folder={`cardapio/${cfg.key}`} aspectRatio={cfg.aspect} recommendedSize={cfg.size} />
        </div>
        <Button size="sm" onClick={() => onSave({
          title: row.title || null,
          subtitle: row.subtitle || null,
          content: row.content || null,
          image_url: row.image_url || null,
          metadata: simplified
            ? (section?.metadata || {})
            : { ...(section?.metadata || {}), script: row.script || null },
        })}>
          <Save className="w-4 h-4 mr-1" /> Salvar seção
        </Button>

      </CardContent>

    </Card>
  );
};


