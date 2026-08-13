import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useCampaign,
  useCampaignPrizes,
  useUpsertCampaignPrize,
  useDeleteCampaignPrize,
  useCampaignParticipations,
  type CampaignPrize,
} from "@/hooks/useSurpresaAdmin";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const defaultPrize: Partial<CampaignPrize> = {
  name: "",
  description: "",
  emoji: "🎁",
  prize_type: "discount_fixed",
  value: 0,
  product_name: "",
  min_purchase: 30,
  validity_days: 7,
  probability_pct: 10,
  stock_total: null,
  sort_order: 0,
  is_active: true,
  color: "#E8A87C",
};

const prizeTypeLabels: Record<string, string> = {
  discount_fixed: "Desconto Fixo (R$)",
  discount_pct: "Desconto Percentual (%)",
  free_product: "Produto Grátis",
  free_shipping: "Frete Grátis",
  bonus_points: "Pontos Extras",
  special: "Prêmio Especial",
};

const AdminSurpresaCampaignEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading: campaignLoading } = useCampaign(id);
  const { data: prizes, isLoading: prizesLoading } = useCampaignPrizes(id);
  const { data: participations } = useCampaignParticipations(id);
  const upsertPrize = useUpsertCampaignPrize();
  const deletePrize = useDeleteCampaignPrize();
  const [editing, setEditing] = useState<Partial<CampaignPrize> | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const totalProbability = (prizes || [])
    .filter((p) => p.is_active)
    .reduce((sum, p) => sum + Number(p.probability_pct), 0);

  const handleSave = () => {
    if (!editing?.name || !id) {
      toast.error("Nome é obrigatório.");
      return;
    }
    upsertPrize.mutate(
      { ...editing, campaign_id: id } as CampaignPrize,
      { onSuccess: () => setShowDialog(false) }
    );
  };

  const handleDelete = (prizeId: string) => {
    if (!id) return;
    if (confirm("Excluir este prêmio?")) {
      deletePrize.mutate({ id: prizeId, campaignId: id });
    }
  };

  if (campaignLoading || prizesLoading) {
    return <div className="text-center py-20 text-muted-foreground">Carregando...</div>;
  }

  if (!campaign) {
    return <div className="text-center py-20 text-muted-foreground">Campanha não encontrada.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/painel-admin/surpresa/campanhas" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Voltar para campanhas
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            🎁 {campaign.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {participations?.length || 0} participações • {campaign.status}
          </p>
        </div>
        <Button
          onClick={() => { setEditing({ ...defaultPrize, sort_order: (prizes?.length || 0) + 1 }); setShowDialog(true); }}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={16} className="mr-1" /> Novo Prêmio
        </Button>
      </div>

      {/* Probability warning */}
      {prizes && prizes.length > 0 && (
        <Card className={`mb-4 ${Math.abs(totalProbability - 100) < 0.01 ? "border-green-200" : "border-red-200"}`}>
          <CardContent className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              Soma das probabilidades (ativos):
            </span>
            <span className={`text-lg font-bold ${Math.abs(totalProbability - 100) < 0.01 ? "text-green-600" : "text-red-600"}`}>
              {totalProbability.toFixed(1)}%
              {Math.abs(totalProbability - 100) < 0.01 ? " ✅" : " ⚠️ (deve ser 100%)"}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Prizes list */}
      {prizes && prizes.length > 0 ? (
        <div className="space-y-3">
          {prizes.map((prize) => (
            <Card key={prize.id} className={!prize.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl">{prize.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{prize.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {prizeTypeLabels[prize.prize_type] || prize.prize_type}
                      {prize.value ? ` • ${prize.prize_type.includes("pct") ? `${prize.value}%` : `R$ ${Number(prize.value).toFixed(2)}`}` : ""}
                      {prize.product_name ? ` • ${prize.product_name}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prob: <strong>{prize.probability_pct}%</strong> •
                      Estoque: <strong>{prize.stock_total ? `${prize.stock_used}/${prize.stock_total}` : "∞"}</strong> •
                      Validade: <strong>{prize.validity_days}d</strong> •
                      Mín: <strong>R$ {Number(prize.min_purchase).toFixed(0)}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: prize.color }}
                    title="Cor na roleta"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditing({ ...prize }); setShowDialog(true); }}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(prize.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhum prêmio configurado</p>
            <Button
              onClick={() => { setEditing({ ...defaultPrize }); setShowDialog(true); }}
              className="bg-accent text-accent-foreground"
            >
              <Plus size={16} className="mr-1" /> Adicionar Prêmio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prize Editor Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar Prêmio" : "Novo Prêmio"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label>Nome</Label>
                  <Input
                    value={editing.name || ""}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="R$ 5 OFF"
                  />
                </div>
                <div>
                  <Label>Emoji</Label>
                  <Input
                    value={editing.emoji || ""}
                    onChange={(e) => setEditing({ ...editing, emoji: e.target.value })}
                    placeholder="🎁"
                    className="text-center text-xl"
                  />
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Desconto de R$ 5 no próximo pedido"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={editing.prize_type || "discount_fixed"}
                    onValueChange={(v) => setEditing({ ...editing, prize_type: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(prizeTypeLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.value ?? 0}
                    onChange={(e) => setEditing({ ...editing, value: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {editing.prize_type === "free_product" && (
                <div>
                  <Label>Nome do Produto</Label>
                  <Input
                    value={editing.product_name || ""}
                    onChange={(e) => setEditing({ ...editing, product_name: e.target.value })}
                    placeholder="Brownie"
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Probabilidade (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editing.probability_pct ?? 10}
                    onChange={(e) => setEditing({ ...editing, probability_pct: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Validade (dias)</Label>
                  <Input
                    type="number"
                    value={editing.validity_days ?? 7}
                    onChange={(e) => setEditing({ ...editing, validity_days: parseInt(e.target.value) || 7 })}
                  />
                </div>
                <div>
                  <Label>Compra Mín (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.min_purchase ?? 0}
                    onChange={(e) => setEditing({ ...editing, min_purchase: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Estoque (vazio = ∞)</Label>
                  <Input
                    type="number"
                    value={editing.stock_total ?? ""}
                    onChange={(e) => setEditing({ ...editing, stock_total: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="∞"
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Cor (roleta)</Label>
                  <Input
                    type="color"
                    value={editing.color || "#E8A87C"}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="h-10 p-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={upsertPrize.isPending}
              className="bg-accent text-accent-foreground"
            >
              {upsertPrize.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSurpresaCampaignEdit;
