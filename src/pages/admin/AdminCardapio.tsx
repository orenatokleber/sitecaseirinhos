import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Plus, Trash2, Save, Cake, Cookie, Sparkles } from "lucide-react";
import { toast } from "sonner";

const AdminCardapio = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [menu, setMenu] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings?.menu_cardapio) {
      setMenu(JSON.parse(JSON.stringify(settings.menu_cardapio)));
    }
  }, [settings]);

  const save = () => {
    if (!menu) return;
    updateSetting.mutate(
      { key: "menu_cardapio", value: menu },
      { onSuccess: () => setHasChanges(false) }
    );
  };

  const update = (path: string[], value: any) => {
    setMenu((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let obj = clone;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return clone;
    });
    setHasChanges(true);
  };

  if (isLoading || !menu) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Cardápio</h1>
          <p className="text-muted-foreground">Edite preços, sabores, estilos e imagens do cardápio</p>
        </div>
        <Button onClick={save} disabled={!hasChanges || updateSetting.isPending}>
          {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="bolos-redondos">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="bolos-redondos"><Cake className="w-4 h-4 mr-1" /> Bolos Redondos</TabsTrigger>
          <TabsTrigger value="bolos-retangulares"><Cake className="w-4 h-4 mr-1" /> Retangulares</TabsTrigger>
          <TabsTrigger value="decoracao"><Sparkles className="w-4 h-4 mr-1" /> Decoração</TabsTrigger>
          <TabsTrigger value="doces"><Cookie className="w-4 h-4 mr-1" /> Doces</TabsTrigger>
          <TabsTrigger value="complementos"><Sparkles className="w-4 h-4 mr-1" /> Complementos</TabsTrigger>
        </TabsList>

        {/* ═══ BOLOS REDONDOS ═══ */}
        <TabsContent value="bolos-redondos">
          <Accordion type="multiple" defaultValue={["tamanhos", "precos", "sabores", "estilos", "massas", "imagens"]}>
            {/* Tamanhos */}
            <AccordionItem value="tamanhos">
              <AccordionTrigger>Tamanhos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {menu.bolos_redondos.tamanhos.map((t: any, i: number) => (
                    <div key={i} className="grid grid-cols-4 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Sigla</Label>
                        <Input value={t.sigla} onChange={(e) => { const arr = [...menu.bolos_redondos.tamanhos]; arr[i] = { ...t, sigla: e.target.value }; update(["bolos_redondos", "tamanhos"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Dimensão</Label>
                        <Input value={t.dimensao} onChange={(e) => { const arr = [...menu.bolos_redondos.tamanhos]; arr[i] = { ...t, dimensao: e.target.value }; update(["bolos_redondos", "tamanhos"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Porções</Label>
                        <Input value={t.porcoes} onChange={(e) => { const arr = [...menu.bolos_redondos.tamanhos]; arr[i] = { ...t, porcoes: e.target.value }; update(["bolos_redondos", "tamanhos"], arr); }} />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => { const arr = menu.bolos_redondos.tamanhos.filter((_: any, j: number) => j !== i); update(["bolos_redondos", "tamanhos"], arr); const p = { ...menu.bolos_redondos.precos }; delete p[t.sigla]; update(["bolos_redondos", "precos"], p); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => { const arr = [...menu.bolos_redondos.tamanhos, { sigla: "", dimensao: "", porcoes: "" }]; update(["bolos_redondos", "tamanhos"], arr); }}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Tamanho
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Estilos */}
            <AccordionItem value="estilos">
              <AccordionTrigger>Estilos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {menu.bolos_redondos.estilos.map((e: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label className="text-xs">Nome</Label>
                            <Input value={e.nome} onChange={(ev) => { const arr = [...menu.bolos_redondos.estilos]; arr[i] = { ...e, nome: ev.target.value }; update(["bolos_redondos", "estilos"], arr); }} />
                          </div>
                          <Button variant="destructive" size="icon" className="mt-5" onClick={() => update(["bolos_redondos", "estilos"], menu.bolos_redondos.estilos.filter((_: any, j: number) => j !== i))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <Label className="text-xs">Descrição</Label>
                          <Textarea value={e.descricao} rows={2} onChange={(ev) => { const arr = [...menu.bolos_redondos.estilos]; arr[i] = { ...e, descricao: ev.target.value }; update(["bolos_redondos", "estilos"], arr); }} />
                        </div>
                        <div>
                          <Label className="text-xs">Imagem</Label>
                          <ImageUpload value={e.imagem || ""} onChange={(url) => { const arr = [...menu.bolos_redondos.estilos]; arr[i] = { ...e, imagem: url }; update(["bolos_redondos", "estilos"], arr); }} folder="cardapio" aspectRatio={1} recommendedSize="600×600px" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["bolos_redondos", "estilos"], [...menu.bolos_redondos.estilos, { nome: "", descricao: "", imagem: "" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Estilo
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Massas */}
            <AccordionItem value="massas">
              <AccordionTrigger>Massas</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {menu.bolos_redondos.massas.map((m: any, i: number) => (
                    <Card key={i} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                        <div>
                          <Label className="text-xs mb-1 block">Imagem</Label>
                          <ImageUpload
                            value={m.imagem || ""}
                            onChange={(url) => { const arr = [...menu.bolos_redondos.massas]; arr[i] = { ...m, imagem: url }; update(["bolos_redondos", "massas"], arr); }}
                            folder="cardapio/massas"
                            aspectRatio={1}
                            recommendedSize="400x400"
                          />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Nome</Label>
                            <Input value={m.nome} onChange={(e) => { const arr = [...menu.bolos_redondos.massas]; arr[i] = { ...m, nome: e.target.value }; update(["bolos_redondos", "massas"], arr); }} />
                          </div>
                          <div>
                            <Label className="text-xs">Acréscimo (R$)</Label>
                            <Input type="number" step="0.01" value={m.acrescimo} onChange={(e) => { const arr = [...menu.bolos_redondos.massas]; arr[i] = { ...m, acrescimo: parseFloat(e.target.value) || 0 }; update(["bolos_redondos", "massas"], arr); }} />
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => update(["bolos_redondos", "massas"], menu.bolos_redondos.massas.filter((_: any, j: number) => j !== i))}>
                            <Trash2 className="h-4 w-4 mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["bolos_redondos", "massas"], [...menu.bolos_redondos.massas, { nome: "", acrescimo: 0, imagem: "" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Massa
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sabores */}
            <AccordionItem value="sabores">
              <AccordionTrigger>Sabores</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <FlavorListEditor label="Tradicionais" flavors={menu.bolos_redondos.sabores_tradicionais} onChange={(v) => update(["bolos_redondos", "sabores_tradicionais"], v)} />
                  <FlavorListEditor label="Premium" flavors={menu.bolos_redondos.sabores_premium} onChange={(v) => update(["bolos_redondos", "sabores_premium"], v)} />
                  <FlavorListEditor label="Supreme" flavors={menu.bolos_redondos.sabores_supreme} onChange={(v) => update(["bolos_redondos", "sabores_supreme"], v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Preços */}
            <AccordionItem value="precos">
              <AccordionTrigger>Tabela de Preços</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Tam.</th>
                        <th className="text-center py-2 px-2">Tradicional</th>
                        <th className="text-center py-2 px-2">Premium</th>
                        <th className="text-center py-2 px-2">Supreme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.bolos_redondos.tamanhos.map((t: any) => {
                        const p = menu.bolos_redondos.precos[t.sigla] || { tradicional: 0, premium: 0, supreme: 0 };
                        return (
                          <tr key={t.sigla} className="border-b border-border/50">
                            <td className="py-2 px-2 font-semibold">{t.sigla}</td>
                            {["tradicional", "premium", "supreme"].map((tier) => (
                              <td key={tier} className="py-2 px-2">
                                <Input type="number" step="0.01" className="text-center h-8 text-sm" value={p[tier] || ""} onChange={(e) => {
                                  const prices = { ...menu.bolos_redondos.precos };
                                  prices[t.sigla] = { ...p, [tier]: parseFloat(e.target.value) || 0 };
                                  update(["bolos_redondos", "precos"], prices);
                                }} />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Imagens gerais */}
            <AccordionItem value="imagens">
              <AccordionTrigger>Imagens da Seção</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Imagem de destaque</Label>
                    <ImageUpload value={menu.bolos_redondos.imagem_destaque || ""} onChange={(url) => update(["bolos_redondos", "imagem_destaque"], url)} folder="cardapio" aspectRatio={16 / 9} recommendedSize="1200×675px" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* ═══ BOLOS RETANGULARES ═══ */}
        <TabsContent value="bolos-retangulares">
          <Accordion type="multiple" defaultValue={["tamanhos-ret", "precos-ret", "estilos-ret"]}>
            <AccordionItem value="tamanhos-ret">
              <AccordionTrigger>Tamanhos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {menu.bolos_retangulares.tamanhos.map((t: any, i: number) => (
                    <div key={i} className="grid grid-cols-4 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Sigla</Label>
                        <Input value={t.sigla} onChange={(e) => { const arr = [...menu.bolos_retangulares.tamanhos]; arr[i] = { ...t, sigla: e.target.value }; update(["bolos_retangulares", "tamanhos"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Dimensão</Label>
                        <Input value={t.dimensao} onChange={(e) => { const arr = [...menu.bolos_retangulares.tamanhos]; arr[i] = { ...t, dimensao: e.target.value }; update(["bolos_retangulares", "tamanhos"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Porções</Label>
                        <Input value={t.porcoes} onChange={(e) => { const arr = [...menu.bolos_retangulares.tamanhos]; arr[i] = { ...t, porcoes: e.target.value }; update(["bolos_retangulares", "tamanhos"], arr); }} />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => { const arr = menu.bolos_retangulares.tamanhos.filter((_: any, j: number) => j !== i); update(["bolos_retangulares", "tamanhos"], arr); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["bolos_retangulares", "tamanhos"], [...menu.bolos_retangulares.tamanhos, { sigla: "", dimensao: "", porcoes: "" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="estilos-ret">
              <AccordionTrigger>Estilos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {menu.bolos_retangulares.estilos.map((e: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label className="text-xs">Nome</Label>
                            <Input value={e.nome} onChange={(ev) => { const arr = [...menu.bolos_retangulares.estilos]; arr[i] = { ...e, nome: ev.target.value }; update(["bolos_retangulares", "estilos"], arr); }} />
                          </div>
                          <Button variant="destructive" size="icon" className="mt-5" onClick={() => update(["bolos_retangulares", "estilos"], menu.bolos_retangulares.estilos.filter((_: any, j: number) => j !== i))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <Label className="text-xs">Descrição</Label>
                          <Textarea value={e.descricao} rows={2} onChange={(ev) => { const arr = [...menu.bolos_retangulares.estilos]; arr[i] = { ...e, descricao: ev.target.value }; update(["bolos_retangulares", "estilos"], arr); }} />
                        </div>
                        <div>
                          <Label className="text-xs">Imagem</Label>
                          <ImageUpload value={e.imagem || ""} onChange={(url) => { const arr = [...menu.bolos_retangulares.estilos]; arr[i] = { ...e, imagem: url }; update(["bolos_retangulares", "estilos"], arr); }} folder="cardapio" aspectRatio={1} recommendedSize="600×600px" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["bolos_retangulares", "estilos"], [...menu.bolos_retangulares.estilos, { nome: "", descricao: "", imagem: "" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Estilo
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="precos-ret">
              <AccordionTrigger>Tabela de Preços</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Tam.</th>
                        <th className="text-center py-2 px-2">Tradicional</th>
                        <th className="text-center py-2 px-2">Premium</th>
                        <th className="text-center py-2 px-2">Supreme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.bolos_retangulares.tamanhos.map((t: any) => {
                        const p = menu.bolos_retangulares.precos[t.sigla] || { tradicional: 0, premium: 0, supreme: 0 };
                        return (
                          <tr key={t.sigla} className="border-b border-border/50">
                            <td className="py-2 px-2 font-semibold">{t.sigla}</td>
                            {["tradicional", "premium", "supreme"].map((tier) => (
                              <td key={tier} className="py-2 px-2">
                                <Input type="number" step="0.01" className="text-center h-8 text-sm" value={p[tier] || ""} onChange={(e) => {
                                  const prices = { ...menu.bolos_retangulares.precos };
                                  prices[t.sigla] = { ...p, [tier]: parseFloat(e.target.value) || 0 };
                                  update(["bolos_retangulares", "precos"], prices);
                                }} />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3">
                  <Label className="text-xs">Observação</Label>
                  <Input value={menu.bolos_retangulares.obs || ""} onChange={(e) => update(["bolos_retangulares", "obs"], e.target.value)} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* ═══ DECORAÇÃO ═══ */}
        <TabsContent value="decoracao">
          <Card>
            <CardHeader><CardTitle>Adicionais de Decoração</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {menu.decoracao.map((d: any, i: number) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <Label className="text-xs">Item</Label>
                      <Input value={d.item} onChange={(e) => { const arr = [...menu.decoracao]; arr[i] = { ...d, item: e.target.value }; update(["decoracao"], arr); }} />
                    </div>
                    <div>
                      <Label className="text-xs">Preço</Label>
                      <Input value={d.preco} onChange={(e) => { const arr = [...menu.decoracao]; arr[i] = { ...d, preco: e.target.value }; update(["decoracao"], arr); }} />
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => update(["decoracao"], menu.decoracao.filter((_: any, j: number) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => update(["decoracao"], [...menu.decoracao, { item: "", preco: "" }])}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ DOCES ═══ */}
        <TabsContent value="doces">
          <Accordion type="multiple" defaultValue={["trad", "gourmet", "especiais"]}>
            {/* Tradicionais */}
            <AccordionItem value="trad">
              <AccordionTrigger>Tradicionais</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold">Pacotes</Label>
                    {menu.doces.tradicionais.pacotes.map((p: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 items-end mt-2">
                        <div className="col-span-2">
                          <Input value={p.qtd} onChange={(e) => { const arr = [...menu.doces.tradicionais.pacotes]; arr[i] = { ...p, qtd: e.target.value }; update(["doces", "tradicionais", "pacotes"], arr); }} />
                        </div>
                        <div className="flex gap-1">
                          <Input type="number" step="0.01" value={p.preco} onChange={(e) => { const arr = [...menu.doces.tradicionais.pacotes]; arr[i] = { ...p, preco: parseFloat(e.target.value) || 0 }; update(["doces", "tradicionais", "pacotes"], arr); }} />
                          <Button variant="destructive" size="icon" onClick={() => update(["doces", "tradicionais", "pacotes"], menu.doces.tradicionais.pacotes.filter((_: any, j: number) => j !== i))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => update(["doces", "tradicionais", "pacotes"], [...menu.doces.tradicionais.pacotes, { qtd: "", preco: 0 }])}>
                      <Plus className="h-4 w-4 mr-1" /> Pacote
                    </Button>
                  </div>
                  <FlavorListEditor label="Sabores" flavors={menu.doces.tradicionais.sabores} onChange={(v) => update(["doces", "tradicionais", "sabores"], v)} />
                  <div>
                    <Label className="text-xs">Observação</Label>
                    <Input value={menu.doces.tradicionais.obs || ""} onChange={(e) => update(["doces", "tradicionais", "obs"], e.target.value)} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gourmet */}
            <AccordionItem value="gourmet">
              <AccordionTrigger>Gourmet</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold">Pacotes</Label>
                    {menu.doces.gourmet.pacotes.map((p: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 items-end mt-2">
                        <div className="col-span-2">
                          <Input value={p.qtd} onChange={(e) => { const arr = [...menu.doces.gourmet.pacotes]; arr[i] = { ...p, qtd: e.target.value }; update(["doces", "gourmet", "pacotes"], arr); }} />
                        </div>
                        <div className="flex gap-1">
                          <Input type="number" step="0.01" value={p.preco} onChange={(e) => { const arr = [...menu.doces.gourmet.pacotes]; arr[i] = { ...p, preco: parseFloat(e.target.value) || 0 }; update(["doces", "gourmet", "pacotes"], arr); }} />
                          <Button variant="destructive" size="icon" onClick={() => update(["doces", "gourmet", "pacotes"], menu.doces.gourmet.pacotes.filter((_: any, j: number) => j !== i))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => update(["doces", "gourmet", "pacotes"], [...menu.doces.gourmet.pacotes, { qtd: "", preco: 0 }])}>
                      <Plus className="h-4 w-4 mr-1" /> Pacote
                    </Button>
                  </div>
                  <FlavorListEditor label="Sabores" flavors={menu.doces.gourmet.sabores} onChange={(v) => update(["doces", "gourmet", "sabores"], v)} />
                  <div>
                    <Label className="text-xs">Observação</Label>
                    <Input value={menu.doces.gourmet.obs || ""} onChange={(e) => update(["doces", "gourmet", "obs"], e.target.value)} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Especiais */}
            <AccordionItem value="especiais">
              <AccordionTrigger>Especiais</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {menu.doces.especiais.map((d: any, i: number) => (
                    <div key={i} className="grid grid-cols-3 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Item</Label>
                        <Input value={d.item} onChange={(e) => { const arr = [...menu.doces.especiais]; arr[i] = { ...d, item: e.target.value }; update(["doces", "especiais"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Preço</Label>
                        <Input value={d.preco} onChange={(e) => { const arr = [...menu.doces.especiais]; arr[i] = { ...d, preco: e.target.value }; update(["doces", "especiais"], arr); }} />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => update(["doces", "especiais"], menu.doces.especiais.filter((_: any, j: number) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["doces", "especiais"], [...menu.doces.especiais, { item: "", preco: "" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* ═══ COMPLEMENTOS ═══ */}
        <TabsContent value="complementos">
          <Accordion type="multiple" defaultValue={["simples", "pasta"]}>
            <AccordionItem value="simples">
              <AccordionTrigger>Simples</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {menu.complementos.simples.map((c: any, i: number) => (
                    <div key={i} className="grid grid-cols-3 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Item</Label>
                        <Input value={c.item} onChange={(e) => { const arr = [...menu.complementos.simples]; arr[i] = { ...c, item: e.target.value }; update(["complementos", "simples"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Preço (R$)</Label>
                        <Input type="number" step="0.01" value={c.preco} onChange={(e) => { const arr = [...menu.complementos.simples]; arr[i] = { ...c, preco: parseFloat(e.target.value) || 0 }; update(["complementos", "simples"], arr); }} />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => update(["complementos", "simples"], menu.complementos.simples.filter((_: any, j: number) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["complementos", "simples"], [...menu.complementos.simples, { item: "", preco: 0 }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pasta">
              <AccordionTrigger>Pasta Americana</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {menu.complementos.pasta_americana.map((c: any, i: number) => (
                    <div key={i} className="grid grid-cols-3 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Item</Label>
                        <Input value={c.item} onChange={(e) => { const arr = [...menu.complementos.pasta_americana]; arr[i] = { ...c, item: e.target.value }; update(["complementos", "pasta_americana"], arr); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Preço (R$)</Label>
                        <Input type="number" step="0.01" value={c.preco} onChange={(e) => { const arr = [...menu.complementos.pasta_americana]; arr[i] = { ...c, preco: parseFloat(e.target.value) || 0 }; update(["complementos", "pasta_americana"], arr); }} />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => update(["complementos", "pasta_americana"], menu.complementos.pasta_americana.filter((_: any, j: number) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update(["complementos", "pasta_americana"], [...menu.complementos.pasta_americana, { item: "", preco: 0 }])}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-4">
            <Label className="text-xs">Observação geral</Label>
            <Input value={menu.complementos.obs || ""} onChange={(e) => update(["complementos", "obs"], e.target.value)} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating save */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={save} size="lg" className="shadow-lg" disabled={updateSetting.isPending}>
            {updateSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Alterações
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── FlavorListEditor ─── */
const FlavorListEditor = ({ label, flavors, onChange }: { label: string; flavors: string[]; onChange: (v: string[]) => void }) => {
  const [newFlavor, setNewFlavor] = useState("");
  return (
    <div>
      <Label className="text-xs font-semibold">{label}</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {flavors.map((f: string, i: number) => (
          <span key={i} className="inline-flex items-center gap-1 bg-secondary text-foreground text-xs px-3 py-1.5 rounded-full">
            {f}
            <button onClick={() => onChange(flavors.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 ml-1">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input placeholder="Novo sabor..." value={newFlavor} onChange={(e) => setNewFlavor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newFlavor.trim()) { onChange([...flavors, newFlavor.trim()]); setNewFlavor(""); } }} className="h-8 text-sm" />
        <Button variant="outline" size="sm" disabled={!newFlavor.trim()} onClick={() => { onChange([...flavors, newFlavor.trim()]); setNewFlavor(""); }}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default AdminCardapio;
