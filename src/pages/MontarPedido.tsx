import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSettings } from "@/hooks/useSiteContent";
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
};

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-xl border px-4 py-3 text-sm transition-all ${
      active
        ? "border-primary bg-primary/10 text-foreground shadow-sm"
        : "border-border bg-card text-muted-foreground hover:border-primary/50"
    }`}
  >
    <span className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {active && <Check size={11} />}
      </span>
      <span className="font-body">{children}</span>
    </span>
  </button>
);

const StepCard = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-bold text-primary">
        {step}
      </span>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const MontarPedido = () => {
  const { data: settings } = useSiteSettings();
  const whatsapp = normalizeWhatsApp((settings?.contact as any)?.whatsapp) || "5500000000000";

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

  const [kind, setKind] = useState<"round" | "rectangular" | "sweet">("round");
  const [items, setItems] = useState<OrderItem[]>([]);

  // round cake selections
  const [sizeId, setSizeId] = useState<string>("");
  const [catId, setCatId] = useState<string>("");
  const [flavorId, setFlavorId] = useState<string>("");
  const [roundAddons, setRoundAddons] = useState<string[]>([]);

  // rectangular selections
  const [rectId, setRectId] = useState<string>("");
  const [rectClass, setRectClass] = useState<"class1" | "class2">("class1");
  const [rectAddons, setRectAddons] = useState<string[]>([]);

  // sweets
  const [sweetTypeId, setSweetTypeId] = useState<string>("");
  const [sweetFlavorId, setSweetFlavorId] = useState<string>("");
  const [sweetPackageId, setSweetPackageId] = useState<string>("");

  // contact
  const [form, setForm] = useState({ name: "", phone: "", date: "", event: "", details: "" });

  const standardCats = categories.filter((c) => c.type !== "addon");
  const roundAddonList = addons.filter((a) => a.applies_to !== "rectangular");
  const rectAddonList = addons.filter((a) => a.applies_to === "rectangular");

  const priceOf = (categoryId: string, sizeIdArg: string) =>
    prices.find((p) => p.category_id === categoryId && p.size_id === sizeIdArg)?.price ?? null;

  const addonPriceInfo = (addonId: string, sizeIdArg?: string) => {
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
  };

  const currentDraft = useMemo<OrderItem | null>(() => {
    if (kind === "round") {
      if (!sizeId || !catId) return null;
      const size = sizes.find((s) => s.id === sizeId);
      const cat = categories.find((c) => c.id === catId);
      const flavor = flavors.find((f) => f.id === flavorId);
      const base = cat?.type === "consult" ? null : priceOf(catId, sizeId);
      let total = base;
      let consult = cat?.type === "consult" || base === null;
      const details = [
        `Tamanho: ${size?.name}${size?.ring_size ? ` (${size.ring_size})` : ""}`,
        `Linha: ${cat?.name}`,
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
        kind,
        title: `Bolo redondo ${size?.name ?? ""}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
      };
    }
    if (kind === "rectangular") {
      if (!rectId) return null;
      const r = rectangular.find((x) => x.id === rectId);
      const base = rectClass === "class1" ? r?.class1_price ?? null : r?.class2_price ?? null;
      let total = base;
      let consult = base === null;
      const details = [
        `Modelo: ${r?.name}${r?.dimensions ? ` (${r.dimensions})` : ""}`,
        `Linha: ${rectClass === "class1" ? "Tradicional" : "Premium"}`,
      ];
      if (r?.slices) details.push(`Fatias: ${r.slices}`);
      rectAddons.forEach((aid) => {
        const a = addons.find((x) => x.id === aid);
        const info = addonPriceInfo(aid);
        details.push(`Adicional: ${a?.name} (${info.label})`);
        if (info.price !== null && total !== null) total += info.price;
        else consult = true;
      });
      return {
        id: "draft",
        kind,
        title: `Bolo retangular ${r?.name ?? ""}`,
        details,
        price: consult ? null : total,
        consult,
        qty: 1,
      };
    }
    if (!sweetTypeId || !sweetPackageId) return null;
    const t = sweetTypes.find((x) => x.id === sweetTypeId);
    const pkg = sweetPackages.find((x) => x.id === sweetPackageId);
    const fl = sweetFlavors.find((x) => x.id === sweetFlavorId);
    const details = [`Quantidade: ${pkg?.quantity} unidades`];
    if (fl) details.push(`Sabor: ${fl.name}`);
    return {
      id: "draft",
      kind: "sweet",
      title: `Doces — ${t?.name ?? ""}`,
      details,
      price: pkg?.price ?? null,
      consult: pkg?.price === undefined,
      qty: 1,
    };
  }, [
    kind,
    sizeId,
    catId,
    flavorId,
    roundAddons,
    rectId,
    rectClass,
    rectAddons,
    sweetTypeId,
    sweetFlavorId,
    sweetPackageId,
    sizes,
    categories,
    flavors,
    prices,
    addons,
    addonPrices,
    rectangular,
    sweetTypes,
    sweetFlavors,
    sweetPackages,
  ]);

  const addItem = () => {
    if (!currentDraft) return;
    setItems((prev) => [...prev, { ...currentDraft, id: `${Date.now()}` }]);
    setSizeId("");
    setCatId("");
    setFlavorId("");
    setRoundAddons([]);
    setRectId("");
    setRectAddons([]);
    setSweetTypeId("");
    setSweetFlavorId("");
    setSweetPackageId("");
  };

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const changeQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)),
    );

  const total = items.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0);
  const hasConsult = items.some((it) => it.consult);

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

  const catFlavors = flavors.filter((f) => f.category_id === catId);
  const typeFlavors = sweetFlavors.filter((f) => f.type_id === sweetTypeId);
  const typePackages = sweetPackages
    .filter((p) => p.type_id === sweetTypeId)
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <main className="pt-24">
      <Helmet>
        <title>Monte seu Pedido | Caseirinhos A Confeitaria</title>
        <meta
          name="description"
          content="Escolha tamanho, sabor, adicionais e doces para montar seu pedido de bolo personalizado e envie direto pelo WhatsApp."
        />
        <link rel="canonical" href="https://caseirinhos.com/montar-pedido" />
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            script="Passo a passo"
            title="Monte seu Pedido"
            subtitle="Escolha as opções abaixo, adicione ao resumo e envie tudo pelo WhatsApp"
          />

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <StepCard step={1} title="O que você deseja?">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Chip active={kind === "round"} onClick={() => setKind("round")}>
                    Bolo redondo
                  </Chip>
                  <Chip active={kind === "rectangular"} onClick={() => setKind("rectangular")}>
                    Bolo retangular
                  </Chip>
                  <Chip active={kind === "sweet"} onClick={() => setKind("sweet")}>
                    Doces para festa
                  </Chip>
                </div>
              </StepCard>

              {kind === "round" && (
                <>
                  <StepCard step={2} title="Tamanho">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {sizes.map((s) => (
                        <Chip key={s.id} active={sizeId === s.id} onClick={() => setSizeId(s.id)}>
                          {s.name}
                          {s.ring_size ? ` · ${s.ring_size}` : ""}
                          {s.slices ? ` · ${s.slices} fatias` : ""}
                        </Chip>
                      ))}
                    </div>
                  </StepCard>

                  <StepCard step={3} title="Linha e sabor">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {standardCats.map((c) => (
                        <Chip
                          key={c.id}
                          active={catId === c.id}
                          onClick={() => {
                            setCatId(c.id);
                            setFlavorId("");
                          }}
                        >
                          {c.name}
                          {sizeId && c.type !== "consult" && priceOf(c.id, sizeId) !== null
                            ? ` · ${formatPrice(priceOf(c.id, sizeId))}`
                            : c.type === "consult"
                              ? " · a consultar"
                              : ""}
                        </Chip>
                      ))}
                    </div>
                    {catId && catFlavors.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {catFlavors.map((f) => (
                          <Chip key={f.id} active={flavorId === f.id} onClick={() => setFlavorId(f.id)}>
                            {f.name}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </StepCard>

                  {roundAddonList.length > 0 && (
                    <StepCard step={4} title="Adicionais (opcional)">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {roundAddonList.map((a) => {
                          const info = addonPriceInfo(a.id, sizeId);
                          return (
                            <Chip
                              key={a.id}
                              active={roundAddons.includes(a.id)}
                              onClick={() => toggle(roundAddons, setRoundAddons, a.id)}
                            >
                              {a.name} · {info.label}
                            </Chip>
                          );
                        })}
                      </div>
                    </StepCard>
                  )}
                </>
              )}

              {kind === "rectangular" && (
                <>
                  <StepCard step={2} title="Modelo">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {rectangular.map((r) => (
                        <Chip key={r.id} active={rectId === r.id} onClick={() => setRectId(r.id)}>
                          {r.name}
                          {r.dimensions ? ` · ${r.dimensions}` : ""}
                          {r.slices ? ` · ${r.slices} fatias` : ""}
                        </Chip>
                      ))}
                    </div>
                  </StepCard>

                  <StepCard step={3} title="Linha">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Chip active={rectClass === "class1"} onClick={() => setRectClass("class1")}>
                        Tradicional
                        {rectId
                          ? ` · ${formatPrice(rectangular.find((r) => r.id === rectId)?.class1_price)}`
                          : ""}
                      </Chip>
                      <Chip active={rectClass === "class2"} onClick={() => setRectClass("class2")}>
                        Premium
                        {rectId
                          ? ` · ${formatPrice(rectangular.find((r) => r.id === rectId)?.class2_price)}`
                          : ""}
                      </Chip>
                    </div>
                  </StepCard>

                  {rectAddonList.length > 0 && (
                    <StepCard step={4} title="Adicionais (opcional)">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {rectAddonList.map((a) => {
                          const info = addonPriceInfo(a.id);
                          return (
                            <Chip
                              key={a.id}
                              active={rectAddons.includes(a.id)}
                              onClick={() => toggle(rectAddons, setRectAddons, a.id)}
                            >
                              {a.name} · {info.label}
                            </Chip>
                          );
                        })}
                      </div>
                    </StepCard>
                  )}
                </>
              )}

              {kind === "sweet" && (
                <>
                  <StepCard step={2} title="Tipo de doce">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {sweetTypes.map((t) => (
                        <Chip
                          key={t.id}
                          active={sweetTypeId === t.id}
                          onClick={() => {
                            setSweetTypeId(t.id);
                            setSweetFlavorId("");
                            setSweetPackageId("");
                          }}
                        >
                          {t.name}
                          {t.weight_g ? ` · ${t.weight_g}g` : ""}
                        </Chip>
                      ))}
                    </div>
                  </StepCard>

                  {sweetTypeId && (
                    <StepCard step={3} title="Sabor e quantidade">
                      {typeFlavors.length > 0 && (
                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {typeFlavors.map((f) => (
                            <Chip
                              key={f.id}
                              active={sweetFlavorId === f.id}
                              onClick={() => setSweetFlavorId(f.id)}
                            >
                              {f.name}
                            </Chip>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {typePackages.map((p) => (
                          <Chip
                            key={p.id}
                            active={sweetPackageId === p.id}
                            onClick={() => setSweetPackageId(p.id)}
                          >
                            {p.quantity} unidades · {formatPrice(p.price)}
                          </Chip>
                        ))}
                      </div>
                    </StepCard>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={addItem}
                disabled={!currentDraft}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-body text-sm uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={16} />
                {currentDraft
                  ? `Adicionar ao pedido${currentDraft.consult ? "" : ` · ${formatPrice(currentDraft.price)}`}`
                  : "Selecione as opções acima"}
              </button>
            </div>

            {/* Resumo */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <ShoppingBag size={18} className="text-primary" /> Seu pedido
                </h3>

                {items.length === 0 ? (
                  <p className="font-body text-sm text-muted-foreground">
                    Nenhum item ainda. Monte seu bolo ou escolha seus doces ao lado.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((it) => (
                      <motion.li
                        key={it.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border/70 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-body text-sm font-semibold text-foreground">{it.title}</p>
                          <button
                            type="button"
                            aria-label="Remover item"
                            onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <ul className="mt-1 space-y-0.5 font-body text-xs text-muted-foreground">
                          {it.details.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              onClick={() => changeQty(it.id, -1)}
                              className="h-6 w-6 rounded-md border border-border font-body text-sm"
                            >
                              −
                            </button>
                            <span className="font-body text-sm">{it.qty}</span>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              onClick={() => changeQty(it.id, 1)}
                              className="h-6 w-6 rounded-md border border-border font-body text-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-body text-sm font-bold text-chocolate">
                            {it.consult ? "a consultar" : formatPrice((it.price ?? 0) * it.qty)}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {items.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between font-heading text-base font-bold text-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    {hasConsult && (
                      <p className="mt-1 font-body text-xs text-muted-foreground">
                        Há itens com valor a consultar — confirmamos pelo WhatsApp.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Nome", key: "name" as const, type: "text" },
                    { label: "Telefone", key: "phone" as const, type: "tel" },
                    { label: "Data desejada", key: "date" as const, type: "date" },
                    { label: "Ocasião", key: "event" as const, type: "text" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="mb-1 block font-body text-xs text-foreground">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        maxLength={120}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block font-body text-xs text-foreground">Observações</label>
                    <textarea
                      rows={3}
                      maxLength={800}
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      placeholder="Tema, cores, recheio especial..."
                      className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendWhatsApp}
                    disabled={items.length === 0 || !form.name.trim() || !form.phone.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(142,70%,40%)] px-4 py-3 font-body text-sm uppercase tracking-wider text-[hsl(0,0%,100%)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Enviar pedido pelo WhatsApp <ArrowRight size={15} />
                  </button>
                  <Link
                    to="/cardapio"
                    className="block text-center font-body text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Ver cardápio completo
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MontarPedido;
