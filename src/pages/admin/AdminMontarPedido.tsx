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
  customNames: {
    bolo: string;
    doces: string;
    salgados: string;
    kit_festa: string;
    pasta_americana: string;
    presentear: string;
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
  // NEW OPTIONS
  salgadosOptions: { id: string, name: string }[];
  kitFestaOptions: { id: string, name: string, price: number | null, desc: string }[];
  pastaAmericanaOptions: { id: string, name: string, price: number | null, desc: string }[];
  presentearOptions: { id: string, name: string, price: number | null, desc: string }[];
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
  customNames: {
    bolo: "Bolo",
    doces: "Doces",
    salgados: "Salgados",
    kit_festa: "Kit Festa",
    pasta_americana: "Pasta Americana",
    presentear: "Para Presentear",
  },
  customTitles: {
    bolo: "~100g/pessoa",
    doces: "3-4/pessoa",
    salgados: "10-15/pessoa",
    kit_festa: "pré-elaborado",
    pasta_americana: "personalizado",
    presentear: "personalizado",
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
  salgadosOptions: [
    { id: "coxinha", name: "Coxinha" },
    { id: "bolinha_queijo", name: "Bolinha de Queijo" },
    { id: "risolis", name: "Risólis" },
    { id: "empadinha", name: "Empadinha" },
  ],
  kitFestaOptions: [
    { id: "kit1", name: "Kit Festa I", price: 199, desc: "Serve 10 Pessoas" },
    { id: "kit2", name: "Kit Festa II", price: 349, desc: "Serve 20 Pessoas" },
    { id: "kit3", name: "Kit Festa III", price: 449, desc: "Serve 30 Pessoas" },
  ],
  pastaAmericanaOptions: [
    { id: "pa_kit1", name: "Kit 1", price: 340, desc: "Inclui: 1x Bolo Bombom, 4x Pirulitos, 4x Cupcakes 3D, 8x Mini Trufas Planas" },
    { id: "pa_kit2", name: "Kit 2", price: 440, desc: "Inclui: 1x Bolo Bombom 3D, 6x Pirulitos, 4x Cupcakes, 6x Bolo Bombom Pequeno, 10x Mini Trufas Planas, 6x Popscicle" },
    { id: "pa_kit3", name: "Kit 3", price: 560, desc: "Inclui: 2x Bolo Bombom 3D, 6x Pirulitos, 4x Cupcakes, 8x Bolo Bombom Pequeno, 15x Mini Trufas Planas, 6x Popscicle" },
  ],
  presentearOptions: [
    { id: "festa_caixa", name: "Festa na Caixa", price: 270, desc: "1 kg de Bolo + 10 Doces + 50 Salgados + 1 Xícara Personalizada" },
    { id: "caixa_cenario", name: "Caixa Cenário", price: 170, desc: "1 kg de Bolo + 20 Doces" },
    { id: "bolo_xicara", name: "Bolo na Xícara", price: null, desc: "170g de Bolo + Xícara" },
    { id: "bento_cake", name: "Bento Cake", price: 70, desc: "400g de Bolo + 4 Doces" },
  ]
};

const AdminMontarPedido = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(DEFAULT_LOJA_CONFIG);
  const [contact, setContact] = useState({
    name: "Minha Loja", 
    whatsapp: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (settings?.loja_config) {
      const dbConfig = settings.loja_config as any;
      setLojaConfig((prev) => ({
        ...DEFAULT_LOJA_CONFIG,
        ...dbConfig,
        activeCategories: { ...DEFAULT_LOJA_CONFIG.activeCategories, ...dbConfig.activeCategories },
        customNames: { ...DEFAULT_LOJA_CONFIG.customNames, ...dbConfig.customNames },
        customTitles: { ...DEFAULT_LOJA_CONFIG.customTitles, ...dbConfig.customTitles },
        delivery: { ...DEFAULT_LOJA_CONFIG.delivery, ...dbConfig.delivery },
        whatsappMsg: { ...DEFAULT_LOJA_CONFIG.whatsappMsg, ...dbConfig.whatsappMsg },
        customCategories: dbConfig.customCategories || [],
        salgadosOptions: dbConfig.salgadosOptions || DEFAULT_LOJA_CONFIG.salgadosOptions,
        kitFestaOptions: dbConfig.kitFestaOptions || DEFAULT_LOJA_CONFIG.kitFestaOptions,
        pastaAmericanaOptions: dbConfig.pastaAmericanaOptions || DEFAULT_LOJA_CONFIG.pastaAmericanaOptions,
        presentearOptions: dbConfig.presentearOptions || DEFAULT_LOJA_CONFIG.presentearOptions,
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
    await updateSetting.mutateAsync({ key: 'loja_config', value: lojaConfig as any });
    await updateSetting.mutateAsync({ key: 'contact', value: { ...settings?.contact, ...contact } as any });
    toast.success("Configurações da loja salvas com sucesso!");
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
              <p>O textinho que aparece ao lado do título da categoria na sua loja (ex.: ~100g/pessoa). Deixe em branco para ocultar.</p>
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

        {/* Nomes das categorias */}
        <Card>
          <CardHeader>
            <CardTitle>Nomes das categorias</CardTitle>
            <CardDescription>Renomeie como cada categoria aparece na página "Montar Pedido".</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {baseCategories.map((cat) => (
                <div key={`name-${cat.id}`} className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">{cat.label}</Label>
                  <Input
                    value={lojaConfig.customNames?.[cat.id as keyof typeof lojaConfig.customNames] ?? ""}
                    onChange={(e) =>
                      setLojaConfig({
                        ...lojaConfig,
                        customNames: { ...lojaConfig.customNames, [cat.id]: e.target.value },
                      })
                    }
                    placeholder={cat.label}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categorias personalizadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Categorias personalizadas</CardTitle>
              <CardDescription>Categorias livres, onde o cliente descreve o pedido (valor a consultar).</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLojaConfig({
              ...lojaConfig,
              customCategories: [...(lojaConfig.customCategories || []), { id: `c_${Date.now()}`, title: "Nova categoria", subtitle: "", isActive: true }]
            })}>
              <Plus size={14} className="mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(lojaConfig.customCategories || []).length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhuma categoria personalizada criada.</p>
            )}
            {(lojaConfig.customCategories || []).map((cat, idx) => (
              <div key={cat.id} className="border border-border p-4 rounded-xl bg-white space-y-3 relative">
                <button
                  onClick={() => setLojaConfig({ ...lojaConfig, customCategories: lojaConfig.customCategories.filter((_, i) => i !== idx) })}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome</Label>
                    <Input value={cat.title} onChange={(e) => {
                      const arr = [...lojaConfig.customCategories];
                      arr[idx] = { ...arr[idx], title: e.target.value };
                      setLojaConfig({ ...lojaConfig, customCategories: arr });
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Frase de referência</Label>
                    <Input value={cat.subtitle} onChange={(e) => {
                      const arr = [...lojaConfig.customCategories];
                      arr[idx] = { ...arr[idx], subtitle: e.target.value };
                      setLojaConfig({ ...lojaConfig, customCategories: arr });
                    }} placeholder="Ex: personalizado" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Ativa na página</span>
                  <Switch
                    checked={cat.isActive}
                    onCheckedChange={(val) => {
                      const arr = [...lojaConfig.customCategories];
                      arr[idx] = { ...arr[idx], isActive: val };
                      setLojaConfig({ ...lojaConfig, customCategories: arr });
                    }}
                    className="data-[state=checked]:bg-[#8c3a40]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* --- OPÇÕES DE SALGADOS --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tipos de Salgados</CardTitle>
              <CardDescription>Nomes e pacotes (quantidade e valor), como nos docinhos.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLojaConfig({
              ...lojaConfig,
              salgadosOptions: [...lojaConfig.salgadosOptions, { id: `s_${Date.now()}`, name: "Novo Salgado", packages: [] }]
            })}>
              <Plus size={14} className="mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lojaConfig.salgadosOptions.map((opt, idx) => (
              <div key={opt.id} className="border border-border p-4 rounded-xl space-y-3 bg-white">
                <div className="flex gap-2 items-center">
                  <Input
                    value={opt.name}
                    onChange={(e) => {
                      const newArr = [...lojaConfig.salgadosOptions];
                      newArr[idx] = { ...newArr[idx], name: e.target.value };
                      setLojaConfig({ ...lojaConfig, salgadosOptions: newArr });
                    }}
                    placeholder="Nome do salgado"
                  />
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 shrink-0" onClick={() => {
                    setLojaConfig({ ...lojaConfig, salgadosOptions: lojaConfig.salgadosOptions.filter((_, i) => i !== idx) });
                  }}>
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Pacotes (quantidade × valor)</Label>
                  {(opt.packages || []).map((pkg, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Qtd."
                        value={pkg.quantity ?? ""}
                        onChange={(e) => {
                          const newArr = [...lojaConfig.salgadosOptions];
                          const pkgs = [...(newArr[idx].packages || [])];
                          pkgs[pIdx] = { ...pkgs[pIdx], quantity: Number(e.target.value) || 0 };
                          newArr[idx] = { ...newArr[idx], packages: pkgs };
                          setLojaConfig({ ...lojaConfig, salgadosOptions: newArr });
                        }}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Preço (R$)"
                        value={pkg.price ?? ""}
                        onChange={(e) => {
                          const newArr = [...lojaConfig.salgadosOptions];
                          const pkgs = [...(newArr[idx].packages || [])];
                          pkgs[pIdx] = { ...pkgs[pIdx], price: e.target.value === "" ? null : Number(e.target.value) };
                          newArr[idx] = { ...newArr[idx], packages: pkgs };
                          setLojaConfig({ ...lojaConfig, salgadosOptions: newArr });
                        }}
                      />
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 shrink-0" onClick={() => {
                        const newArr = [...lojaConfig.salgadosOptions];
                        newArr[idx] = { ...newArr[idx], packages: (newArr[idx].packages || []).filter((_, i) => i !== pIdx) };
                        setLojaConfig({ ...lojaConfig, salgadosOptions: newArr });
                      }}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    const newArr = [...lojaConfig.salgadosOptions];
                    newArr[idx] = { ...newArr[idx], packages: [...(newArr[idx].packages || []), { quantity: 50, price: 0 }] };
                    setLojaConfig({ ...lojaConfig, salgadosOptions: newArr });
                  }}>
                    <Plus size={14} className="mr-1" /> Adicionar pacote
                  </Button>
                  <p className="text-[10px] text-muted-foreground">Deixe o preço vazio para exibir "A consultar".</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* --- DOCINHOS (nomes e valores) --- */}
        <DocinhosEditor />


        {/* --- OPÇÕES DE KIT FESTA --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Opções de Kit Festa</CardTitle>
              <CardDescription>Opções fixas com preços ou sob consulta.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLojaConfig({
              ...lojaConfig,
              kitFestaOptions: [...lojaConfig.kitFestaOptions, { id: `k_${Date.now()}`, name: "Novo Kit", price: 0, desc: "" }]
            })}>
              <Plus size={14} className="mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lojaConfig.kitFestaOptions.map((opt, idx) => (
              <div key={opt.id} className="border border-border p-4 rounded-xl flex flex-col gap-3 relative bg-white">
                <button 
                  onClick={() => setLojaConfig({ ...lojaConfig, kitFestaOptions: lojaConfig.kitFestaOptions.filter((_, i) => i !== idx) })}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3 pr-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome</Label>
                    <Input value={opt.name} onChange={(e) => {
                      const newArr = [...lojaConfig.kitFestaOptions];
                      newArr[idx].name = e.target.value;
                      setLojaConfig({ ...lojaConfig, kitFestaOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Preço (deixe vazio p/ consultar)</Label>
                    <Input type="number" value={opt.price ?? ""} onChange={(e) => {
                      const val = e.target.value;
                      const newArr = [...lojaConfig.kitFestaOptions];
                      newArr[idx].price = val === "" ? null : Number(val);
                      setLojaConfig({ ...lojaConfig, kitFestaOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs">Descrição / Rendimento</Label>
                    <Input value={opt.desc} onChange={(e) => {
                      const newArr = [...lojaConfig.kitFestaOptions];
                      newArr[idx].desc = e.target.value;
                      setLojaConfig({ ...lojaConfig, kitFestaOptions: newArr });
                    }} placeholder="Ex: Serve 10 Pessoas" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* --- OPÇÕES DE PASTA AMERICANA --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Opções de Pasta Americana</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLojaConfig({
              ...lojaConfig,
              pastaAmericanaOptions: [...lojaConfig.pastaAmericanaOptions, { id: `pa_${Date.now()}`, name: "Novo Kit", price: 0, desc: "" }]
            })}>
              <Plus size={14} className="mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lojaConfig.pastaAmericanaOptions.map((opt, idx) => (
              <div key={opt.id} className="border border-border p-4 rounded-xl flex flex-col gap-3 relative bg-white">
                <button 
                  onClick={() => setLojaConfig({ ...lojaConfig, pastaAmericanaOptions: lojaConfig.pastaAmericanaOptions.filter((_, i) => i !== idx) })}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3 pr-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome</Label>
                    <Input value={opt.name} onChange={(e) => {
                      const newArr = [...lojaConfig.pastaAmericanaOptions];
                      newArr[idx].name = e.target.value;
                      setLojaConfig({ ...lojaConfig, pastaAmericanaOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Preço</Label>
                    <Input type="number" value={opt.price ?? ""} onChange={(e) => {
                      const val = e.target.value;
                      const newArr = [...lojaConfig.pastaAmericanaOptions];
                      newArr[idx].price = val === "" ? null : Number(val);
                      setLojaConfig({ ...lojaConfig, pastaAmericanaOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs">Itens Inclusos</Label>
                    <Textarea rows={2} value={opt.desc} onChange={(e) => {
                      const newArr = [...lojaConfig.pastaAmericanaOptions];
                      newArr[idx].desc = e.target.value;
                      setLojaConfig({ ...lojaConfig, pastaAmericanaOptions: newArr });
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* --- OPÇÕES DE PRESENTEAR --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Para Presentear</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLojaConfig({
              ...lojaConfig,
              presentearOptions: [...lojaConfig.presentearOptions, { id: `pr_${Date.now()}`, name: "Novo Item", price: 0, desc: "" }]
            })}>
              <Plus size={14} className="mr-1" /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lojaConfig.presentearOptions.map((opt, idx) => (
              <div key={opt.id} className="border border-border p-4 rounded-xl flex flex-col gap-3 relative bg-white">
                <button 
                  onClick={() => setLojaConfig({ ...lojaConfig, presentearOptions: lojaConfig.presentearOptions.filter((_, i) => i !== idx) })}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3 pr-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome</Label>
                    <Input value={opt.name} onChange={(e) => {
                      const newArr = [...lojaConfig.presentearOptions];
                      newArr[idx].name = e.target.value;
                      setLojaConfig({ ...lojaConfig, presentearOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Preço</Label>
                    <Input type="number" value={opt.price ?? ""} onChange={(e) => {
                      const val = e.target.value;
                      const newArr = [...lojaConfig.presentearOptions];
                      newArr[idx].price = val === "" ? null : Number(val);
                      setLojaConfig({ ...lojaConfig, presentearOptions: newArr });
                    }} />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs">Descrição</Label>
                    <Input value={opt.desc} onChange={(e) => {
                      const newArr = [...lojaConfig.presentearOptions];
                      newArr[idx].desc = e.target.value;
                      setLojaConfig({ ...lojaConfig, presentearOptions: newArr });
                    }} />
                  </div>
                </div>
              </div>
            ))}
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
