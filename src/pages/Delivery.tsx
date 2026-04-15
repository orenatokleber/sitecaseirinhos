import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Tag, Gift, Megaphone, Info, ChevronRight, Truck } from "lucide-react";
import { useDeliveryPopups, DeliveryPopup } from "@/hooks/useDeliveryPopups";
import { Button } from "@/components/ui/button";

const DELIVERY_URL = "https://instadelivery.com.br/caseirinhosaconfeitaria";

const typeIcon: Record<string, React.ReactNode> = {
  banner: <Megaphone size={20} />,
  promo: <Gift size={20} />,
  coupon: <Tag size={20} />,
  notice: <Info size={20} />,
};

const typeLabel: Record<string, string> = {
  banner: "Novidade",
  promo: "Promoção",
  coupon: "Cupom",
  notice: "Aviso",
};

const DeliveryPage = () => {
  const { data: popups = [], isLoading } = useDeliveryPopups(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState<DeliveryPopup | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const visiblePopups = popups.filter((p) => !dismissedIds.has(p.id));
  const hasPopups = visiblePopups.length > 0;

  // Auto-redirect after countdown
  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      window.open(DELIVERY_URL, "_blank");
      return;
    }
    const timer = setTimeout(() => setRedirectCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [redirectCountdown]);

  // Start redirect after loading if no popups
  useEffect(() => {
    if (!isLoading && !hasPopups) {
      setRedirectCountdown(3);
    }
  }, [isLoading, hasPopups]);

  const dismiss = (id: string) => setDismissedIds((s) => new Set(s).add(id));

  const goToDelivery = () => {
    window.open(DELIVERY_URL, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-8 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Truck size={18} />
            <span className="text-sm font-semibold font-body">Delivery</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Peça pelo <span className="text-primary">Delivery</span>
          </h1>
          <p className="text-muted-foreground font-body mb-6">
            Confira nossas promoções e faça seu pedido online!
          </p>
        </motion.div>
      </section>

      {/* Popups / Banners */}
      {hasPopups && (
        <section className="container mx-auto px-4 pb-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence>
              {visiblePopups.map((popup, i) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg border border-border/50 cursor-pointer hover:shadow-xl transition-shadow"
                  style={{
                    background: popup.image_url
                      ? undefined
                      : `linear-gradient(135deg, ${popup.bg_color}, ${popup.bg_color}dd)`,
                  }}
                  onClick={() => setShowModal(popup)}
                >
                  {popup.image_url && (
                    <img
                      src={popup.image_url}
                      alt={popup.title}
                      className="w-full h-48 md:h-56 object-cover"
                    />
                  )}

                  <div
                    className={`p-5 ${popup.image_url ? "bg-card" : ""}`}
                    style={!popup.image_url ? { color: popup.text_color } : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={
                              popup.image_url
                                ? { background: `${popup.bg_color}20`, color: popup.bg_color }
                                : { background: "rgba(255,255,255,0.2)", color: popup.text_color }
                            }
                          >
                            {typeIcon[popup.popup_type]}
                            {typeLabel[popup.popup_type]}
                          </span>
                        </div>
                        <h3 className={`font-display text-lg md:text-xl mb-1 ${popup.image_url ? "text-foreground" : ""}`}>
                          {popup.title}
                        </h3>
                        {popup.description && (
                          <p className={`text-sm font-body ${popup.image_url ? "text-muted-foreground" : "opacity-90"}`}>
                            {popup.description}
                          </p>
                        )}
                        {popup.coupon_code && (
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 border-2 border-dashed border-primary">
                            <Tag size={14} className="text-primary" />
                            <span className="font-mono font-bold text-primary tracking-wider">
                              {popup.coupon_code}
                            </span>
                            {popup.discount_text && (
                              <span className="text-xs text-muted-foreground">— {popup.discount_text}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(popup.id);
                        }}
                        className="p-1 rounded-full hover:bg-black/10 transition-colors shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {redirectCountdown !== null && !hasPopups ? (
            <div className="text-muted-foreground font-body">
              <p className="mb-2">Redirecionando para o delivery em {redirectCountdown}s...</p>
              <Button onClick={goToDelivery} size="lg" className="rounded-full gap-2">
                <ExternalLink size={18} />
                Ir agora
              </Button>
            </div>
          ) : (
            <Button onClick={goToDelivery} size="lg" className="rounded-full gap-2 px-8 shadow-lg">
              <ExternalLink size={18} />
              Acessar Cardápio Delivery
              <ChevronRight size={16} />
            </Button>
          )}
        </motion.div>
      </section>

      {/* Modal detail */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {showModal.image_url && (
                <img src={showModal.image_url} alt={showModal.title} className="w-full h-56 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${showModal.bg_color}20`, color: showModal.bg_color }}
                  >
                    {typeIcon[showModal.popup_type]}
                    {typeLabel[showModal.popup_type]}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">{showModal.title}</h2>
                {showModal.description && (
                  <p className="text-muted-foreground font-body mb-4">{showModal.description}</p>
                )}
                {showModal.coupon_code && (
                  <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/5 border-2 border-dashed border-primary">
                    <Tag size={16} className="text-primary" />
                    <span className="font-mono font-bold text-primary text-lg tracking-wider">
                      {showModal.coupon_code}
                    </span>
                    {showModal.discount_text && (
                      <span className="text-sm text-muted-foreground ml-2">— {showModal.discount_text}</span>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={goToDelivery} className="flex-1 rounded-full gap-2">
                    <ExternalLink size={16} />
                    Pedir Agora
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(null)} className="rounded-full">
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default DeliveryPage;
