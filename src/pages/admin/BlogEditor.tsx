import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft, Loader2, Eye, EyeOff, Settings2, FileText, Clock, Save, X,
  Tag, MessageSquare, PanelRightOpen, PanelRightClose, CalendarIcon,
  Search, Keyboard,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import BlockEditor, { Block, serializeBlocks, deserializeBlocks, calculateReadingTime, getWordCount, getCharCount } from "@/components/admin/BlockEditor";
import SEOPreview from "@/components/admin/blog/SEOPreview";
import StatusBar from "@/components/admin/blog/StatusBar";
import PostPreview from "@/components/admin/blog/PostPreview";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_PRESETS = [
  "Receitas", "Dicas", "Novidades", "Confeitaria", "Decoração", "Ingredientes", "Eventos",
];

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author_name: string;
  reading_time_min: number;
  is_published: boolean;
  tags: string[];
  allow_comments: boolean;
  published_at: string | null;
}

const defaultForm: FormData = {
  title: "", slug: "", excerpt: "", cover_image: "", category: "",
  author_name: "Caseirinhos", reading_time_min: 1, is_published: false,
  tags: [], allow_comments: true, published_at: null,
};

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = id && id !== "novo";
  const isMobile = useIsMobile();

  const { data: posts } = useBlogPosts(false);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [blocks, setBlocks] = useState<Block[]>(deserializeBlocks(""));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    if (isEditing && posts) {
      const post = posts.find((p: any) => p.id === id);
      if (post) {
        setFormData({
          title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "",
          cover_image: post.cover_image || "", category: post.category || "",
          author_name: post.author_name || "Caseirinhos", reading_time_min: post.reading_time_min || 1,
          is_published: post.is_published ?? false, tags: post.tags || [],
          allow_comments: post.allow_comments ?? true,
          published_at: post.published_at || null,
        });
        setBlocks(deserializeBlocks(post.content || ""));
      }
    }
  }, [id, isEditing, posts]);

  useEffect(() => {
    const time = calculateReadingTime(blocks);
    setFormData((prev) => ({ ...prev, reading_time_min: time }));
  }, [blocks]);

  useEffect(() => { setHasChanges(true); }, [formData, blocks]);

  // Auto-save every 60 seconds
  useEffect(() => {
    if (!hasChanges || !formData.title) return;
    const timer = setTimeout(() => {
      handleSave(false, true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [hasChanges, formData, blocks]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [formData, blocks]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title, slug: !isEditing ? generateSlug(title) : prev.slug }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSave = useCallback(async (publish = false, silent = false) => {
    if (!formData.title) {
      if (!silent) toast.error("Adicione um título ao post");
      return;
    }
    setIsSaving(true);
    const slug = formData.slug || generateSlug(formData.title);
    const serializedContent = serializeBlocks(blocks);
    const payload = {
      ...formData, slug, content: serializedContent,
      is_published: publish ? true : formData.is_published,
      published_at: formData.published_at || (publish || formData.is_published ? new Date().toISOString() : null),
      updated_at: new Date().toISOString(),
    };
    try {
      if (isEditing) { await updatePost.mutateAsync({ id: id!, updates: payload }); }
      else { await createPost.mutateAsync(payload); }
      setHasChanges(false);
      setLastSaved(new Date().toISOString());
      if (!silent) toast.success(publish ? "Post publicado!" : "Salvo com sucesso!");
      if (!isEditing && !silent) navigate("/painel-admin/blog");
    } catch {
      if (!silent) toast.error("Erro ao salvar");
    } finally { setIsSaving(false); }
  }, [formData, blocks, isEditing, id]);

  const wordCount = getWordCount(blocks);
  const charCount = getCharCount(blocks);

  const sidebarContent = (
    <div className="p-4 space-y-1">
      <Accordion type="multiple" defaultValue={["status", "cover", "excerpt", "seo"]} className="w-full">
        {/* Status */}
        <AccordionItem value="status" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <span className="flex items-center gap-2"><Settings2 className="h-4 w-4" /> Status e Publicação</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{formData.is_published ? "Publicado" : "Rascunho"}</p>
                <p className="text-xs text-muted-foreground">{formData.is_published ? "Visível no site" : "Apenas você pode ver"}</p>
              </div>
              <Switch checked={formData.is_published} onCheckedChange={(v) => setFormData({ ...formData, is_published: v })} />
            </div>
            {/* Scheduled publishing */}
            <div className="space-y-1.5">
              <Label className="text-xs">Agendar publicação</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 font-normal">
                    <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                    {formData.published_at
                      ? format(new Date(formData.published_at), "dd MMM yyyy, HH:mm", { locale: ptBR })
                      : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.published_at ? new Date(formData.published_at) : undefined}
                    onSelect={(date) => setFormData({ ...formData, published_at: date?.toISOString() || null })}
                    locale={ptBR}
                  />
                  <div className="p-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setFormData({ ...formData, published_at: null })}>
                      Limpar data
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cover Image */}
        <AccordionItem value="cover" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">Imagem de Destaque</AccordionTrigger>
          <AccordionContent className="pb-4">
            <ImageUpload value={formData.cover_image} onChange={(url) => setFormData({ ...formData, cover_image: url })} folder="blog" aspectRatio={16 / 9} recommendedSize="1200x675" />
          </AccordionContent>
        </AccordionItem>

        {/* Excerpt */}
        <AccordionItem value="excerpt" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">Resumo</AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Breve descrição do post..." rows={3} className="resize-none text-sm" />
            <p className="text-[10px] text-muted-foreground">{formData.excerpt.length}/155 caracteres • Exibido na listagem e redes sociais</p>
          </AccordionContent>
        </AccordionItem>

        {/* SEO Preview */}
        <AccordionItem value="seo" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> SEO</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <SEOPreview title={formData.title} excerpt={formData.excerpt} slug={formData.slug} />
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">Categoria</AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORY_PRESETS.map((cat) => (
                <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${formData.category === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ou digite uma categoria" className="h-8 text-sm" />
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-1">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Adicionar tag..." className="h-8 text-sm" />
              <Button size="sm" variant="outline" className="h-8 px-2" onClick={addTag}>+</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* URL */}
        <AccordionItem value="url" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">URL do Post</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground text-xs">/blog/</span>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="url-do-post" className="h-8 text-sm" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Comments */}
        <AccordionItem value="comments" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Comentários</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{formData.allow_comments ? "Habilitados" : "Desabilitados"}</p>
                <p className="text-xs text-muted-foreground">Leitores poderão comentar</p>
              </div>
              <Switch checked={formData.allow_comments} onCheckedChange={(v) => setFormData({ ...formData, allow_comments: v })} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Author & Reading Time */}
        <AccordionItem value="author" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">Autor e Leitura</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Autor</Label>
                <Input value={formData.author_name} onChange={(e) => setFormData({ ...formData, author_name: e.target.value })} className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Leitura</Label>
                <div className="flex items-center gap-1">
                  <Input type="number" min={1} value={formData.reading_time_min} className="h-8 text-sm" disabled />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-3 md:px-4 bg-card flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Link to="/painel-admin/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-medium truncate max-w-[100px] md:max-w-[200px]">
              {formData.title || "Novo Post"}
            </span>
            {formData.is_published && (
              <Badge variant="secondary" className="text-[10px] h-5 hidden sm:flex">Publicado</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-1.5">
          {/* Preview toggle */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Editar" : "Prévia"}>
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          {/* Shortcuts */}
          <Popover open={showShortcuts} onOpenChange={setShowShortcuts}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" title="Atalhos">
                <Keyboard className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <p className="text-xs font-medium mb-2">Atalhos do Teclado</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {[
                  ["Ctrl+S", "Salvar"],
                  ["Ctrl+B", "Negrito"],
                  ["Ctrl+I", "Itálico"],
                  ["Ctrl+U", "Sublinhado"],
                  ["Ctrl+K", "Inserir link"],
                  ["Enter", "Novo parágrafo"],
                  ["Backspace", "Excluir bloco vazio"],
                ].map(([key, desc]) => (
                  <div key={key} className="flex justify-between">
                    <span>{desc}</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">{key}</kbd>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={isSaving} className="h-8 px-2 md:px-3 text-xs">
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline ml-1">Salvar</span>
          </Button>
          {!formData.is_published && (
            <Button size="sm" onClick={() => handleSave(true)} disabled={isSaving} className="h-8 px-2 md:px-3 text-xs">
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              Publicar
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSidebar(!showSidebar)} title={showSidebar ? "Ocultar painel" : "Mostrar painel"}>
            {showSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor / Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {showPreview ? (
            <PostPreview
              title={formData.title}
              excerpt={formData.excerpt}
              coverImage={formData.cover_image}
              authorName={formData.author_name}
              readingTime={formData.reading_time_min}
              category={formData.category}
              tags={formData.tags}
              blocks={blocks}
            />
          ) : (
            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto py-4 md:py-8 px-3 md:px-6">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Adicione um título"
                  className="w-full text-2xl md:text-4xl font-heading font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-4 md:mb-6"
                />
                <BlockEditor blocks={blocks} onChange={setBlocks} />
              </div>
            </ScrollArea>
          )}

          {/* Status Bar */}
          <StatusBar
            wordCount={wordCount}
            charCount={charCount}
            blockCount={blocks.length}
            readingTime={formData.reading_time_min}
            hasChanges={hasChanges}
            lastSaved={lastSaved || undefined}
          />
        </div>

        {/* Sidebar */}
        {isMobile ? (
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>Configurações do Post</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-60px)]">
                {sidebarContent}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ) : (
          showSidebar && (
            <aside className="w-80 border-l border-border bg-card flex-shrink-0 flex flex-col">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-sm font-medium">Configurações</p>
              </div>
              <ScrollArea className="flex-1">
                {sidebarContent}
              </ScrollArea>
            </aside>
          )
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
