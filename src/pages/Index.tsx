import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import heroCake from "@/assets/caseirinhos-58.jpg";
import cakeChocolate from "@/assets/caseirinhos-85.jpg";
import cakeSlice from "@/assets/caseirinhos-118.jpg";
import docesFinos from "@/assets/caseirinhos-40.jpg";
import sobremesaCopo from "@/assets/caseirinhos-2.jpg";
import boloPote from "@/assets/caseirinhos-4.jpg";

const products = [
  { img: cakeChocolate, name: "Bolos Caseiros", desc: "Receitas tradicionais feitas com amor e ingredientes selecionados" },
  { img: cakeSlice, name: "Fatias Gourmet", desc: "Porções individuais perfeitas para qualquer momento do dia" },
  { img: boloPote, name: "Bolos de Pote", desc: "Camadas irresistíveis de bolo, creme e cobertura" },
  { img: docesFinos, name: "Doces Finos", desc: "Elegância e sabor para eventos e ocasiões especiais" },
  { img: sobremesaCopo, name: "Sobremesas no Copo", desc: "Sobremesas cremosas e sofisticadas em porções individuais" },
];

const testimonials = [
  { name: "Maria Clara", text: "Os bolos da Caseirinhos são os melhores que já provei! Cada pedido é uma experiência única.", stars: 5 },
  { name: "João Pedro", text: "Encomendei o bolo de casamento e superou todas as expectativas. Lindo e delicioso!", stars: 5 },
  { name: "Ana Beatriz", text: "Os doces finos para o chá de bebê ficaram perfeitos. Todos elogiaram!", stars: 5 },
];

const Index = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroCake} alt="Bolo artesanal da Caseirinhos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-chocolate/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-script text-4xl md:text-6xl text-gold mb-4"
          >
            Caseirinhos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
          >
            Mais do que doces, criamos memórias.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-body"
          >
            Confeitaria artesanal com amor em cada detalhe
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cardapio"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-accent text-accent-foreground font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Ver Cardápio
            </Link>
            <a
              href="https://wa.me/5500000000000?text=Olá! Gostaria de fazer um pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md border border-primary-foreground/40 text-primary-foreground font-body text-sm uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              Fazer Pedido
            </a>
          </motion.div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <SectionTitle script="Sobre nós" title="Uma História de Amor pela Confeitaria" />
          <p className="text-muted-foreground leading-relaxed mb-8">
            A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis. 
            Com ingredientes selecionados e receitas desenvolvidas com carinho, cada criação é única — assim como 
            cada cliente que nos escolhe para fazer parte dos seus momentos especiais.
          </p>
          <Link
            to="/nossa-historia"
            className="inline-flex items-center text-accent text-sm uppercase tracking-wider font-body hover:underline"
          >
            Conheça nossa história →
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionTitle script="Delícias" title="Nossos Produtos" subtitle="Cada doce é uma obra de arte feita com ingredientes frescos e muito amor" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/cardapio"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Ver Cardápio Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionTitle script="Amor em cada feedback" title="O que nossos clientes dizem" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-8 rounded-lg text-center"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic mb-4">"{t.text}"</p>
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-script text-3xl md:text-4xl text-gold mb-4">Pronto para adoçar seu dia?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Entre em contato e faça sua encomenda. Transformamos seus momentos em memórias doces.
          </p>
          <a
            href="https://wa.me/5500000000000?text=Olá! Gostaria de fazer um pedido."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-accent text-accent-foreground font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Fazer Pedido pelo WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
};

export default Index;
