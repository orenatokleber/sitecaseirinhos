import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const infoItems = [
  { icon: MapPin, title: "Endereço", text: "Rua Exemplo, 123 — Bairro, Cidade - Estado" },
  { icon: Clock, title: "Horário", text: "Terça a Sábado: 11h às 18h\nDelivery a partir das 13h" },
  { icon: Phone, title: "WhatsApp", text: "(00) 00000-0000", href: "https://wa.me/5500000000000" },
  { icon: Instagram, title: "Instagram", text: "@caseirinhos", href: "https://instagram.com/caseirinhos" },
];

const Contato = () => {
  return (
    <main className="pt-24">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionTitle script="Fale conosco" title="Contato" subtitle="Estamos prontos para atender você!" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-lg text-center"
              >
                <item.icon size={28} className="mx-auto mb-3 text-accent" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline whitespace-pre-line"
                  >
                    {item.text}
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{item.text}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Mapa — Adicione seu iframe do Google Maps aqui</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contato;
