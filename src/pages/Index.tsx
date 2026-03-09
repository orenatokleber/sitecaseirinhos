import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { useSiteSections, useSiteSectionsList, useProducts, useTestimonials, useSiteSettings } from "@/hooks/useSiteContent";

// Fallback images
import heroCakeFallback from "@/assets/caseirinhos-58.jpg";
import cakeChocolate from "@/assets/caseirinhos-85.jpg";
import cakeSlice from "@/assets/caseirinhos-118.jpg";
import docesFinos from "@/assets/caseirinhos-40.jpg";
import sobremesaCopo from "@/assets/caseirinhos-2.jpg";
import boloPote from "@/assets/caseirinhos-4.jpg";

const fallbackProducts = [
  { img: cakeChocolate, name: "Bolos Caseiros", desc: "Receitas tradicionais feitas com amor e ingredientes selecionados" },
  { img: cakeSlice, name: "Fatias Gourmet", desc: "Porções individuais perfeitas para qualquer momento do dia" },
  { img: boloPote, name: "Bolos de Pote", desc: "Camadas irresistíveis de bolo, creme e cobertura" },
  { img: docesFinos, name: "Doces Finos", desc: "Elegância e sabor para eventos e ocasiões especiais" },
  { img: sobremesaCopo, name: "Sobremesas no Copo", desc: "Sobremesas cremosas e sofisticadas em porções individuais" },
];

const fallbackTestimonials = [
  { name: "Maria Clara", content: "Os bolos da Caseirinhos são os melhores que já provei!", stars: 5 },
  { name: "João Pedro", content: "Encomendei o bolo de casamento e superou todas as expectativas.", stars: 5 },
  { name: "Ana Beatriz", content: "Os doces finos para o chá de bebê ficaram perfeitos.", stars: 5 },
];

