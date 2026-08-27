import { useEffect, useState } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { useBioLinks, useCreateBioLink, useUpdateBioLink, useDeleteBioLink, BioLink } from "@/hooks/useBioLinks";
import type { BiolinkSettings } from "@/pages/Biolink";
import ImageUpload from "@/components/admin/ImageUpload";
import ColorPicker from "@/components/admin/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { title: "", description: "", url: "", image_url: "" };

const AdminBiolink = () => {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { data: links } = useBioLinks(false);
  const createLink = useCreateBioLink();
  const updateLink = useUpdateBioLink();
  const deleteLink = useDeleteBioLink();

  const [cfg, setCfg] = useState<BiolinkSettings>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (settings?.biolink) setCfg(settings.biolink);
  }, [settings]);

  const set = (patch: Partial<BiolinkSettings>) => setCfg((c) => ({ ...c, ...patch }));

  const saveSettings = () => updateSetting.mutate({ key: "biolink", value: cfg });

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (l: BioLink) => {
    setForm({ title: l.title, description: l.description || "", url: l.url, image_url: l.image_url || "" });
    setEditingId(l.id);
    setDialogOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;
    const values = {
      title: form.title,
      description: form.description || null,
      url: form.url,
      image_url: form.image_url || null,
    };
    if (editingId) {
      await updateLink.mutateAsync({ id: editingId, ...values });
      toast.success("Link atualizado!");
    } else {
      await createLink.mutateAsync({ ...values, sort_order: (links?.length || 0) + 1, is_active: true });
    }
    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!links) return;
    const target = links[index + dir];
    const current = links[index];
    if (!target || !current) return;
    await Promise.all([
      updateLink.mutateAsync({ id: current.id, sort_order: target.sort_order }),
      updateLink.mutateAsync({ id: target.id, sort_order: current.sort_order }),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-foreground">Página de Links</h1>
          <p className="text-muted-foreground mt-1">Monte sua página estilo biolink em /links</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/links" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} className="mr-2" />
            Ver página
          </a>
        </Button>
      </div>

      <Tabs defaultValue="links">
        <TabsList>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNew}>
                  <Plus size={16} className="mr-2" />
                  Novo link
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar link" : "Novo link"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Instagram" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição (opcional)</Label>
                    <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Veja nossos bolos" />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." required />
                  </div>
                  <div className="space-y-2">
                    <Label>Imagem / ícone (1:1, opcional)</Label>
                    <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="biolink" aspectRatio={1} recommendedSize="400x400px" />
                  </div>
                  <Button type="submit" className="w-full" disabled={createLink.isPending || updateLink.isPending}>
                    {editingId ? "Salvar" : "Criar link"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {!links?.length ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                <LinkIcon className="mx-auto mb-2 h-8 w-8" />
                <p>Nenhum link adicionado ainda.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map((l, i) => (
                <Card key={l.id}>
                  <CardContent className="flex flex-wrap items-center gap-3 p-4">
                    <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{l.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{l.url}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, -1)} title="Subir">
                        <ArrowUp size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={i === links.length - 1} onClick={() => move(i, 1)} title="Descer">
                        <ArrowDown size={16} />
                      </Button>
                      <Switch checked={l.is_active} onCheckedChange={(v) => updateLink.mutate({ id: l.id, is_active: v })} />
                      <Button variant="ghost" size="icon" onClick={() => openEdit(l)} title="Editar">
                        <Pencil size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive" title="Excluir">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir link?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteLink.mutate(l.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
              <CardDescription>Título, descrição e imagens da página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={cfg.title || ""} onChange={(e) => set({ title: e.target.value })} placeholder="Caseirinhos a Confeitaria" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea value={cfg.subtitle || ""} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Bolos e doces artesanais feitos com amor" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Texto do rodapé (opcional)</Label>
                <Input value={cfg.footer_text || ""} onChange={(e) => set({ footer_text: e.target.value })} placeholder="Atendemos por encomenda" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Imagem de perfil (1:1)</Label>
                  <ImageUpload value={cfg.avatar_url || ""} onChange={(url) => set({ avatar_url: url })} folder="biolink" aspectRatio={1} recommendedSize="500x500px" />
                </div>
                <div className="space-y-2">
                  <Label>Imagem de fundo (9:16)</Label>
                  <ImageUpload value={cfg.bg_image_url || ""} onChange={(url) => set({ bg_image_url: url })} folder="biolink" aspectRatio={9 / 16} recommendedSize="1080x1920px" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cores e botões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ColorPicker label="Cor de fundo" value={cfg.bg_color || "#936037"} onChange={(v) => set({ bg_color: v })} />
                <ColorPicker label="Cor do texto" value={cfg.text_color || "#ffffff"} onChange={(v) => set({ text_color: v })} />
                <ColorPicker label="Cor dos botões" value={cfg.button_color || "#40e0d0"} onChange={(v) => set({ button_color: v })} />
                <ColorPicker label="Cor do texto dos botões" value={cfg.button_text_color || "#ffffff"} onChange={(v) => set({ button_text_color: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Estilo dos botões</Label>
                  <Select value={cfg.button_style || "solid"} onValueChange={(v) => set({ button_style: v as BiolinkSettings["button_style"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Preenchido</SelectItem>
                      <SelectItem value="outline">Contorno</SelectItem>
                      <SelectItem value="glass">Vidro (translúcido)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Escurecer imagem de fundo ({Math.round((cfg.overlay_opacity ?? 0.45) * 100)}%)</Label>
                  <Input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round((cfg.overlay_opacity ?? 0.45) * 100)}
                    onChange={(e) => set({ overlay_opacity: Number(e.target.value) / 100 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mapa / localização</CardTitle>
              <CardDescription>Exibe um mapa com o endereço no final da página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Label>Mostrar mapa</Label>
                <Switch
                  checked={cfg.map_enabled !== false}
                  onCheckedChange={(v) => set({ map_enabled: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={cfg.map_address ?? ""}
                  onChange={(e) => set({ map_address: e.target.value })}
                  placeholder="Rua Manucaia, 114"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSettings} disabled={updateSetting.isPending}>
            Salvar aparência
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBiolink;
