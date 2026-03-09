import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/admin/ColorPicker";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";

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
  }, [settings]);

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

        {/* Hours */}
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
