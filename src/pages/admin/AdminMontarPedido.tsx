import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Plus, Trash2, Settings2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export type LojaConfig = {
  activeCategories: {
    bolo: boolean;
    doces: boolean;
    salgados: boolean;
    kit_festa: boolean;
    pasta_americana: boolean;
    presentear: boolean;
  };
  customTitles: {
    bolo: string;
    doces: string;
    salgados: string;
    kit_festa: string;
    pasta_americana: string;
    presentear: string;
  };
  delivery: {
    acceptsDelivery: boolean;
    deliveryFee: string;
    acceptsPickup: boolean;
  };
  whatsappMsg: {
    greeting: string;
    signoff: string;
  };
  customCategories: {
    id: string;
    title: string;
    subtitle: string;
    isActive: boolean;
  }[];
};

const DEFAULT_LOJA_CONFIG: LojaConfig = {
  activeCategories: {
    bolo: true,
    doces: true,
    salgados: true,
    kit_festa: true,
    pasta_americana: true,
    presentear: true,
  },
  customTitles: {
    bolo: "~100g/pessoa",
    doces: "3-4/pessoa",
    salgados: "10-15/pessoa",
    kit_festa: "",
    pasta_americana: "",
    presentear: "",
  },
  delivery: {
    acceptsDelivery: true,
    deliveryFee: "0",
    acceptsPickup: true,
  },
  whatsappMsg: {
    greeting: "Olá {nome}! Aqui é {loja}",
    signoff: "Qualquer ajuste é só me avisar. Obrigada!",
  },
  customCategories: [],
};

