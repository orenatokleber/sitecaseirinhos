import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ColorPicker from "@/components/admin/ColorPicker";
import ProfileSection from "@/components/admin/ProfileSection";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Save, Plus, Trash2, GripVertical, Instagram, Cake } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EncomendaCard {
  image_url: string;
  title: string;
  description: string;
}
interface EncomendasSection {
  is_active: boolean;
  script: string;
  title: string;
  subtitle: string;
  cards: EncomendaCard[];
}
const defaultEncomendas: EncomendasSection = {
  is_active: true,
  script: "Sob medida",
  title: "Encomendas Especiais",
  subtitle: "Bolos e doces personalizados para tornar seu evento inesquecível",
  cards: [
    { image_url: "", title: "Bolos de Casamento", description: "Criações exclusivas e elegantes para o dia mais especial da sua vida." },
    { image_url: "", title: "Aniversários & Eventos", description: "Bolos temáticos, mesas de doces e sobremesas para celebrações únicas." },
  ],
};

interface MenuItem {
  label: string;
  to: string;
}

const defaultMenuItems: MenuItem[] = [
  { to: "/", label: "Home" },
  { to: "/nossa-historia", label: "Nossa História" },
  { to: "/cardapio", label: "Cardápio" },
  { to: "/encomendas", label: "Encomendas" },
  { to: "/contato", label: "Contato" },
];

