import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSettings, useProducts } from "@/hooks/useSiteContent";
import { Cake, Cookie, Sparkles, ChefHat, MessageCircle, Star, CircleDot } from "lucide-react";

const formatPrice = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

// ─── Default menu data (fallback) ───
const defaultMenu = {
  bolos_redondos: {
    tamanhos: [
      { sigla: "PP", dimensao: "13cm", porcoes: "8 a 10" },
      { sigla: "P", dimensao: "15cm", porcoes: "12 a 15" },
      { sigla: "M", dimensao: "17cm", porcoes: "17 a 20" },
      { sigla: "G", dimensao: "20cm", porcoes: "25 a 30" },
      { sigla: "GG", dimensao: "23cm", porcoes: "35 a 40" },
    ],
    estilos: [
      { nome: "Naked / Acetato", descricao: "Bolo sem cobertura, com camadas aparentes." },
      { nome: "Chantininho", descricao: "Bolo coberto com chantininho, mistura cremosa de chantilly e ninho." },
      { nome: "Ganache", descricao: "Bolo com cobertura de chocolate nobre meio amargo." },
    ],
    massas: [
      { nome: "Massa Branca", acrescimo: 0 },
      { nome: "Massa Chocolate", acrescimo: 0 },
      { nome: "Red Velvet", acrescimo: 5 },
    ],
    sabores_tradicionais: ["Brigadeiro", "Cocada Cremosa", "Doce de Leite", "Ninho", "Dois Amores", "Doce de Leite com Coco", "Mousse Meio Amargo", "Mousse Doce de Leite", "Mousse Maracujá", "Mousse Morango"],
    sabores_premium: ["Brigadeiro de Maracujá", "Ninho com Abacaxi", "Abacaxi com Coco", "Olho de Sogra", "Doce de Leite com Ameixa", "Prestígio", "Mousse de Chocolate Branco"],
    sabores_supreme: ["Ninho com Morangos", "Brigadeiro com Morango", "Ferrero Rocher", "Kinder Bueno", "Quatro Leites com Geleia", "Ninho com Nutella", "Laka com Frutas Vermelhas", "Brigadeiro de Cream Cheese"],
    precos: {
      PP: { tradicional: 85, premium: 110, supreme: 138 },
      P: { tradicional: 130, premium: 165, supreme: 190 },
      M: { tradicional: 180, premium: 220, supreme: 255 },
      G: { tradicional: 240, premium: 285, supreme: 330 },
      GG: { tradicional: 300, premium: 350, supreme: 400 },
    },
  },
  bolos_retangulares: {
    tamanhos: [
      { sigla: "P", dimensao: "20×15cm", porcoes: "20 a 25" },
      { sigla: "M", dimensao: "25×17cm", porcoes: "30 a 35" },
      { sigla: "G", dimensao: "30×22cm", porcoes: "40 a 45" },
      { sigla: "GG", dimensao: "36×26cm", porcoes: "60 a 65" },
    ],
    estilos: [
      { nome: "Bolo de Corte", descricao: "Coberto com chantininho e decoração simples. Embalagem simples." },
      { nome: "Bolo Retangular Decorado", descricao: "2 camadas de recheio, decoração personalizada. Vai no cakeboard." },
      { nome: "Bolo em Fatias", descricao: "Fatias em embalagem com etiqueta personalizada." },
    ],
    precos: {
      P: { tradicional: 170, premium: 190, supreme: 220 },
      M: { tradicional: 255, premium: 285, supreme: 330 },
      G: { tradicional: 340, premium: 380, supreme: 440 },
      GG: { tradicional: 510, premium: 570, supreme: 660 },
    },
    obs: "Valores para bolos de corte. Decorados têm acréscimo de R$15,00.",
  },
  decoracao: [
    { item: "Brigadeiros", preco: "R$ 2,00/un" },
    { item: "Drip Cake", preco: "R$ 8,00" },
    { item: "Topo Simples", preco: "R$ 25,00" },
    { item: "Topo em Camadas", preco: "R$ 35,00" },
    { item: "Flores Naturais", preco: "R$ 40,00" },
    { item: "Flores Artificiais", preco: "R$ 30,00" },
    { item: "Flor de Morango", preco: "R$ 20,00" },
    { item: "Flores Manuais", preco: "R$ 20,00" },
    { item: "Andar Fake", preco: "a partir de R$ 15,00" },
    { item: "Glitter", preco: "R$ 5,00 / R$ 10,00" },
    { item: "Formato Coração", preco: "R$ 50,00" },
    { item: "Bento Cake", preco: "consultar" },
    { item: "Andar Verdadeiro", preco: "R$ 60,00" },
  ],
  doces: {
    tradicionais: {
      pacotes: [
        { qtd: "12 unidades (1 tipo)", preco: 30 },
        { qtd: "25 unidades (2 tipos)", preco: 50 },
        { qtd: "50 unidades (2 tipos)", preco: 60 },
        { qtd: "100 unidades (até 4 tipos)", preco: 100 },
      ],
      sabores: ["Brigadeiro", "Beijinho", "Amendoim", "Cajuzinho", "Bicho de Pé", "Ninho"],
      obs: "12 e 25 un: docinhos de 15g. 50 e 100 un: de 10g.",
    },
    gourmet: {
      pacotes: [
        { qtd: "12 unidades (1 tipo)", preco: 36 },
        { qtd: "25 unidades (2 tipos)", preco: 75 },
        { qtd: "50 unidades (2 tipos)", preco: 100 },
        { qtd: "100 unidades (até 4 tipos)", preco: 200 },
      ],
      sabores: ["Ninho com Nutella", "Maracujá", "Surpresa de Uva", "Sensação", "Olho de Sogra", "Chocolate Meio Amargo", "Chocolate ao Leite", "Chocolate Branco", "Oreo"],
      obs: "12 e 25 un: docinhos de 20g. 50 e 100 un: de 15g.",
    },
    especiais: [
      { item: "Brigadeiro Colorido", preco: "R$ 2,50/un" },
      { item: "Carimbo Personalizado", preco: "R$ 3,00/un" },
      { item: "Detalhe em Pasta", preco: "R$ 3,80/un" },
      { item: "Confete Diferente", preco: "R$ 2,00/un" },
      { item: "Glitter", preco: "R$ 2,50/un" },
    ],
  },
  complementos: {
    simples: [
      { item: "Pirulito de Chocolate", preco: 9 },
      { item: "Alfajor", preco: 8 },
      { item: "Mini Cone Recheado", preco: 5 },
      { item: "Brownie Simples", preco: 5 },
      { item: "Sanduba Brownie", preco: 8 },
      { item: "Mini Cupcake", preco: 5.5 },
      { item: "Cupcake", preco: 8 },
      { item: "Pão de Mel", preco: 9.5 },
      { item: "Maçã no Chocolate", preco: 8 },
    ],
    pasta_americana: [
      { item: "Pirulito de Chocolate", preco: 18 },
      { item: "Mini Bombom", preco: 13 },
      { item: "Mini Cupcake", preco: 13 },
      { item: "Cupcake", preco: 16 },
      { item: "Pão de Mel", preco: 21 },
      { item: "Maçã no Chocolate", preco: 15 },
      { item: "Paleta Recheada", preco: 23 },
    ],
    obs: "Pedido mínimo: 4 unidades. Tags e laços cobrados à parte (Laço: R$1,50 / Tag: R$3,50).",
  },
};

