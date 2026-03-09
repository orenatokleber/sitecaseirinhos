import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import nossaHistoriaImg from "@/assets/caseirinhos-103.jpg";
import confeiteiraSorrindo from "@/assets/caseirinhos-19.jpg";
import decorandoBolo from "@/assets/caseirinhos-83.jpg";

const NossaHistoria = () => {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={nossaHistoriaImg} alt="Confeiteira da Caseirinhos" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-chocolate/50" />
        <div className="relative z-10 text-center px-4">
          <p className="font-script text-3xl md:text-5xl text-gold mb-2">Nossa</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">História</h1>
        </div>
      </section>

      {/* Content with photos */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={confeiteiraSorrindo}
                alt="Confeiteira Caseirinhos com fouet"
                className="rounded-lg object-cover w-full h-[420px] shadow-md"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6 text-muted-foreground leading-relaxed"
            >
              <SectionTitle script="O começo" title="De uma cozinha caseira para o seu coração" align="left" />
              <p>
                Tudo começou com uma paixão simples: a vontade de fazer bolos que trouxessem sorrisos. 
                Em uma pequena cozinha, com receitas de família e muita dedicação, nasceu a Caseirinhos — 
                uma confeitaria artesanal que acredita que cada doce conta uma história.
              </p>
              <p>
                O que começou com bolos caseiros para amigos e familiares se transformou em algo maior: 
                bolos de casamento que emocionam, sobremesas que surpreendem, doces finos que encantam. 
                Cada encomenda é tratada com o mesmo carinho do primeiro bolo.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6 text-muted-foreground leading-relaxed md:order-1 order-2"
            >
              <p>
                Hoje, a Caseirinhos é mais do que uma confeitaria. É um pedaço de afeto em forma de doce. 
                É a certeza de que cada ingrediente foi escolhido com cuidado, cada decoração foi pensada 
                com atenção, e cada entrega é feita com orgulho.
              </p>
              <p>
                Nosso propósito é claro: <strong className="text-foreground">transformar momentos em memórias doces</strong>. 
                Seja um aniversário, um casamento, um chá de bebê ou simplesmente uma terça-feira que merece 
                um bolo especial — estamos aqui para fazer parte da sua história.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:order-2 order-1"
            >
              <img
                src={decorandoBolo}
                alt="Confeiteira decorando bolo artesanal"
                className="rounded-lg object-cover w-full h-[420px] shadow-md"
              />
            </motion.div>
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
