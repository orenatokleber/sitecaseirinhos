import { useAllComments, useApproveComment, useDeleteComment } from "@/hooks/useComments";
import { Loader2, CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const AdminComments = () => {
  const { data: comments, isLoading } = useAllComments();
  const approveComment = useApproveComment();
  const deleteComment = useDeleteComment();

  const handleApprove = (id: string, approve: boolean) => {
    approveComment.mutate(
      { id, is_approved: approve },
      { onSuccess: () => toast.success(approve ? "Comentário aprovado!" : "Comentário reprovado.") }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;
    deleteComment.mutate(id, { onSuccess: () => toast.success("Comentário excluído.") });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const pending = comments?.filter((c: any) => !c.is_approved) || [];
  const approved = comments?.filter((c: any) => c.is_approved) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Comentários</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modere os comentários dos posts do blog
        </p>
      </div>

      {/* Pending */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          Pendentes ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            Nenhum comentário pendente de aprovação.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((c: any) => (
              <Card key={c.id} className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">{c.author_name}</span>
                        <Badge variant="outline" className="text-[10px]">Pendente</Badge>
                      </div>
                      <p className="text-sm text-foreground/80 mb-2">{c.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(c.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                        {c.blog_posts && (
                          <>
                            <span>•</span>
                            <span className="truncate">{c.blog_posts.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                        onClick={() => handleApprove(c.id, true)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approved */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Aprovados ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            Nenhum comentário aprovado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {approved.map((c: any) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">{c.author_name}</span>
                        <Badge variant="secondary" className="text-[10px]">Aprovado</Badge>
                      </div>
                      <p className="text-sm text-foreground/80 mb-2">{c.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(c.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                        {c.blog_posts && (
                          <>
                            <span>•</span>
                            <span className="truncate">{c.blog_posts.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        onClick={() => handleApprove(c.id, false)}
                        title="Reprovar"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
