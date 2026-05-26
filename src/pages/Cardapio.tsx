import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSettings, useProducts } from "@/hooks/useSiteContent";
import { getPublicImageUrl } from "@/lib/supabase";
import { Cake, Cookie, Sparkles, ChefHat, MessageCircle, Star, CircleDot, Crown } from "lucide-react";
import InstagramFeed from "@/components/InstagramFeed";
import massaBrancaDefault from "@/assets/massa-branca.jpg";
import massaChocolateDefault from "@/assets/massa-chocolate.jpg";
import massaRedVelvetDefault from "@/assets/massa-red-velvet.jpg";
import boloCasamento from "@/assets/caseirinhos-85.webp";
import cakeChocolate from "@/assets/caseirinhos-83.webp";

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
      { nome: "Bolo de Corte", descricao: "Coberto com chantininho e decoração simples." },
      { nome: "Bolo Retangular Decorado", descricao: "2 camadas de recheio, decoração personalizada." },
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
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", event: "", date: "", details: "" });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá! Gostaria de um orçamento.\n\nNome: ${orderForm.name}\nTelefone: ${orderForm.phone}\nEvento: ${orderForm.event}\nData: ${orderForm.date}\nDetalhes: ${orderForm.details}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const bolosRedondos = menu.bolos_redondos || defaultMenu.bolos_redondos;
  const bolosRetangulares = menu.bolos_retangulares || defaultMenu.bolos_retangulares;
  const decoracao = menu.decoracao || defaultMenu.decoracao;
  const doces = menu.doces || defaultMenu.doces;
  const complementos = menu.complementos || defaultMenu.complementos;

  const galleryProducts = products?.filter((p: any) => p.image_url) || [];

  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer uma encomenda. Pode me ajudar?")}`;

  return (
    <main className="pt-24 pb-8">
      {/* Hero */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-script text-2xl md:text-3xl text-primary">Nossas delícias</span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Cardápio de Encomendas
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4" />
            <p className="text-muted-foreground max-w-lg mx-auto font-body leading-relaxed">
              Cada criação é feita artesanalmente com ingredientes selecionados.
              Escolha o estilo perfeito para sua celebração.
            </p>
          </motion.div>

          {/* Section tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {sectionTabs.map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(tab.key)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-body font-semibold transition-all duration-300 border ${
                  activeSection === tab.key
                    ? "bg-chocolate text-white border-chocolate shadow-lg shadow-chocolate/20"
                    : "bg-card text-chocolate/70 hover:bg-secondary border-border hover:border-chocolate/30"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {/* ══════════════════════════════ BOLOS ══════════════════════════════ */}
        {activeSection === "bolos" && (
          <motion.section
            key="bolos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="pb-16"
          >
            <div className="container mx-auto px-4 max-w-5xl">
              {/* Sub-tabs */}
              <div className="flex justify-center gap-3 mb-12">
                {[
                  { key: "redondos" as const, label: "Redondos" },
                  { key: "retangulares" as const, label: "Retangulares" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setBoloTab(t.key)}
                    className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 border ${
                      boloTab === t.key
                        ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                        : "bg-transparent text-muted-foreground border-border hover:border-accent/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ─── Bolos Redondos ─── */}
              {boloTab === "redondos" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {/* Estilos com imagem */}
                  <ElegantCard title="Nossos Estilos" subtitle="Escolha a cobertura perfeita" icon={<ChefHat className="w-5 h-5" />} accent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {bolosRedondos.estilos.map((e: any) => {
                        const imgUrl = e.imagem ? getPublicImageUrl(e.imagem) : null;
                        return (
                          <motion.div
                            key={e.nome}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl overflow-hidden bg-background border border-border/60 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {imgUrl && (
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={imgUrl}
                                  alt={e.nome}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="p-4 text-center">
                              <h4 className="font-heading font-bold text-foreground text-base">{e.nome}</h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.descricao}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ElegantCard>

                  {/* Tamanhos */}
                  <ElegantCard title="Tamanhos" subtitle="Dimensões e porções" icon={<CircleDot className="w-5 h-5" />}>
                    <div className="overflow-x-auto -mx-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-accent/20">
                            <th className="text-left py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Tamanho</th>
                            <th className="text-center py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Diâmetro</th>
                            <th className="text-center py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Porções</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bolosRedondos.tamanhos.map((t: any, i: number) => (
                            <tr key={t.sigla} className={`${i % 2 === 0 ? "bg-accent/[0.04]" : ""} hover:bg-accent/[0.08] transition-colors`}>
                              <td className="py-3 px-4 font-heading font-bold text-foreground">{t.sigla}</td>
                              <td className="py-3 px-4 text-center text-muted-foreground">{t.dimensao}</td>
                              <td className="py-3 px-4 text-center text-muted-foreground">{t.porcoes} fatias</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ElegantCard>

                  {/* Massas */}
                  <ElegantCard title="Massas" subtitle="Base da sua criação" icon={<Cake className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {bolosRedondos.massas.map((m: any) => {
                        const defaultImages: Record<string, string> = {
                          "Massa Branca": massaBrancaDefault,
                          "Massa Chocolate": massaChocolateDefault,
                          "Red Velvet": massaRedVelvetDefault,
                        };
                        const imgUrl = m.imagem ? getPublicImageUrl(m.imagem) : defaultImages[m.nome] || null;
                        return (
                          <div
                            key={m.nome}
                            className="group rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-b from-background to-secondary/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-500"
                          >
                            {imgUrl && (
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={imgUrl}
                                  alt={m.nome}
                                  loading="lazy"
                                  width={400}
                                  height={400}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              </div>
                            )}
                            <div className="p-4 text-center">
                              <span className="font-heading font-semibold text-foreground">{m.nome}</span>
                              {m.acrescimo > 0 && (
                                <p className="text-sm text-accent font-medium mt-1">+R$ {m.acrescimo.toFixed(2).replace(".", ",")}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ElegantCard>

                  {/* Sabores */}
                  <ElegantCard title="Sabores" subtitle="Escolha seu preferido" icon={<Star className="w-5 h-5" />}>
                    <FlavorTier
                      title="Tradicionais"
                      flavors={bolosRedondos.sabores_tradicionais}
                      badgeClass="bg-primary/8 text-primary border border-primary/15"
                      icon={<Star className="w-3 h-3" />}
                    />
                    <FlavorTier
                      title="Premium"
                      flavors={bolosRedondos.sabores_premium}
                      badgeClass="bg-accent/10 text-accent border border-accent/20"
                      icon={<Crown className="w-3 h-3" />}
                    />
                    <FlavorTier
                      title="Supreme"
                      flavors={bolosRedondos.sabores_supreme}
                      badgeClass="bg-chocolate/8 text-chocolate border border-chocolate/15"
                      icon={<Sparkles className="w-3 h-3" />}
                    />
                  </ElegantCard>

                  {/* Tabela de Preços */}
                  <ElegantCard title="Investimento" subtitle="Valores por tamanho e categoria" icon={<Sparkles className="w-5 h-5" />} accent>
                    <PriceTable sizes={bolosRedondos.tamanhos} prices={bolosRedondos.precos} />
                    <p className="text-xs text-muted-foreground mt-4 text-center italic">
                      * Cobertura de ganache pode ter valores diferenciados — consulte.
                    </p>
                  </ElegantCard>
                </motion.div>
              )}

              {/* ─── Bolos Retangulares ─── */}
              {boloTab === "retangulares" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {/* Estilos com imagem */}
                  <ElegantCard title="Estilos" subtitle="Retangulares" icon={<ChefHat className="w-5 h-5" />} accent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {bolosRetangulares.estilos.map((e: any) => {
                        const imgUrl = e.imagem ? getPublicImageUrl(e.imagem) : null;
                        return (
                          <motion.div
                            key={e.nome}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl overflow-hidden bg-background border border-border/60 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {imgUrl && (
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={imgUrl}
                                  alt={e.nome}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="p-4 text-center">
                              <h4 className="font-heading font-bold text-foreground text-sm">{e.nome}</h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.descricao}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ElegantCard>

                  <ElegantCard title="Tamanhos" subtitle="Retangulares" icon={<CircleDot className="w-5 h-5" />}>
                    <div className="overflow-x-auto -mx-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-accent/20">
                            <th className="text-left py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Tamanho</th>
                            <th className="text-center py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Dimensão</th>
                            <th className="text-center py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Porções</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bolosRetangulares.tamanhos.map((t: any, i: number) => (
                            <tr key={t.sigla} className={`${i % 2 === 0 ? "bg-accent/[0.04]" : ""} hover:bg-accent/[0.08] transition-colors`}>
                              <td className="py-3 px-4 font-heading font-bold text-foreground">{t.sigla}</td>
                              <td className="py-3 px-4 text-center text-muted-foreground">{t.dimensao}</td>
                              <td className="py-3 px-4 text-center text-muted-foreground">{t.porcoes} fatias</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ElegantCard>

                  <ElegantCard title="Investimento" subtitle="Retangulares" icon={<Sparkles className="w-5 h-5" />} accent>
                    <PriceTable sizes={bolosRetangulares.tamanhos} prices={bolosRetangulares.precos} />
                    {bolosRetangulares.obs && (
                      <p className="text-xs text-muted-foreground mt-4 text-center italic">* {bolosRetangulares.obs}</p>
                    )}
                  </ElegantCard>
                </motion.div>
              )}

              {/* Decoração */}
              <ElegantCard title="Adicionais" subtitle="Decoração & Personalizações" icon={<Sparkles className="w-5 h-5" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {decoracao.map((d: any, i: number) => (
                    <div
                      key={d.item}
                      className="flex justify-between items-center rounded-xl px-4 py-3 text-sm hover:bg-accent/[0.05] transition-colors border-b border-border/30 last:border-0"
                    >
                      <span className="text-foreground font-body">{d.item}</span>
                      <span className="text-accent font-heading font-semibold text-xs ml-3 whitespace-nowrap">{d.preco}</span>
                    </div>
                  ))}
                </div>
              </ElegantCard>

              {/* Instagram Feed */}
              <InstagramFeed
                profileUrl={settings?.contact?.instagram}
                postUrls={settings?.instagram_posts || []}
              />
            </div>
          </motion.section>
        )}

        {/* ══════════════════════════════ DOCES ══════════════════════════════ */}
        {activeSection === "doces" && (
          <motion.section
            key="doces"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="pb-16"
          >
            <div className="container mx-auto px-4 max-w-5xl">
              {/* Tradicionais */}
              <ElegantCard title="Docinhos" subtitle="Tradicionais" icon={<Cookie className="w-5 h-5" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-heading text-xs uppercase tracking-wider text-chocolate mb-4">Pacotes</h4>
                    {doces.tradicionais.pacotes.map((p: any, i: number) => (
                      <div key={p.qtd} className={`flex justify-between items-center py-3 ${i < doces.tradicionais.pacotes.length - 1 ? 'border-b border-border/40' : ''}`}>
                        <span className="text-sm text-foreground font-body">{p.qtd}</span>
                        <span className="text-sm font-heading font-bold text-accent">{formatPrice(p.preco)}</span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-3 italic">{doces.tradicionais.obs}</p>
                  </div>
                  <div>
                    <h4 className="font-heading text-xs uppercase tracking-wider text-chocolate mb-4">Sabores</h4>
                    <div className="flex flex-wrap gap-2">
                      {doces.tradicionais.sabores.map((s: string) => (
                        <span key={s} className="bg-primary/8 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/15 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ElegantCard>

              {/* Gourmet */}
              <ElegantCard title="Docinhos" subtitle="Gourmet" icon={<Crown className="w-5 h-5" />} accent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-heading text-xs uppercase tracking-wider text-chocolate mb-4">Pacotes</h4>
                    {doces.gourmet.pacotes.map((p: any, i: number) => (
                      <div key={p.qtd} className={`flex justify-between items-center py-3 ${i < doces.gourmet.pacotes.length - 1 ? 'border-b border-border/40' : ''}`}>
                        <span className="text-sm text-foreground font-body">{p.qtd}</span>
                        <span className="text-sm font-heading font-bold text-accent">{formatPrice(p.preco)}</span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-3 italic">{doces.gourmet.obs}</p>
                  </div>
                  <div>
                    <h4 className="font-heading text-xs uppercase tracking-wider text-chocolate mb-4">Sabores</h4>
                    <div className="flex flex-wrap gap-2">
                      {doces.gourmet.sabores.map((s: string) => (
                        <span key={s} className="bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-full border border-accent/20 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ElegantCard>

              {/* Especiais */}
              <ElegantCard title="Docinhos" subtitle="Especiais & Personalizados" icon={<Sparkles className="w-5 h-5" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {doces.especiais.map((d: any) => (
                    <div key={d.item} className="flex justify-between items-center rounded-xl px-4 py-3 text-sm hover:bg-accent/[0.05] transition-colors border-b border-border/30 last:border-0">
                      <span className="text-foreground">{d.item}</span>
                      <span className="text-accent font-heading font-semibold text-xs ml-3 whitespace-nowrap">{d.preco}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center italic">
                  * Pedido mínimo: 50 unidades. Pedir com 20 dias de antecedência.
                </p>
              </ElegantCard>
            </div>
          </motion.section>
        )}

        {/* ══════════════════════════════ COMPLEMENTOS ══════════════════════════════ */}
        {activeSection === "complementos" && (
          <motion.section
            key="complementos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="pb-16"
          >
            <div className="container mx-auto px-4 max-w-5xl">
              <ElegantCard title="Complementos" subtitle="Individuais" icon={<Cookie className="w-5 h-5" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {complementos.simples.map((c: any) => (
                    <div key={c.item} className="flex justify-between items-center rounded-xl px-4 py-3 hover:bg-accent/[0.05] transition-colors border-b border-border/30 last:border-0">
                      <span className="text-sm text-foreground font-body">{c.item}</span>
                      <span className="text-sm font-heading font-bold text-accent">{formatPrice(c.preco)}</span>
                    </div>
                  ))}
                </div>
              </ElegantCard>

              <ElegantCard title="Complementos" subtitle="Com Pasta Americana" icon={<Sparkles className="w-5 h-5" />} accent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {complementos.pasta_americana.map((c: any) => (
                    <div key={c.item} className="flex justify-between items-center rounded-xl px-4 py-3 hover:bg-accent/[0.05] transition-colors border-b border-border/30 last:border-0">
                      <span className="text-sm text-foreground font-body">{c.item}</span>
                      <span className="text-sm font-heading font-bold text-accent">{formatPrice(c.preco)}</span>
                    </div>
                  ))}
                </div>
              </ElegantCard>

              {complementos.obs && (
                <p className="text-xs text-muted-foreground text-center italic mt-6">* {complementos.obs}</p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════ ENCOMENDAS ══════════════════════════════ */}
      <section id="encomenda" className="py-16">
        <div className="container mx-auto px-4">
          {/* Showcase cards (configurable) */}
          {(() => {
            const enc = (settings?.encomendas_section as any) || {};
            const isActive = enc.is_active !== false; // default true
            if (!isActive) return null;
            const cards = Array.isArray(enc.cards) && enc.cards.length > 0
              ? enc.cards
              : [
                  { image_url: boloCasamento, title: "Bolos de Casamento", description: "Criações exclusivas e elegantes para o dia mais especial da sua vida." },
                  { image_url: cakeChocolate, title: "Aniversários & Eventos", description: "Bolos temáticos, mesas de doces e sobremesas para celebrações únicas." },
                ];
            return (
              <>
                <SectionTitle
                  script={enc.script || "Sob medida"}
                  title={enc.title || "Encomendas Especiais"}
                  subtitle={enc.subtitle || "Bolos e doces personalizados para tornar seu evento inesquecível"}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                  {cards.map((item: any, i: number) => (
                    <motion.div key={`${item.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl overflow-hidden shadow-sm bg-card border border-border/60">
                      <div className="aspect-video overflow-hidden bg-muted">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* Order form */}
          <div className="max-w-xl mx-auto">
            <SectionTitle script="Orçamento" title="Solicite seu orçamento" />
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {[
                { label: "Nome", key: "name" as const, type: "text" },
                { label: "Telefone", key: "phone" as const, type: "tel" },
                { label: "Tipo de Evento", key: "event" as const, type: "text" },
                { label: "Data do Evento", key: "date" as const, type: "date" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-body text-foreground mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    value={orderForm[field.key]}
                    onChange={(e) => setOrderForm({ ...orderForm, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-body text-foreground mb-1">Detalhes do pedido</label>
                <textarea
                  rows={4}
                  value={orderForm.details}
                  onChange={(e) => setOrderForm({ ...orderForm, details: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  placeholder="Descreva o que você precisa..."
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-accent text-accent-foreground font-body text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity">
                Enviar Orçamento via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Floating CTA button */}
      <motion.button
        onClick={() => document.getElementById("encomenda")?.scrollIntoView({ behavior: "smooth" })}
        className="fixed bottom-20 right-6 z-40 bg-accent text-accent-foreground px-5 py-3 rounded-full shadow-lg font-body font-bold text-sm flex items-center gap-2 hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Cake className="w-4 h-4" />
        Fazer Encomenda
      </motion.button>
    </main>
  );
};

/* ═══════════════════════════════ Sub-components ═══════════════════════════════ */

const ElegantCard = ({
  title,
  subtitle,
  icon,
  children,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45 }}
    className={`rounded-3xl p-7 md:p-9 mb-7 border transition-colors ${
      accent
        ? "bg-gradient-to-br from-card to-accent/[0.03] border-accent/15 shadow-sm"
        : "bg-card border-border/60 shadow-sm"
    }`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
        {icon}
      </div>
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-semibold">{title}</span>
        <h3 className="font-heading text-lg font-bold text-foreground leading-tight">{subtitle}</h3>
      </div>
    </div>
    {children}
  </motion.div>
);

const FlavorTier = ({
  title,
  flavors,
  badgeClass,
  icon,
}: {
  title: string;
  flavors: string[];
  badgeClass: string;
  icon: React.ReactNode;
}) => (
  <div className="mb-5 last:mb-0">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-muted-foreground">{icon}</span>
      <h4 className="font-heading text-xs uppercase tracking-wider font-bold text-chocolate">{title}</h4>
      <div className="flex-1 h-px bg-border/40" />
    </div>
    <div className="flex flex-wrap gap-2">
      {flavors.map((f: string) => (
        <span key={f} className={`${badgeClass} text-xs px-3 py-1.5 rounded-full font-medium`}>
          {f}
        </span>
      ))}
    </div>
  </div>
);

const PriceTable = ({ sizes, prices }: { sizes: any[]; prices: any }) => (
  <div className="overflow-x-auto -mx-2">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-chocolate/15">
          <th className="text-left py-3 px-4 font-heading text-chocolate text-xs uppercase tracking-wider">Tam.</th>
          <th className="text-center py-3 px-4">
            <span className="font-heading text-xs uppercase tracking-wider text-primary">Tradicional</span>
          </th>
          <th className="text-center py-3 px-4">
            <span className="font-heading text-xs uppercase tracking-wider text-accent">Premium</span>
          </th>
          <th className="text-center py-3 px-4">
            <span className="font-heading text-xs uppercase tracking-wider text-chocolate">Supreme</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sizes.map((s: any, i: number) => {
          const p = prices[s.sigla];
          return (
            <tr key={s.sigla} className={`${i % 2 === 0 ? "bg-accent/[0.03]" : ""} hover:bg-accent/[0.07] transition-colors`}>
              <td className="py-3.5 px-4 font-heading font-bold text-foreground">{s.sigla}</td>
              <td className="py-3.5 px-4 text-center font-body font-semibold text-foreground/80">{p ? formatPrice(p.tradicional) : "—"}</td>
              <td className="py-3.5 px-4 text-center font-body font-semibold text-foreground/80">{p ? formatPrice(p.premium) : "—"}</td>
              <td className="py-3.5 px-4 text-center font-body font-semibold text-foreground/80">{p ? formatPrice(p.supreme) : "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default Cardapio;
