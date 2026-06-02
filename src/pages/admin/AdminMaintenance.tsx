import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Save } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import ColorPicker from "@/components/admin/ColorPicker";
import ImageUpload from "@/components/admin/ImageUpload";
import { MAINTENANCE_ROUTES } from "@/lib/maintenanceRoutes";
import MaintenancePage from "@/pages/MaintenancePage";

interface MaintenanceConfig {
  enabled_paths?: string[];
  title?: string;
  message?: string;
  image_url?: string;
  bg_color?: string;
  text_color?: string;
  expected_return?: string;
  show_whatsapp?: boolean;
  whatsapp_number?: string;
  show_instagram?: boolean;
  instagram_url?: string;
}

const defaultConfig: MaintenanceConfig = {
  enabled_paths: [],
  title: "Página em Manutenção",
  message:
    "Estamos trabalhando para deixar tudo ainda mais saboroso. Voltamos em breve!",
  image_url: "",
  bg_color: "#f7f5e2",
  text_color: "#936037",
  expected_return: "",
  show_whatsapp: false,
  whatsapp_number: "",
  show_instagram: false,
  instagram_url: "",
};

const AdminMaintenance = () => {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [config, setConfig] = useState<MaintenanceConfig>(defaultConfig);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (settings?.maintenance) {
      setConfig({ ...defaultConfig, ...settings.maintenance });
    }
  }, [settings]);

  const togglePath = (path: string) => {
    const current = config.enabled_paths || [];
    const next = current.includes(path)
      ? current.filter((p) => p !== path)
      : [...current, path];
    setConfig({ ...config, enabled_paths: next });
  };

  const handleSave = () => {
    updateSetting.mutate({ key: "maintenance", value: config });
  };

  const update = <K extends keyof MaintenanceConfig>(
    key: K,
    value: MaintenanceConfig[K]
  ) => setConfig({ ...config, [key]: value });

  if (previewOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex justify-between items-center">
          <span className="font-medium">Pré-visualização</span>
          <Button size="sm" variant="outline" onClick={() => setPreviewOpen(false)}>
            Fechar
          </Button>
        </div>
        <MaintenancePage config={config} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Modo Manutenção</h1>
          <p className="text-sm text-muted-foreground">
            Escolha quais páginas exibirão a tela de manutenção.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye size={16} className="mr-2" /> Pré-visualizar
          </Button>
          <Button onClick={handleSave} disabled={updateSetting.isPending}>
            <Save size={16} className="mr-2" /> Salvar
          </Button>
        </div>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Páginas em manutenção</h2>
        <p className="text-sm text-muted-foreground">
          Ative para exibir a tela de manutenção na página correspondente.
        </p>
        <div className="space-y-3">
          {MAINTENANCE_ROUTES.map((route) => (
            <div
              key={route.path}
              className="flex items-center justify-between p-3 border border-border rounded-md"
            >
              <div>
                <p className="font-medium">{route.label}</p>
                <p className="text-xs text-muted-foreground">{route.path}</p>
              </div>
              <Switch
                checked={config.enabled_paths?.includes(route.path) || false}
                onCheckedChange={() => togglePath(route.path)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Conteúdo</h2>

        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={config.title || ""}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Página em Manutenção"
          />
        </div>

        <div className="space-y-2">
          <Label>Mensagem</Label>
          <Textarea
            rows={4}
            value={config.message || ""}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Conte ao visitante o que está acontecendo..."
          />
        </div>

        <div className="space-y-2">
          <Label>Previsão de retorno (opcional)</Label>
          <Input
            value={config.expected_return || ""}
            onChange={(e) => update("expected_return", e.target.value)}
            placeholder="Ex: 15 de junho"
          />
        </div>

        <div className="space-y-2">
          <Label>Imagem (opcional)</Label>
          <ImageUpload
            value={config.image_url || ""}
            onChange={(url) => update("image_url", url)}
            folder="maintenance"
            aspectRatio={1}
            recommendedSize="1:1 (quadrada)"
          />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Cores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Cor de fundo"
            value={config.bg_color || ""}
            onChange={(c) => update("bg_color", c)}
          />
          <ColorPicker
            label="Cor do texto"
            value={config.text_color || ""}
            onChange={(c) => update("text_color", c)}
          />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Contato alternativo</h2>
        <p className="text-sm text-muted-foreground">
          Permita que visitantes entrem em contato enquanto o site está fora.
        </p>

        <div className="flex items-center justify-between">
          <Label htmlFor="show_wa">Mostrar botão WhatsApp</Label>
          <Switch
            id="show_wa"
            checked={config.show_whatsapp || false}
            onCheckedChange={(v) => update("show_whatsapp", v)}
          />
        </div>
        {config.show_whatsapp && (
          <Input
            value={config.whatsapp_number || ""}
            onChange={(e) => update("whatsapp_number", e.target.value)}
            placeholder="Ex: 5511999999999"
          />
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="show_ig">Mostrar botão Instagram</Label>
          <Switch
            id="show_ig"
            checked={config.show_instagram || false}
            onCheckedChange={(v) => update("show_instagram", v)}
          />
        </div>
        {config.show_instagram && (
          <Input
            value={config.instagram_url || ""}
            onChange={(e) => update("instagram_url", e.target.value)}
            placeholder="https://instagram.com/seu_perfil"
          />
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSetting.isPending} size="lg">
          <Save size={16} className="mr-2" /> Salvar configurações
        </Button>
      </div>
    </div>
  );
};

export default AdminMaintenance;
