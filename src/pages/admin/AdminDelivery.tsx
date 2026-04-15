import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Eye, EyeOff, Pencil, Tag, Gift, Megaphone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  useDeliveryPopups,
  useCreateDeliveryPopup,
  useUpdateDeliveryPopup,
  useDeleteDeliveryPopup,
  DeliveryPopup,
  PopupType,
} from "@/hooks/useDeliveryPopups";

const typeOptions: { value: PopupType; label: string; icon: React.ReactNode }[] = [
  { value: "banner", label: "Banner", icon: <Megaphone size={16} /> },
  { value: "promo", label: "Promoção", icon: <Gift size={16} /> },
  { value: "coupon", label: "Cupom", icon: <Tag size={16} /> },
  { value: "notice", label: "Aviso", icon: <Info size={16} /> },
];

const emptyPopup = {
  title: "",
  description: "",
  popup_type: "banner" as PopupType,
  image_url: "",
  coupon_code: "",
  discount_text: "",
  bg_color: "#40e0d0",
  text_color: "#ffffff",
  is_active: true,
  sort_order: 0,
};

const AdminDelivery = () => {
  const { data: popups = [], isLoading } = useDeliveryPopups(false);
  const createPopup = useCreateDeliveryPopup();
  const updatePopup = useUpdateDeliveryPopup();
  const deletePopup = useDeleteDeliveryPopup();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Partial<DeliveryPopup>>(emptyPopup);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openNew = () => {
    setEditingId(null);
    setEditingPopup({ ...emptyPopup, sort_order: popups.length });
    setDialogOpen(true);
  };

  const openEdit = (popup: DeliveryPopup) => {
    setEditingId(popup.id);
    setEditingPopup({ ...popup });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingPopup.title?.trim()) return;
    if (editingId) {
      const { id, created_at, updated_at, ...updates } = editingPopup as any;
      updatePopup.mutate({ id: editingId, updates }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createPopup.mutate(editingPopup, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const toggleActive = (popup: DeliveryPopup) => {
    updatePopup.mutate({ id: popup.id, updates: { is_active: !popup.is_active } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este popup?")) deletePopup.mutate(id);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Delivery</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie banners, promoções e cupons exibidos na página de Delivery
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={16} />
          Novo Popup
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Link do Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Os clientes serão redirecionados para:
          </p>
          <code className="text-sm bg-muted px-3 py-2 rounded-md block">
            https://instadelivery.com.br/caseirinhosaconfeitaria
          </code>
        </CardContent>
      </Card>

      {/* List */}
      {popups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Megaphone size={48} className="mx-auto mb-4 opacity-30" />
            <p>Nenhum popup criado ainda.</p>
            <p className="text-sm">Crie banners, promoções e cupons para seus clientes!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {popups.map((popup) => (
            <Card key={popup.id} className={`transition-opacity ${!popup.is_active ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {popup.image_url ? (
                    <img src={popup.image_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: popup.bg_color, color: popup.text_color }}
                    >
                      {typeOptions.find((t) => t.value === popup.popup_type)?.icon}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">
                        {typeOptions.find((t) => t.value === popup.popup_type)?.label}
                      </span>
                      {popup.coupon_code && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                          {popup.coupon_code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{popup.title}</h3>
                    {popup.description && (
                      <p className="text-sm text-muted-foreground truncate">{popup.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => toggleActive(popup)} title={popup.is_active ? "Desativar" : "Ativar"}>
                      {popup.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(popup)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(popup.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Popup" : "Novo Popup"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={editingPopup.popup_type}
                onValueChange={(v) => setEditingPopup({ ...editingPopup, popup_type: v as PopupType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Título *</Label>
              <Input
                value={editingPopup.title || ""}
                onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                placeholder="Ex: Frete grátis acima de R$50"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={editingPopup.description || ""}
                onChange={(e) => setEditingPopup({ ...editingPopup, description: e.target.value })}
                placeholder="Detalhes da promoção..."
                rows={3}
              />
            </div>

            <div>
              <Label>Imagem (Banner)</Label>
              <ImageUpload
                value={editingPopup.image_url || ""}
                onChange={(url) => setEditingPopup({ ...editingPopup, image_url: url })}
                folder="delivery-popups"
                aspectRatio={16 / 9}
                recommendedSize="1200×675px"
              />
            </div>

            {(editingPopup.popup_type === "coupon" || editingPopup.popup_type === "promo") && (
              <>
                <div>
                  <Label>Código do Cupom</Label>
                  <Input
                    value={editingPopup.coupon_code || ""}
                    onChange={(e) => setEditingPopup({ ...editingPopup, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="Ex: PROMO10"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>Texto do Desconto</Label>
                  <Input
                    value={editingPopup.discount_text || ""}
                    onChange={(e) => setEditingPopup({ ...editingPopup, discount_text: e.target.value })}
                    placeholder="Ex: 10% de desconto"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cor de fundo</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingPopup.bg_color || "#40e0d0"}
                    onChange={(e) => setEditingPopup({ ...editingPopup, bg_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={editingPopup.bg_color || ""}
                    onChange={(e) => setEditingPopup({ ...editingPopup, bg_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Cor do texto</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingPopup.text_color || "#ffffff"}
                    onChange={(e) => setEditingPopup({ ...editingPopup, text_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={editingPopup.text_color || ""}
                    onChange={(e) => setEditingPopup({ ...editingPopup, text_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editingPopup.is_active ?? true}
                onCheckedChange={(v) => setEditingPopup({ ...editingPopup, is_active: v })}
              />
              <Label>Ativo</Label>
            </div>

            <Button onClick={handleSave} className="w-full" disabled={createPopup.isPending || updatePopup.isPending}>
              {createPopup.isPending || updatePopup.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDelivery;
