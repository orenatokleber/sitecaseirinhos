import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, FileText, Eye, EyeOff, Calendar } from "lucide-react";
import { useBlogPosts, useDeleteBlogPost } from "@/hooks/useBlog";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminBlog = () => {
  const { data: posts, isLoading } = useBlogPosts(false);
  const deletePost = useDeleteBlogPost();
  const navigate = useNavigate();

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
        <Button onClick={() => navigate("/painel-admin/blog/novo")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Post
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${!post.is_published ? "opacity-60" : ""}`}
              onClick={() => navigate(`/painel-admin/blog/${post.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
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
                      <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" variant="outline" onClick={() => navigate(`/painel-admin/blog/${post.id}`)}>
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
            <Button onClick={() => navigate("/painel-admin/blog/novo")}>
              <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBlog;
