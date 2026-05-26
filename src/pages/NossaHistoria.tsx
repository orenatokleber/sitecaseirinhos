import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSections } from "@/hooks/useSiteContent";
import { getPublicImageUrl } from "@/lib/supabase";
import { useFooterWaveBg } from "@/hooks/useFooterWaveBg";
import nossaHistoriaImg from "@/assets/caseirinhos-103.webp";
import confeiteiraSorrindo from "@/assets/caseirinhos-19.webp";
import decorandoBolo from "@/assets/caseirinhos-83.webp";

const NossaHistoria = () => {
  const { data: sections } = useSiteSections();
  useFooterWaveBg("hsl(var(--secondary))");

  const meta = (sections?.nossa_historia?.metadata as any) || {};
  const hero = meta.hero || {};
  const block1 = meta.block1 || {};
  const block2 = meta.block2 || {};
  const values = meta.values || {};

  const heroImg = hero.image_url ? getPublicImageUrl(hero.image_url) : nossaHistoriaImg;
  const block1Img = block1.image_url ? getPublicImageUrl(block1.image_url) : confeiteiraSorrindo;
  const block2Img = block2.image_url ? getPublicImageUrl(block2.image_url) : decorandoBolo;

  const valueItems: Array<{ title: string; desc: string }> = Array.isArray(values.items) && values.items.length > 0
    ? values.items
    : [
        { title: "Artesanal", desc: "Cada produto é feito à mão, com técnicas tradicionais e ingredientes frescos e de qualidade." },
        { title: "Amor", desc: "Colocamos carinho e dedicação em cada etapa, do preparo à entrega." },
        { title: "Excelência", desc: "Buscamos superar expectativas, criando sabores e apresentações que encantam." },
      ];

  return (
    <main className="pt-24">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Confeiteira da Caseirinhos" className="absolute inset-0 w-full h-full object-cover object-top" decoding="async" fetchPriority="high" />
        <div className="absolute inset-0 bg-chocolate/50" />
        <div className="relative z-10 text-center px-4">
          <p className="font-script text-3xl md:text-5xl text-gold mb-2">{hero.script || "Nossa"}</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">{hero.title || "História"}</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <img src={block1Img} alt="Confeiteira Caseirinhos" className="rounded-lg object-cover w-full h-[420px] shadow-md" loading="lazy" decoding="async" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-6 text-muted-foreground leading-relaxed">
              <SectionTitle script={block1.script || "O começo"} title={block1.title || "De uma cozinha caseira para o seu coração"} align="left" />
              {block1.paragraph1 && <p>{block1.paragraph1}</p>}
              {block1.paragraph2 && <p>{block1.paragraph2}</p>}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-6 text-muted-foreground leading-relaxed md:order-1 order-2">
              {block2.paragraph1 && <p>{block2.paragraph1}</p>}
              {block2.paragraph2 && <p>{block2.paragraph2}</p>}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="md:order-2 order-1">
              <img src={block2Img} alt="Confeiteira decorando bolo artesanal" className="rounded-lg object-cover w-full h-[420px] shadow-md" loading="lazy" decoding="async" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionTitle script={values.script || "Nossos valores"} title={values.title || "O que nos move"} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {valueItems.map((v, i) => (
              <motion.div key={`${v.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-8">
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
