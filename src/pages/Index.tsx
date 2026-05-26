import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Cake, Heart, Award, Truck, ExternalLink, Clock, MapPin } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import WaveDivider from "@/components/WaveDivider";
import ConfettiDots from "@/components/ConfettiDots";
import { useSiteSections, useSiteSectionsList, useProducts, useTestimonials, useSiteSettings } from "@/hooks/useSiteContent";

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

const features = [
  { icon: Cake, title: "Artesanal", desc: "Feitos à mão com carinho" },
  { icon: Heart, title: "Com Amor", desc: "Ingredientes selecionados" },
  { icon: Award, title: "Qualidade", desc: "Excelência em cada pedido" },
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

  const heroImageUrl = sectionsLoading ? null : (hero?.image_url || heroCakeFallback);

  const heroColors = hero?.metadata?.colors || {};
  const aboutColors = aboutPreview?.metadata?.colors || {};
  const ctaColors = cta?.metadata?.colors || {};

  const isSectionVisible = (key: string) => {
    const section = sectionsList?.find(s => s.section_key === key);
    if (!section) return true;
    return (section.metadata as any)?.is_visible !== false;
  };

  const FIXED_SECTIONS = ['hero', 'about_preview', 'products', 'testimonials', 'cta'];
  const customSections = sectionsList?.filter(s => !FIXED_SECTIONS.includes(s.section_key) && (s.metadata as any)?.is_visible !== false) || [];

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <ConfettiDots />
        <div className="absolute inset-0 bg-gradient-to-b from-pink-light via-background to-background" />
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 py-12">
          {/* Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-script text-3xl md:text-5xl text-primary mb-2"
            >
              Caseirinhos
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            >
              {hero?.title || "Doces que encantam e criam memórias"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-8 font-body max-w-md mx-auto md:mx-0"
            >
              {hero?.subtitle || "Confeitaria artesanal com amor em cada detalhe. Bolos, doces finos e sobremesas para tornar seus momentos inesquecíveis."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Link
                to={hero?.cta_link || "/cardapio"}
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {hero?.cta_text || "Ver Cardápio"} 🧁
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border-2 border-primary text-primary font-body text-sm font-semibold hover:bg-primary/5 transition-colors"
              >
                Fazer Pedido
              </a>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-pink-medium shadow-2xl">
                {heroImageUrl ? (
                  <img
                    key={heroImageUrl}
                    src={heroImageUrl}
                    alt="Bolo artesanal da Caseirinhos"
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-light" />
                )}
              </div>
              {/* Decorative floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-peach animate-float" />
              <div className="absolute -bottom-2 -left-6 w-12 h-12 rounded-full bg-pink-medium animate-bounce-slow" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature badges */}
      <section className="relative -mt-4 z-10 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-md border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <feat.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{feat.title}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {isSectionVisible('about_preview') && (
      <section
        className="relative py-16 md:py-24 bg-pink-light overflow-hidden"
        style={{ backgroundColor: aboutColors.bg_color || undefined }}
      >
        {aboutPreview?.image_url && (
          <>
            <img
              src={aboutPreview.image_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/70" />
          </>
        )}
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <SectionTitle script="Sobre nós" title={aboutPreview?.title || "Uma História de Amor pela Confeitaria"} />
          <p
            className="leading-relaxed mb-8 text-muted-foreground"
            style={{ color: aboutColors.text_color || undefined }}
          >
            {aboutPreview?.content || "A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis."}
          </p>
          <Link
            to={aboutPreview?.cta_link || "/nossa-historia"}
            className="inline-flex items-center px-6 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold font-body hover:bg-primary hover:text-primary-foreground transition-colors"
            style={{ borderColor: aboutColors.accent_color || undefined, color: aboutColors.accent_color || undefined }}
          >
            {aboutPreview?.cta_text || "Conheça nossa história"} →
          </Link>
        </div>
      </section>
      )}

      {isSectionVisible('products') && (
      <>
      {/* Products */}
      <section className="py-16 md:py-24 relative">
        <ConfettiDots />
        <div className="container mx-auto px-4 relative z-10">
          <SectionTitle script="Delícias" title="Nossos Produtos" subtitle="Cada doce é uma obra de arte feita com ingredientes frescos e muito amor" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(displayProducts || fallbackProducts).map((product: any, i: number) => (
              <motion.div
                key={product.name || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
              >
                <div className="aspect-square overflow-hidden p-4">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={product.image_url || product.img || cakeChocolate}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="px-6 pb-6 text-center">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description || product.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/cardapio"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Ver Cardápio Completo 🍰
            </Link>
          </div>
        </div>
      </section>
      </>
      )}

      {isSectionVisible('testimonials') && (
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionTitle script="Amor em cada feedback" title="O que nossos clientes dizem" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(displayTestimonials || fallbackTestimonials).map((t: any, i: number) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-8 rounded-3xl text-center shadow-sm border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-script text-xl text-primary">{(t.name || "?")[0]}</span>
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: t.stars || 5 }).map((_, j) => (
                    <Star key={j} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic mb-4">"{t.content || t.text}"</p>
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section, i) => {
        const colors = (section.metadata as any)?.colors || {};
        const layout = (section.metadata as any)?.layout || "text-centered";

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
                {section.title && <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4" style={{ color: colors.title_color || '#ffffff' }}>{section.title}</h2>}
                {section.subtitle && <p className="font-script text-2xl md:text-3xl mb-4" style={{ color: colors.title_color || '#ffffff' }}>{section.subtitle}</p>}
                {section.content && <p className="text-lg mb-8" style={{ color: colors.text_color || '#ffffffcc' }}>{section.content}</p>}
                {section.cta_text && section.cta_link && (
                  <Link to={section.cta_link} className="inline-flex items-center justify-center px-8 py-3 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: colors.accent_color || 'hsl(var(--primary))', color: '#ffffff' }}>
                    {section.cta_text}
                  </Link>
                )}
              </div>
            </motion.section>
          );
        }

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
                  <div className="w-full md:w-1/2 rounded-3xl overflow-hidden">
                    <img src={section.image_url} alt={section.title || ""} className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                )}
                <div className={`w-full ${section.image_url ? 'md:w-1/2' : ''}`}>
                  {section.title && <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.title_color || undefined }}>{section.title}</h2>}
                  {section.subtitle && <p className="font-script text-xl mb-2 text-primary">{section.subtitle}</p>}
                  {section.content && <p className="leading-relaxed mb-6 text-muted-foreground" style={{ color: colors.text_color || undefined }}>{section.content}</p>}
                  {section.cta_text && section.cta_link && (
                    <Link to={section.cta_link} className="inline-flex items-center justify-center px-8 py-3 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity bg-primary text-primary-foreground" style={{ backgroundColor: colors.accent_color || undefined }}>
                      {section.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </motion.section>
          );
        }

        if (layout === "product-grid") {
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
                {section.title && <SectionTitle script={(section.metadata as any)?.display_name || ""} title={section.title} subtitle={section.subtitle || undefined} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
                      <p style={{ color: colors.text_color || undefined }}>{item}</p>
                    </div>
                  ))}
                </div>
                {section.cta_text && section.cta_link && (
                  <div className="text-center mt-10">
                    <Link to={section.cta_link} className="inline-flex items-center justify-center px-8 py-3 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity bg-primary text-primary-foreground" style={{ backgroundColor: colors.accent_color || undefined }}>
                      {section.cta_text}
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>
          );
        }

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
                <div className="mb-8 max-w-md mx-auto rounded-3xl overflow-hidden">
                  <img src={section.image_url} alt={section.title || ""} className="w-full h-auto object-cover" loading="lazy" />
                </div>
              )}
              {section.title && <SectionTitle script={(section.metadata as any)?.display_name || ""} title={section.title} subtitle={section.subtitle || undefined} />}
              {section.content && <p className="leading-relaxed mb-8 text-muted-foreground" style={{ color: colors.text_color || undefined }}>{section.content}</p>}
              {section.cta_text && section.cta_link && (
                <Link to={section.cta_link} className="inline-flex items-center justify-center px-8 py-3 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity bg-primary text-primary-foreground" style={{ backgroundColor: colors.accent_color || undefined }}>
                  {section.cta_text}
                </Link>
              )}
            </div>
          </motion.section>
        );
      })}

      {isSectionVisible('cta') && (
      <div className="relative">
        {/* Top wave — chocolate rising into the previous section */}
        <div className="relative leading-[0] -mb-px bg-secondary">
          <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="block w-full h-16 md:h-24" aria-hidden="true">
            <path d="M0,80 C240,20 480,140 720,80 C960,20 1200,140 1440,80 L1440,140 L0,140 Z" fill="hsl(var(--chocolate))" opacity="0.35" />
            <path d="M0,100 C320,40 640,160 960,100 C1200,52 1320,132 1440,100 L1440,140 L0,140 Z" fill="hsl(var(--chocolate))" opacity="0.6" />
            <path d="M0,118 C360,70 720,170 1080,118 C1260,92 1380,128 1440,118 L1440,140 L0,140 Z" fill="hsl(var(--chocolate))" />
          </svg>
        </div>

        <section className="relative py-20 md:py-28 text-center overflow-hidden bg-chocolate">
          <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-chocolate/95 to-chocolate" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--cream)) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          {/* Soft inner vignette for depth */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--chocolate) / 0.5) 100%)' }} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 text-cream mb-6 border border-cream/20 backdrop-blur-sm">
                <Truck size={18} />
                <span className="text-sm font-semibold font-body tracking-wide">Entregamos na sua porta</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl mb-4 text-cream font-bold leading-tight">
                {cta?.title || "Peça pelo Delivery"}
              </h2>
              <p className="mb-10 max-w-lg mx-auto text-cream/80 font-body leading-relaxed">
                {cta?.content || "Bolos fresquinhos e doces artesanais entregues com carinho. Confira nosso cardápio de delivery e peça agora!"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/delivery"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <ExternalLink size={18} />
                  {cta?.cta_text || "Fazer Pedido Online"}
                </Link>
                <a
                  href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-cream/40 text-cream font-body text-sm font-semibold hover:bg-cream/10 transition-colors"
                >
                  Pedir pelo WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-10 text-cream/60 text-sm font-body">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  Entrega Rápida
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  Consulte sua região
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom transition handled by Footer's own wave */}
      </div>
      )}
    </main>
  );
};

export default Index;