type MenuSection = "bolos" | "doces" | "complementos";

const sectionTabs: { key: MenuSection; label: string; icon: React.ReactNode }[] = [
  { key: "bolos", label: "Bolos Festivos", icon: <Cake className="w-4 h-4" /> },
  { key: "doces", label: "Doces", icon: <Cookie className="w-4 h-4" /> },
  { key: "complementos", label: "Complementos", icon: <Sparkles className="w-4 h-4" /> },
];

const Cardapio = () => {
  const { data: settings } = useSiteSettings();
  const { data: products } = useProducts();
  const whatsapp = (settings?.contact as any)?.whatsapp || "5500000000000";
  const menu = (settings?.menu_cardapio as any) || defaultMenu;

  const [activeSection, setActiveSection] = useState<MenuSection>("bolos");
  const [boloTab, setBoloTab] = useState<"redondos" | "retangulares">("redondos");

  const bolosRedondos = menu.bolos_redondos || defaultMenu.bolos_redondos;
  const bolosRetangulares = menu.bolos_retangulares || defaultMenu.bolos_retangulares;
  const decoracao = menu.decoracao || defaultMenu.decoracao;
  const doces = menu.doces || defaultMenu.doces;
  const complementos = menu.complementos || defaultMenu.complementos;

  // Filter products for gallery
  const galleryProducts = products?.filter((p: any) => p.image_url) || [];

  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer uma encomenda. Pode me ajudar?")}`;

  return (
    <main className="pt-24 pb-8">
      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle
            script="Nossas delícias"
            title="Cardápio de Encomendas"
            subtitle="Conheça nossos sabores, estilos e valores. Cada bolo é feito com amor e ingredientes selecionados."
          />

          {/* Section tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {sectionTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                  activeSection === tab.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ BOLOS ══════════════════════════════ */}
      {activeSection === "bolos" && (
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Sub-tabs: Redondos / Retangulares */}
            <div className="flex justify-center gap-2 mb-10">
              {[
                { key: "redondos" as const, label: "Redondos" },
                { key: "retangulares" as const, label: "Retangulares" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setBoloTab(t.key)}
                  className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                    boloTab === t.key
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ─── Bolos Redondos ─── */}
            {boloTab === "redondos" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {/* Passo 1: Tamanhos */}
                <MenuCard title="Passo 1" subtitle="Escolha o tamanho" icon={<CircleDot className="w-5 h-5 text-primary" />}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-heading text-foreground">Tamanho</th>
                          <th className="text-center py-2 px-3 font-heading text-foreground">Diâmetro</th>
                          <th className="text-center py-2 px-3 font-heading text-foreground">Porções</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bolosRedondos.tamanhos.map((t: any, i: number) => (
                          <tr key={t.sigla} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                            <td className="py-2.5 px-3 font-semibold text-foreground">{t.sigla}</td>
                            <td className="py-2.5 px-3 text-center text-muted-foreground">{t.dimensao}</td>
                            <td className="py-2.5 px-3 text-center text-muted-foreground">{t.porcoes} fatias</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MenuCard>

                {/* Passo 2: Estilos */}
                <MenuCard title="Passo 2" subtitle="Escolha o estilo" icon={<ChefHat className="w-5 h-5 text-primary" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {bolosRedondos.estilos.map((e: any) => (
                      <div key={e.nome} className="bg-secondary/40 rounded-2xl p-4 text-center">
                        <h4 className="font-heading font-semibold text-foreground mb-1">{e.nome}</h4>
                        <p className="text-xs text-muted-foreground">{e.descricao}</p>
                      </div>
                    ))}
                  </div>
                </MenuCard>

                {/* Passo 3: Massas */}
                <MenuCard title="Passo 3" subtitle="Escolha a massa" icon={<Cake className="w-5 h-5 text-primary" />}>
                  <div className="flex flex-wrap justify-center gap-3">
                    {bolosRedondos.massas.map((m: any) => (
                      <div key={m.nome} className="bg-secondary/40 rounded-full px-5 py-2.5 text-sm text-center">
                        <span className="font-medium text-foreground">{m.nome}</span>
                        {m.acrescimo > 0 && (
                          <span className="text-xs text-accent ml-1">(+R$ {m.acrescimo.toFixed(2).replace(".", ",")})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </MenuCard>

                {/* Passo 4: Sabores */}
                <MenuCard title="Passo 4" subtitle="Escolha o sabor" icon={<Star className="w-5 h-5 text-primary" />}>
                  <FlavorTier title="Tradicionais" flavors={bolosRedondos.sabores_tradicionais} color="bg-primary/10 text-primary" />
                  <FlavorTier title="Premium" flavors={bolosRedondos.sabores_premium} color="bg-accent/15 text-accent" />
                  <FlavorTier title="Supreme" flavors={bolosRedondos.sabores_supreme} color="bg-chocolate/10 text-chocolate" />
                </MenuCard>

                {/* Tabela de Preços */}
                <MenuCard title="Valores" subtitle="Bolos Redondos Decorados" icon={<Sparkles className="w-5 h-5 text-primary" />}>
                  <PriceTable sizes={bolosRedondos.tamanhos} prices={bolosRedondos.precos} />
                  <p className="text-xs text-muted-foreground mt-3 text-center italic">
                    * Valores diferentes para cobertura de ganache — consulte antes.
                  </p>
                </MenuCard>
              </motion.div>
            )}

            {/* ─── Bolos Retangulares ─── */}
            {boloTab === "retangulares" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <MenuCard title="Tamanhos" subtitle="Bolos Retangulares" icon={<CircleDot className="w-5 h-5 text-primary" />}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-heading text-foreground">Tamanho</th>
                          <th className="text-center py-2 px-3 font-heading text-foreground">Dimensão</th>
                          <th className="text-center py-2 px-3 font-heading text-foreground">Porções</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bolosRetangulares.tamanhos.map((t: any, i: number) => (
                          <tr key={t.sigla} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                            <td className="py-2.5 px-3 font-semibold text-foreground">{t.sigla}</td>
                            <td className="py-2.5 px-3 text-center text-muted-foreground">{t.dimensao}</td>
                            <td className="py-2.5 px-3 text-center text-muted-foreground">{t.porcoes} fatias</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MenuCard>

                <MenuCard title="Estilos" subtitle="Retangulares" icon={<ChefHat className="w-5 h-5 text-primary" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {bolosRetangulares.estilos.map((e: any) => (
                      <div key={e.nome} className="bg-secondary/40 rounded-2xl p-4 text-center">
                        <h4 className="font-heading font-semibold text-foreground mb-1 text-sm">{e.nome}</h4>
                        <p className="text-xs text-muted-foreground">{e.descricao}</p>
                      </div>
                    ))}
                  </div>
                </MenuCard>

                <MenuCard title="Valores" subtitle="Bolos Retangulares" icon={<Sparkles className="w-5 h-5 text-primary" />}>
                  <PriceTable sizes={bolosRetangulares.tamanhos} prices={bolosRetangulares.precos} />
                  {bolosRetangulares.obs && (
                    <p className="text-xs text-muted-foreground mt-3 text-center italic">* {bolosRetangulares.obs}</p>
                  )}
                </MenuCard>
              </motion.div>
            )}

            {/* Decoração */}
            <MenuCard title="Adicionais" subtitle="Decoração" icon={<Sparkles className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {decoracao.map((d: any) => (
                  <div key={d.item} className="flex justify-between items-center bg-secondary/30 rounded-xl px-3 py-2.5 text-sm">
                    <span className="text-foreground">{d.item}</span>
                    <span className="text-accent font-semibold text-xs ml-2 whitespace-nowrap">{d.preco}</span>
                  </div>
                ))}
              </div>
            </MenuCard>

            {/* Gallery */}
            {galleryProducts.length > 0 && (
              <div className="mt-10">
                <h3 className="font-script text-2xl text-primary text-center mb-6">Algumas inspirações</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {galleryProducts.slice(0, 8).map((p: any) => (
                    <div key={p.id} className="aspect-square rounded-2xl overflow-hidden group">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════ DOCES ══════════════════════════════ */}
      {activeSection === "doces" && (
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Tradicionais */}
            <MenuCard title="Docinhos" subtitle="Tradicionais" icon={<Cookie className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Pacotes</h4>
                  {doces.tradicionais.pacotes.map((p: any) => (
                    <div key={p.qtd} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{p.qtd}</span>
                      <span className="text-sm font-semibold text-accent">{formatPrice(p.preco)}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2 italic">{doces.tradicionais.obs}</p>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Sabores</h4>
                  <div className="flex flex-wrap gap-2">
                    {doces.tradicionais.sabores.map((s: string) => (
                      <span key={s} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </MenuCard>

            {/* Gourmet */}
            <MenuCard title="Docinhos" subtitle="Gourmet" icon={<Star className="w-5 h-5 text-accent" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Pacotes</h4>
                  {doces.gourmet.pacotes.map((p: any) => (
                    <div key={p.qtd} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{p.qtd}</span>
                      <span className="text-sm font-semibold text-accent">{formatPrice(p.preco)}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2 italic">{doces.gourmet.obs}</p>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Sabores</h4>
                  <div className="flex flex-wrap gap-2">
                    {doces.gourmet.sabores.map((s: string) => (
                      <span key={s} className="bg-accent/15 text-accent text-xs px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </MenuCard>

            {/* Especiais */}
            <MenuCard title="Docinhos" subtitle="Especiais" icon={<Sparkles className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {doces.especiais.map((d: any) => (
                  <div key={d.item} className="flex justify-between items-center bg-secondary/30 rounded-xl px-3 py-2.5 text-sm">
                    <span className="text-foreground">{d.item}</span>
                    <span className="text-accent font-semibold text-xs ml-2 whitespace-nowrap">{d.preco}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center italic">
                * Pedido mínimo: 50 unidades. Pedir com 20 dias de antecedência.
              </p>
            </MenuCard>
          </div>
        </section>
      )}

      {/* ══════════════════════════════ COMPLEMENTOS ══════════════════════════════ */}
      {activeSection === "complementos" && (
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <MenuCard title="Complementos" subtitle="Simples" icon={<Cookie className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {complementos.simples.map((c: any) => (
                  <div key={c.item} className="flex justify-between items-center bg-secondary/30 rounded-xl px-4 py-3">
                    <span className="text-sm text-foreground">{c.item}</span>
                    <span className="text-sm font-semibold text-accent">{formatPrice(c.preco)}</span>
                  </div>
                ))}
              </div>
            </MenuCard>

            <MenuCard title="Complementos" subtitle="Pasta Americana" icon={<Sparkles className="w-5 h-5 text-accent" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {complementos.pasta_americana.map((c: any) => (
                  <div key={c.item} className="flex justify-between items-center bg-secondary/30 rounded-xl px-4 py-3">
                    <span className="text-sm text-foreground">{c.item}</span>
                    <span className="text-sm font-semibold text-accent">{formatPrice(c.preco)}</span>
                  </div>
                ))}
              </div>
            </MenuCard>

            {complementos.obs && (
              <p className="text-xs text-muted-foreground text-center italic mt-4">* {complementos.obs}</p>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════ CTA ══════════════════════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-3xl p-8 md:p-12 text-center shadow-sm border border-border">
            <h3 className="font-script text-3xl text-primary mb-2">Faça sua encomenda!</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Mínimo de 3 dias de antecedência. Pagamento: PIX, dinheiro ou cartão. 
              Confirmação com 50% do valor total.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-body font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Pedir via WhatsApp
            </a>
            <p className="text-xs text-muted-foreground mt-4">
              Retirada: Rua José Vila Busquets, 240 — Jardim dos Álamos
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ═══════════════════════════════ Sub-components ═══════════════════════════════ */

const MenuCard = ({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-card rounded-3xl p-6 md:p-8 mb-6 shadow-sm border border-border"
  >
    <div className="flex items-center gap-3 mb-5">
      {icon}
      <div>
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-body">{title}</span>
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">{subtitle}</h3>
      </div>
    </div>
    {children}
  </motion.div>
);

const FlavorTier = ({ title, flavors, color }: { title: string; flavors: string[]; color: string }) => (
  <div className="mb-4 last:mb-0">
    <h4 className="font-heading text-sm font-semibold text-foreground mb-2">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {flavors.map((f: string) => (
        <span key={f} className={`${color} text-xs px-3 py-1.5 rounded-full`}>
          {f}
        </span>
      ))}
    </div>
  </div>
);

const PriceTable = ({ sizes, prices }: { sizes: any[]; prices: any }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-primary/20">
          <th className="text-left py-2.5 px-3 font-heading text-foreground">Tam.</th>
          <th className="text-center py-2.5 px-3 font-heading text-primary">Tradicional</th>
          <th className="text-center py-2.5 px-3 font-heading text-accent">Premium</th>
          <th className="text-center py-2.5 px-3 font-heading text-chocolate">Supreme</th>
        </tr>
      </thead>
      <tbody>
        {sizes.map((s: any, i: number) => {
          const p = prices[s.sigla];
          return (
            <tr key={s.sigla} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
              <td className="py-2.5 px-3 font-semibold text-foreground">{s.sigla}</td>
              <td className="py-2.5 px-3 text-center text-muted-foreground">{p ? formatPrice(p.tradicional) : "—"}</td>
              <td className="py-2.5 px-3 text-center text-muted-foreground">{p ? formatPrice(p.premium) : "—"}</td>
              <td className="py-2.5 px-3 text-center text-muted-foreground">{p ? formatPrice(p.supreme) : "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default Cardapio;
