import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import boloCasamento from "@/assets/bolo-casamento.jpg";
import cakeChocolate from "@/assets/cake-chocolate.jpg";

const Encomendas = () => {
  const [form, setForm] = useState({ name: "", phone: "", event: "", date: "", details: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá! Gostaria de um orçamento.\n\nNome: ${form.name}\nTelefone: ${form.phone}\nEvento: ${form.event}\nData: ${form.date}\nDetalhes: ${form.details}`;
    window.open(`https://wa.me/5500000000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionTitle script="Sob medida" title="Encomendas Especiais" subtitle="Bolos e doces personalizados para tornar seu evento inesquecível" />

          {/* Event types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {[
              { img: boloCasamento, title: "Bolos de Casamento", desc: "Criações exclusivas e elegantes para o dia mais especial da sua vida." },
              { img: cakeChocolate, title: "Aniversários & Eventos", desc: "Bolos temáticos, mesas de doces e sobremesas para celebrações únicas." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg overflow-hidden shadow-sm bg-card"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <SectionTitle script="Orçamento" title="Solicite seu orçamento" />
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-body text-foreground mb-1">Detalhes do pedido</label>
                <textarea
                  rows={4}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  placeholder="Descreva o que você precisa..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Enviar Orçamento via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Encomendas;
