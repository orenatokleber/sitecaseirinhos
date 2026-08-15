import { useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Info,
  Cake,
  Candy,
  RectangleHorizontal,
  Store,
  MapPin,
  Camera,
  PartyPopper,
  Croissant,
  Gift,
  Star
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { getPublicImageUrl } from "@/lib/supabase";
import { normalizeWhatsApp } from "@/lib/utils";
import {
  useCakeSizes,
  useCakeCategories,
  useCakePrices,
  useCakeFlavors,
  useCakeRectangular,
  useCakeAddons,
  useCakeAddonPrices,
  useSweetTypes,
  useSweetFlavors,
  useSweetPackages,
} from "@/hooks/useCardapio";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/* ─── helpers ──────────────────────────────── */
const formatPrice = (v: number | null | undefined) =>
  v === null || v === undefined
    ? "—"
    : `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type OrderItem = {
  id: string;
  kind: "round" | "rectangular" | "sweet" | "manual";
  title: string;
  details: string[];
  price: number | null;
  consult: boolean;
  qty: number;
  image?: string | null;
};

type CategoryKind = "round" | "rectangular" | "sweet";
type MainCategory = string;

/* ─── UI Components ────────────────────────── */

const StepHeader = ({ number, title, className = "" }: { number: number; title: string, className?: string }) => (
  <div className={`flex items-center gap-3 mb-4 ${className}`}>
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8c3a40] text-white font-bold text-xs shrink-0">
      {number}
    </div>
    <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
  </div>
);

const RadioCard = ({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon?: any;
  title: string;
  subtitle?: string | null;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all duration-300 min-h-[100px] ${
      active
        ? "border-[#8c3a40] bg-[#f9f2f2] shadow-sm ring-1 ring-[#8c3a40]/20"
        : "border-border bg-card hover:border-[#8c3a40]/40 hover:bg-[#f9f2f2]/40"
    }`}
  >
    <div className="flex w-full items-start justify-between">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-[#8c3a40]/10 text-[#8c3a40]" : "bg-muted text-muted-foreground"}`}>
        {Icon ? <Icon size={20} /> : <Cake size={20} />}
      </div>
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
          active ? "border-[#8c3a40] bg-[#8c3a40] text-white" : "border-muted-foreground/30 bg-transparent"
        }`}
      >
        {active && <Check size={12} strokeWidth={3} />}
      </div>
    </div>
    <div className="mt-3">
      <span className="block font-heading text-base font-bold text-foreground leading-tight">
        {title}
      </span>
      {subtitle && <span className="block mt-0.5 font-body text-xs text-muted-foreground line-clamp-1">{subtitle}</span>}
    </div>
  </button>
);

const OptionChip = ({
  active,
  onClick,
  children,
  meta,
  price,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  meta?: string;
  price?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
      active
        ? "border-[#8c3a40] bg-[#f9f2f2] shadow-sm ring-1 ring-[#8c3a40]/30"
        : "border-border bg-card hover:border-[#8c3a40]/40"
    }`}
  >
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        active ? "border-[#8c3a40] bg-[#8c3a40] text-white" : "border-muted-foreground/30"
      }`}
    >
      {active && <Check size={12} strokeWidth={3} />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-body text-sm font-semibold text-foreground">{children}</span>
      {meta && <span className="mt-0.5 block font-body text-xs text-muted-foreground">{meta}</span>}
      {price && <span className="mt-0.5 block font-body text-xs font-bold text-chocolate">{price}</span>}
    </span>
  </button>
);

const InlineSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 mt-4 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    <span className="h-px flex-1 bg-border" />
    {children}
    <span className="h-px flex-1 bg-border" />
  </p>
);

/* ─── Main Component ───────────────────────── */

type CatState = {
  selectedProduct: { id: string, kind: CategoryKind } | null;
  manualDescription: string;
  sizeId: string;
  flavorId: string;
  roundAddons: string[];
  rectClass: "class1" | "class2";
  rectAddons: string[];
  sweetFlavorId: string;
  sweetPackageId: string;
};

const defaultCatState: CatState = {
  selectedProduct: null,
  manualDescription: "",
  sizeId: "",
  flavorId: "",
  roundAddons: [],
  rectClass: "class1",
  rectAddons: [],
  sweetFlavorId: "",
  sweetPackageId: ""
};

const toggleArr = (list: string[], val: string) => list.includes(val) ? list.filter(x => x !== val) : [...list, val];

const MontarPedido = () => {
  const { data: settings } = useSiteSettings();

  const lojaConfig = settings?.loja_config as any || {
    activeCategories: { bolo: true, doces: true, salgados: true, kit_festa: true, pasta_americana: true, presentear: true },
    customTitles: { bolo: "~100g/pessoa", doces: "3-4/pessoa", salgados: "10-15/pessoa", kit_festa: "", pasta_americana: "", presentear: "" },
    delivery: { acceptsDelivery: true, deliveryFee: "0", acceptsPickup: true },
    whatsappMsg: { greeting: "Olá {nome}! Aqui é {loja}", signoff: "Qualquer ajuste é só me avisar. Obrigada!" },
    customCategories: []
  };

  const contactSettings = settings?.contact as any;
  const whatsapp = normalizeWhatsApp(contactSettings?.whatsapp) || "5500000000000";
  const lojaName = contactSettings?.name || "Nossa Loja";

  // Data hooks
  const { data: sizes = [] } = useCakeSizes(true);
  const { data: categories = [] } = useCakeCategories(true);
  const { data: prices = [] } = useCakePrices();
  const { data: flavors = [] } = useCakeFlavors(true);
  const { data: rectangular = [] } = useCakeRectangular(true);
  const { data: addons = [] } = useCakeAddons(true);
  const { data: addonPrices = [] } = useCakeAddonPrices();
  const { data: sweetTypes = [] } = useSweetTypes(true);
  const { data: sweetFlavors = [] } = useSweetFlavors(true);
  const { data: sweetPackages = [] } = useSweetPackages();

  const standardCats = categories.filter((c) => c.type !== "addon");
  
  const boloProducts = useMemo(() => {
    const arr = [];
    standardCats.forEach(c => arr.push({ id: c.id, kind: "round" as const, title: c.name, subtitle: c.description || "Bolos redondos", icon: Cake }));
    rectangular.forEach(r => arr.push({ id: r.id, kind: "rectangular" as const, title: r.name, subtitle: "Bolos retangulares", icon: RectangleHorizontal }));
    return arr;
  }, [standardCats, rectangular]);

  const doceProducts = useMemo(() => {
    return sweetTypes.map(t => ({ id: t.id, kind: "sweet" as const, title: t.name, subtitle: t.description || "Docinhos", icon: Candy }));
  }, [sweetTypes]);

  // Main Category Hierarchy
  const mainCats = useMemo(() => {
    const defaultCats = [
      { id: "bolo", title: "Bolo", subtitle: lojaConfig.customTitles.bolo, icon: Cake, isManual: false },
      { id: "doces", title: "Doces", subtitle: lojaConfig.customTitles.doces, icon: Candy, isManual: false },
      { id: "salgados", title: "Salgados", subtitle: lojaConfig.customTitles.salgados, icon: Croissant, isManual: true },
      { id: "kit_festa", title: "Kit Festa", subtitle: lojaConfig.customTitles.kit_festa, icon: PartyPopper, isManual: true },
      { id: "pasta_americana", title: "Pasta Americana", subtitle: lojaConfig.customTitles.pasta_americana, icon: Cake, isManual: true },
      { id: "presentear", title: "Para Presentear", subtitle: lojaConfig.customTitles.presentear, icon: Gift, isManual: true },
    ].filter(cat => lojaConfig.activeCategories[cat.id]);

    const customCats = (lojaConfig.customCategories || [])
      .filter((c: any) => c.isActive)
      .map((c: any) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        icon: Star,
        isManual: true
      }));

    return [...defaultCats, ...customCats];
  }, [lojaConfig]);

  // UI state
  const [selectedMainCats, setSelectedMainCats] = useState<string[]>([]);
  const [catStates, setCatStates] = useState<Record<string, CatState>>({});
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Contact form
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "",
    date: "", 
    details: "",
    deliveryMethod: lojaConfig.delivery.acceptsPickup ? "pickup" : "delivery" as "pickup" | "delivery"
  });

  const step2Ref = useRef<HTMLElement>(null);
  const step3Ref = useRef<HTMLElement>(null);

  const updateCatState = (catId: string, updates: Partial<CatState>) => {
    setCatStates(prev => ({
      ...prev,
      [catId]: { ...(prev[catId] || defaultCatState), ...updates }
    }));
  };

  const handleToggleMainCat = (id: string) => {
    setSelectedMainCats(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(c => c !== id);
      } else {
        setTimeout(() => {
          step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return [...prev, id];
      }
    });
  };

  const handleSelectProduct = (catId: string, id: string, kind: CategoryKind) => {
    updateCatState(catId, {
      selectedProduct: { id, kind },
      sizeId: "",
      flavorId: "",
      roundAddons: [],
      rectClass: "class1",
      rectAddons: [],
      sweetFlavorId: "",
      sweetPackageId: ""
    });
  };

  const roundAddonList = addons.filter((a) => a.applies_to !== "rectangular");
  const rectAddonList = addons.filter((a) => a.applies_to === "rectangular");

  const priceOf = (categoryId: string, sizeIdArg: string) =>
    prices.find((p) => p.category_id === categoryId && p.size_id === sizeIdArg)?.price ?? null;

  const addonPriceInfo = useCallback(
    (addonId: string, sizeIdArg?: string) => {
      const addon = addons.find((a) => a.id === addonId);
      if (!addon) return { price: null as number | null, consult: true, label: "" };
      if (addon.pricing_type === "consult") return { price: null, consult: true, label: "a consultar" };
      if (addon.pricing_type === "per_size") {
        const p = addonPrices.find((ap) => ap.addon_id === addonId && ap.size_id === sizeIdArg)?.price ?? null;
        return { price: p, consult: p === null, label: p !== null ? formatPrice(p) : "a consultar" };
      }
      const p = addonPrices.find((ap) => ap.addon_id === addonId)?.price ?? null;
      return {
        price: p,
        consult: p === null,
        label: p !== null ? `${addon.pricing_type === "from" ? "a partir de " : ""}${formatPrice(p)}` : "a consultar",
      };
    },
    [addons, addonPrices],
  );

  /* ─── Compute draft item for a specific category ─────── */
  const computeDraftForCat = useCallback((catId: string): OrderItem | null => {
    const state = catStates[catId] || defaultCatState;
    const activeMainCatObj = mainCats.find(c => c.id === catId);
    if (!activeMainCatObj) return null;

    if (activeMainCatObj.isManual) {
      if (!state.manualDescription.trim()) return null;
      return {
        id: `draft-manual-${catId}`,
        kind: "manual",
        title: activeMainCatObj.title,
        details: [`Descrição: ${state.manualDescription}`],
        price: null,
        consult: true,
        qty: 1
      };
    }

    if (!state.selectedProduct) return null;
    const { id, kind } = state.selectedProduct;

    if (kind === "round") {
      const cat = categories.find((c) => c.id === id);
      if (!cat || !state.sizeId) return null;
      const size = sizes.find((s) => s.id === state.sizeId);
      const flavor = flavors.find((f) => f.id === state.flavorId);
      const base = cat.type === "consult" ? null : priceOf(id, state.sizeId);
      let total = base;
      let consult = cat.type === "consult" || base === null;
      const details = [
        `Tamanho: ${size?.name}${size?.ring_size ? ` (${size.ring_size})` : ""}`,
        `Linha: ${cat.name}`,
      ];
      if (flavor) details.push(`Sabor: ${flavor.name}`);
      state.roundAddons.forEach((aid) => {
        const a = addons.find((x) => x.id === aid);
        const info = addonPriceInfo(aid, state.sizeId);
        details.push(`Adicional: ${a?.name} (${info.label})`);
        if (info.price !== null && total !== null) total += info.price;
        else consult = true;
      });
      return {
        id: `draft-round-${catId}`,
        kind: "round",
        title: `Bolo ${cat.name} — ${size?.name ?? ""}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
        image: cat.image_url ? getPublicImageUrl(cat.image_url) : null,
      };
    }

    if (kind === "rectangular") {
      const r = rectangular.find((x) => x.id === id);
      if (!r) return null;
      const base = state.rectClass === "class1" ? r.class1_price ?? null : r.class2_price ?? null;
      let total = base;
      let consult = base === null;
      const details = [
        `Modelo: ${r.name}${r.dimensions ? ` (${r.dimensions})` : ""}`,
        `Linha: ${state.rectClass === "class1" ? "Tradicional" : "Premium"}`,
      ];
      if (r.slices) details.push(`Fatias: ${r.slices}`);
      state.rectAddons.forEach((aid) => {
        const a = addons.find((x) => x.id === aid);
        const info = addonPriceInfo(aid);
        details.push(`Adicional: ${a?.name} (${info.label})`);
        if (info.price !== null && total !== null) total += info.price;
        else consult = true;
      });
      return {
        id: `draft-rect-${catId}`,
        kind: "rectangular",
        title: `Bolo retangular ${r.name}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
      };
    }

    if (kind === "sweet") {
      if (!state.sweetPackageId) return null;
      const t = sweetTypes.find((x) => x.id === id);
      const pkg = sweetPackages.find((x) => x.id === state.sweetPackageId);
      const fl = sweetFlavors.find((x) => x.id === state.sweetFlavorId);
      const details = [`Quantidade: ${pkg?.quantity} unidades`];
      if (fl) details.push(`Sabor: ${fl.name}`);
      return {
        id: `draft-sweet-${catId}`,
        kind: "sweet" as const,
        title: `Doces — ${t?.name ?? ""}`,
        details,
        price: pkg?.price ?? null,
        consult: pkg?.price === undefined,
        qty: 1,
        image: t?.image_url,
      };
    }

    return null;
  }, [
    catStates, mainCats, categories, sizes, flavors, prices, addons, addonPrices,
    rectangular, sweetTypes, sweetFlavors, sweetPackages, addonPriceInfo
  ]);

  const draftItems = useMemo(() => {
    return selectedMainCats
      .map(catId => computeDraftForCat(catId))
      .filter((d): d is OrderItem => d !== null);
  }, [selectedMainCats, computeDraftForCat]);


  const addItem = (catId: string) => {
    const draft = computeDraftForCat(catId);
    if (!draft) return;
    const stamp = Date.now();
    setItems((prev) => [...prev, { ...draft, id: `${stamp}-${catId}` }]);
    
    // Clear only this category's configuration state so they can add another one of the same type if they want
    updateCatState(catId, defaultCatState);
    
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  /* ─── Cart operations ───────────────────── */

  const changeQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)),
    );

  const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

  const total = items.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0);
  const draftTotal = draftItems.reduce((sum, it) => sum + (it.price ?? 0), 0);
  const displayTotal = total + draftTotal;
  
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0) + draftItems.length;

  /* ─── WhatsApp ──────────────────────────── */
  const sendWhatsApp = () => {
    const finalItems = [...items, ...draftItems];
    const finalTotal = finalItems.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0);
    const finalHasConsult = finalItems.some((it) => it.consult);

    const lines = finalItems.map((it, i) => {
      const p = it.consult ? "valor a consultar" : formatPrice((it.price ?? 0) * it.qty);
      return `${i + 1}) ${it.title} — ${it.qty}x — ${p}\n   ${it.details.join("\n   ")}`;
    });

    let deliveryStr = "";
    if (form.deliveryMethod === "pickup") {
      deliveryStr = "Retirar no local";
    } else {
      const fee = Number(lojaConfig.delivery.deliveryFee || 0);
      deliveryStr = `Entrega (${fee > 0 ? `Taxa: R$ ${fee.toFixed(2)}` : "A combinar"})`;
    }

    const orderText = 
      `\n\n*Resumo do Pedido*\n` +
      `${lines.join("\n\n")}\n\n` +
      `Subtotal estimado: ${formatPrice(finalTotal)}${finalHasConsult ? " (+ itens a consultar)" : ""}\n\n` +
      `*Seus Dados:*\n` +
      `Nome: ${form.name}\n` +
      `Telefone: ${form.phone}\n` +
      (form.email ? `E-mail: ${form.email}\n` : "") +
      `Data desejada: ${form.date}\n` +
      `Forma de Recebimento: ${deliveryStr}\n` +
      `Observações: ${form.details || "—"}\n\n`;

    let greeting = lojaConfig.whatsappMsg.greeting.replace("{nome}", form.name).replace("{loja}", lojaName);
    let signoff = lojaConfig.whatsappMsg.signoff;
    
    const msg = greeting + orderText + signoff;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  
  /* ─── Render ────────────────────────────── */
  return (
    <main className="min-h-screen bg-[#fcf8f8] pb-32 pt-20">
      <Helmet>
        <title>Monte seu Pedido | Caseirinhos</title>
        <meta
          name="description"
          content="Monte seu pedido de forma fácil e envie direto pelo WhatsApp."
        />
      </Helmet>

      {/* Header Info */}
      <div className="container mx-auto px-4 py-6 text-center max-w-2xl">
        <div className="inline-flex items-center justify-center bg-[#8c3a40]/10 text-[#8c3a40] px-3 py-1 rounded-full text-xs font-bold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c3a40] mr-2 animate-pulse"></span>
          Encomendas abertas
        </div>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Monte seu pedido com carinho. Calculamos o valor na hora e você finaliza pelo WhatsApp.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-xl space-y-10">
        
        {/* STEP 1: Main Category */}
        <section id="step-1">
          <StepHeader number={1} title="O que você vai pedir?" />
          <p className="text-sm text-muted-foreground mb-4">Você pode selecionar mais de uma opção para fazer todo o pedido de uma só vez.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {mainCats.map((cat) => (
              <RadioCard
                key={cat.id}
                title={cat.title}
                subtitle={cat.subtitle}
                icon={cat.icon}
                active={selectedMainCats.includes(cat.id)}
                onClick={() => handleToggleMainCat(cat.id)}
              />
            ))}
          </div>
        </section>

        {/* STEP 2: Personalize */}
        <AnimatePresence mode="wait">
          {selectedMainCats.length > 0 && (
            <motion.section
              id="step-2"
              ref={step2Ref}
              key="step-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-6"
            >
              <StepHeader number={2} title="Personalize seu pedido" />
              
              <div className="space-y-6">
                {selectedMainCats.map(catId => {
                  const catObj = mainCats.find(c => c.id === catId);
                  const state = catStates[catId] || defaultCatState;
                  const isManualCategory = catObj?.isManual;
                  const subProducts = catId === "bolo" ? boloProducts : catId === "doces" ? doceProducts : [];
                  
                  const modalCatFlavors = state.selectedProduct?.kind === "round" ? flavors.filter((f) => f.category_id === state.selectedProduct?.id) : [];
                  const modalSweetFlavors = state.selectedProduct?.kind === "sweet" ? sweetFlavors.filter((f) => f.type_id === state.selectedProduct?.id) : [];
                  const modalSweetPackages = state.selectedProduct?.kind === "sweet" ? sweetPackages
                    .filter((p) => p.type_id === state.selectedProduct?.id)
                    .sort((a, b) => a.quantity - b.quantity) : [];

                  const canAddDraft = computeDraftForCat(catId) !== null;

                  return (
                    <div key={catId} className="bg-white rounded-3xl p-5 border border-border/60 shadow-sm space-y-4">
                      
                      <h3 className="font-heading text-lg font-bold text-[#8c3a40] flex items-center gap-2 border-b border-border pb-3 mb-2">
                         {catObj?.icon && <catObj.icon size={20} />}
                         Opções para {catObj?.title}
                      </h3>

                      {/* 2.1 - Sub-categories selection (if bolo or doces) */}
                      {subProducts.length > 0 && (
                        <>
                          <InlineSectionLabel>Selecione a linha *</InlineSectionLabel>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-6">
                            {subProducts.map((p) => (
                              <OptionChip
                                key={`${p.kind}-${p.id}`}
                                active={state.selectedProduct?.id === p.id}
                                onClick={() => handleSelectProduct(catId, p.id, p.kind)}
                                meta={p.subtitle || undefined}
                              >
                                {p.title}
                              </OptionChip>
                            ))}
                          </div>
                        </>
                      )}

                      {/* 2.2 - Manual input for Salgados, Kit Festa etc */}
                      {isManualCategory && (
                        <>
                          <InlineSectionLabel>Descreva seu pedido *</InlineSectionLabel>
                          <textarea
                            rows={4}
                            value={state.manualDescription}
                            onChange={(e) => updateCatState(catId, { manualDescription: e.target.value })}
                            placeholder={`Descreva aqui como você gostaria do seu ${catObj?.title}...`}
                            className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Para essa opção, o valor é 100% a consultar. Nossa equipe passará o orçamento pelo WhatsApp.
                          </p>
                        </>
                      )}

                      {/* 2.3 - Detail options (Round, Rectangular, Sweet) */}
                      {state.selectedProduct?.kind === "round" && (
                        <>
                          <InlineSectionLabel>Tamanho *</InlineSectionLabel>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {sizes.map((s) => {
                              const cat = categories.find((c) => c.id === state.selectedProduct?.id);
                              const p = cat?.type === "consult" ? null : priceOf(state.selectedProduct!.id, s.id);
                              return (
                                <OptionChip
                                  key={s.id}
                                  active={state.sizeId === s.id}
                                  onClick={() => updateCatState(catId, { sizeId: s.id })}
                                  meta={[
                                    s.ring_size ? `Aro ${s.ring_size}` : null,
                                    s.slices ? `${s.slices} fatias` : null,
                                  ].filter(Boolean).join(" · ")}
                                  price={p !== null ? formatPrice(p) : cat?.type === "consult" ? "A consultar" : undefined}
                                >
                                  {s.name}
                                </OptionChip>
                              );
                            })}
                          </div>

                          {modalCatFlavors.length > 0 && (
                            <>
                              <InlineSectionLabel>Sabor</InlineSectionLabel>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {modalCatFlavors.map((f) => (
                                  <OptionChip
                                    key={f.id}
                                    active={state.flavorId === f.id}
                                    onClick={() => updateCatState(catId, { flavorId: f.id })}
                                    meta={f.description || undefined}
                                  >
                                    {f.name}
                                </OptionChip>
                                ))}
                              </div>
                            </>
                          )}

                          {roundAddonList.length > 0 && (
                            <>
                              <InlineSectionLabel>Adicionais</InlineSectionLabel>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {roundAddonList.map((a) => {
                                  const info = addonPriceInfo(a.id, state.sizeId);
                                  return (
                                    <OptionChip
                                      key={a.id}
                                      active={state.roundAddons.includes(a.id)}
                                      onClick={() => updateCatState(catId, { roundAddons: toggleArr(state.roundAddons, a.id) })}
                                      meta={a.description || undefined}
                                      price={info.label}
                                    >
                                      {a.name}
                                    </OptionChip>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {state.selectedProduct?.kind === "rectangular" && (
                        <>
                          {(() => {
                            const r = rectangular.find((x) => x.id === state.selectedProduct?.id);
                            return r ? (
                              <div className="mb-3 flex flex-wrap gap-2 font-body text-xs text-muted-foreground">
                                {r.dimensions && <span className="rounded-full bg-muted/40 px-2.5 py-1">{r.dimensions}</span>}
                                {r.slices && <span className="rounded-full bg-muted/40 px-2.5 py-1">{r.slices} fatias</span>}
                              </div>
                            ) : null;
                          })()}

                          <InlineSectionLabel>Linha *</InlineSectionLabel>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <OptionChip
                              active={state.rectClass === "class1"}
                              onClick={() => updateCatState(catId, { rectClass: "class1" })}
                              price={formatPrice(rectangular.find((r) => r.id === state.selectedProduct?.id)?.class1_price)}
                            >
                              Tradicional
                            </OptionChip>
                            <OptionChip
                              active={state.rectClass === "class2"}
                              onClick={() => updateCatState(catId, { rectClass: "class2" })}
                              price={formatPrice(rectangular.find((r) => r.id === state.selectedProduct?.id)?.class2_price)}
                            >
                              Premium
                            </OptionChip>
                          </div>

                          {rectAddonList.length > 0 && (
                            <>
                              <InlineSectionLabel>Adicionais</InlineSectionLabel>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {rectAddonList.map((a) => {
                                  const info = addonPriceInfo(a.id);
                                  return (
                                    <OptionChip
                                      key={a.id}
                                      active={state.rectAddons.includes(a.id)}
                                      onClick={() => updateCatState(catId, { rectAddons: toggleArr(state.rectAddons, a.id) })}
                                      meta={a.description || undefined}
                                      price={info.label}
                                    >
                                      {a.name}
                                    </OptionChip>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {state.selectedProduct?.kind === "sweet" && (
                        <>
                          {modalSweetFlavors.length > 0 && (
                            <>
                              <InlineSectionLabel>Sabor</InlineSectionLabel>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {modalSweetFlavors.map((f) => (
                                  <OptionChip
                                    key={f.id}
                                    active={state.sweetFlavorId === f.id}
                                    onClick={() => updateCatState(catId, { sweetFlavorId: f.id })}
                                    meta={f.description || undefined}
                                  >
                                    {f.name}
                                  </OptionChip>
                                ))}
                              </div>
                            </>
                          )}

                          <InlineSectionLabel>Quantidade *</InlineSectionLabel>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {modalSweetPackages.map((p) => (
                              <OptionChip
                                key={p.id}
                                active={state.sweetPackageId === p.id}
                                onClick={() => updateCatState(catId, { sweetPackageId: p.id })}
                                price={formatPrice(p.price)}
                              >
                                {p.quantity} unidades
                              </OptionChip>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Botão Adicionar (Apenas limpa o estado DESSA categoria) */}
                      {((subProducts.length > 0 && state.selectedProduct) || isManualCategory) && (
                        <div className="pt-4 border-t border-border mt-4">
                          <button
                            type="button"
                            onClick={() => addItem(catId)}
                            disabled={!canAddDraft}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#8c3a40] text-[#8c3a40] px-4 py-3 font-body text-sm font-semibold transition-all hover:bg-[#8c3a40] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={16} />
                            Adicionar mais {catObj?.title.toLowerCase()} (opcional)
                          </button>
                          <p className="text-center text-xs text-muted-foreground mt-2">
                            Se quiser apenas um {catObj?.title.toLowerCase()}, não precisa clicar acima. Basta preencher e seguir para os dados abaixo.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* STEP 3: Formulario */}
        <section id="step-3" ref={step3Ref} className={(itemCount === 0 && selectedMainCats.length === 0) ? "opacity-50 pointer-events-none" : ""}>
          <StepHeader number={3} title="Seus dados e entrega" />
          
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-border/60 shadow-sm space-y-4">
            
            <div>
              <label className="mb-1.5 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Nome completo *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Maria da Silva"
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Telefone / WhatsApp *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                E-mail (opcional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Data desejada *
              </label>
              <p className="text-[11px] text-muted-foreground mb-2 -mt-1 leading-tight">
                Encomendas com antecedência.
              </p>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Observações
              </label>
              <textarea
                rows={3}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Cores, restrições, mensagem no topo..."
                className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#8c3a40] focus:ring-1 focus:ring-[#8c3a40]"
              />
            </div>

            {/* Delivery Methods dynamic rendering */}
            {(lojaConfig.delivery.acceptsPickup || lojaConfig.delivery.acceptsDelivery) && (
              <div>
                <label className="mb-2 mt-4 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Forma de recebimento *
                </label>
                <div className={`grid gap-3 ${lojaConfig.delivery.acceptsPickup && lojaConfig.delivery.acceptsDelivery ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {lojaConfig.delivery.acceptsPickup && (
                    <button
                      type="button"
                      onClick={() => setForm({...form, deliveryMethod: "pickup"})}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-colors ${
                        form.deliveryMethod === "pickup" ? "border-[#8c3a40] bg-[#f9f2f2] text-[#8c3a40]" : "border-border bg-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Store size={20} />
                      <div className="text-center">
                        <span className="block font-bold text-sm">Retirar no local</span>
                        <span className="block text-[10px]">No ateliê</span>
                      </div>
                    </button>
                  )}
                  {lojaConfig.delivery.acceptsDelivery && (
                    <button
                      type="button"
                      onClick={() => setForm({...form, deliveryMethod: "delivery"})}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-colors ${
                        form.deliveryMethod === "delivery" ? "border-[#8c3a40] bg-[#f9f2f2] text-[#8c3a40]" : "border-border bg-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <MapPin size={20} />
                      <div className="text-center">
                        <span className="block font-bold text-sm">Entrega</span>
                        <span className="block text-[10px]">
                          {Number(lojaConfig.delivery.deliveryFee || 0) > 0 ? `Taxa: R$ ${Number(lojaConfig.delivery.deliveryFee).toFixed(2)}` : 'A combinar'}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reference Photo Upload Mockup */}
            <div className="pt-2">
              <label className="mb-2 block font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Foto de referência (opcional)
              </label>
              <button type="button" className="w-full border-2 border-dashed border-[#8c3a40]/30 rounded-2xl bg-[#f9f2f2]/50 p-6 flex flex-col items-center justify-center gap-2 text-center hover:bg-[#f9f2f2] transition-colors">
                 <div className="bg-[#8c3a40]/10 text-[#8c3a40] p-3 rounded-2xl mb-1">
                   <Camera size={24} />
                 </div>
                 <span className="font-heading font-bold text-sm text-[#8c3a40]">ADICIONAR FOTO</span>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Toque para escolher ou tirar uma foto</span>
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* ─── STICKY BOTTOM BAR ───────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-5 py-4 max-w-xl flex items-center justify-between">
          <div>
            <p className="font-heading text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
              Total estimado
            </p>
            <p className="font-heading text-xl font-bold text-foreground leading-none">
              {formatPrice(displayTotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            disabled={itemCount === 0}
            className="flex items-center gap-2 rounded-full bg-[#c28e8e] px-6 py-2.5 font-body text-sm font-bold text-white shadow-md transition-all hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revisar <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ─── CART DRAWER (Revisar) ───────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md bg-[#fcf8f8]">
          <SheetHeader className="text-left">
            <SheetTitle className="font-heading text-2xl text-[#8c3a40]">
              Revisar Pedido
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Confirme seus itens e envie para o WhatsApp
            </SheetDescription>
          </SheetHeader>

          {/* Items list */}
          <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-2">
            {[...(items), ...draftItems].length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag size={40} className="mb-3 text-muted-foreground/30" />
                <p className="font-body text-sm text-muted-foreground">
                  Seu pedido está vazio.
                </p>
              </div>
            ) : (
              [...(items), ...draftItems].map((it, idx) => {
                const isDraft = it.id.startsWith('draft');
                
                return (
                  <div
                    key={`${it.id}-${idx}`}
                    className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading text-base font-bold text-foreground leading-tight pr-4">{it.title}</p>
                      {!isDraft && (
                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={() => removeItem(it.id)}
                          className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1 font-body text-xs text-muted-foreground">
                      {it.details.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                      {!isDraft ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => changeQty(it.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="font-body text-sm font-bold">{it.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(it.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#8c3a40] bg-[#8c3a40]/10 px-2 py-1 rounded-md">Editando agora</span>
                      )}
                      <span className="font-heading text-base font-bold text-foreground">
                        {it.consult ? "A consultar" : formatPrice((it.price ?? 0) * it.qty)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-4 border-t border-border pt-4 pb-4">
            <div className="flex items-center justify-between font-heading text-lg font-bold text-foreground mb-4">
              <span>Total Estimado</span>
              <span className="text-[#8c3a40]">{formatPrice(displayTotal)}</span>
            </div>
            
            {!form.name.trim() || !form.phone.trim() || !form.date ? (
              <div className="bg-orange-50 text-orange-800 p-3 rounded-xl text-xs font-bold flex gap-2 items-start">
                <Info size={16} className="shrink-0 mt-0.5" />
                Por favor, preencha seus dados (Nome, Telefone e Data) no Passo 3 da tela anterior para liberar o envio.
              </div>
            ) : null}

            <button
              type="button"
              onClick={sendWhatsApp}
              disabled={itemCount === 0 || !form.name.trim() || !form.phone.trim() || !form.date}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-4 font-body text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#25D366]/20 transition-all hover:shadow-xl hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none mt-4"
            >
              Enviar pelo WhatsApp <ArrowRight size={16} />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default MontarPedido;
