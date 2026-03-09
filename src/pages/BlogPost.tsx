import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogPost } from "@/hooks/useBlog";
import { Loader2, ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Simple markdown-ish renderer: bold, italic, paragraphs */
function renderContent(raw: string) {
  const paragraphs = raw.split(/\n\s*\n/).filter(Boolean);

  return paragraphs.map((p, i) => {
    // Process inline formatting
    let html = p
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");

    return (
      <p
        key={i}
        className="mb-5 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <main className="pt-24">
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-24">
        <div className="py-20 text-center container mx-auto px-4">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este post pode ter sido removido ou o link está incorreto.</p>
          <Link to="/blog" className="text-accent font-medium hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar ao blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24">
      {/* Hero cover */}
      {post.cover_image && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
      )}

      <article className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={post.cover_image ? "-mt-20 relative z-10" : "pt-12"}
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time_min} min de leitura
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {post.author_name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Divider */}
          <div className="w-16 h-1 bg-accent rounded-full mb-8" />

          {/* Content */}
          <div className="text-foreground/90 text-base md:text-lg">
            {renderContent(post.content)}
          </div>

          {/* Footer */}
          <div className="border-t border-border mt-12 pt-8 pb-16 text-center">
            <p className="text-muted-foreground mb-4">Gostou do conteúdo?</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Veja mais posts
            </Link>
          </div>
        </motion.div>
      </article>
    </main>
  );
};

export default BlogPost;