const AdminConfig = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    instagram: "",
    whatsapp: ""
  });

  const [hours, setHours] = useState({
    weekdays: "",
    delivery: ""
  });

  const [themeColors, setThemeColors] = useState({
    primary: "",
    accent: "",
    gold: "",
    background: "",
    foreground: "",
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [instagramPosts, setInstagramPosts] = useState<string[]>([]);
  const [encomendas, setEncomendas] = useState<EncomendasSection>(defaultEncomendas);

  useEffect(() => {
    if (settings?.contact) {
      setContact(settings.contact);
    }
    if (settings?.hours) {
      setHours(settings.hours);
    }
    if (settings?.theme_colors) {
      setThemeColors(prev => ({ ...prev, ...settings.theme_colors }));
    }
    if (settings?.menu_items) {
      setMenuItems(settings.menu_items as unknown as MenuItem[]);
    }
    if (settings?.instagram_posts) {
      setInstagramPosts(settings.instagram_posts as unknown as string[]);
    }
    if (settings?.encomendas_section) {
      setEncomendas({ ...defaultEncomendas, ...(settings.encomendas_section as any) });
    }
  }, [settings]);

  const handleSaveEncomendas = () => {
    updateSetting.mutate({ key: 'encomendas_section', value: encomendas as any });
  };
  const updateEncomendaCard = (idx: number, field: keyof EncomendaCard, value: string) => {
    setEncomendas({
      ...encomendas,
      cards: encomendas.cards.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    });
  };
  const addEncomendaCard = () => {
    setEncomendas({ ...encomendas, cards: [...encomendas.cards, { image_url: "", title: "", description: "" }] });
  };
  const removeEncomendaCard = (idx: number) => {
    setEncomendas({ ...encomendas, cards: encomendas.cards.filter((_, i) => i !== idx) });
  };

  const handleSaveInstagramPosts = () => {
    const cleaned = instagramPosts.map((u) => u.trim()).filter(Boolean);
    updateSetting.mutate({ key: 'instagram_posts', value: cleaned as any });
  };

  const addInstagramPost = () => setInstagramPosts([...instagramPosts, ""]);
  const removeInstagramPost = (i: number) =>
    setInstagramPosts(instagramPosts.filter((_, idx) => idx !== i));
  const updateInstagramPost = (i: number, v: string) =>
    setInstagramPosts(instagramPosts.map((u, idx) => (idx === i ? v : u)));

  const handleSaveContact = () => {
    updateSetting.mutate({ key: 'contact', value: contact });
  };

  const handleSaveHours = () => {
    updateSetting.mutate({ key: 'hours', value: hours });
  };

  const handleSaveThemeColors = () => {
    updateSetting.mutate({ key: 'theme_colors', value: themeColors });
  };

  const handleSaveMenu = () => {
    updateSetting.mutate({ key: 'menu_items', value: menuItems as any });
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { label: "", to: "/" }]);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    setMenuItems(menuItems.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const moveMenuItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= menuItems.length) return;
    const items = [...menuItems];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    setMenuItems(items);
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
        <h1 className="font-heading text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Atualize informações de contato, horários, cores e menu</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile */}
        <ProfileSection />

        {/* Encomendas Especiais Section */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cake className="h-5 w-5 text-accent" />
                  Seção "Encomendas Especiais"
                </CardTitle>
                <CardDescription>
                  Edite os textos, imagens e visibilidade da seção exibida ao final do Cardápio.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={encomendas.is_active}
                  onCheckedChange={(v) => setEncomendas({ ...encomendas, is_active: v })}
                />
                <Label className="text-xs text-muted-foreground">
                  {encomendas.is_active ? "Ativa" : "Oculta"}
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Script (acima do título)</Label>
                <Input
                  value={encomendas.script}
                  onChange={(e) => setEncomendas({ ...encomendas, script: e.target.value })}
                  placeholder="Sob medida"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Título</Label>
                <Input
                  value={encomendas.title}
                  onChange={(e) => setEncomendas({ ...encomendas, title: e.target.value })}
                  placeholder="Encomendas Especiais"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea
                rows={2}
                value={encomendas.subtitle}
                onChange={(e) => setEncomendas({ ...encomendas, subtitle: e.target.value })}
                placeholder="Bolos e doces personalizados..."
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-semibold">Cards de destaque</Label>
              {encomendas.cards.map((card, idx) => (
                <div key={idx} className="border border-border rounded-md p-3 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Card {idx + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-7 w-7"
                      onClick={() => removeEncomendaCard(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ImageUpload
                    value={card.image_url}
                    onChange={(url) => updateEncomendaCard(idx, "image_url", url)}
                    folder="encomendas"
                    aspectRatio={16 / 9}
                    recommendedSize="16:9 (ex: 1280x720)"
                  />
                  <Input
                    value={card.title}
                    onChange={(e) => updateEncomendaCard(idx, "title", e.target.value)}
                    placeholder="Título do card"
                  />
                  <Textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => updateEncomendaCard(idx, "description", e.target.value)}
                    placeholder="Descrição curta"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addEncomendaCard}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Card
              </Button>
            </div>

            <Button onClick={handleSaveEncomendas} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Seção Encomendas
            </Button>
          </CardContent>
        </Card>

        {/* Menu Editor */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Menu do Site</CardTitle>
            <CardDescription>Adicione, remova e reordene os itens do menu de navegação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted/30">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveMenuItem(index, -1)}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMenuItem(index, 1)}
                    disabled={index === menuItems.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                    placeholder="Nome do item"
                    className="text-sm"
                  />
                  <Input
                    value={item.to}
                    onChange={(e) => updateMenuItem(index, 'to', e.target.value)}
                    placeholder="/caminho"
                    className="text-sm"
                  />
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeMenuItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addMenuItem}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
            <div>
              <Button onClick={handleSaveMenu} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Menu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Colors */}
        <Card>
          <CardHeader>
            <CardTitle>🎨 Cores do Tema</CardTitle>
            <CardDescription>Personalize as cores globais do site. Deixe em branco para usar as cores padrão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPicker
                label="Cor Principal"
                value={themeColors.primary}
                onChange={(c) => setThemeColors({ ...themeColors, primary: c })}
                description="Usada em botões, fundos de destaque"
              />
              <ColorPicker
                label="Cor de Destaque"
                value={themeColors.accent}
                onChange={(c) => setThemeColors({ ...themeColors, accent: c })}
                description="Botões CTA, links de ação"
              />
              <ColorPicker
                label="Cor Dourada"
                value={themeColors.gold}
                onChange={(c) => setThemeColors({ ...themeColors, gold: c })}
                description="Títulos em script, estrelas"
              />
              <ColorPicker
                label="Cor de Fundo"
                value={themeColors.background}
                onChange={(c) => setThemeColors({ ...themeColors, background: c })}
                description="Fundo geral do site"
              />
              <ColorPicker
                label="Cor do Texto"
                value={themeColors.foreground}
                onChange={(c) => setThemeColors({ ...themeColors, foreground: c })}
                description="Cor padrão dos textos"
              />
            </div>
            <Button onClick={handleSaveThemeColors} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Cores do Tema
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>WhatsApp, email, endereço e redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <Input
                  id="whatsapp"
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="5511999999999"
                />
                <p className="text-xs text-muted-foreground">Apenas números, com código do país</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="5511999999999"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="contato@caseirinhos.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                placeholder="Rua Exemplo, 123 - Cidade/UF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={contact.instagram}
                onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                placeholder="https://instagram.com/caseirinhos"
              />
            </div>

            <Button onClick={handleSaveContact} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Contato
            </Button>
          </CardContent>
        </Card>

        {/* Instagram Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-accent" />
              Posts do Instagram (Cardápio)
            </CardTitle>
            <CardDescription>
              Cole as URLs dos posts que aparecerão na seção Instagram do Cardápio. Ex.: <code className="text-xs">https://www.instagram.com/p/ABC123/</code>. Exibe até 6 posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {instagramPosts.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Nenhum post adicionado. O perfil será exibido como link.
              </p>
            )}
            {instagramPosts.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateInstagramPost(index, e.target.value)}
                  placeholder="https://www.instagram.com/p/SHORTCODE/"
                  className="text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeInstagramPost(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addInstagramPost} disabled={instagramPosts.length >= 6}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Post
              </Button>
              <Button onClick={handleSaveInstagramPosts} disabled={updateSetting.isPending} size="sm">
                {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Posts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
            <CardDescription>Informe os horários de atendimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays">Horário Geral</Label>
              <Input
                id="weekdays"
                value={hours.weekdays}
                onChange={(e) => setHours({ ...hours, weekdays: e.target.value })}
                placeholder="Ter a Sáb: 11h – 18h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery">Horário de Delivery</Label>
              <Input
                id="delivery"
                value={hours.delivery}
                onChange={(e) => setHours({ ...hours, delivery: e.target.value })}
                placeholder="Delivery a partir das 13h"
              />
            </div>

            <Button onClick={handleSaveHours} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Horários
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfig;
