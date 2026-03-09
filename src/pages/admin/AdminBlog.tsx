import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, FileText, Eye, EyeOff, Calendar } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import BlockEditor, { Block, serializeBlocks, deserializeBlocks } from "@/components/admin/BlockEditor";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author_name: string;
  reading_time_min: number;
  is_published: boolean;
}

const defaultForm: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  author_name: "Caseirinhos",
  reading_time_min: 3,
  is_published: false,
};

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const AdminBlog = () => {
  const { data: posts, isLoading } = useBlogPosts(false);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [blocks, setBlocks] = useState<Block[]>(deserializeBlocks(""));

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setBlocks(deserializeBlocks(""));
    setIsDialogOpen(true);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "",
      category: post.category || "",
      author_name: post.author_name || "Caseirinhos",
      reading_time_min: post.reading_time_min || 3,
      is_published: post.is_published ?? false,
    });
    setBlocks(deserializeBlocks(post.content || ""));
    setIsDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !editingId ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.slug) return;

    const serializedContent = serializeBlocks(blocks);
    const payload = {
      ...formData,
      content: serializedContent,
      published_at: formData.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      updatePost.mutate({ id: editingId, updates: payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createPost.mutate(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este post?")) deletePost.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground">Gerencie os posts do blog</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Post
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className={`overflow-hidden transition-opacity ${!post.is_published ? "opacity-60" : ""}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Cover thumbnail */}
                  {post.cover_image && (
                    <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {post.is_published ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              <Eye className="h-3 w-3" /> Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              <EyeOff className="h-3 w-3" /> Rascunho
                            </span>
                          )}
                          {post.category && (
                            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground truncate">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.published_at
                              ? format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })
                              : format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })}
                          </span>
                          <span>{post.reading_time_min} min de leitura</span>
                          <span>por {post.author_name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="icon" variant="outline" onClick={() => handleEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum post no blog ainda.</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Post" : "Novo Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <ImageUpload
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
              folder="blog"
              aspectRatio={16 / 9}
              recommendedSize="1200x675"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título do post"
                />
              </div>
              <div>
                <Label>Slug (URL) *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="titulo-do-post"
                />
              </div>
            </div>

            <div>
              <Label>Resumo</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post (exibido na listagem)"
                rows={2}
              />
            </div>

            <div>
              <Label>Conteúdo *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escreva o conteúdo do post aqui. Suporta parágrafos separados por linha em branco."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Dica: Separe parágrafos com uma linha em branco. Use **texto** para negrito e *texto* para itálico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Categoria</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Receitas, Dicas"
                />
              </div>
              <div>
                <Label>Autor</Label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Tempo de leitura (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.reading_time_min}
                  onChange={(e) => setFormData({ ...formData, reading_time_min: parseInt(e.target.value) || 3 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
              />
              <div>
                <Label className="text-sm font-medium">Publicar</Label>
                <p className="text-xs text-muted-foreground">
                  {formData.is_published ? "O post será visível no site" : "O post ficará como rascunho"}
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.slug || createPost.isPending || updatePost.isPending}
            >
              {(createPost.isPending || updatePost.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Salvar Alterações" : "Criar Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
