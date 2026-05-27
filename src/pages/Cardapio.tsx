import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Cake, Heart, Sparkles, MessageCircle } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSettings, useSiteSections } from "@/hooks/useSiteContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { normalizeWhatsApp } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/supabase";
import {
  useCakeSizes,
  useCakeCategories,
  useCakePrices,
  useCakeFlavors,
  useCakeRectangular,
  useCakeDecorations,
} from "@/hooks/useCardapio";


const formatPrice = (v: number | null | undefined) =>
  v == null ? "—" : `R$ ${Number(v).toFixed(0)}`;

const formatAddon = (v: number) =>
  v > 0 ? `+R$${Math.round(v)}` : "";

const Cardapio = () => {
  const isMobile = useIsMobile();
  const { data: settings } = useSiteSettings();
  const { data: sections = {} } = useSiteSections();
  const whatsapp =
    normalizeWhatsApp((settings?.contact as any)?.whatsapp) || "5500000000000";

  const sec = (key: string) => (sections as any)?.[key] || {};
  const scriptOf = (key: string) => sec(key)?.metadata?.script || undefined;

  const { data: sizes = [] } = useCakeSizes(true);
  const { data: categories = [] } = useCakeCategories(true);
  const { data: prices = [] } = useCakePrices();
  const { data: flavors = [] } = useCakeFlavors(true);
  const { data: rectangular = [] } = useCakeRectangular(true);
  const { data: decorations = [] } = useCakeDecorations(true);


  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    event: "",
    date: "",
    details: "",
  });

  const standardCategories = categories.filter((c) => c.type === "standard");
  const addonCategories = categories.filter((c) => c.type === "addon");

  const priceOf = (categoryId: string, sizeId: string) =>
    prices.find((p) => p.category_id === categoryId && p.size_id === sizeId)?.price ?? null;

  const flavorsByCategory = useMemo(() => {
    const map: Record<string, typeof flavors> = {};
    flavors.forEach((f) => {
      (map[f.category_id] ||= []).push(f);
    });
    return map;
  }, [flavors]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá! Gostaria de um orçamento.\n\nNome: ${orderForm.name}\nTelefone: ${orderForm.phone}\nEvento: ${orderForm.event}\nData: ${orderForm.date}\nDetalhes: ${orderForm.details}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main className="pt-24 pb-8">
      {/* ─── HERO ─── */}
      <section className="py-14 md:py-20 relative overflow-hidden">
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
            {scriptOf("cardapio_hero") && (
              <span className="font-script text-2xl md:text-3xl text-primary">
                {scriptOf("cardapio_hero")}
              </span>
            )}
            {sec("cardapio_hero").title && (
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                {sec("cardapio_hero").title}
              </h1>
            )}
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4" />
            {sec("cardapio_hero").subtitle && (
              <p className="text-muted-foreground max-w-lg mx-auto font-body leading-relaxed">
                {sec("cardapio_hero").subtitle}
              </p>
            )}

            {sec("cardapio_hero").image_url && (
              <div className="mt-8 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border/60 shadow-sm">
                <img src={sec("cardapio_hero").image_url} alt={sec("cardapio_hero").title || "Cardápio"} className="w-full h-auto" />
              </div>
            )}
            {sec("cardapio_hero").content && (
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed whitespace-pre-line">
                {sec("cardapio_hero").content}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── BOLOS DECORADOS — TAMANHOS ─── */}
      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {sec("cardapio_sizes").title && (
            <SectionTitle
              script={scriptOf("cardapio_sizes")}
              title={sec("cardapio_sizes").title}
              subtitle={sec("cardapio_sizes").subtitle || undefined}
            />
          )}

          <div className={`grid grid-cols-1 ${sec("cardapio_sizes").image_url ? "md:grid-cols-2" : ""} gap-10 md:gap-12 items-center mt-4`}>
            {sec("cardapio_sizes").image_url && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={sec("cardapio_sizes").image_url}
                  alt={sec("cardapio_sizes").title || ""}
                  className="rounded-lg object-cover w-full h-[420px] shadow-md"
                  loading="lazy"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-3"
            >
              {sizes.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-accent/10 flex items-center justify-center">
                    <span className="font-heading text-2xl md:text-3xl font-bold text-accent">
                      {s.code}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1 py-3 pr-4 text-sm md:text-base text-foreground font-body">
                    {s.ring_size && <span>{s.ring_size}</span>}
                    {s.slices != null && (
                      <>
                        <span className="text-muted-foreground">|</span>
                        <span>{s.slices} fatias</span>
                      </>
                    )}
                    {s.weight_kg != null && (
                      <>
                        <span className="text-muted-foreground">|</span>
                        <span>{Number(s.weight_kg).toFixed(1)}kg</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Retangulares resumo */}
              {rectangular.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden"
                >
                  <div className="w-24 h-16 md:w-28 md:h-20 flex-shrink-0 bg-chocolate/10 flex items-center justify-center px-2 text-center">
                    <span className="font-heading text-xs md:text-sm font-bold text-chocolate leading-tight">
                      {r.name.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-1 py-3 pr-4 text-sm text-foreground font-body">
                    {r.dimensions && <span>{r.dimensions}</span>}
                    {r.slices != null && (
                      <>
                        <span className="text-muted-foreground">|</span>
                        <span>{r.slices} fatias</span>
                      </>
                    )}
                    {r.weight_kg != null && (
                      <>
                        <span className="text-muted-foreground">|</span>
                        <span>{Number(r.weight_kg).toFixed(1)} kg</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {sec("cardapio_sizes").content && (
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
              {sec("cardapio_sizes").content}
            </p>
          )}
        </div>
      </section>



      {/* ─── CATEGORIAS DE SABORES (CLASSE 1, CLASSE 2, ...) ─── */}
      {standardCategories.map((cat, idx) => {
        const catFlavors = flavorsByCategory[cat.id] || [];
        const catImg = cat.image_url ? getPublicImageUrl(cat.image_url) : null;
        const imageOnRight = idx % 2 === 1;
        return (
          <section key={cat.id} className="pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <SectionTitle
                title={cat.name}
                subtitle={cat.description || undefined}
              />

              <div className={`grid grid-cols-1 ${catImg ? "md:grid-cols-2" : ""} gap-10 md:gap-12 items-start mt-4`}>
                {catImg && (
                  <motion.div
                    initial={{ opacity: 0, x: imageOnRight ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={imageOnRight ? "md:order-2" : "md:order-1"}
                  >
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="rounded-lg object-cover w-full h-[420px] shadow-md sticky top-28"
                      loading="lazy"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: imageOnRight ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={catImg ? (imageOnRight ? "md:order-1" : "md:order-2") : ""}
                >
                  {/* Preços por tamanho — mobile: cards / desktop: tabela */}
                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-3">
                      {sizes.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-accent/20 bg-card shadow-sm p-4 text-center"
                        >
                          <div className="font-heading text-lg font-bold text-foreground">
                            {s.code}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground font-body space-y-0.5">
                            {s.slices != null && <div>{s.slices} fatias</div>}
                            {s.weight_kg != null && <div>{Number(s.weight_kg).toFixed(1)}kg</div>}
                          </div>
                          <div className="mt-2 font-body text-base font-semibold text-chocolate">
                            {formatPrice(priceOf(cat.id, s.id))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-accent/20 bg-card shadow-sm overflow-x-auto">
                      <div
                        className="grid divide-x divide-border/60 min-w-full"
                        style={{ gridTemplateColumns: `repeat(${sizes.length}, minmax(0, 1fr))` }}
                      >
                        {sizes.map((s) => (
                          <div key={s.id} className="text-center py-3 bg-accent/[0.04] min-w-0">
                            <div className="font-heading text-base md:text-lg font-bold text-foreground truncate px-1">
                              {s.code}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className="grid divide-x divide-border/60 border-t border-border/60 min-w-full"
                        style={{ gridTemplateColumns: `repeat(${sizes.length}, minmax(0, 1fr))` }}
                      >
                        {sizes.map((s) => (
                          <div key={s.id} className="text-center py-3 min-w-0">
                            <div className="font-body text-sm md:text-base font-semibold text-chocolate truncate px-1">
                              {formatPrice(priceOf(cat.id, s.id))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lista de sabores */}
                  <div className="mt-8 space-y-4">
                    {catFlavors.map((f) => (
                      <div
                        key={f.id}
                        className="border-l-2 border-accent/30 pl-4 py-1"
                      >
                        <h4 className="font-heading font-bold text-foreground uppercase text-sm tracking-wide">
                          {f.name}
                        </h4>
                        {f.description && (
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {f.description}
                          </p>
                        )}
                      </div>
                    ))}
                    {catFlavors.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        Em breve novos sabores.
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── BOLOS CORAÇÃO (ADDON) ─── */}
      {addonCategories.map((cat, idx) => {
        const catImg = cat.image_url ? getPublicImageUrl(cat.image_url) : (sec("cardapio_addons").image_url || null);
        const imageOnRight = idx % 2 === 1;
        return (
        <section key={cat.id} className="pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionTitle
              script={scriptOf("cardapio_addons")}
              title={sec("cardapio_addons").title || cat.name}
              subtitle={sec("cardapio_addons").subtitle || cat.description || undefined}
            />

            <div className={`grid grid-cols-1 ${catImg ? "md:grid-cols-2" : ""} gap-10 md:gap-12 items-center mt-4`}>
              {catImg && (
                <motion.div
                  initial={{ opacity: 0, x: imageOnRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={imageOnRight ? "md:order-2" : "md:order-1"}
                >
                  <img
                    src={catImg}
                    alt={cat.name}
                    className="rounded-lg object-cover w-full h-[420px] shadow-md"
                    loading="lazy"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: imageOnRight ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`space-y-3 ${catImg ? (imageOnRight ? "md:order-1" : "md:order-2") : ""}`}
              >

              {sizes.map((s) => {
                const addon = priceOf(cat.id, s.id);
                if (addon == null || addon === 0) return null;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-primary/10 flex items-center justify-center">
                      <span className="font-heading text-2xl md:text-3xl font-bold text-primary">
                        {s.code}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-1 py-3 pr-4 text-sm md:text-base text-foreground font-body">
                      {s.slices != null && <span>{s.slices} fatias</span>}
                      {s.weight_kg != null && (
                        <>
                          <span className="text-muted-foreground">|</span>
                          <span>{Number(s.weight_kg).toFixed(1)}kg</span>
                        </>
                      )}
                      <span className="ml-auto font-heading font-bold text-accent">
                        {formatAddon(addon)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {sec("cardapio_addons").content && (
              <p className="text-xs text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                {sec("cardapio_addons").content}
              </p>
            )}
          </div>
        </section>
        );
      })}

      {/* ─── BOLOS RETANGULARES (TABELA DETALHADA) ─── */}
      {rectangular.length > 0 && (
        <section className="pb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            {sec("cardapio_rectangular").title && (
              <SectionTitle
                script={scriptOf("cardapio_rectangular")}
                title={sec("cardapio_rectangular").title}
                subtitle={sec("cardapio_rectangular").subtitle || undefined}
              />
            )}


            {sec("cardapio_rectangular").image_url && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-border/60">
                <img src={sec("cardapio_rectangular").image_url} alt={sec("cardapio_rectangular").title || ""} className="w-full h-auto" loading="lazy" />
              </div>
            )}

            <div className="mt-8 space-y-6">
              {rectangular.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden"
                >
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
                  <div className="p-5 space-y-2">
                    {r.note && (
                      <p className="font-script text-lg text-chocolate text-center mb-3">
                        {r.note}
                      </p>
                    )}
                    {r.class1_price != null && (
                      <div className="flex justify-between text-sm font-body">
                      <span>Tradicional</span>
                        <span className="font-bold text-chocolate">
                          {formatPrice(r.class1_price)}
                        </span>
                      </div>
                    )}
                    {r.class2_price != null && (
                      <div className="flex justify-between text-sm font-body">
                        <span>Premium</span>
                        <span className="font-bold text-chocolate">
                          {formatPrice(r.class2_price)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {sec("cardapio_rectangular").content && (
              <p className="text-xs text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                {sec("cardapio_rectangular").content}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ─── DECORAÇÕES ─── */}
      {(decorations.length > 0 || sec("cardapio_decorations").title) && (
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {sec("cardapio_decorations").title && (
              <SectionTitle
                script={scriptOf("cardapio_decorations")}
                title={sec("cardapio_decorations").title}
                subtitle={sec("cardapio_decorations").subtitle || undefined}
              />
            )}


            {sec("cardapio_decorations").image_url && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-border/60">
                <img src={sec("cardapio_decorations").image_url} alt={sec("cardapio_decorations").title || ""} className="w-full h-auto" loading="lazy" />
              </div>
            )}

            {decorations.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8">
                {decorations.map((d) => (
                  <motion.div
                    key={d.id}
                    whileHover={{ scale: 1.03 }}
                    className="aspect-square overflow-hidden rounded-xl border border-border/60 bg-card"
                  >
                    <img
                      src={d.image_url}
                      alt={d.title || "Decoração"}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {sec("cardapio_decorations").content && (
              <p className="text-sm text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                {sec("cardapio_decorations").content}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ─── ORDER FORM ─── */}
      <section id="encomenda" className="pb-16">
        <div className="container mx-auto px-4 max-w-xl">
          {sec("cardapio_order").title && (
            <SectionTitle
              script={scriptOf("cardapio_order")}
              title={sec("cardapio_order").title}
              subtitle={sec("cardapio_order").subtitle || undefined}
            />
          )}

          {sec("cardapio_order").image_url && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-border/60">
              <img src={sec("cardapio_order").image_url} alt={sec("cardapio_order").title || ""} className="w-full h-auto" loading="lazy" />
            </div>
          )}
          {sec("cardapio_order").content && (
            <p className="text-sm text-muted-foreground mt-6 leading-relaxed whitespace-pre-line text-center">
              {sec("cardapio_order").content}
            </p>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-4 mt-6">
            {[
              { label: "Nome", key: "name" as const, type: "text" },
              { label: "Telefone", key: "phone" as const, type: "tel" },
              { label: "Tipo de Evento", key: "event" as const, type: "text" },
              { label: "Data do Evento", key: "date" as const, type: "date" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-body text-foreground mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  value={orderForm[field.key]}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-body text-foreground mb-1">
                Detalhes do pedido
              </label>
              <textarea
                rows={4}
                value={orderForm.details}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, details: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder="Tamanho, sabor, decoração, data da entrega..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-accent text-accent-foreground font-body text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Enviar via WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* Floating CTA */}
      <motion.button
        onClick={() =>
          document.getElementById("encomenda")?.scrollIntoView({ behavior: "smooth" })
        }
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

export default Cardapio;
