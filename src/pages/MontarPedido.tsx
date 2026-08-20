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
  <div className={`flex items-center gap-4 mb-5 ${className}`}>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 text-white font-bold text-sm shadow-md shrink-0">
      {number}
    </div>
    <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
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
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.97 }}
    className={`relative flex flex-col items-start justify-between rounded-3xl border p-6 text-left transition-all duration-300 min-h-[140px] shadow-sm overflow-hidden group ${
      active
        ? "border-primary/50 bg-primary/10 ring-2 ring-primary/20 shadow-primary/10"
        : "border-border/40 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    }`}
  >
    {active && (
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
    )}
    <div className="flex w-full items-start justify-between relative z-10">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${active ? "bg-primary text-white shadow-md shadow-primary/30 scale-110" : "bg-primary/5 text-primary group-hover:bg-primary/10 group-hover:scale-110"}`}>
        {Icon ? <Icon size={24} strokeWidth={2} /> : <Cake size={24} strokeWidth={2} />}
      </div>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          active ? "border-primary bg-primary text-white scale-110 shadow-sm" : "border-border/60 bg-white text-transparent group-hover:border-primary/40"
        }`}
      >
        {active && <Check size={14} strokeWidth={3} />}
      </div>
    </div>
    <div className="mt-5 relative z-10">
      <span className="block font-heading text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
        {title}
      </span>
      {subtitle && <span className="block mt-1 font-body text-xs font-medium tracking-wide text-muted-foreground/80 line-clamp-2">{subtitle}</span>}
    </div>
  </motion.button>
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
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 group overflow-hidden relative ${
      active
        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-sm"
        : "border-border/40 bg-white hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    }`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
    )}
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 relative z-10 ${
        active ? "border-primary bg-primary text-white shadow-sm scale-110" : "border-border/60 bg-white group-hover:border-primary/40"
      }`}
    >
      {active && <Check size={14} strokeWidth={3} />}
    </span>
    <span className="min-w-0 flex-1 relative z-10">
      <span className={`block font-heading text-base font-bold transition-colors ${active ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>{children}</span>
      {meta && <span className="mt-0.5 block font-body text-xs font-medium text-muted-foreground/70">{meta}</span>}
    </span>
    {price && (
      <span className="shrink-0 font-body text-sm font-bold text-chocolate bg-white border border-border/40 px-3 py-1 rounded-full shadow-sm relative z-10 group-hover:border-primary/20 transition-colors">
        {price}
      </span>
    )}
  </motion.button>
);

const InlineSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 mt-5 flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
    <span className="h-[1px] flex-1 bg-border/50" />
    {children}
    <span className="h-[1px] flex-1 bg-border/50" />
  </p>
);

/* ─── Main Component ───────────────────────── */

type CatState = {
  selectedProduct: { id: string, kind: CategoryKind } | null;
  manualDescription: string;
  boloTheme: string;
  sizeId: string;
  flavorId: string;
  roundAddons: string[];
  rectClass: "class1" | "class2";
  rectAddons: string[];
  sweetFlavors: string[];
  sweetPackageId: string;
  salgadosTypes: string[];
  kitFestaSelections: string[];
  pastaAmericanaSelections: string[];
  presentearSelections: string[];
};

const defaultCatState: CatState = {
  selectedProduct: null,
  manualDescription: "",
  boloTheme: "",
  sizeId: "",
  flavorId: "",
  roundAddons: [],
  rectClass: "class1",
  rectAddons: [],
  sweetFlavors: [""],
  sweetPackageId: "",
  salgadosTypes: [""],
  kitFestaSelections: [],
  pastaAmericanaSelections: [],
  presentearSelections: []
};

const toggleArr = (list: string[], val: string) => list.includes(val) ? list.filter(x => x !== val) : [...list, val];

