import { useState, useEffect } from "react";
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
import { ArrowLeft, Loader2, Eye, Settings2, FileText, Clock, Save, X, Tag, MessageSquare, PanelRightOpen, PanelRightClose } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import BlockEditor, { Block, serializeBlocks, deserializeBlocks, calculateReadingTime } from "@/components/admin/BlockEditor";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

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
}

const defaultForm: FormData = {
  title: "", slug: "", excerpt: "", cover_image: "", category: "",
  author_name: "Caseirinhos", reading_time_min: 1, is_published: false, tags: [], allow_comments: true,
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
  const [sidebarTab, setSidebarTab] = useState<"post" | "block">("post");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isEditing && posts) {
      const post = posts.find((p: any) => p.id === id);
      if (post) {
        setFormData({
          title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "",
          cover_image: post.cover_image || "", category: post.category || "",
          author_name: post.author_name || "Caseirinhos", reading_time_min: post.reading_time_min || 1,
          is_published: post.is_published ?? false, tags: post.tags || [], allow_comments: post.allow_comments ?? true,
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

  const handleSave = async (publish = false) => {
    if (!formData.title) { toast.error("Adicione um título ao post"); return; }
    setIsSaving(true);
    const slug = formData.slug || generateSlug(formData.title);
    const serializedContent = serializeBlocks(blocks);
    const payload = {
      ...formData, slug, content: serializedContent,
      is_published: publish ? true : formData.is_published,
      published_at: publish || formData.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    try {
      if (isEditing) { await updatePost.mutateAsync({ id: id!, updates: payload }); }
      else { await createPost.mutateAsync(payload); }
      setHasChanges(false);
      if (!isEditing) navigate("/painel-admin/blog");
    } finally { setIsSaving(false); }
  };

  const sidebarContent = (
    <div className="p-4 space-y-5">
      {/* Status */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Settings2 className="h-4 w-4" /> Status
        </h3>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm font-medium">{formData.is_published ? "Publicado" : "Rascunho"}</p>
            <p className="text-xs text-muted-foreground">{formData.is_published ? "Visível no site" : "Apenas você pode ver"}</p>
          </div>
          <Switch checked={formData.is_published} onCheckedChange={(v) => setFormData({ ...formData, is_published: v })} />
        </div>
      </div>
      <Separator />
      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Imagem de Destaque</Label>
        <ImageUpload value={formData.cover_image} onChange={(url) => setFormData({ ...formData, cover_image: url })} folder="blog" aspectRatio={16 / 9} recommendedSize="1200x675" />
      </div>
      <Separator />
      {/* Excerpt */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Resumo</Label>
        <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Breve descrição do post..." rows={3} className="resize-none text-sm" />
        <p className="text-xs text-muted-foreground">Exibido na listagem e em redes sociais</p>
      </div>
      <Separator />
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Categoria</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {CATEGORY_PRESETS.map((cat) => (
            <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${formData.category === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}>
              {cat}
            </button>
          ))}
        </div>
        <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ou digite uma categoria" className="h-8 text-sm" />
      </div>
      <Separator />
      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Tags</Label>
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
      </div>
      <Separator />
      {/* URL */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">URL do Post</Label>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground text-xs">/blog/</span>
          <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="url-do-post" className="h-8 text-sm" />
        </div>
      </div>
      <Separator />
      {/* Comments */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Comentários</p>
            <p className="text-xs text-muted-foreground">{formData.allow_comments ? "Habilitados" : "Desabilitados"}</p>
          </div>
        </div>
        <Switch checked={formData.allow_comments} onCheckedChange={(v) => setFormData({ ...formData, allow_comments: v })} />
      </div>
      <Separator />
      {/* Author & Reading Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Autor</Label>
          <Input value={formData.author_name} onChange={(e) => setFormData({ ...formData, author_name: e.target.value })} className="h-9 text-sm" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Leitura</Label>
          <div className="flex items-center gap-1">
            <Input type="number" min={1} value={formData.reading_time_min} className="h-9 text-sm" disabled />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-3 md:px-4 bg-card flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Link to="/painel-admin/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-medium truncate max-w-[120px] md:max-w-[200px]">
              {formData.title || "Novo Post"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={isSaving} className="h-8 px-2 md:px-3 text-xs md:text-sm">
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline ml-1">Salvar</span>
          </Button>
          {!formData.is_published && (
            <Button size="sm" onClick={() => handleSave(true)} disabled={isSaving} className="h-8 px-2 md:px-3 text-xs md:text-sm">
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
        {/* Editor Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="max-w-3xl mx-auto py-4 md:py-8 px-3 md:px-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Adicione um título"
                className="w-full text-2xl md:text-4xl font-heading font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-4 md:mb-6"
              />
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Desktop: inline panel, Mobile: Sheet */}
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
              <div className="flex border-b border-border">
                <button onClick={() => setSidebarTab("post")} className={`flex-1 py-3 text-sm font-medium transition-colors ${sidebarTab === "post" ? "text-foreground border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}>Post</button>
                <button onClick={() => setSidebarTab("block")} className={`flex-1 py-3 text-sm font-medium transition-colors ${sidebarTab === "block" ? "text-foreground border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}>Bloco</button>
              </div>
              <ScrollArea className="flex-1">
                {sidebarTab === "post" && sidebarContent}
              </ScrollArea>
            </aside>
          )
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
