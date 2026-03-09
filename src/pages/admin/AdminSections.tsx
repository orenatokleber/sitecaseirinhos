import { useState, useEffect } from "react";
import { useSiteSections, useSiteSectionsList, useUpdateSiteSection, useCreateSiteSection, useDeleteSiteSection } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ImageUpload from "@/components/admin/ImageUpload";
import ColorPicker from "@/components/admin/ColorPicker";
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface SectionColors {
  bg_color?: string;
  text_color?: string;
  overlay_color?: string;
  accent_color?: string;
  title_color?: string;
}

const FIXED_SECTIONS = ['hero', 'about_preview', 'cta'];

const AdminSections = () => {
  const { data: sections, isLoading } = useSiteSections();
  const { data: sectionsList } = useSiteSectionsList();
  const updateSection = useUpdateSiteSection();
  const createSection = useCreateSiteSection();
  const deleteSection = useDeleteSiteSection();

  const [hero, setHero] = useState({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "" });
  const [heroColors, setHeroColors] = useState<SectionColors>({});
  const [aboutPreview, setAboutPreview] = useState({ title: "", content: "", cta_text: "", cta_link: "" });
  const [aboutColors, setAboutColors] = useState<SectionColors>({});
  const [cta, setCta] = useState({ title: "", content: "", cta_text: "" });
  const [ctaColors, setCtaColors] = useState<SectionColors>({});

  // Custom sections editing state
  const [customEdits, setCustomEdits] = useState<Record<string, any>>({});
  const [customColors, setCustomColors] = useState<Record<string, SectionColors>>({});
  const [expandedCustom, setExpandedCustom] = useState<Record<string, boolean>>({});

  // New section dialog
  const [newSectionOpen, setNewSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState({ name: "", title: "", content: "" });

  useEffect(() => {
    if (sections?.hero) {
      setHero({
        title: sections.hero.title || "",
        subtitle: sections.hero.subtitle || "",
        image_url: sections.hero.image_url || "",
        cta_text: sections.hero.cta_text || "",
        cta_link: sections.hero.cta_link || ""
      });
      setHeroColors(sections.hero.metadata?.colors || {});
    }
    if (sections?.about_preview) {
      setAboutPreview({
        title: sections.about_preview.title || "",
        content: sections.about_preview.content || "",
        cta_text: sections.about_preview.cta_text || "",
        cta_link: sections.about_preview.cta_link || ""
      });
      setAboutColors(sections.about_preview.metadata?.colors || {});
    }
    if (sections?.cta) {
      setCta({
        title: sections.cta.title || "",
        content: sections.cta.content || "",
        cta_text: sections.cta.cta_text || ""
      });
      setCtaColors(sections.cta.metadata?.colors || {});
    }
  }, [sections]);

  // Initialize custom section edits when data loads
  useEffect(() => {
    if (sectionsList) {
      const customs: Record<string, any> = {};
      const colors: Record<string, SectionColors> = {};
      sectionsList
        .filter(s => !FIXED_SECTIONS.includes(s.section_key))
        .forEach(s => {
          if (!customEdits[s.section_key]) {
            customs[s.section_key] = {
              title: s.title || "",
              subtitle: s.subtitle || "",
              content: s.content || "",
              image_url: s.image_url || "",
              cta_text: s.cta_text || "",
              cta_link: s.cta_link || "",
            };
            colors[s.section_key] = (s.metadata as any)?.colors || {};
          }
        });
      if (Object.keys(customs).length > 0) {
        setCustomEdits(prev => ({ ...customs, ...prev }));
        setCustomColors(prev => ({ ...colors, ...prev }));
      }
    }
  }, [sectionsList]);

  const handleSaveHero = () => {
    updateSection.mutate({
      sectionKey: 'hero',
      updates: { ...hero, metadata: { ...(sections?.hero?.metadata || {}), colors: heroColors } }
    });
  };

  const handleSaveAbout = () => {
    updateSection.mutate({
      sectionKey: 'about_preview',
      updates: { ...aboutPreview, metadata: { ...(sections?.about_preview?.metadata || {}), colors: aboutColors } }
    });
  };

  const handleSaveCta = () => {
    updateSection.mutate({
      sectionKey: 'cta',
      updates: { ...cta, metadata: { ...(sections?.cta?.metadata || {}), colors: ctaColors } }
    });
  };

  const handleSaveCustom = (sectionKey: string) => {
    const edit = customEdits[sectionKey];
    const colors = customColors[sectionKey] || {};
    const existing = sectionsList?.find(s => s.section_key === sectionKey);
    updateSection.mutate({
      sectionKey,
      updates: {
        ...edit,
        metadata: { ...((existing?.metadata as Record<string, any>) || {}), colors }
      }
    });
  };

  const handleCreateSection = () => {
    if (!newSection.name.trim()) return;
    const sectionKey = `custom_${newSection.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')}`;
    createSection.mutate({
      section_key: sectionKey,
      title: newSection.title || newSection.name,
      content: newSection.content,
      metadata: { display_name: newSection.name, colors: {} }
    }, {
      onSuccess: () => {
        setNewSectionOpen(false);
        setNewSection({ name: "", title: "", content: "" });
      }
    });
  };

  const handleDeleteSection = (sectionKey: string) => {
    deleteSection.mutate(sectionKey);
  };

  const customSections = sectionsList?.filter(s => !FIXED_SECTIONS.includes(s.section_key)) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Seções do Site</h1>
          <p className="text-muted-foreground">Edite textos, imagens e cores das seções</p>
        </div>
        <Dialog open={newSectionOpen} onOpenChange={setNewSectionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Seção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Seção</DialogTitle>
              <DialogDescription>Adicione uma nova seção personalizada ao site</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Seção</Label>
                <Input
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="Ex: Promoções, Parceiros, FAQ..."
                />
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="Título que aparecerá na seção"
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  placeholder="Texto da seção..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewSectionOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateSection} disabled={!newSection.name.trim() || createSection.isPending}>
                {createSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Criar Seção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <Input id="hero-title" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} placeholder="Mais do que doces, criamos memórias." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtítulo</Label>
              <Input id="hero-subtitle" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} placeholder="Confeitaria artesanal com amor em cada detalhe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto do Botão</Label>
                <Input value={hero.cta_text} onChange={(e) => setHero({ ...hero, cta_text: e.target.value })} placeholder="Ver Cardápio" />
              </div>
              <div className="space-y-2">
                <Label>Link do Botão</Label>
                <Input value={hero.cta_link} onChange={(e) => setHero({ ...hero, cta_link: e.target.value })} placeholder="/cardapio" />
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-semibold text-foreground mb-3">🎨 Cores da Seção</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ColorPicker label="Cor do Overlay" value={heroColors.overlay_color || ""} onChange={(c) => setHeroColors({ ...heroColors, overlay_color: c })} description="Sobreposição na imagem" />
                <ColorPicker label="Cor do Título" value={heroColors.title_color || ""} onChange={(c) => setHeroColors({ ...heroColors, title_color: c })} description="Cor do 'Caseirinhos'" />
                <ColorPicker label="Cor do Texto" value={heroColors.text_color || ""} onChange={(c) => setHeroColors({ ...heroColors, text_color: c })} description="Cor do texto principal" />
                <ColorPicker label="Cor do Botão" value={heroColors.accent_color || ""} onChange={(c) => setHeroColors({ ...heroColors, accent_color: c })} description="Fundo do botão CTA" />
              </div>
            </div>
            <Button onClick={handleSaveHero} disabled={updateSection.isPending}>
              {updateSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
              <Label>Título</Label>
              <Input value={aboutPreview.title} onChange={(e) => setAboutPreview({ ...aboutPreview, title: e.target.value })} placeholder="Uma História de Amor pela Confeitaria" />
            </div>
            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea value={aboutPreview.content} onChange={(e) => setAboutPreview({ ...aboutPreview, content: e.target.value })} placeholder="A Caseirinhos nasceu do desejo..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto do Link</Label>
                <Input value={aboutPreview.cta_text} onChange={(e) => setAboutPreview({ ...aboutPreview, cta_text: e.target.value })} placeholder="Conheça nossa história" />
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input value={aboutPreview.cta_link} onChange={(e) => setAboutPreview({ ...aboutPreview, cta_link: e.target.value })} placeholder="/nossa-historia" />
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-semibold text-foreground mb-3">🎨 Cores da Seção</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ColorPicker label="Cor de Fundo" value={aboutColors.bg_color || ""} onChange={(c) => setAboutColors({ ...aboutColors, bg_color: c })} description="Fundo da seção" />
                <ColorPicker label="Cor do Texto" value={aboutColors.text_color || ""} onChange={(c) => setAboutColors({ ...aboutColors, text_color: c })} description="Cor do texto" />
                <ColorPicker label="Cor do Link" value={aboutColors.accent_color || ""} onChange={(c) => setAboutColors({ ...aboutColors, accent_color: c })} description="Cor do link" />
              </div>
            </div>
            <Button onClick={handleSaveAbout} disabled={updateSection.isPending}>
              {updateSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
              <Label>Título</Label>
              <Input value={cta.title} onChange={(e) => setCta({ ...cta, title: e.target.value })} placeholder="Pronto para adoçar seu dia?" />
            </div>
            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea value={cta.content} onChange={(e) => setCta({ ...cta, content: e.target.value })} placeholder="Entre em contato..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input value={cta.cta_text} onChange={(e) => setCta({ ...cta, cta_text: e.target.value })} placeholder="Fazer Pedido pelo WhatsApp" />
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-semibold text-foreground mb-3">🎨 Cores da Seção</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ColorPicker label="Cor de Fundo" value={ctaColors.bg_color || ""} onChange={(c) => setCtaColors({ ...ctaColors, bg_color: c })} description="Fundo da seção" />
                <ColorPicker label="Cor do Título" value={ctaColors.title_color || ""} onChange={(c) => setCtaColors({ ...ctaColors, title_color: c })} description="Cor do título" />
                <ColorPicker label="Cor do Texto" value={ctaColors.text_color || ""} onChange={(c) => setCtaColors({ ...ctaColors, text_color: c })} description="Cor do texto" />
                <ColorPicker label="Cor do Botão" value={ctaColors.accent_color || ""} onChange={(c) => setCtaColors({ ...ctaColors, accent_color: c })} description="Fundo do botão" />
              </div>
            </div>
            <Button onClick={handleSaveCta} disabled={updateSection.isPending}>
              {updateSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar CTA
            </Button>
          </CardContent>
        </Card>

        {/* Custom Sections */}
        {customSections.length > 0 && (
          <div className="border-t border-border pt-6">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Seções Personalizadas</h2>
          </div>
        )}

        {customSections.map((section) => {
          const key = section.section_key;
          const edit = customEdits[key] || { title: "", subtitle: "", content: "", image_url: "", cta_text: "", cta_link: "" };
          const colors = customColors[key] || {};
          const displayName = section.metadata?.display_name || section.title || key;
          const isExpanded = expandedCustom[key];

          return (
            <Card key={key}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedCustom(prev => ({ ...prev, [key]: !prev[key] }))}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {displayName}
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {key}
                      </span>
                    </CardTitle>
                    <CardDescription>Seção personalizada</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir seção?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A seção "{displayName}" será removida permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSection(key)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Imagem</Label>
                    <ImageUpload
                      value={edit.image_url}
                      onChange={(url) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], image_url: url } }))}
                      folder="sections"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={edit.title}
                      onChange={(e) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], title: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo</Label>
                    <Input
                      value={edit.subtitle}
                      onChange={(e) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], subtitle: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Conteúdo</Label>
                    <Textarea
                      value={edit.content}
                      onChange={(e) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], content: e.target.value } }))}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Texto do Botão</Label>
                      <Input
                        value={edit.cta_text}
                        onChange={(e) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], cta_text: e.target.value } }))}
                        placeholder="Saiba mais"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link do Botão</Label>
                      <Input
                        value={edit.cta_link}
                        onChange={(e) => setCustomEdits(prev => ({ ...prev, [key]: { ...prev[key], cta_link: e.target.value } }))}
                        placeholder="/pagina"
                      />
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm font-semibold text-foreground mb-3">🎨 Cores da Seção</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ColorPicker label="Cor de Fundo" value={colors.bg_color || ""} onChange={(c) => setCustomColors(prev => ({ ...prev, [key]: { ...prev[key], bg_color: c } }))} />
                      <ColorPicker label="Cor do Texto" value={colors.text_color || ""} onChange={(c) => setCustomColors(prev => ({ ...prev, [key]: { ...prev[key], text_color: c } }))} />
                      <ColorPicker label="Cor do Título" value={colors.title_color || ""} onChange={(c) => setCustomColors(prev => ({ ...prev, [key]: { ...prev[key], title_color: c } }))} />
                      <ColorPicker label="Cor do Botão" value={colors.accent_color || ""} onChange={(c) => setCustomColors(prev => ({ ...prev, [key]: { ...prev[key], accent_color: c } }))} />
                    </div>
                  </div>
                  <Button onClick={() => handleSaveCustom(key)} disabled={updateSection.isPending}>
                    {updateSection.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Seção
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSections;
