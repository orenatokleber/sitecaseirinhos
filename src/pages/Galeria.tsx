import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useGalleryImages } from "@/hooks/useGallery";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PageSEO from "@/components/PageSEO";

const Galeria = () => {
  const { data: images, isLoading } = useGalleryImages(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!images) return [];
    const cats = new Set<string>();
    images.forEach((img) => {
      if (img.category) cats.add(img.category);
    });
    return Array.from(cats);
  }, [images]);

  const filteredImages = useMemo(() => {
    if (!images) return [];
    if (!activeCategory) return images;
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  if (isLoading) {
    return (
      <main className="pt-24">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24">
      <PageSEO title="Galeria de Bolos e Doces | Caseirinhos a Confeitaria" description="Fotos reais de bolos decorados, doces finos e mesas de festa criados pela Caseirinhos a Confeitaria." path="/galeria" />
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle title="Galeria" subtitle="Conheça nossos trabalhos" />

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeCategory
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer group"
                  onClick={() => setSelectedImage(img.image_url)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden shadow-md">
                    <img
                      src={img.image_url}
                      alt={img.alt_text || img.title || "Imagem da galeria"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {img.title && (
                    <p className="mt-2 text-sm text-center text-foreground/80 font-medium">
                      {img.title}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredImages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Nenhuma imagem encontrada.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/90 border-none">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="w-full h-auto max-h-[85vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Galeria;
