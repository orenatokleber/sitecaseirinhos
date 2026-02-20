import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import cakeChocolate from "@/assets/cake-chocolate.jpg";
import cakeSlice from "@/assets/cake-slice.jpg";
import boloPote from "@/assets/bolo-pote.jpg";
import docesFinos from "@/assets/doces-finos.jpg";
import sobremesaCopo from "@/assets/sobremesa-copo.jpg";

const categories = [
  {
    id: "caseiros",
    name: "Bolos Caseiros",
    items: [
      { name: "Bolo de Chocolate", desc: "Massa fofinha com cobertura cremosa de chocolate belga", img: cakeChocolate },
      { name: "Bolo de Cenoura", desc: "Receita tradicional com cobertura generosa de chocolate", img: cakeChocolate },
      { name: "Bolo Red Velvet", desc: "Camadas aveludadas com cream cheese artesanal", img: cakeSlice },
    ],
  },
  {
    id: "fatias",
    name: "Fatias Gourmet",
    items: [
      { name: "Fatia de Morango", desc: "Camadas de bolo, creme e morangos frescos", img: cakeSlice },
      { name: "Fatia Ninho com Nutella", desc: "Combinação irresistível de leite ninho e Nutella", img: cakeSlice },
    ],
  },
  {
    id: "pote",
    name: "Bolos de Pote",
    items: [
      { name: "Bolo de Pote Prestígio", desc: "Chocolate com creme de coco ralado", img: boloPote },
      { name: "Bolo de Pote Brigadeiro", desc: "Camadas generosas de brigadeiro cremoso", img: boloPote },
    ],
  },
  {
    id: "doces",
    name: "Doces Finos",
    items: [
      { name: "Brigadeiros Gourmet", desc: "Sabores variados com acabamento artesanal", img: docesFinos },
      { name: "Cake Pops", desc: "Bolinhos no palito decorados com muito charme", img: docesFinos },
    ],
  },
  {
    id: "copos",
    name: "Sobremesas no Copo",
    items: [
      { name: "Mousse de Chocolate", desc: "Cremoso e intenso, finalizado com chantilly", img: sobremesaCopo },
      { name: "Pavê no Copo", desc: "Camadas de biscoito, creme e chocolate", img: sobremesaCopo },
    ],
  },
];

const Cardapio = () => {
  const [active, setActive] = useState("caseiros");
  const current = categories.find((c) => c.id === active)!;

  return (
    <main className="pt-24">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionTitle script="Nossas delícias" title="Cardápio" subtitle="Escolha sua categoria e descubra nossos sabores artesanais" />

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  active === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {current.items.map((item) => (
                <div key={item.name} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                    <a
                      href={`https://wa.me/5500000000000?text=Olá! Gostaria de pedir: ${item.name}`}
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
