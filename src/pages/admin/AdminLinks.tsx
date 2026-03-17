import { useState } from "react";
import { useRedirects, useCreateRedirect, useUpdateRedirect, useDeleteRedirect } from "@/hooks/useRedirects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Trash2, Pencil, Link as LinkIcon, BarChart3, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = window.location.origin;

interface LinkForm {
  slug: string;
  destination_url: string;
  title: string;
}

const AdminLinks = () => {
  const { data: redirects, isLoading } = useRedirects();
  const createRedirect = useCreateRedirect();
  const updateRedirect = useUpdateRedirect();
  const deleteRedirect = useDeleteRedirect();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LinkForm>({ slug: "", destination_url: "", title: "" });

  const resetForm = () => {
    setForm({ slug: "", destination_url: "", title: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!slug || !form.destination_url) return;

    try {
      if (editingId) {
        await updateRedirect.mutateAsync({ id: editingId, slug, destination_url: form.destination_url, title: form.title || undefined });
        toast({ title: "Link atualizado!" });
      } else {
        await createRedirect.mutateAsync({ slug, destination_url: form.destination_url, title: form.title || undefined });
        toast({ title: "Link criado!" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (r: any) => {
    setForm({ slug: r.slug, destination_url: r.destination_url, title: r.title || "" });
    setEditingId(r.id);
    setDialogOpen(true);
  };

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${BASE_URL}/${slug}`);
    toast({ title: "Link copiado!" });
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    await updateRedirect.mutateAsync({ id, is_active });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Links</h1>
          <p className="text-muted-foreground">Gerencie seus links de redirecionamento</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" />Novo Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Link" : "Novo Link"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Título (opcional)</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Instagram" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{BASE_URL}/</span>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="instagram" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL de Destino</Label>
                <Input value={form.destination_url} onChange={(e) => setForm({ ...form, destination_url: e.target.value })} placeholder="https://instagram.com/caseirinhos" type="url" required />
              </div>
              <Button type="submit" className="w-full" disabled={createRedirect.isPending || updateRedirect.isPending}>
                {editingId ? "Salvar" : "Criar Link"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Total de Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{redirects?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Links Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{redirects?.filter(r => r.is_active).length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Total de Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{redirects?.reduce((sum, r) => sum + r.total_clicks, 0) || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : !redirects?.length ? (
            <div className="p-8 text-center text-muted-foreground">
              <LinkIcon className="mx-auto mb-2 h-8 w-8" />
              <p>Nenhum link criado ainda</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead className="hidden md:table-cell">Destino</TableHead>
                  <TableHead className="text-center">Cliques</TableHead>
                  <TableHead className="text-center">Ativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{r.title || r.slug}</p>
                        <p className="text-xs text-muted-foreground">/go/{r.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <a href={r.destination_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate">
                        {r.destination_url}
                        <ExternalLink size={12} />
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-sm"><BarChart3 size={14} />{r.total_clicks}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={r.is_active} onCheckedChange={(v) => handleToggle(r.id, v)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(r.slug)} title="Copiar link">
                          <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(r)} title="Editar">
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
                              <AlertDialogDescription>Esta ação não pode ser desfeita. Todos os dados de cliques também serão removidos.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRedirect.mutate(r.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLinks;
