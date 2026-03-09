import { useState, useEffect } from "react";
import { useSiteSections, useUpdateSiteSection } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Save } from "lucide-react";

const AdminSections = () => {
  const { data: sections, isLoading } = useSiteSections();
  const updateSection = useUpdateSiteSection();

  const [hero, setHero] = useState({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "" });
  const [aboutPreview, setAboutPreview] = useState({ title: "", content: "", cta_text: "", cta_link: "" });
  const [cta, setCta] = useState({ title: "", content: "", cta_text: "" });

  useEffect(() => {
    if (sections?.hero) {
      setHero({
        title: sections.hero.title || "",
        subtitle: sections.hero.subtitle || "",
        image_url: sections.hero.image_url || "",
        cta_text: sections.hero.cta_text || "",
        cta_link: sections.hero.cta_link || ""
      });
    }
    if (sections?.about_preview) {
      setAboutPreview({
        title: sections.about_preview.title || "",
        content: sections.about_preview.content || "",
        cta_text: sections.about_preview.cta_text || "",
        cta_link: sections.about_preview.cta_link || ""
      });
    }
    if (sections?.cta) {
      setCta({
        title: sections.cta.title || "",
        content: sections.cta.content || "",
        cta_text: sections.cta.cta_text || ""
      });
    }
  }, [sections]);

  const handleSaveHero = () => {
    updateSection.mutate({ sectionKey: 'hero', updates: hero });
  };

  const handleSaveAbout = () => {
    updateSection.mutate({ sectionKey: 'about_preview', updates: aboutPreview });
  };

  const handleSaveCta = () => {
    updateSection.mutate({ sectionKey: 'cta', updates: cta });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Seções do Site</h1>
        <p className="text-muted-foreground">Edite textos e imagens das principais seções</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Hero (Banner Principal)</CardTitle>
            <CardDescription>A primeira coisa que os visitantes veem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imagem de Fundo</Label>
              <ImageUpload
                value={hero.image_url}
                onChange={(url) => setHero({ ...hero, image_url: url })}
                folder="hero"
                aspectRatio={16 / 9}
                recommendedSize="1920×1080px (16:9)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-title">Título Principal</Label>
              <Input
                id="hero-title"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="Mais do que doces, criamos memórias."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtítulo</Label>
              <Input
                id="hero-subtitle"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                placeholder="Confeitaria artesanal com amor em cada detalhe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-cta-text">Texto do Botão</Label>
                <Input
                  id="hero-cta-text"
                  value={hero.cta_text}
                  onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                  placeholder="Ver Cardápio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-cta-link">Link do Botão</Label>
                <Input
                  id="hero-cta-link"
                  value={hero.cta_link}
                  onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                  placeholder="/cardapio"
                />
              </div>
            </div>

            <Button onClick={handleSaveHero} disabled={updateSection.isPending}>
              {updateSection.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Hero
            </Button>
          </CardContent>
        </Card>

        {/* About Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Sobre Nós (Preview)</CardTitle>
            <CardDescription>Resumo na home que leva para página completa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-title">Título</Label>
              <Input
                id="about-title"
                value={aboutPreview.title}
                onChange={(e) => setAboutPreview({ ...aboutPreview, title: e.target.value })}
                placeholder="Uma História de Amor pela Confeitaria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-content">Texto</Label>
              <Textarea
                id="about-content"
                value={aboutPreview.content}
                onChange={(e) => setAboutPreview({ ...aboutPreview, content: e.target.value })}
                placeholder="A Caseirinhos nasceu do desejo de transformar momentos..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="about-cta-text">Texto do Link</Label>
                <Input
                  id="about-cta-text"
                  value={aboutPreview.cta_text}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, cta_text: e.target.value })}
                  placeholder="Conheça nossa história"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-cta-link">Link</Label>
                <Input
                  id="about-cta-link"
                  value={aboutPreview.cta_link}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, cta_link: e.target.value })}
                  placeholder="/nossa-historia"
                />
              </div>
            </div>

            <Button onClick={handleSaveAbout} disabled={updateSection.isPending}>
              {updateSection.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Sobre Nós
            </Button>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seção CTA (Chamada para Ação)</CardTitle>
            <CardDescription>Seção final da home incentivando o contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cta-title">Título</Label>
              <Input
                id="cta-title"
                value={cta.title}
                onChange={(e) => setCta({ ...cta, title: e.target.value })}
                placeholder="Pronto para adoçar seu dia?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta-content">Texto</Label>
              <Textarea
                id="cta-content"
                value={cta.content}
                onChange={(e) => setCta({ ...cta, content: e.target.value })}
                placeholder="Entre em contato e faça sua encomenda..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta-button-text">Texto do Botão</Label>
              <Input
                id="cta-button-text"
                value={cta.cta_text}
                onChange={(e) => setCta({ ...cta, cta_text: e.target.value })}
                placeholder="Fazer Pedido pelo WhatsApp"
              />
            </div>

            <Button onClick={handleSaveCta} disabled={updateSection.isPending}>
              {updateSection.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar CTA
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSections;
