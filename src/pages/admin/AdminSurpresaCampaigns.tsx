import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCampaigns, useUpsertCampaign, useDeleteCampaign, type Campaign } from "@/hooks/useSurpresaAdmin";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const defaultCampaign: Partial<Campaign> = {
  name: "",
  slug: "",
  description: "",
  mechanic_type: "wheel",
  status: "draft",
  require_story_share: true,
  require_access_token: false,
  external_menu_url: "",
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: "",
  instagram: { handle: "@caseirinhosaconfeitaria", hashtag: "#SurpresaCaseirinhos" },
};

const AdminSurpresaCampaigns = () => {
  const { data: campaigns, isLoading } = useCampaigns();
  const upsertCampaign = useUpsertCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [editing, setEditing] = useState<Partial<Campaign> | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSave = () => {
    if (!editing?.name || !editing?.slug) {
      toast.error("Nome e slug são obrigatórios.");
      return;
    }
    upsertCampaign.mutate(editing as Campaign, {
      onSuccess: () => setShowDialog(false),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir esta campanha? Todas as participações serão perdidas.")) {
      deleteCampaign.mutate(id);
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Rascunho", color: "bg-gray-100 text-gray-700" },
    active: { label: "Ativa", color: "bg-green-100 text-green-700" },
    paused: { label: "Pausada", color: "bg-yellow-100 text-yellow-700" },
    ended: { label: "Encerrada", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            🎯 Campanhas
          </h1>
          <p className="text-sm text-muted-foreground">Gerencie suas campanhas de recompensas</p>
        </div>
        <Button
          onClick={() => { setEditing({ ...defaultCampaign }); setShowDialog(true); }}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={16} className="mr-1" /> Nova Campanha
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Carregando...</div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const st = statusLabels[c.status] || statusLabels.draft;
            return (
              <Card key={c.id}>
                <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-lg font-semibold truncate">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.slug} • {c.mechanic_type} •{" "}
                      {new Date(c.starts_at).toLocaleDateString("pt-BR")}
                      {c.ends_at ? ` → ${new Date(c.ends_at).toLocaleDateString("pt-BR")}` : " → Sem fim"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/painel-admin/surpresa/campanhas/${c.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={14} className="mr-1" /> Editar Prêmios
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditing({ ...c }); setShowDialog(true); }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma campanha criada</p>
            <p className="text-sm mb-4">Crie sua primeira campanha para começar a distribuir surpresas!</p>
            <Button
              onClick={() => { setEditing({ ...defaultCampaign }); setShowDialog(true); }}
              className="bg-accent text-accent-foreground"
            >
              <Plus size={16} className="mr-1" /> Criar Campanha
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Surpresa de Agosto"
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={editing.slug || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  placeholder="surpresa-de-agosto"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Escaneie o QR Code e ganhe um presente!"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mecânica</Label>
                  <Select
                    value={editing.mechanic_type || "wheel"}
                    onValueChange={(v) => setEditing({ ...editing, mechanic_type: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheel">🎡 Roleta</SelectItem>
                      <SelectItem value="scratch">🎟️ Raspadinha</SelectItem>
                      <SelectItem value="box">📦 Caixa Surpresa</SelectItem>
                      <SelectItem value="quiz">❓ Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editing.status || "draft"}
                    onValueChange={(v) => setEditing({ ...editing, status: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                      <SelectItem value="ended">Encerrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Início</Label>
                  <Input
                    type="datetime-local"
                    value={editing.starts_at?.slice(0, 16) || ""}
                    onChange={(e) => setEditing({ ...editing, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Fim (opcional)</Label>
                  <Input
                    type="datetime-local"
                    value={editing.ends_at?.slice(0, 16) || ""}
                    onChange={(e) => setEditing({ ...editing, ends_at: e.target.value || null })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.require_story_share ?? true}
                    onChange={(e) =>
                      setEditing({ ...editing, require_story_share: e.target.checked })
                    }
                    className="w-4 h-4"
                    id="require-share"
                  />
                  <Label htmlFor="require-share" className="cursor-pointer">
                    Exigir compartilhamento no Instagram Stories
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.require_access_token ?? false}
                    onChange={(e) =>
                      setEditing({ ...editing, require_access_token: e.target.checked })
                    }
                    className="w-4 h-4"
                    id="require-access-token"
                  />
                  <Label htmlFor="require-access-token" className="cursor-pointer">
                    Exigir Token de Acesso (apenas clientes que compraram)
                  </Label>
                </div>
              </div>
              <div className="mt-2">
                <Label>URL do Cardápio Externo (Opcional)</Label>
                <Input
                  type="url"
                  placeholder="https://exemplo.com/cardapio"
                  value={editing.external_menu_url || ""}
                  onChange={(e) => setEditing({ ...editing, external_menu_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Se preenchido, os botões de ação final da roleta redirecionarão para este link.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={upsertCampaign.isPending}
              className="bg-accent text-accent-foreground"
            >
              {upsertCampaign.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSurpresaCampaigns;
