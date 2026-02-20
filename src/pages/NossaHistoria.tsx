import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import nossaHistoriaImg from "@/assets/nossa-historia.jpg";

const NossaHistoria = () => {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={nossaHistoriaImg} alt="Confeiteira decorando bolo" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-chocolate/50" />
        <div className="relative z-10 text-center px-4">
          <p className="font-script text-3xl md:text-5xl text-gold mb-2">Nossa</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">História</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle script="O começo" title="De uma cozinha caseira para o seu coração" />
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Tudo começou com uma paixão simples: a vontade de fazer bolos que trouxessem sorrisos. 
              Em uma pequena cozinha, com receitas de família e muita dedicação, nasceu a Caseirinhos — 
              uma confeitaria artesanal que acredita que cada doce conta uma história.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              O que começou com bolos caseiros para amigos e familiares se transformou em algo maior: 
              bolos de casamento que emocionam, sobremesas que surpreendem, doces finos que encantam. 
              Cada encomenda é tratada com o mesmo carinho do primeiro bolo.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              Hoje, a Caseirinhos é mais do que uma confeitaria. É um pedaço de afeto em forma de doce. 
              É a certeza de que cada ingrediente foi escolhido com cuidado, cada decoração foi pensada 
              com atenção, e cada entrega é feita com orgulho.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              Nosso propósito é claro: <strong className="text-foreground">transformar momentos em memórias doces</strong>. 
              Seja um aniversário, um casamento, um chá de bebê ou simplesmente uma terça-feira que merece 
              um bolo especial — estamos aqui para fazer parte da sua história.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionTitle script="Nossos valores" title="O que nos move" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Artesanal", desc: "Cada produto é feito à mão, com técnicas tradicionais e ingredientes frescos e de qualidade." },
              { title: "Amor", desc: "Colocamos carinho e dedicação em cada etapa, do preparo à entrega." },
              { title: "Excelência", desc: "Buscamos superar expectativas, criando sabores e apresentações que encantam." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8"
              >
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NossaHistoria;
