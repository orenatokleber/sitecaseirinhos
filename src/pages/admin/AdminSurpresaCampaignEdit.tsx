import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
  useCampaign,
  useCampaignPrizes,
  useUpsertCampaignPrize,
  useDeleteCampaignPrize,
  useCampaignParticipations,
  type CampaignPrize,
} from "@/hooks/useSurpresaAdmin";
import { Plus, Edit2, Trash2, ArrowLeft, Copy, Check, Ticket, Key, Info } from "lucide-react";
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
  static_coupon_code: "",
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

  // External Coupon Pool & static coupon states
  const [couponsText, setCouponsText] = useState("");
  const [prizeCouponsCount, setPrizeCouponsCount] = useState<number | null>(null);

  // Access tokens states
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenQty, setTokenQty] = useState(10);
  const [generatingTokens, setGeneratingTokens] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const totalProbability = (prizes || [])
    .filter((p) => p.is_active)
    .reduce((sum, p) => sum + Number(p.probability_pct), 0);

  const fetchTokens = useCallback(async () => {
    if (!id) return;
    setLoadingTokens(true);
    const { data, error } = await supabase
      .from("campaign_access_tokens" as any)
      .select("*")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });
    setLoadingTokens(false);
    if (!error && data) {
      setTokens(data);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTokens();
    }
  }, [id, fetchTokens]);

  const handleEditPrizeClick = async (prize: CampaignPrize) => {
    setEditing({ ...prize });
    setCouponsText("");
    setPrizeCouponsCount(null);
    setShowDialog(true);
    try {
      const { count, error } = await supabase
        .from("campaign_prize_coupons" as any)
        .select("*", { count: "exact", head: true })
        .eq("prize_id", prize.id)
        .eq("is_used", false);
      if (!error && count !== null) {
        setPrizeCouponsCount(count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (!editing?.name || !id) {
      toast.error("Nome é obrigatório.");
      return;
    }
    upsertPrize.mutate(
      { ...editing, campaign_id: id } as CampaignPrize,
      {
        onSuccess: async (data: any) => {
          const finalPrizeId = data?.id || editing.id;
          if (finalPrizeId && couponsText.trim()) {
            const codes = couponsText
              .split("\n")
              .map((c) => c.trim())
              .filter(Boolean);

            if (codes.length > 0) {
              const insertData = codes.map((code) => ({
                prize_id: finalPrizeId,
                coupon_code: code,
              }));
              const { error: insErr } = await supabase
                .from("campaign_prize_coupons" as any)
                .insert(insertData);
              if (insErr) {
                toast.error("Erro ao importar cupons do pool.");
              } else {
                toast.success(`${codes.length} cupons adicionados ao pool.`);
              }
            }
          }
          setShowDialog(false);
        },
      }
    );
  };

  const handleDelete = (prizeId: string) => {
    if (!id) return;
    if (confirm("Excluir este prêmio?")) {
      deletePrize.mutate({ id: prizeId, campaignId: id });
    }
  };

  const handleGenerateTokens = async () => {
    if (!id || tokenQty <= 0) return;
    setGeneratingTokens(true);
    const newTokens = Array.from({ length: tokenQty }, () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let tokenStr = "CASE-";
      for (let i = 0; i < 8; i++) {
        tokenStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return {
        campaign_id: id,
        token: tokenStr,
      };
    });

    const { error } = await supabase.from("campaign_access_tokens" as any).insert(newTokens);
    setGeneratingTokens(false);
    if (error) {
      toast.error("Erro ao gerar tokens de acesso.");
    } else {
      toast.success(`${tokenQty} tokens de acesso gerados com sucesso!`);
      fetchTokens();
    }
  };

  const handleCopyLink = (tokenStr: string) => {
    const link = `${window.location.origin}/surpresa?t=${tokenStr}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(tokenStr);
    setTimeout(() => setCopiedToken(null), 2000);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleCopyAllLinks = () => {
    const links = tokens.map((t) => `${window.location.origin}/surpresa?t=${t.token}`).join("\n");
    navigator.clipboard.writeText(links);
    toast.success("Todos os links de acesso foram copiados!");
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
          onClick={() => { setEditing({ ...defaultPrize, sort_order: (prizes?.length || 0) + 1 }); setCouponsText(""); setPrizeCouponsCount(null); setShowDialog(true); }}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={16} className="mr-1" /> Novo Prêmio
        </Button>
      </div>

      <Tabs defaultValue="prizes" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="prizes" className="flex items-center gap-2">
            <Ticket size={16} /> Prêmios e Cupons
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Key size={16} /> Links de Acesso (Tokens)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prizes" className="space-y-6">
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
                        {((prize as any).static_coupon_code) && (
                          <p className="text-xs text-amber-600 font-semibold mt-1">
                            🎟️ Cupom Estático: {(prize as any).static_coupon_code}
                          </p>
                        )}
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
                        onClick={() => handleEditPrizeClick(prize)}
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
                  onClick={() => { setEditing({ ...defaultPrize }); setCouponsText(""); setPrizeCouponsCount(null); setShowDialog(true); }}
                  className="bg-accent text-accent-foreground"
                >
                  <Plus size={16} className="mr-1" /> Adicionar Prêmio
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="text-gold" />
                Gerador de Links de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Gere links exclusivos para enviar aos clientes que compraram. Cada link permite girar a roleta apenas uma vez.
              </p>
              
              <div className="flex items-end gap-4 max-w-md">
                <div className="flex-1">
                  <Label>Quantidade a Gerar</Label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={tokenQty}
                    onChange={(e) => setTokenQty(parseInt(e.target.value) || 10)}
                  />
                </div>
                <Button
                  onClick={handleGenerateTokens}
                  disabled={generatingTokens}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {generatingTokens ? "Gerando..." : "Gerar Links"}
                </Button>
              </div>

              {tokens.length > 0 && (
                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">
                      Links Gerados ({tokens.length} no total, {tokens.filter((t) => !t.used_at).length} disponíveis)
                    </h3>
                    <Button variant="outline" size="sm" onClick={handleCopyAllLinks}>
                      <Copy size={14} className="mr-1" /> Copiar Todos os Links
                    </Button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto border rounded-lg divide-y bg-white">
                    {loadingTokens ? (
                      <div className="p-8 text-center text-muted-foreground">Carregando...</div>
                    ) : (
                      tokens.map((t) => (
                        <div key={t.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded mr-2">
                              {t.token}
                            </span>
                            <span className="text-muted-foreground truncate hidden md:inline">
                              {window.location.origin}/surpresa?t={t.token}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {t.used_at ? (
                              <span className="text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                                Usado por {t.used_by_whatsapp?.slice(0, 12)}...
                              </span>
                            ) : (
                              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                Disponível
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLink(t.token)}
                            >
                              {copiedToken === t.token ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
              
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  <Ticket size={16} /> Configurações de Cupom Externo
                </h4>
                
                <div>
                  <Label>Cupom Estático (Cardápio Externo)</Label>
                  <Input
                    value={(editing as any).static_coupon_code || ""}
                    onChange={(e) => setEditing({ ...editing, static_coupon_code: e.target.value } as any)}
                    placeholder="Ex: ROLETACASE5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Se preenchido, todos os ganhadores deste prêmio receberão esse mesmo cupom estático.
                  </p>
                </div>

                {editing.id && (
                  <div>
                    <Label className="flex justify-between items-center">
                      <span>Importar Pool de Cupons de Uso Único</span>
                      {prizeCouponsCount !== null && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          {prizeCouponsCount} disponíveis no pool
                        </span>
                      )}
                    </Label>
                    <Textarea
                      value={couponsText}
                      onChange={(e) => setCouponsText(e.target.value)}
                      placeholder="Insira um código por linha. Ex:&#10;CUPOM-ABC-123&#10;CUPOM-XYZ-456"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <Info size={12} className="mt-0.5 flex-shrink-0" />
                      Insira códigos de cupom pré-gerados no seu cardápio externo. O sistema distribuirá um por ganhador.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t pt-3">
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
