import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Info,
  X,
  Cake,
  RectangleHorizontal,
  Candy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSiteSettings, useSiteSections } from "@/hooks/useSiteContent";
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
  kind: "round" | "rectangular" | "sweet";
  title: string;
  details: string[];
  price: number | null;
  consult: boolean;
  qty: number;
  image?: string | null;
};

type TabKind = "round" | "rectangular" | "sweet";

const TAB_CONFIG: { kind: TabKind; icon: typeof Cake; label: string; sectionKey: string }[] = [
  { kind: "round", icon: Cake, label: "Bolos Redondos", sectionKey: "pedido_tab_round" },
  { kind: "rectangular", icon: RectangleHorizontal, label: "Bolos Retangulares", sectionKey: "pedido_tab_rect" },
  { kind: "sweet", icon: Candy, label: "Doces", sectionKey: "pedido_tab_sweets" },
];

/* ─── Product Card ──────────────────────────── */
const ProductCard = ({
  image,
  title,
  description,
  price,
  priceLabel,
  onSelect,
  index = 0,
}: {
  image?: string | null;
  title: string;
  description?: string | null;
  price?: number | null;
  priceLabel?: string;
  onSelect: () => void;
  index?: number;
}) => (
  <motion.button
    type="button"
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1"
  >
    {/* Image */}
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
      {image ? (
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Cake size={40} className="text-muted-foreground/30" />
        </div>
      )}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col p-4">
      <h3 className="font-heading text-base font-semibold text-foreground line-clamp-2 leading-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 font-body text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}
      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="font-body text-sm font-bold text-chocolate">
          {priceLabel || (price !== null && price !== undefined ? formatPrice(price) : "A consultar")}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 font-body text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          Pedir <ChevronRight size={12} />
        </span>
      </div>
    </div>
  </motion.button>
);

/* ─── Option Chip (for modal) ──────────────── */
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
        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
        : "border-border bg-card hover:border-primary/40"
    }`}
  >
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
      }`}
    >
      {active && <Check size={12} />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-body text-sm font-semibold text-foreground">{children}</span>
      {meta && <span className="mt-0.5 block font-body text-xs text-muted-foreground">{meta}</span>}
      {price && <span className="mt-0.5 block font-body text-xs font-bold text-chocolate">{price}</span>}
    </span>
  </button>
);

/* ─── Section Label (for modal) ────────────── */
const ModalSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 mt-4 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    <span className="h-px flex-1 bg-border" />
    {children}
    <span className="h-px flex-1 bg-border" />
  </p>
);