const Index = () => {
  const { data: sections, isLoading: sectionsLoading } = useSiteSections();
  const { data: dbProducts } = useProducts();
  const { data: dbTestimonials } = useTestimonials();
  const { data: settings } = useSiteSettings();
  const { data: sectionsList } = useSiteSectionsList();

  const hero = sections?.hero;
  const aboutPreview = sections?.about_preview;
  const cta = sections?.cta;
  const whatsapp = (settings?.contact as any)?.whatsapp || "5500000000000";

  const displayProducts = dbProducts && dbProducts.length > 0 ? dbProducts : null;
  const displayTestimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : null;

  // Don't show any image until data is loaded to prevent flash of old cached image
  const heroImageUrl = sectionsLoading ? null : (hero?.image_url || heroCakeFallback);

  // Section colors from metadata
  const heroColors = hero?.metadata?.colors || {};
  const aboutColors = aboutPreview?.metadata?.colors || {};
  const ctaColors = cta?.metadata?.colors || {};

  // Custom sections (exclude fixed ones)
  const FIXED_SECTIONS = ['hero', 'about_preview', 'cta'];
  const customSections = sectionsList?.filter(s => !FIXED_SECTIONS.includes(s.section_key)) || [];
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImageUrl ? (
            <img
              key={heroImageUrl}
              src={heroImageUrl}
              alt="Bolo artesanal da Caseirinhos"
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            <div className="w-full h-full bg-chocolate" />
          )}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: heroColors.overlay_color ? `${heroColors.overlay_color}99` : undefined }}
          >
            {!heroColors.overlay_color && <div className="w-full h-full bg-chocolate/60" />}
          </div>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: heroColors.overlay_color ? `${heroColors.overlay_color}80` : undefined }}
          >
            {!heroColors.overlay_color && <div className="w-full h-full bg-chocolate/60" />}
          </div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-script text-4xl md:text-6xl mb-4"
            style={{ color: heroColors.title_color || undefined }}
          >
            {!heroColors.title_color && <span className="text-gold">Caseirinhos</span>}
            {heroColors.title_color && "Caseirinhos"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`font-heading text-4xl md:text-6xl font-bold mb-6 ${!heroColors.text_color ? 'text-primary-foreground' : ''}`}
            style={{ color: heroColors.text_color || undefined }}
          >
            {hero?.title || "Mais do que doces, criamos memórias."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg md:text-xl mb-8 font-body ${!heroColors.text_color ? 'text-primary-foreground/80' : ''}`}
            style={{ color: heroColors.text_color ? `${heroColors.text_color}cc` : undefined }}
          >
            {hero?.subtitle || "Confeitaria artesanal com amor em cada detalhe"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={hero?.cta_link || "/cardapio"}
              className="inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: heroColors.accent_color || undefined,
                color: heroColors.accent_color ? '#ffffff' : undefined,
              }}
            >
              {!heroColors.accent_color && (
                <span className="bg-accent text-accent-foreground px-8 py-3 rounded-md -m-[12px]">
                  {hero?.cta_text || "Ver Cardápio"}
                </span>
              )}
              {heroColors.accent_color && (hero?.cta_text || "Ver Cardápio")}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-8 py-3 rounded-md border font-body text-sm uppercase tracking-wider transition-colors ${
                !heroColors.text_color ? 'border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10' : ''
              }`}
              style={{
                borderColor: heroColors.text_color ? `${heroColors.text_color}66` : undefined,
                color: heroColors.text_color || undefined,
              }}
            >
              Fazer Pedido
            </a>
          </motion.div>
        </div>
      </section>

      {/* About preview */}
      <section
        className={`py-20 md:py-28 ${!aboutColors.bg_color ? '' : ''}`}
        style={{ backgroundColor: aboutColors.bg_color || undefined }}
      >
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <SectionTitle script="Sobre nós" title={aboutPreview?.title || "Uma História de Amor pela Confeitaria"} />
          <p
            className={`leading-relaxed mb-8 ${!aboutColors.text_color ? 'text-muted-foreground' : ''}`}
            style={{ color: aboutColors.text_color || undefined }}
          >
            {aboutPreview?.content || "A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis."}
          </p>
          <Link
            to={aboutPreview?.cta_link || "/nossa-historia"}
            className={`inline-flex items-center text-sm uppercase tracking-wider font-body hover:underline ${
              !aboutColors.accent_color ? 'text-accent' : ''
            }`}
            style={{ color: aboutColors.accent_color || undefined }}
          >
            {aboutPreview?.cta_text || "Conheça nossa história"} →
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionTitle script="Delícias" title="Nossos Produtos" subtitle="Cada doce é uma obra de arte feita com ingredientes frescos e muito amor" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(displayProducts || fallbackProducts).map((product: any, i: number) => (
              <motion.div
                key={product.name || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url || product.img || cakeChocolate}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description || product.desc}</p>
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
            {(displayTestimonials || fallbackTestimonials).map((t: any, i: number) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-8 rounded-lg text-center"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: t.stars || 5 }).map((_, j) => (
                    <Star key={j} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic mb-4">"{t.content || t.text}"</p>
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Sections */}
      {customSections.map((section, i) => {
        const colors = (section.metadata as any)?.colors || {};
        const layout = (section.metadata as any)?.layout || "text-centered";

        // Hero Banner layout
        if (layout === "hero-banner") {
          return (
            <motion.section
              key={section.section_key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
            >
              {section.image_url && (
                <img src={section.image_url} alt={section.title || ""} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0" style={{ backgroundColor: colors.overlay_color ? `${colors.overlay_color}99` : 'rgba(0,0,0,0.5)' }} />
              <div className="relative z-10 text-center px-4 max-w-3xl">
                {section.title && (
                  <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4" style={{ color: colors.title_color || '#ffffff' }}>
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="font-script text-2xl md:text-3xl mb-4" style={{ color: colors.title_color || '#ffffff' }}>
                    {section.subtitle}
                  </p>
                )}
                {section.content && (
                  <p className="text-lg mb-8" style={{ color: colors.text_color || '#ffffffcc' }}>
                    {section.content}
                  </p>
                )}
                {section.cta_text && section.cta_link && (
                  <Link to={section.cta_link} className="inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity" style={{ backgroundColor: colors.accent_color || 'hsl(var(--accent))', color: '#ffffff' }}>
                    {section.cta_text}
                  </Link>
                )}
              </div>
            </motion.section>
          );
        }

        // Image Left / Image Right layout
        if (layout === "image-left" || layout === "image-right") {
          return (
            <motion.section
              key={section.section_key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`py-20 ${i % 2 === 0 ? '' : 'bg-secondary'}`}
              style={{ backgroundColor: colors.bg_color || undefined }}
            >
              <div className={`container mx-auto px-4 flex flex-col ${layout === "image-left" ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center max-w-5xl`}>
                {section.image_url && (
                  <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
                    <img src={section.image_url} alt={section.title || ""} className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                )}
                <div className={`w-full ${section.image_url ? 'md:w-1/2' : ''} ${layout === "image-left" ? 'text-left' : 'text-right md:text-left'}`}>
                  {section.title && (
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.title_color || undefined }}>
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p className="font-script text-xl mb-2 text-gold">{section.subtitle}</p>
                  )}
                  {section.content && (
                    <p className={`leading-relaxed mb-6 ${!colors.text_color ? 'text-muted-foreground' : ''}`} style={{ color: colors.text_color || undefined }}>
                      {section.content}
                    </p>
                  )}
                  {section.cta_text && section.cta_link && (
                    <Link to={section.cta_link} className={`inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${!colors.accent_color ? 'bg-accent text-accent-foreground' : ''}`} style={{ backgroundColor: colors.accent_color || undefined, color: colors.accent_color ? '#ffffff' : undefined }}>
                      {section.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </motion.section>
          );
        }

        // Product Grid layout
        if (layout === "product-grid") {
          // Split content by lines for card items
          const items = section.content?.split('\n').filter(Boolean) || [];
          return (
            <motion.section
              key={section.section_key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`py-20 ${i % 2 === 0 ? '' : 'bg-secondary'}`}
              style={{ backgroundColor: colors.bg_color || undefined }}
            >
              <div className="container mx-auto px-4">
                {section.title && (
                  <SectionTitle script={(section.metadata as any)?.display_name || ""} title={section.title} subtitle={section.subtitle || undefined} />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-background rounded-lg p-6 text-center shadow-sm">
                      <p className={`${!colors.text_color ? 'text-foreground' : ''}`} style={{ color: colors.text_color || undefined }}>{item}</p>
                    </div>
                  ))}
                </div>
                {section.cta_text && section.cta_link && (
                  <div className="text-center mt-10">
                    <Link to={section.cta_link} className={`inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${!colors.accent_color ? 'bg-accent text-accent-foreground' : ''}`} style={{ backgroundColor: colors.accent_color || undefined, color: colors.accent_color ? '#ffffff' : undefined }}>
                      {section.cta_text}
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>
          );
        }

        // Default: text-centered
        return (
          <motion.section
            key={section.section_key}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`py-20 ${i % 2 === 0 ? '' : 'bg-secondary'}`}
            style={{ backgroundColor: colors.bg_color || undefined }}
          >
            <div className="container mx-auto px-4 text-center max-w-3xl">
              {section.image_url && (
                <div className="mb-8 max-w-md mx-auto rounded-lg overflow-hidden">
                  <img src={section.image_url} alt={section.title || ""} className="w-full h-auto object-cover" loading="lazy" />
                </div>
              )}
              {section.title && (
                <SectionTitle script={(section.metadata as any)?.display_name || ""} title={section.title} subtitle={section.subtitle || undefined} />
              )}
              {section.content && (
                <p className={`leading-relaxed mb-8 ${!colors.text_color ? 'text-muted-foreground' : ''}`} style={{ color: colors.text_color || undefined }}>
                  {section.content}
                </p>
              )}
              {section.cta_text && section.cta_link && (
                <Link to={section.cta_link} className={`inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${!colors.accent_color ? 'bg-accent text-accent-foreground' : ''}`} style={{ backgroundColor: colors.accent_color || undefined, color: colors.accent_color ? '#ffffff' : undefined }}>
                  {section.cta_text}
                </Link>
              )}
            </div>
          </motion.section>
        );
      })}

      {/* CTA */}
      <section
        className={`py-20 text-center ${!ctaColors.bg_color ? 'bg-primary text-primary-foreground' : ''}`}
        style={{
          backgroundColor: ctaColors.bg_color || undefined,
          color: ctaColors.text_color || undefined,
        }}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`font-script text-3xl md:text-4xl mb-4 ${!ctaColors.title_color ? 'text-gold' : ''}`}
            style={{ color: ctaColors.title_color || undefined }}
          >
            {cta?.title || "Pronto para adoçar seu dia?"}
          </h2>
          <p
            className={`mb-8 max-w-md mx-auto ${!ctaColors.text_color ? 'text-primary-foreground/70' : ''}`}
            style={{ color: ctaColors.text_color ? `${ctaColors.text_color}b3` : undefined }}
          >
            {cta?.content || "Entre em contato e faça sua encomenda. Transformamos seus momentos em memórias doces."}
          </p>
          <a
            href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center px-8 py-3 rounded-md font-body text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${
              !ctaColors.accent_color ? 'bg-accent text-accent-foreground' : ''
            }`}
            style={{
              backgroundColor: ctaColors.accent_color || undefined,
              color: ctaColors.accent_color ? '#ffffff' : undefined,
            }}
          >
            {cta?.cta_text || "Fazer Pedido pelo WhatsApp"}
          </a>
        </div>
      </section>
    </main>
  );
};

export default Index;
