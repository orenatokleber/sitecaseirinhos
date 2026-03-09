import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useProducts, useSiteSettings } from "@/hooks/useSiteContent";

import cakeChocolate from "@/assets/cake-chocolate.jpg";

const Cardapio = () => {
  const { data: products, isLoading } = useProducts();
  const { data: settings } = useSiteSettings();
  const whatsapp = (settings?.contact as any)?.whatsapp || "5500000000000";

  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const cats: Record<string, typeof products> = {};
    products.forEach((p) => {
      if (!cats[p.category]) cats[p.category] = [];
      cats[p.category].push(p);
    });
    return Object.entries(cats).map(([name, items]) => ({ name, items }));
  }, [products]);

  const [active, setActive] = useState<string | null>(null);
  const currentCategory = active || (categories.length > 0 ? categories[0].name : null);
  const currentItems = categories.find((c) => c.name === currentCategory)?.items || [];

  if (isLoading) {
    return (
      <main className="pt-24">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Carregando cardápio...</p>
          </div>
        </section>
      </main>
    );
  }

  if (categories.length === 0) {
    return (
      <main className="pt-24">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <SectionTitle script="Nossas delícias" title="Cardápio" subtitle="Em breve nossos produtos estarão disponíveis aqui!" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionTitle script="Nossas delícias" title="Cardápio" subtitle="Escolha sua categoria e descubra nossos sabores artesanais" />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActive(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  currentCategory === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {currentItems.map((item) => (
                <div key={item.id} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image_url || cakeChocolate}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                    {item.price && (
                      <p className="text-accent font-semibold mb-4">
                        R$ {Number(item.price).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                    <a
                      href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de pedir: ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-accent text-sm font-body uppercase tracking-wider hover:underline"
                    >
                      Pedir via WhatsApp →
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default Cardapio;