const AdminMontarPedido = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(DEFAULT_LOJA_CONFIG);
  const [contact, setContact] = useState({
    name: "Minha Loja", // Pseudo field se não houver
    whatsapp: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (settings?.loja_config) {
      // Merge with default to avoid undefined issues with new fields
      setLojaConfig((prev) => ({
        ...DEFAULT_LOJA_CONFIG,
        ...(settings.loja_config as any),
        activeCategories: { ...DEFAULT_LOJA_CONFIG.activeCategories, ...(settings.loja_config as any).activeCategories },
        customTitles: { ...DEFAULT_LOJA_CONFIG.customTitles, ...(settings.loja_config as any).customTitles },
        delivery: { ...DEFAULT_LOJA_CONFIG.delivery, ...(settings.loja_config as any).delivery },
        whatsappMsg: { ...DEFAULT_LOJA_CONFIG.whatsappMsg, ...(settings.loja_config as any).whatsappMsg },
        customCategories: (settings.loja_config as any).customCategories || [],
      }));
    }
    if (settings?.contact) {
      setContact((prev) => ({
        ...prev,
        ...settings.contact
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    // We update two different setting keys
    await updateSetting.mutateAsync({ key: 'loja_config', value: lojaConfig as any });
    await updateSetting.mutateAsync({ key: 'contact', value: { ...settings?.contact, ...contact } as any });
    toast.success("Configurações da loja salvas com sucesso!");
  };

  const addCustomCategory = () => {
    setLojaConfig({
      ...lojaConfig,
      customCategories: [
        ...lojaConfig.customCategories,
        { id: `custom_${Date.now()}`, title: "Nova Categoria", subtitle: "", isActive: true }
      ]
    });
  };

  const updateCustomCat = (idx: number, field: string, value: string | boolean) => {
    const cats = [...lojaConfig.customCategories];
    cats[idx] = { ...cats[idx], [field]: value };
    setLojaConfig({ ...lojaConfig, customCategories: cats });
  };

  const removeCustomCat = (idx: number) => {
    setLojaConfig({
      ...lojaConfig,
      customCategories: lojaConfig.customCategories.filter((_, i) => i !== idx)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#8c3a40]" />
      </div>
    );
  }

  const baseCategories = [
    { id: "bolo", label: "Bolos personalizados", desc: "Temas, sabores, toppers" },
    { id: "doces", label: "Doces e docinhos", desc: "Brigadeiros, festa" },
    { id: "salgados", label: "Salgados", desc: "Por encomenda" },
    { id: "kit_festa", label: "Kit Festa", desc: "Kits prontos" },
    { id: "pasta_americana", label: "Pasta Americana", desc: "Bolos artísticos" },
    { id: "presentear", label: "Para Presentear", desc: "Lembrancinhas, cestas" },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Configurações da Loja</h1>
        <p className="text-muted-foreground mt-1">Configure o visual público da página "Montar Pedido".</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        
        {/* Sua loja pública */}
        <Card className="border-t-4 border-t-[#8c3a40]">
          <CardHeader>
            <CardTitle>Sua loja pública</CardTitle>
            <CardDescription>Ative ou desative as categorias principais que aparecerão na página.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {baseCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-xl border border-border p-4 bg-[#fcf8f8]/50">
                <div className="flex items-center gap-3">
                  <div className="bg-[#8c3a40]/10 p-2 rounded-lg">
                    <Settings2 size={20} className="text-[#8c3a40]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={lojaConfig.activeCategories[cat.id as keyof typeof lojaConfig.activeCategories]}
                  onCheckedChange={(val) => 
                    setLojaConfig({
                      ...lojaConfig, 
                      activeCategories: { ...lojaConfig.activeCategories, [cat.id]: val }
                    })
                  }
                  className="data-[state=checked]:bg-[#8c3a40]"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Frase de referência */}
        <Card>
          <CardHeader>
            <CardTitle>Frase de referência das seções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#eaf4fe] text-[#2c73bd] p-3 rounded-lg text-xs flex gap-2 items-start">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <p>O textinho que aparece abaixo de cada seção na sua loja (ex.: ~100g/pessoa). Deixe em branco para ocultar.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {baseCategories.map((cat) => (
                <div key={`title-${cat.id}`} className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">{cat.label}</Label>
                  <Input
                    value={lojaConfig.customTitles[cat.id as keyof typeof lojaConfig.customTitles]}
                    onChange={(e) => 
                      setLojaConfig({
                        ...lojaConfig,
                        customTitles: { ...lojaConfig.customTitles, [cat.id]: e.target.value }
                      })
                    }
                    placeholder="Ex: ~100g/pessoa"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Adicionais das seções */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionais das seções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#eaf4fe] text-[#2c73bd] p-3 rounded-lg text-xs flex gap-2 items-start mb-2">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <p>Os adicionais (como topo de bolo, bombons extras) são criados centralizados no Painel do Cardápio para organizar melhor os preços.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-white">
                <div>
                  <p className="font-bold text-sm">Adicionais do Bolo</p>
                  <p className="text-xs text-muted-foreground">Gerencie topos, recheios extras, etc.</p>
                </div>
                <Link to="/admin/cardapio?tab=addons">
                  <Button variant="outline" size="sm" className="text-[#8c3a40]">
                    <Plus size={14} className="mr-1" /> Gerenciar
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil & Entregas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Nome da Loja</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Seu nome ou ateliê"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-muted-foreground">WhatsApp (com DDD)</Label>
                <Input
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="5511999999999"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-muted-foreground">E-mail</Label>
                <Input
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="loja@email.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Endereço do Ateliê</Label>
                <Input
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  placeholder="Rua, número, bairro"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entregas e margem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-[#fcf8f8]/50">
                <div>
                  <p className="font-bold text-sm">Aceita entregas</p>
                  <p className="text-xs text-muted-foreground">Clientes podem solicitar entrega</p>
                </div>
                <Switch
                  checked={lojaConfig.delivery.acceptsDelivery}
                  onCheckedChange={(val) => 
                    setLojaConfig({
                      ...lojaConfig,
                      delivery: { ...lojaConfig.delivery, acceptsDelivery: val }
                    })
                  }
                  className="data-[state=checked]:bg-[#8c3a40]"
                />
              </div>
              
              {lojaConfig.delivery.acceptsDelivery && (
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Taxa de Entrega (R$)</Label>
                  <Input
                    value={lojaConfig.delivery.deliveryFee}
                    onChange={(e) => 
                      setLojaConfig({
                        ...lojaConfig,
                        delivery: { ...lojaConfig.delivery, deliveryFee: e.target.value }
                      })
                    }
                    placeholder="Deixe 0 para combinar via WhatsApp"
                  />
                  <p className="text-xs text-muted-foreground">Se 0, aparecerá "A combinar".</p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-[#fcf8f8]/50 mt-4">
                <div>
                  <p className="font-bold text-sm">Aceita retirada no local</p>
                  <p className="text-xs text-muted-foreground">Clientes podem buscar no ateliê</p>
                </div>
                <Switch
                  checked={lojaConfig.delivery.acceptsPickup}
                  onCheckedChange={(val) => 
                    setLojaConfig({
                      ...lojaConfig,
                      delivery: { ...lojaConfig.delivery, acceptsPickup: val }
                    })
                  }
                  className="data-[state=checked]:bg-[#8c3a40]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categorias Personalizadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Categorias personalizadas</CardTitle>
              <CardDescription>Crie categorias livres que serão enviadas por WhatsApp.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addCustomCategory}>
              <Plus size={14} className="mr-1" /> Categoria
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-[#eaf4fe] text-[#2c73bd] p-3 rounded-lg text-xs flex gap-2 items-start mb-2">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <p>Crie categorias próprias para sua loja. Elas aparecem como opção na loja, ao lado de Bolo/Doces.</p>
            </div>

            {lojaConfig.customCategories.length === 0 ? (
               <div className="border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                 Nenhuma categoria personalizada. Toque em "Categoria" para criar.
               </div>
            ) : (
              <div className="space-y-3">
                {lojaConfig.customCategories.map((cat, idx) => (
                  <div key={cat.id} className="border border-border p-4 rounded-xl flex gap-3 relative bg-white">
                    <button 
                      onClick={() => removeCustomCat(idx)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex-1 space-y-3">
                       <div className="flex items-center gap-3">
                         <Switch 
                           checked={cat.isActive}
                           onCheckedChange={(val) => updateCustomCat(idx, "isActive", val)}
                           className="data-[state=checked]:bg-[#8c3a40]"
                         />
                         <span className="text-xs font-bold">{cat.isActive ? "Visível na loja" : "Oculta"}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1.5">
                           <Label className="text-xs">Título</Label>
                           <Input 
                             value={cat.title} 
                             onChange={(e) => updateCustomCat(idx, "title", e.target.value)} 
                           />
                         </div>
                         <div className="space-y-1.5">
                           <Label className="text-xs">Referência (Ex: ~100g/pessoa)</Label>
                           <Input 
                             value={cat.subtitle} 
                             onChange={(e) => updateCustomCat(idx, "subtitle", e.target.value)} 
                           />
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mensagem do WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagem do WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-[#eaf4fe] text-[#2c73bd] p-3 rounded-lg text-xs flex gap-2 items-start mb-2">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <p>Personalize a saudação e a despedida. O <strong>resumo do pedido</strong> (itens, data e valor) entra automaticamente no meio e não é editável.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Saudação</Label>
              <Textarea
                rows={2}
                value={lojaConfig.whatsappMsg.greeting}
                onChange={(e) => 
                  setLojaConfig({
                    ...lojaConfig,
                    whatsappMsg: { ...lojaConfig.whatsappMsg, greeting: e.target.value }
                  })
                }
                placeholder="Olá {nome}! Aqui é {loja}"
              />
              <p className="text-[10px] text-muted-foreground">Use {'{nome}'} para o nome do cliente e {'{loja}'} para o nome do seu ateliê.</p>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground italic my-2">
              ... aqui entra o resumo do pedido automaticamente (itens, data, valor) ...
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Despedida</Label>
              <Textarea
                rows={2}
                value={lojaConfig.whatsappMsg.signoff}
                onChange={(e) => 
                  setLojaConfig({
                    ...lojaConfig,
                    whatsappMsg: { ...lojaConfig.whatsappMsg, signoff: e.target.value }
                  })
                }
                placeholder="Qualquer ajuste é só me avisar. Obrigada!"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Footer bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 flex justify-center">
         <div className="w-full max-w-3xl flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">Modificações salvas na nuvem</span>
            <Button 
              onClick={handleSave} 
              disabled={updateSetting.isPending}
              className="w-full sm:w-auto bg-[#8c3a40] hover:bg-[#722f34] text-white"
            >
              {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar configurações
            </Button>
         </div>
      </div>
    </div>
  );
};

export default AdminMontarPedido;