const MontarPedido = () => {
  const { data: settings } = useSiteSettings();

  const lojaConfig = settings?.loja_config as any || {
    activeCategories: { bolo: true, doces: true, salgados: true, kit_festa: true, pasta_americana: true, presentear: true },
    customTitles: { bolo: "~100g/pessoa", doces: "3-4/pessoa", salgados: "10-15/pessoa", kit_festa: "", pasta_americana: "", presentear: "" },
    delivery: { acceptsDelivery: true, deliveryFee: "0", acceptsPickup: true },
    whatsappMsg: { greeting: "Olá {nome}! Aqui é {loja}", signoff: "Qualquer ajuste é só me avisar. Obrigada!" },
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
    standardCats.forEach(c => arr.push({ id: c.id, kind: "round" as const, title: c.name, subtitle: c.description || "Bolos redondos", icon: Cake, image: c.image_url }));
    rectangular.forEach(r => arr.push({ id: r.id, kind: "rectangular" as const, title: r.name, subtitle: "Bolos retangulares", icon: RectangleHorizontal, image: null }));
    return arr;
  }, [standardCats, rectangular]);

  const doceProducts = useMemo(() => {
    return sweetTypes.map(t => ({ id: t.id, kind: "sweet" as const, title: t.name, subtitle: t.description || "Docinhos", icon: Candy, image: t.image_url }));
  }, [sweetTypes]);

  // Main Category Hierarchy
  const mainCats = useMemo(() => {
    const defaultCats = [
      { id: "bolo", title: "Bolo", subtitle: lojaConfig.customTitles?.bolo, icon: Cake, type: "bolo" },
      { id: "doces", title: "Doces", subtitle: lojaConfig.customTitles?.doces, icon: Candy, type: "doces" },
      { id: "salgados", title: "Salgados", subtitle: lojaConfig.customTitles?.salgados, icon: Croissant, type: "salgados" },
      { id: "kit_festa", title: "Kit Festa", subtitle: lojaConfig.customTitles?.kit_festa, icon: PartyPopper, type: "kit_festa" },
      { id: "pasta_americana", title: "Pasta Americana", subtitle: lojaConfig.customTitles?.pasta_americana, icon: Cake, type: "pasta_americana" },
      { id: "presentear", title: "Para Presentear", subtitle: lojaConfig.customTitles?.presentear, icon: Gift, type: "presentear" },
    ].filter(cat => lojaConfig.activeCategories && lojaConfig.activeCategories[cat.id]);

    const customCats = (lojaConfig.customCategories || [])
      .filter((c: any) => c.isActive)
      .map((c: any) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        icon: Star,
        type: "manual"
      }));

    return [...defaultCats, ...customCats];
  }, [lojaConfig]);

  // UI state
  const [selectedMainCats, setSelectedMainCats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
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
    deliveryMethod: lojaConfig.delivery?.acceptsPickup ? "pickup" : "delivery" as "pickup" | "delivery",
    photo: null as string | null
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step2Ref = useRef<HTMLElement>(null);
  const step3Ref = useRef<HTMLElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const { uploadImage } = await import("@/lib/supabase");
      const path = await uploadImage(file, 'orders');
      if (path) {
        setForm(prev => ({ ...prev, photo: path }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
        const newCats = prev.filter(c => c !== id);
        if (activeTab === id) setActiveTab(newCats[0] || null);
        return newCats;
      } else {
        if (!activeTab) setActiveTab(id);
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
      sweetFlavors: [""],
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
    const catType = activeMainCatObj.type;

    if (catType === "kit_festa" || catType === "pasta_americana" || catType === "presentear") {
      let selections = state.kitFestaSelections;
      let opts = lojaConfig.kitFestaOptions || [];
      if (catType === "pasta_americana") {
        selections = state.pastaAmericanaSelections;
        opts = lojaConfig.pastaAmericanaOptions || [];
      } else if (catType === "presentear") {
        selections = state.presentearSelections;
        opts = lojaConfig.presentearOptions || [];
      }

      if (selections.length === 0) return null;
      let total = 0;
      let consult = false;
      const details = selections.map(id => {
        const opt = opts.find((o: any) => o.id === id);
        if (opt?.price === null || opt?.price === undefined) consult = true;
        else total += opt.price;
        return `${opt?.name} (${opt?.price === null || opt?.price === undefined ? 'A consultar' : formatPrice(opt?.price)})`;
      });
      return { id: `draft-${catId}`, kind: "manual", title: activeMainCatObj.title, details, price: consult ? null : total, consult, qty: 1 };
    }

    if (catType === "salgados") {
      const validTypes = state.salgadosTypes.filter(t => t !== "");
      if (validTypes.length === 0 && !state.manualDescription) return null;
      const details = [];
      if (validTypes.length > 0) {
         validTypes.forEach((t, i) => details.push(`Sabor ${i+1}: ${t}`));
      }
      if (state.manualDescription) details.push(`Observações: ${state.manualDescription}`);
      return { id: `draft-${catId}`, kind: "manual", title: activeMainCatObj.title, details, price: null, consult: true, qty: 1 };
    }

    if (catType === "manual") {
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
      if (state.boloTheme) details.push(`Tema: ${state.boloTheme}`);
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
      if (state.boloTheme) details.push(`Tema: ${state.boloTheme}`);
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
      const validFlavors = state.sweetFlavors.filter(f => f !== "");
      
      const details = [`Quantidade: ${pkg?.quantity} unidades`];
      if (validFlavors.length > 0) {
        validFlavors.forEach((fId, i) => {
           const fl = sweetFlavors.find((x) => x.id === fId);
           if (fl) details.push(`Sabor ${i+1}: ${fl.name}`);
        });
      }
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
    rectangular, sweetTypes, sweetFlavors, sweetPackages, addonPriceInfo, lojaConfig
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
      const fee = Number(lojaConfig.delivery?.deliveryFee || 0);
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
      `Observações: ${form.details || "—"}\n` +
      (form.photo ? `Foto de Referência: ${getPublicImageUrl(form.photo)}\n\n` : "\n");

    let greeting = lojaConfig.whatsappMsg?.greeting?.replace("{nome}", form.name).replace("{loja}", lojaName) || "";
    let signoff = lojaConfig.whatsappMsg?.signoff || "";
    
    const msg = greeting + orderText + signoff;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  
  /* ─── Render ────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-white pb-32 pt-24 font-body relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-rose/10 blur-[80px] rounded-full -z-10" />
      <div className="absolute top-80 left-10 w-48 h-48 bg-gold/10 blur-[60px] rounded-full -z-10" />

      <Helmet>
        <title>Monte seu Pedido | Caseirinhos</title>
        <meta
          name="description"
          content="Monte seu pedido de forma fácil e envie direto pelo WhatsApp."
        />
      </Helmet>

      {/* Header Info */}
      <div className="container mx-auto px-4 py-8 text-center max-w-2xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center bg-white/60 backdrop-blur-md border border-border/50 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Encomendas abertas
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-body text-base text-muted-foreground leading-relaxed max-w-md mx-auto"
        >
          Monte seu pedido com carinho. Calculamos o valor na hora e você finaliza pelo WhatsApp com toda facilidade.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 space-y-12 max-w-2xl w-full">
        
        {/* STEP 1: Main Category */}
        <section id="step-1">
          <StepHeader number={1} title="O que você vai pedir?" />
          <p className="text-sm text-muted-foreground/80 mb-5 ml-12">Você pode selecionar mais de uma opção para fazer todo o pedido de uma só vez.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 ml-0 sm:ml-12">
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
              <StepHeader number={2} title="Detalhes do pedido" />
              
              <div className="space-y-8 ml-0 sm:ml-12">
                
                {mainCats.filter(cat => selectedMainCats.includes(cat.id)).map(catObj => {
                  const catId = catObj.id;
                  const state = catStates[catId] || defaultCatState;
                  const catType = catObj?.type;
                  const isManualCategory = catType === "manual";
                  
                  const subProducts = catType === "bolo" ? boloProducts : catType === "doces" ? doceProducts : [];
                  
                  const modalCatFlavors = state.selectedProduct?.kind === "round" ? flavors.filter((f) => f.category_id === state.selectedProduct?.id) : [];
                  const modalSweetFlavors = state.selectedProduct?.kind === "sweet" ? sweetFlavors.filter((f) => f.type_id === state.selectedProduct?.id) : [];
                  const modalSweetPackages = state.selectedProduct?.kind === "sweet" ? sweetPackages
                    .filter((p) => p.type_id === state.selectedProduct?.id)
                    .sort((a, b) => a.quantity - b.quantity) : [];

                  const canAddDraft = computeDraftForCat(catId) !== null;

                  return (
                    <motion.div 
                      key={catId} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5"
                    >
                      <h3 className="font-heading text-xl font-bold text-chocolate flex items-center justify-between border-b border-border/40 pb-4 mb-2">
                         <div className="flex items-center gap-3">
                           <div className="bg-primary/10 p-2 rounded-xl text-primary">
                             {catObj?.icon && <catObj.icon size={22} />}
                           </div>
                           {catObj?.title}
                         </div>
                         {catObj?.subtitle && (
                           <span className="text-[11px] bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full font-body font-bold uppercase tracking-wider">
                             {catObj.subtitle}
                           </span>
                         )}
                      </h3>

                      {/* --- FORMULÁRIO BOLO --- */}
                      {catType === "bolo" && (
                         <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.15em] ml-1">Tema / Decoração</label>
                              <input
                                type="text"
                                value={state.boloTheme}
                                onChange={(e) => updateCatState(catId, { boloTheme: e.target.value })}
                                placeholder="Ex: Jardim encantado, flores, rústico..."
                                className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                              />
                            </div>
                         </div>
                      )}

                      {/* --- CATEGORIAS COM SUB-PRODUTOS (Bolo/Doces) --- */}
                      {subProducts.length > 0 && (
                        <>
                          <InlineSectionLabel>Selecione a linha *</InlineSectionLabel>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8 mt-4">
                            {subProducts.map((p) => {
                              const pImg = p.image ? getPublicImageUrl(p.image) : null;
                              const isActive = state.selectedProduct?.id === p.id;
                              return (
                                <motion.div
                                  key={`${p.kind}-${p.id}`}
                                  onClick={() => handleSelectProduct(catId, p.id, p.kind)}
                                  whileHover={{ y: -4, scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`cursor-pointer rounded-3xl border overflow-hidden transition-all duration-300 shadow-sm flex flex-col h-full bg-white relative ${isActive ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border/60 hover:border-primary/40 hover:shadow-lg"}`}
                                >
                                  {isActive && (
                                    <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full z-10 shadow-sm">
                                      <Check size={16} strokeWidth={3} />
                                    </div>
                                  )}
                                  {pImg && (
                                    <div className="h-40 w-full bg-muted/30 overflow-hidden relative border-b border-border/40">
                                      <img src={pImg} alt={p.title} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="p-5 flex-1 flex flex-col justify-center text-center">
                                    <h4 className={`font-heading text-lg font-bold transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>{p.title}</h4>
                                    {p.subtitle && <p className="text-sm font-body text-muted-foreground mt-1 line-clamp-2">{p.subtitle}</p>}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* --- OPÇÕES CUSTOMIZADAS MANUAIS --- */}
                      {isManualCategory && (
                        <>
                          <InlineSectionLabel>Descreva seu pedido *</InlineSectionLabel>
                          <textarea
                            rows={4}
                            value={state.manualDescription}
                            onChange={(e) => updateCatState(catId, { manualDescription: e.target.value })}
                            placeholder={`Descreva aqui como você gostaria do seu ${catObj?.title}...`}
                            className="w-full resize-none rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                          />
                          <p className="text-[11px] text-muted-foreground/80 mt-3 flex items-start gap-2 bg-muted/30 p-3 rounded-xl">
                            <Info size={14} className="shrink-0 mt-0.5 text-primary" />
                            Para essa opção, o valor é 100% a consultar. Nossa equipe passará o orçamento pelo WhatsApp.
                          </p>
                        </>
                      )}

                      {/* --- SALGADOS --- */}
                      {catType === "salgados" && (
                        <div className="space-y-5 pt-2">
                           <div className="space-y-4">
                             {state.salgadosTypes.map((t, idx) => (
                               <div key={idx} className="space-y-2">
                                 <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.15em] ml-1">TIPO {idx + 1}</label>
                                 <select 
                                   className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white appearance-none"
                                   value={t}
                                   onChange={(e) => {
                                     const arr = [...state.salgadosTypes];
                                     arr[idx] = e.target.value;
                                     updateCatState(catId, { salgadosTypes: arr });
                                   }}
                                 >
                                   <option value="">Selecionar sabor (opcional)</option>
                                   {lojaConfig.salgadosOptions?.map((opt: any) => (
                                      <option key={opt.id} value={opt.name}>{opt.name}</option>
                                   ))}
                                 </select>
                               </div>
                             ))}
                           </div>
                           <button 
                             type="button" 
                             onClick={() => updateCatState(catId, { salgadosTypes: [...state.salgadosTypes, ""] })}
                             className="text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-primary/5 px-3 py-2 rounded-lg"
                           >
                             <Plus size={14} /> Adicionar outro salgado
                           </button>

                           <div className="pt-4">
                              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.15em] ml-1 block mb-2">OBSERVAÇÕES (OPCIONAL)</label>
                              <textarea
                                rows={2}
                                value={state.manualDescription}
                                onChange={(e) => updateCatState(catId, { manualDescription: e.target.value })}
                                placeholder="Descreva quantidades por tipo, detalhes..."
                                className="w-full resize-none rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                              />
                           </div>
                        </div>
                      )}

                      {/* --- KITS, PASTA AMERICANA E PRESENTEAR --- */}
                      {(catType === "kit_festa" || catType === "pasta_americana" || catType === "presentear") && (
                        <div className="space-y-3 pt-2">
                           {(() => {
                             let opts = lojaConfig.kitFestaOptions || [];
                             let selections = state.kitFestaSelections;
                             if (catType === "pasta_americana") {
                               opts = lojaConfig.pastaAmericanaOptions || [];
                               selections = state.pastaAmericanaSelections;
                             } else if (catType === "presentear") {
                               opts = lojaConfig.presentearOptions || [];
                               selections = state.presentearSelections;
                             }

                             return opts.map((opt: any) => (
                               <label key={opt.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer relative backdrop-blur-sm ${selections.includes(opt.id) ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 bg-white/60 hover:border-primary/40 hover:bg-white'}`}>
                                  <div className="mt-0.5">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selections.includes(opt.id) ? 'bg-primary border-primary text-white scale-110' : 'border-muted-foreground/30 bg-transparent'}`}>
                                      {selections.includes(opt.id) && <Check size={12} strokeWidth={4} />}
                                    </div>
                                    <input 
                                      type="checkbox"
                                      className="sr-only"
                                      checked={selections.includes(opt.id)}
                                      onChange={() => {
                                        let newSel = [...selections];
                                        if (newSel.includes(opt.id)) newSel = newSel.filter(id => id !== opt.id);
                                        else newSel.push(opt.id);

                                        if (catType === "kit_festa") updateCatState(catId, { kitFestaSelections: newSel });
                                        if (catType === "pasta_americana") updateCatState(catId, { pastaAmericanaSelections: newSel });
                                        if (catType === "presentear") updateCatState(catId, { presentearSelections: newSel });
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-20">
                                    <span className="block font-heading text-lg font-bold text-foreground leading-tight">{opt.name}</span>
                                    {opt.desc && <span className="block font-body text-xs font-semibold text-muted-foreground/80 mt-1">{opt.desc}</span>}
                                  </div>
                                  <span className="absolute top-5 right-5 text-sm font-bold text-chocolate bg-white px-3 py-1 rounded-full shadow-sm border border-border/40">
                                    {opt.price === null || opt.price === undefined ? "A consultar" : formatPrice(opt.price)}
                                  </span>
                               </label>
                             ));
                           })()}
                        </div>
                      )}


                      {/* --- ROUND CAKE OPTIONS --- */}
                      {state.selectedProduct?.kind === "round" && (
                        <>
                          <InlineSectionLabel>Tamanho *</InlineSectionLabel>
                          <div className="flex flex-col gap-3">
                            {sizes.map((s) => {
                              const cat = categories.find((c) => c.id === state.selectedProduct?.id);
                              const p = cat?.type === "consult" ? null : priceOf(state.selectedProduct!.id, s.id);
                              const isActive = state.sizeId === s.id;
                              
                              return (
                                <motion.button
                                  key={s.id}
                                  type="button"
                                  onClick={() => updateCatState(catId, { sizeId: s.id })}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`flex text-left w-full items-center gap-4 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 relative ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "bg-card border-border/60 hover:border-primary/40 hover:shadow-md"}`}
                                >
                                  {isActive && (
                                    <div className="absolute top-2 right-2 text-primary">
                                      <Check size={16} strokeWidth={3} />
                                    </div>
                                  )}
                                  <div className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "bg-primary text-white" : "bg-accent/10 text-accent"}`}>
                                    <span className="font-heading text-2xl md:text-3xl font-bold">
                                      {s.code}
                                    </span>
                                  </div>
                                  <div className="flex-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 pr-8 text-sm md:text-base text-foreground font-body">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {s.ring_size && <span className="font-bold">{s.ring_size}</span>}
                                      {s.slices != null && (
                                        <>
                                          <span className="text-muted-foreground hidden sm:inline">|</span>
                                          <span className="text-muted-foreground">{s.slices} fatias</span>
                                        </>
                                      )}
                                      {s.weight_kg != null && (
                                        <>
                                          <span className="text-muted-foreground hidden sm:inline">|</span>
                                          <span className="text-muted-foreground">{Number(s.weight_kg).toFixed(1)}kg</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="font-heading font-bold text-chocolate text-lg">
                                      {p !== null ? formatPrice(p) : cat?.type === "consult" ? "A consultar" : ""}
                                    </div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>

                          {modalCatFlavors.length > 0 && (
                            <>
                              <InlineSectionLabel>Sabor</InlineSectionLabel>
                              <div className="flex flex-col gap-2">
                                {modalCatFlavors.map((f) => (
                                  <motion.button
                                    key={f.id}
                                    type="button"
                                    onClick={() => updateCatState(catId, { flavorId: f.id })}
                                    whileHover={{ x: 4 }}
                                    className={`flex text-left flex-col w-full border-l-4 pl-4 py-2 transition-all ${state.flavorId === f.id ? "border-primary bg-primary/5 rounded-r-xl pr-4" : "border-accent/30 hover:border-primary/50"}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className={`font-heading font-bold uppercase text-sm tracking-wide ${state.flavorId === f.id ? "text-primary" : "text-foreground"}`}>
                                        {f.name}
                                      </h4>
                                      {state.flavorId === f.id && <Check size={14} className="text-primary" strokeWidth={3} />}
                                    </div>
                                    {f.description && (
                                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {f.description}
                                      </p>
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                            </>
                          )}

                          {roundAddonList.length > 0 && (
                            <>
                              <InlineSectionLabel>Adicionais</InlineSectionLabel>
                              <div className="flex flex-col gap-3">
                                {roundAddonList.map((a) => {
                                  const info = addonPriceInfo(a.id, state.sizeId);
                                  const isActive = state.roundAddons.includes(a.id);
                                  return (
                                    <motion.button
                                      key={a.id}
                                      type="button"
                                      onClick={() => updateCatState(catId, { roundAddons: toggleArr(state.roundAddons, a.id) })}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`flex text-left w-full items-center gap-4 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 relative ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "bg-card border-border/60 hover:border-primary/40 hover:shadow-md"}`}
                                    >
                                      {isActive && (
                                        <div className="absolute top-2 right-2 text-primary">
                                          <Check size={16} strokeWidth={3} />
                                        </div>
                                      )}
                                      <div className={`w-12 h-full min-h-[4rem] flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "bg-primary text-white" : "bg-accent/10 text-accent"}`}>
                                        <Plus size={20} strokeWidth={isActive ? 3 : 2} />
                                      </div>
                                      <div className="flex-1 flex flex-col justify-center py-3 pr-8">
                                        <div className="flex justify-between items-start gap-2">
                                          <h4 className={`font-heading font-bold text-base leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>{a.name}</h4>
                                          <span className="font-heading font-bold text-chocolate whitespace-nowrap">
                                            {info.price !== null ? formatAddon(info.price) : info.label}
                                          </span>
                                        </div>
                                        {a.description && (
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* --- RECTANGULAR CAKE OPTIONS --- */}
                      {state.selectedProduct?.kind === "rectangular" && (
                        <>
                          <div className="mb-4">
                            {(() => {
                              const r = rectangular.find((x) => x.id === state.selectedProduct?.id);
                              return r ? (
                                <div className="rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden mb-6 mt-4">
                                  <div className="bg-accent/10 px-5 py-3 text-center">
                                    <h3 className="font-heading font-bold text-foreground uppercase text-sm tracking-wider">
                                      {r.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1 font-body">
                                      {[r.dimensions, r.slices ? `${r.slices} fatias` : null, r.weight_kg ? `${Number(r.weight_kg).toFixed(1)} kg` : null]
                                        .filter(Boolean)
                                        .join(" | ")}
                                    </p>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>

                          <InlineSectionLabel>Linha *</InlineSectionLabel>
                          <div className="flex flex-col gap-3">
                            {[
                              { id: "class1", name: "Tradicional", price: rectangular.find((r) => r.id === state.selectedProduct?.id)?.class1_price },
                              { id: "class2", name: "Premium", price: rectangular.find((r) => r.id === state.selectedProduct?.id)?.class2_price }
                            ].map((cls) => {
                               const isActive = state.rectClass === cls.id;
                               return (
                                <motion.button
                                  key={cls.id}
                                  type="button"
                                  onClick={() => updateCatState(catId, { rectClass: cls.id as "class1" | "class2" })}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`flex text-left w-full items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 relative ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "bg-card border-border/60 hover:border-primary/40 hover:shadow-md"}`}
                                >
                                  {isActive && (
                                    <div className="absolute top-2 right-2 text-primary">
                                      <Check size={16} strokeWidth={3} />
                                    </div>
                                  )}
                                  <span className={`font-heading text-lg font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>{cls.name}</span>
                                  <span className="font-heading font-bold text-chocolate text-lg">{formatPrice(cls.price)}</span>
                                </motion.button>
                               );
                            })}
                          </div>

                          {rectAddonList.length > 0 && (
                            <>
                              <InlineSectionLabel>Adicionais</InlineSectionLabel>
                              <div className="flex flex-col gap-3">
                                {rectAddonList.map((a) => {
                                  const info = addonPriceInfo(a.id);
                                  const isActive = state.rectAddons.includes(a.id);
                                  return (
                                    <motion.button
                                      key={a.id}
                                      type="button"
                                      onClick={() => updateCatState(catId, { rectAddons: toggleArr(state.rectAddons, a.id) })}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`flex text-left w-full items-center gap-4 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 relative ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "bg-card border-border/60 hover:border-primary/40 hover:shadow-md"}`}
                                    >
                                      {isActive && (
                                        <div className="absolute top-2 right-2 text-primary">
                                          <Check size={16} strokeWidth={3} />
                                        </div>
                                      )}
                                      <div className={`w-12 h-full min-h-[4rem] flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "bg-primary text-white" : "bg-accent/10 text-accent"}`}>
                                        <Plus size={20} strokeWidth={isActive ? 3 : 2} />
                                      </div>
                                      <div className="flex-1 flex flex-col justify-center py-3 pr-8">
                                        <div className="flex justify-between items-start gap-2">
                                          <h4 className={`font-heading font-bold text-base leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>{a.name}</h4>
                                          <span className="font-heading font-bold text-chocolate whitespace-nowrap">
                                            {info.price !== null ? formatAddon(info.price) : info.label}
                                          </span>
                                        </div>
                                        {a.description && (
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* --- SWEET OPTIONS --- */}
                      {state.selectedProduct?.kind === "sweet" && (
                        <>
                          <InlineSectionLabel>Quantidade *</InlineSectionLabel>
                          <div className="flex flex-col gap-3">
                            {modalSweetPackages.map((p) => {
                              const isActive = state.sweetPackageId === p.id;
                              return (
                                <motion.button
                                  key={p.id}
                                  type="button"
                                  onClick={() => updateCatState(catId, { sweetPackageId: p.id })}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`flex text-left w-full items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 relative ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "bg-card border-border/60 hover:border-primary/40 hover:shadow-md"}`}
                                >
                                  {isActive && (
                                    <div className="absolute top-2 right-2 text-primary">
                                      <Check size={16} strokeWidth={3} />
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? "bg-primary text-white" : "bg-accent/10 text-accent"}`}>
                                      {p.quantity}
                                    </div>
                                    <span className={`font-heading text-lg font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>unidades</span>
                                  </div>
                                  <span className="font-heading font-bold text-chocolate text-lg">{formatPrice(p.price)}</span>
                                </motion.button>
                              );
                            })}
                          </div>

                          {modalSweetFlavors.length > 0 && (
                            <div className="space-y-5 mt-8">
                              <div className="space-y-4">
                                {state.sweetFlavors.map((fl, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.15em] ml-1">SABOR {idx + 1}</label>
                                    <select 
                                      className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white appearance-none"
                                      value={fl}
                                      onChange={(e) => {
                                        const arr = [...state.sweetFlavors];
                                        arr[idx] = e.target.value;
                                        updateCatState(catId, { sweetFlavors: arr });
                                      }}
                                    >
                                      <option value="">Selecionar sabor (opcional)</option>
                                      {modalSweetFlavors.map((f) => (
                                          <option key={f.id} value={f.id}>{f.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                              <button 
                                type="button" 
                                onClick={() => updateCatState(catId, { sweetFlavors: [...state.sweetFlavors, ""] })}
                                className="text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-primary/5 px-3 py-2 rounded-lg"
                              >
                                <Plus size={14} /> Adicionar outro sabor
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Botão Adicionar (Apenas limpa o estado DESSA categoria se for Bolo/Doces) */}
                      {((subProducts.length > 0 && state.selectedProduct) || isManualCategory) && (
                        <div className="pt-6 border-t border-border/40 mt-6">
                          <motion.button
                            whileHover={{ scale: canAddDraft ? 1.01 : 1 }}
                            whileTap={{ scale: canAddDraft ? 0.98 : 1 }}
                            type="button"
                            onClick={() => addItem(catId)}
                            disabled={!canAddDraft}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary text-primary px-5 py-4 font-body text-sm font-bold transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary shadow-sm"
                          >
                            <Plus size={18} strokeWidth={2.5} />
                            Adicionar mais {catObj?.title.toLowerCase()} (opcional)
                          </motion.button>
                          <p className="text-center text-[11px] font-semibold text-muted-foreground/70 mt-3 px-4 leading-relaxed">
                            Se quiser apenas um item desta categoria, não precisa clicar acima. Basta preencher e seguir para os dados abaixo.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* STEP 3: Formulario */}
        <section id="step-3" ref={step3Ref} className={(itemCount === 0 && selectedMainCats.length === 0) ? "opacity-50 pointer-events-none" : ""}>
          <StepHeader number={3} title="Seus dados e entrega" />
          
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 ml-0 sm:ml-12">
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Maria da Silva"
                  className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                  Data desejada *
                </label>
                <p className="text-[10px] text-muted-foreground/70 mb-2 ml-1 font-semibold">
                  Encomendas sujeitas à disponibilidade.
                </p>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                Observações adicionais
              </label>
              <textarea
                rows={3}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Ex: Restrições alimentares, mensagem no topo do bolo, detalhes das cores..."
                className="w-full resize-none rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all hover:bg-white"
              />
            </div>

            {/* Delivery Methods dynamic rendering */}
            {(lojaConfig.delivery?.acceptsPickup || lojaConfig.delivery?.acceptsDelivery) && (
              <div className="pt-2">
                <label className="mb-3 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                  Forma de recebimento *
                </label>
                <div className={`grid gap-4 ${lojaConfig.delivery?.acceptsPickup && lojaConfig.delivery?.acceptsDelivery ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {lojaConfig.delivery?.acceptsPickup && (
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setForm({...form, deliveryMethod: "pickup"})}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                        form.deliveryMethod === "pickup" ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20" : "border-border/60 bg-white/60 text-muted-foreground hover:bg-white hover:border-primary/40"
                      }`}
                    >
                      <Store size={24} strokeWidth={form.deliveryMethod === "pickup" ? 2.5 : 2} />
                      <div className="text-center">
                        <span className="block font-bold text-sm">Retirar no local</span>
                        <span className={`block text-[10px] uppercase tracking-wider mt-1 ${form.deliveryMethod === "pickup" ? "text-primary/70" : "text-muted-foreground/60"}`}>No ateliê</span>
                      </div>
                    </motion.button>
                  )}
                  {lojaConfig.delivery?.acceptsDelivery && (
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setForm({...form, deliveryMethod: "delivery"})}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                        form.deliveryMethod === "delivery" ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20" : "border-border/60 bg-white/60 text-muted-foreground hover:bg-white hover:border-primary/40"
                      }`}
                    >
                      <MapPin size={24} strokeWidth={form.deliveryMethod === "delivery" ? 2.5 : 2} />
                      <div className="text-center">
                        <span className="block font-bold text-sm">Entrega</span>
                        <span className={`block text-[10px] uppercase tracking-wider mt-1 ${form.deliveryMethod === "delivery" ? "text-primary/70" : "text-muted-foreground/60"}`}>
                          {Number(lojaConfig.delivery?.deliveryFee || 0) > 0 ? `Taxa: R$ ${Number(lojaConfig.delivery.deliveryFee).toFixed(2)}` : 'A combinar'}
                        </span>
                      </div>
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Reference Photo Upload */}
            <div className="pt-4">
              <label className="mb-3 block font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ml-1">
                Foto de referência (opcional)
              </label>

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
              />
              
              {form.photo ? (
                <div className="relative rounded-3xl overflow-hidden border-2 border-primary/30 w-full h-48 bg-black/5 flex items-center justify-center">
                  <img src={getPublicImageUrl(form.photo)} alt="Referência" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setForm(prev => ({ ...prev, photo: null }))} 
                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full hover:bg-white shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="w-full border-2 border-dashed border-primary/30 rounded-3xl bg-primary/5 p-8 flex flex-col items-center justify-center gap-3 text-center hover:bg-primary/10 transition-colors group disabled:opacity-50"
                >
                   {isUploadingPhoto ? (
                     <div className="bg-white text-primary p-4 rounded-2xl shadow-sm">
                       <span className="animate-spin block w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                     </div>
                   ) : (
                     <div className="bg-white text-primary p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                       <Camera size={26} strokeWidth={2.5} />
                     </div>
                   )}
                   <div>
                     <span className="block font-heading font-bold text-base text-primary mb-1">
                       {isUploadingPhoto ? "ENVIANDO..." : "ADICIONAR FOTO"}
                     </span>
                     <span className="block text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                       {isUploadingPhoto ? "Aguarde um momento" : "Toque para escolher ou tirar uma foto"}
                     </span>
                   </div>
                </button>
              )}
            </div>

          </div>
        </section>

          </div>
          
          {/* ─── STICKY CART (DESKTOP) ───────────── */}
          <div className="hidden lg:block w-[400px] shrink-0 sticky top-28">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col max-h-[calc(100vh-140px)]">
              <h3 className="font-heading text-2xl font-bold text-chocolate mb-6 border-b border-border/40 pb-4">
                Seu Pedido
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-[200px]">
                {[...(items), ...draftItems].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full opacity-60">
                    <ShoppingBag size={40} className="text-primary/40 mb-3" />
                    <p className="font-heading text-base font-bold text-foreground">Sua sacola está vazia</p>
                  </div>
                ) : (
                  [...(items), ...draftItems].map((it, idx) => {
                    const isDraft = it.id.startsWith('draft');
                    return (
                      <motion.div
                        key={`${it.id}-${idx}`}
                        className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-heading text-base font-bold text-chocolate leading-tight pr-6">{it.title}</p>
                          {!isDraft && (
                            <button type="button" onClick={() => removeItem(it.id)} className="shrink-0 text-muted-foreground/50 hover:text-red-500 p-1">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                          {!isDraft ? (
                            <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-full">
                              <button type="button" onClick={() => changeQty(it.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm"><Minus size={12} /></button>
                              <span className="font-body text-xs font-bold w-4 text-center">{it.qty}</span>
                              <button type="button" onClick={() => changeQty(it.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm"><Plus size={12} /></button>
                            </div>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-gold">Editando...</span>
                          )}
                          <span className="font-heading text-sm font-bold text-foreground">
                            {it.consult ? "A consultar" : formatPrice((it.price ?? 0) * it.qty)}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              <div className="mt-6 border-t border-border/40 pt-5">
                <div className="flex items-center justify-between font-heading text-lg font-bold text-foreground mb-4">
                  <span className="uppercase tracking-widest text-[10px] text-muted-foreground">Total Estimado</span>
                  <span className="text-chocolate text-2xl">{formatPrice(displayTotal)}</span>
                </div>
                
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  disabled={itemCount === 0 || !form.name.trim() || !form.phone.trim() || !form.date}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 font-body text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#25D366]/30 transition-all hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STICKY BOTTOM BAR (MOBILE ONLY) ───────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-border/40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="container mx-auto px-5 py-4 max-w-2xl flex items-center justify-between">
          <div>
            <p className="font-heading text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1.5">
              Total estimado
            </p>
            <p className="font-heading text-2xl font-bold text-chocolate leading-none">
              {formatPrice(displayTotal)}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: itemCount > 0 ? 1.05 : 1 }}
            whileTap={{ scale: itemCount > 0 ? 0.95 : 1 }}
            type="button"
            onClick={() => setCartOpen(true)}
            disabled={itemCount === 0}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-body text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Revisar <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* ─── CART DRAWER (Revisar) ───────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md bg-gradient-to-b from-cream to-white border-l border-border/30">
          <SheetHeader className="text-left mt-2">
            <SheetTitle className="font-heading text-3xl font-bold text-chocolate">
              Seu Pedido
            </SheetTitle>
            <SheetDescription className="text-muted-foreground/80 font-body text-sm">
              Revise os itens e confira seus dados antes de enviar.
            </SheetDescription>
          </SheetHeader>

          {/* Items list */}
          <div className="mt-8 flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {[...(items), ...draftItems].length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  <ShoppingBag size={48} className="text-primary/40" />
                </div>
                <p className="font-heading text-lg font-bold text-foreground">Sua sacola está vazia</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Adicione algumas delícias para começar.
                </p>
              </div>
            ) : (
              [...(items), ...draftItems].map((it, idx) => {
                const isDraft = it.id.startsWith('draft');
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${it.id}-${idx}`}
                    className="rounded-3xl border border-border/50 bg-white/80 backdrop-blur-sm p-5 shadow-sm relative overflow-hidden"
                  >
                    {isDraft && (
                      <div className="absolute top-0 right-0 bg-gold text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                        Editando agora
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <p className="font-heading text-lg font-bold text-chocolate leading-tight pr-6">{it.title}</p>
                      {!isDraft && (
                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={() => removeItem(it.id)}
                          className="shrink-0 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1.5 font-body text-xs font-semibold text-muted-foreground/80">
                      {it.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <span className="text-primary mt-0.5">•</span>
                           <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 relative z-10">
                      {!isDraft ? (
                        <div className="flex items-center gap-3 bg-muted/30 p-1 rounded-full border border-border/50">
                          <button
                            type="button"
                            onClick={() => changeQty(it.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="font-body text-sm font-bold w-4 text-center">{it.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(it.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider bg-gold/10 px-3 py-1.5 rounded-full">
                           <Star size={14} className="fill-gold" /> Em configuração
                        </div>
                      )}
                      <span className="font-heading text-lg font-bold text-foreground bg-white px-3 py-1 rounded-full shadow-sm border border-border/30">
                        {it.consult ? "A consultar" : formatPrice((it.price ?? 0) * it.qty)}
                      </span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          <div className="mt-6 border-t border-border/40 pt-6 pb-6 bg-white/50 -mx-6 px-6 backdrop-blur-md">
            <div className="flex items-center justify-between font-heading text-xl font-bold text-foreground mb-5">
              <span className="uppercase tracking-widest text-[11px] text-muted-foreground">Total Estimado</span>
              <span className="text-chocolate text-3xl">{formatPrice(displayTotal)}</span>
            </div>
            
            {!form.name.trim() || !form.phone.trim() || !form.date ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-2xl text-xs font-bold flex gap-3 items-start mb-4 shadow-sm"
              >
                <Info size={20} className="shrink-0 mt-0.5 text-amber-500" />
                <span className="leading-relaxed">Por favor, feche e preencha seus dados (Nome, Telefone e Data) no Passo 3 para liberar o envio.</span>
              </motion.div>
            ) : null}

            <motion.button
              whileHover={{ scale: (itemCount === 0 || !form.name.trim() || !form.phone.trim() || !form.date) ? 1 : 1.02 }}
              whileTap={{ scale: (itemCount === 0 || !form.name.trim() || !form.phone.trim() || !form.date) ? 1 : 0.98 }}
              type="button"
              onClick={sendWhatsApp}
              disabled={itemCount === 0 || !form.name.trim() || !form.phone.trim() || !form.date}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-5 font-body text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#25D366]/30 transition-all hover:shadow-xl hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Enviar Pedido <ArrowRight size={20} strokeWidth={2.5} />
            </motion.button>
            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold mt-4">
               Você será redirecionado para o WhatsApp
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default MontarPedido;