/* ─── Main Component ───────────────────────── */
const MontarPedido = () => {
  const { data: settings } = useSiteSettings();
  const { data: sections = {} } = useSiteSections();
  const sec = (key: string) => (sections as any)?.[key] || {};

  const psec = (key: string, fallbackKey?: string) => {
    const own = (sections as any)?.[key];
    const fb = fallbackKey ? (sections as any)?.[fallbackKey] : undefined;
    if (!own && !fb) return {};
    return {
      title: own?.title || fb?.title || null,
      subtitle: own?.subtitle || fb?.subtitle || null,
      content: own?.content || fb?.content || null,
      image_url: own?.image_url || fb?.image_url || null,
    };
  };

  const whatsapp = normalizeWhatsApp((settings?.contact as any)?.whatsapp) || "5500000000000";

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

  // UI state
  const [activeTab, setActiveTab] = useState<TabKind>("round");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Modal state for customization
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKind, setModalKind] = useState<TabKind>("round");
  const [modalProductId, setModalProductId] = useState<string>(""); // catId or rectId or sweetTypeId

  // Round cake modal selections
  const [sizeId, setSizeId] = useState<string>("");
  const [flavorId, setFlavorId] = useState<string>("");
  const [roundAddons, setRoundAddons] = useState<string[]>([]);

  // Rectangular modal selections
  const [rectClass, setRectClass] = useState<"class1" | "class2">("class1");
  const [rectAddons, setRectAddons] = useState<string[]>([]);

  // Sweet modal selections
  const [sweetFlavorId, setSweetFlavorId] = useState<string>("");
  const [sweetPackageId, setSweetPackageId] = useState<string>("");

  // Contact form
  const [form, setForm] = useState({ name: "", phone: "", date: "", event: "", details: "" });

  // Derived data
  const standardCats = categories.filter((c) => c.type !== "addon");
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

  // Price for cheapest size of a category (for card display)
  const lowestPriceForCat = useCallback(
    (catId: string) => {
      const cat = categories.find((c) => c.id === catId);
      if (cat?.type === "consult") return null;
      const ps = prices.filter((p) => p.category_id === catId).map((p) => p.price);
      return ps.length > 0 ? Math.min(...ps) : null;
    },
    [categories, prices],
  );

  const lowestPriceForRect = (rectItem: typeof rectangular[0]) => {
    const p1 = rectItem.class1_price;
    const p2 = rectItem.class2_price;
    if (p1 !== null && p2 !== null) return Math.min(p1, p2);
    return p1 ?? p2;
  };

  const lowestPriceForSweetType = useCallback(
    (typeId: string) => {
      const pkgs = sweetPackages.filter((p) => p.type_id === typeId);
      if (pkgs.length === 0) return null;
      return Math.min(...pkgs.map((p) => p.price));
    },
    [sweetPackages],
  );

  /* ─── Open customization modal ──────────── */
  const openModal = (kind: TabKind, productId: string) => {
    setModalKind(kind);
    setModalProductId(productId);
    setSizeId("");
    setFlavorId("");
    setRoundAddons([]);
    setRectClass("class1");
    setRectAddons([]);
    setSweetFlavorId("");
    setSweetPackageId("");
    setModalOpen(true);
  };

  /* ─── Compute draft item from modal ─────── */
  const modalDraft = useMemo<OrderItem | null>(() => {
    if (modalKind === "round") {
      const cat = categories.find((c) => c.id === modalProductId);
      if (!cat || !sizeId) return null;
      const size = sizes.find((s) => s.id === sizeId);
      const flavor = flavors.find((f) => f.id === flavorId);
      const base = cat.type === "consult" ? null : priceOf(modalProductId, sizeId);
      let total = base;
      let consult = cat.type === "consult" || base === null;
      const details = [
        `Tamanho: ${size?.name}${size?.ring_size ? ` (${size.ring_size})` : ""}`,
        `Linha: ${cat.name}`,
      ];
      if (flavor) details.push(`Sabor: ${flavor.name}`);
      roundAddons.forEach((aid) => {
        const a = addons.find((x) => x.id === aid);
        const info = addonPriceInfo(aid, sizeId);
        details.push(`Adicional: ${a?.name} (${info.label})`);
        if (info.price !== null && total !== null) total += info.price;
        else consult = true;
      });
      return {
        id: "draft",
        kind: "round",
        title: `Bolo ${cat.name} — ${size?.name ?? ""}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
        image: cat.image_url ? getPublicImageUrl(cat.image_url) : null,
      };
    }

    if (modalKind === "rectangular") {
      const r = rectangular.find((x) => x.id === modalProductId);
      if (!r) return null;
      const base = rectClass === "class1" ? r.class1_price ?? null : r.class2_price ?? null;
      let total = base;
      let consult = base === null;
      const details = [
        `Modelo: ${r.name}${r.dimensions ? ` (${r.dimensions})` : ""}`,
        `Linha: ${rectClass === "class1" ? "Tradicional" : "Premium"}`,
      ];
      if (r.slices) details.push(`Fatias: ${r.slices}`);
      rectAddons.forEach((aid) => {
        const a = addons.find((x) => x.id === aid);
        const info = addonPriceInfo(aid);
        details.push(`Adicional: ${a?.name} (${info.label})`);
        if (info.price !== null && total !== null) total += info.price;
        else consult = true;
      });
      return {
        id: "draft",
        kind: "rectangular",
        title: `Bolo retangular ${r.name}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
      };
    }

    // sweet
    if (!sweetPackageId) return null;
    const t = sweetTypes.find((x) => x.id === modalProductId);
    const pkg = sweetPackages.find((x) => x.id === sweetPackageId);
    const fl = sweetFlavors.find((x) => x.id === sweetFlavorId);
    const details = [`Quantidade: ${pkg?.quantity} unidades`];
    if (fl) details.push(`Sabor: ${fl.name}`);
    return {
      id: "draft-sweet",
      kind: "sweet" as const,
      title: `Doces — ${t?.name ?? ""}`,
      details,
      price: pkg?.price ?? null,
      consult: pkg?.price === undefined,
      qty: 1,
      image: t?.image_url,
    };
  }, [
    modalKind, modalProductId, sizeId, flavorId, roundAddons, rectClass, rectAddons,
    sweetFlavorId, sweetPackageId, categories, sizes, flavors, prices, addons, addonPrices,
    rectangular, sweetTypes, sweetFlavors, sweetPackages, addonPriceInfo,
  ]);

  /* ─── Add item from modal ───────────────── */
  const addItem = () => {
    if (!modalDraft) return;
    const stamp = Date.now();
    setItems((prev) => [...prev, { ...modalDraft, id: `${stamp}` }]);
    setModalOpen(false);
  };

  /* ─── Cart operations ───────────────────── */
  const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const changeQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)),
    );

  const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

  const total = items.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0);
  const hasConsult = items.some((it) => it.consult);
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  /* ─── WhatsApp ──────────────────────────── */
  const sendWhatsApp = () => {
    const lines = items.map((it, i) => {
      const p = it.consult ? "valor a consultar" : formatPrice((it.price ?? 0) * it.qty);
      return `${i + 1}) ${it.title} — ${it.qty}x — ${p}\n   ${it.details.join("\n   ")}`;
    });
    const msg =
      `Olá! Montei meu pedido no site:\n\n${lines.join("\n\n")}\n\n` +
      `Subtotal estimado: ${formatPrice(total)}${hasConsult ? " (+ itens a consultar)" : ""}\n\n` +
      `Nome: ${form.name}\nTelefone: ${form.phone}\nData desejada: ${form.date}\nOcasião: ${form.event}\n` +
      `Observações: ${form.details || "—"}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  /* ─── Modal data ────────────────────────── */
  const modalCatFlavors = flavors.filter((f) => f.category_id === modalProductId);
  const modalSweetFlavors = sweetFlavors.filter((f) => f.type_id === modalProductId);
  const modalSweetPackages = sweetPackages
    .filter((p) => p.type_id === modalProductId)
    .sort((a, b) => a.quantity - b.quantity);

  const heroSec = psec("pedido_hero", "cardapio_hero");
  const rectFallbackImage = psec("pedido_rect", "cardapio_rectangular").image_url;

  /* ─── canAdd for modal ──────────────────── */
  const canAddFromModal = (() => {
    if (modalKind === "round") return !!sizeId;
    if (modalKind === "rectangular") return true;
    return !!sweetPackageId;
  })();

  /* ─── Render ────────────────────────────── */
  return (
    <main className="min-h-screen pb-24 pt-24">
      <Helmet>
        <title>Monte seu Pedido | Caseirinhos A Confeitaria</title>
        <meta
          name="description"
          content="Escolha tamanho, sabor, adicionais e doces para montar seu pedido de bolo personalizado e envie direto pelo WhatsApp."
        />
        <link rel="canonical" href="https://caseirinhos.com/montar-pedido" />
      </Helmet>

      {/* ─── HERO ──────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        {heroSec.image_url && (
          <div className="absolute inset-0">
            <img
              src={heroSec.image_url}
              alt=""
              className="h-full w-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}

        <div className="container relative mx-auto px-4 py-10 text-center md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {sec("pedido_hero").metadata?.script && (
              <span className="font-script text-2xl text-primary md:text-3xl">
                {sec("pedido_hero").metadata.script}
              </span>
            )}
            <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
              {heroSec.title || "Monte seu Pedido"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl font-body text-sm text-muted-foreground md:text-base">
              {heroSec.subtitle || "Escolha seus favoritos, personalize e envie tudo pelo WhatsApp"}
            </p>

            {/* Decorative divider */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="h-[2px] w-8 bg-primary/40" />
              <div className="h-3 w-3 rounded-full bg-primary" />
              <div className="h-[2px] w-8 bg-primary/40" />
            </div>
          </motion.div>

          {heroSec.content && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-4 max-w-2xl font-body text-xs leading-relaxed text-muted-foreground md:text-sm"
            >
              {heroSec.content}
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── CATEGORY TABS ─────────────── */}
      <section className="sticky top-16 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl md:top-20">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none md:justify-center md:gap-2">
            {TAB_CONFIG.map(({ kind, icon: Icon, label, sectionKey }) => {
              const customLabel = sec(sectionKey).title;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setActiveTab(kind)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-body text-sm font-semibold transition-all duration-300 md:px-5 ${
                    activeTab === kind
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span className="whitespace-nowrap">{customLabel || label}</span>
                  {activeTab === kind && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full bg-primary -z-10"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ──────────────── */}
      <section className="container mx-auto px-4 py-8 md:py-10">
        <AnimatePresence mode="wait">
          {/* Round cakes */}
          {activeTab === "round" && (
            <motion.div
              key="round"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {psec("pedido_round_line", "cardapio_sizes").content && (
                <div className="mb-6 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-primary" />
                  <p className="font-body text-xs leading-relaxed text-muted-foreground">
                    {psec("pedido_round_line", "cardapio_sizes").content}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {standardCats.map((cat, i) => {
                  const lowest = lowestPriceForCat(cat.id);
                  return (
                    <ProductCard
                      key={cat.id}
                      index={i}
                      image={cat.image_url ? getPublicImageUrl(cat.image_url) : null}
                      title={cat.name}
                      description={cat.description}
                      price={lowest}
                      priceLabel={
                        cat.type === "consult"
                          ? "A consultar"
                          : lowest !== null
                            ? `A partir de ${formatPrice(lowest)}`
                            : undefined
                      }
                      onSelect={() => openModal("round", cat.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Rectangular cakes */}
          {activeTab === "rectangular" && (
            <motion.div
              key="rectangular"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {psec("pedido_rect", "cardapio_rectangular").content && (
                <div className="mb-6 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-primary" />
                  <p className="font-body text-xs leading-relaxed text-muted-foreground">
                    {psec("pedido_rect", "cardapio_rectangular").content}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {rectangular.map((r, i) => {
                  const lowest = lowestPriceForRect(r);
                  return (
                    <ProductCard
                      key={r.id}
                      index={i}
                      image={rectFallbackImage || null}
                      title={r.name}
                      description={
                        [r.dimensions, r.slices ? `${r.slices} fatias` : null, r.note]
                          .filter(Boolean)
                          .join(" · ") || null
                      }
                      price={lowest}
                      priceLabel={lowest !== null ? `A partir de ${formatPrice(lowest)}` : undefined}
                      onSelect={() => openModal("rectangular", r.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Sweets */}
          {activeTab === "sweet" && (
            <motion.div
              key="sweet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {psec("pedido_sweets", "cardapio_sweets").content && (
                <div className="mb-6 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-primary" />
                  <p className="font-body text-xs leading-relaxed text-muted-foreground">
                    {psec("pedido_sweets", "cardapio_sweets").content}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sweetTypes.map((t, i) => {
                  const lowest = lowestPriceForSweetType(t.id);
                  return (
                    <ProductCard
                      key={t.id}
                      index={i}
                      image={t.image_url}
                      title={t.name}
                      description={
                        [t.description, t.weight_g ? `${t.weight_g}g por un.` : null]
                          .filter(Boolean)
                          .join(" · ") || null
                      }
                      price={lowest}
                      priceLabel={lowest !== null ? `A partir de ${formatPrice(lowest)}` : undefined}
                      onSelect={() => openModal("sweet", t.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to full menu */}
        <div className="mt-8 text-center">
          <Link
            to="/cardapio"
            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver cardápio completo <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── CUSTOMIZATION MODAL ───────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-5 pb-8 shadow-2xl md:max-w-lg md:rounded-3xl"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-muted/60 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>

              {/* Drag handle (mobile) */}
              <div className="mb-4 flex justify-center md:hidden">
                <div className="h-1 w-10 rounded-full bg-border" />
              </div>

              {/* Modal header */}
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-primary">
                    Personalize
                  </span>
                </div>
                <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">
                  {modalKind === "round" && categories.find((c) => c.id === modalProductId)?.name}
                  {modalKind === "rectangular" && rectangular.find((r) => r.id === modalProductId)?.name}
                  {modalKind === "sweet" && sweetTypes.find((t) => t.id === modalProductId)?.name}
                </h2>
                {modalKind === "round" && categories.find((c) => c.id === modalProductId)?.description && (
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    {categories.find((c) => c.id === modalProductId)?.description}
                  </p>
                )}
              </div>

              {/* ─── Round cake options ─── */}
              {modalKind === "round" && (
                <>
                  <ModalSectionLabel>
                    {psec("pedido_size", "cardapio_sizes").title || "Tamanho"}
                  </ModalSectionLabel>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {sizes.map((s) => {
                      const cat = categories.find((c) => c.id === modalProductId);
                      const p = cat?.type === "consult" ? null : priceOf(modalProductId, s.id);
                      return (
                        <OptionChip
                          key={s.id}
                          active={sizeId === s.id}
                          onClick={() => setSizeId(s.id)}
                          meta={[
                            s.ring_size ? `Aro ${s.ring_size}` : null,
                            s.slices ? `${s.slices} fatias` : null,
                            s.weight_kg ? `${s.weight_kg} kg` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                          price={p !== null ? formatPrice(p) : cat?.type === "consult" ? "A consultar" : undefined}
                        >
                          {s.name}
                        </OptionChip>
                      );
                    })}
                  </div>

                  {modalCatFlavors.length > 0 && (
                    <>
                      <ModalSectionLabel>Sabor</ModalSectionLabel>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {modalCatFlavors.map((f) => (
                          <OptionChip
                            key={f.id}
                            active={flavorId === f.id}
                            onClick={() => setFlavorId(f.id)}
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
                      <ModalSectionLabel>
                        {psec("pedido_round_addons", "cardapio_decorations").title || "Adicionais"}
                      </ModalSectionLabel>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {roundAddonList.map((a) => {
                          const info = addonPriceInfo(a.id, sizeId);
                          return (
                            <OptionChip
                              key={a.id}
                              active={roundAddons.includes(a.id)}
                              onClick={() => toggle(roundAddons, setRoundAddons, a.id)}
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

              {/* ─── Rectangular cake options ─── */}
              {modalKind === "rectangular" && (
                <>
                  {(() => {
                    const r = rectangular.find((x) => x.id === modalProductId);
                    return r ? (
                      <div className="mb-3 flex flex-wrap gap-2 font-body text-xs text-muted-foreground">
                        {r.dimensions && <span className="rounded-full bg-muted/60 px-2.5 py-1">{r.dimensions}</span>}
                        {r.slices && <span className="rounded-full bg-muted/60 px-2.5 py-1">{r.slices} fatias</span>}
                        {r.weight_kg && <span className="rounded-full bg-muted/60 px-2.5 py-1">{r.weight_kg} kg</span>}
                      </div>
                    ) : null;
                  })()}

                  <ModalSectionLabel>
                    {sec("pedido_rect_line").title || "Linha"}
                  </ModalSectionLabel>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <OptionChip
                      active={rectClass === "class1"}
                      onClick={() => setRectClass("class1")}
                      price={formatPrice(rectangular.find((r) => r.id === modalProductId)?.class1_price)}
                    >
                      Tradicional
                    </OptionChip>
                    <OptionChip
                      active={rectClass === "class2"}
                      onClick={() => setRectClass("class2")}
                      price={formatPrice(rectangular.find((r) => r.id === modalProductId)?.class2_price)}
                    >
                      Premium
                    </OptionChip>
                  </div>

                  {rectAddonList.length > 0 && (
                    <>
                      <ModalSectionLabel>Adicionais</ModalSectionLabel>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {rectAddonList.map((a) => {
                          const info = addonPriceInfo(a.id);
                          return (
                            <OptionChip
                              key={a.id}
                              active={rectAddons.includes(a.id)}
                              onClick={() => toggle(rectAddons, setRectAddons, a.id)}
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

              {/* ─── Sweet options ─── */}
              {modalKind === "sweet" && (
                <>
                  {modalSweetFlavors.length > 0 && (
                    <>
                      <ModalSectionLabel>Sabor</ModalSectionLabel>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {modalSweetFlavors.map((f) => (
                          <OptionChip
                            key={f.id}
                            active={sweetFlavorId === f.id}
                            onClick={() => setSweetFlavorId(f.id)}
                            meta={f.description || undefined}
                          >
                            {f.name}
                          </OptionChip>
                        ))}
                      </div>
                    </>
                  )}

                  <ModalSectionLabel>Quantidade</ModalSectionLabel>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {modalSweetPackages.map((p) => (
                      <OptionChip
                        key={p.id}
                        active={sweetPackageId === p.id}
                        onClick={() => setSweetPackageId(p.id)}
                        price={formatPrice(p.price)}
                      >
                        {p.quantity} unidades
                      </OptionChip>
                    ))}
                  </div>
                </>
              )}

              {/* ─── Price + Add button ─── */}
              <div className="mt-6 space-y-3">
                {modalDraft && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                    <span className="font-body text-sm text-muted-foreground">Total estimado</span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {modalDraft.consult ? "A consultar" : formatPrice(modalDraft.price)}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!canAddFromModal || !modalDraft}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <Plus size={16} />
                  {canAddFromModal && modalDraft ? "Adicionar ao pedido" : "Selecione as opções acima"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CART BOTTOM BAR ───────────── */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl"
          >
            <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag size={22} className="text-primary" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </p>
                  <p className="font-heading text-base font-bold text-foreground">
                    {formatPrice(total)}
                    {hasConsult && <span className="ml-1 font-body text-xs font-normal text-muted-foreground">+ consulta</span>}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110"
              >
                Ver Pedido <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CART DRAWER ───────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-heading text-xl">
              <ShoppingBag size={20} className="text-primary" /> Seu Pedido
            </SheetTitle>
            <SheetDescription>
              Revise seus itens e envie pelo WhatsApp
            </SheetDescription>
          </SheetHeader>

          {/* Items list */}
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag size={40} className="mb-3 text-muted-foreground/30" />
                <p className="font-body text-sm text-muted-foreground">
                  Seu pedido está vazio. Escolha seus produtos favoritos!
                </p>
              </div>
            ) : (
              items.map((it) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-border/70 bg-card/60 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-body text-sm font-semibold text-foreground">{it.title}</p>
                    <button
                      type="button"
                      aria-label="Remover item"
                      onClick={() => removeItem(it.id)}
                      className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <ul className="mt-1 space-y-0.5 font-body text-xs text-muted-foreground">
                    {it.details.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => changeQty(it.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background font-body text-sm transition-colors hover:bg-muted"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-body text-sm font-semibold">{it.qty}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => changeQty(it.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background font-body text-sm transition-colors hover:bg-muted"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-body text-sm font-bold text-chocolate">
                      {it.consult ? "A consultar" : formatPrice((it.price ?? 0) * it.qty)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Totals + Form + WhatsApp */}
          {items.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between font-heading text-lg font-bold text-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {hasConsult && (
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  Há itens com valor a consultar — confirmamos pelo WhatsApp.
                </p>
              )}

              <div className="mt-4 space-y-3">
                {[
                  { label: "Nome *", key: "name" as const, type: "text", placeholder: "Seu nome" },
                  { label: "Telefone *", key: "phone" as const, type: "tel", placeholder: "(00) 00000-0000" },
                  { label: "Data desejada", key: "date" as const, type: "date", placeholder: "" },
                  { label: "Ocasião", key: "event" as const, type: "text", placeholder: "Aniversário, casamento..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block font-body text-xs font-semibold text-foreground">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      maxLength={120}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block font-body text-xs font-semibold text-foreground">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    maxLength={800}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Tema, cores, recheio especial..."
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  disabled={items.length === 0 || !form.name.trim() || !form.phone.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(142,70%,40%)] px-4 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  Enviar pedido pelo WhatsApp <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default MontarPedido;
