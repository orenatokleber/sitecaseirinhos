import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogPost } from "@/hooks/useBlog";
import { Loader2, ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPublicImageUrl } from "@/lib/supabase";

interface Block {
  id: string;
  type: "paragraph" | "heading" | "subheading" | "image" | "quote" | "list" | "ordered-list" | "divider" | "code";
  content: string;
  imageUrl?: string;
  imageCaption?: string;
}

function parseContent(raw: string): Block[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      return parsed;
    }
  } catch {}
  return null;
}

/** Fallback for plain text */
function renderPlainText(raw: string) {
  const paragraphs = raw.split(/\n\s*\n/).filter(Boolean);
  return paragraphs.map((p, i) => {
    let html = p
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");
    return (
      <p key={i} className="mb-5 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
}

function renderBlocks(blocks: Block[]) {
  return blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        if (!block.content) return null;
        return (
          <p key={block.id} className="mb-5 leading-relaxed text-foreground/90">
            {block.content}
          </p>
        );

      case "heading":
        return (
          <h2 key={block.id} className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-10 mb-4">
            {block.content}
          </h2>
        );

      case "heading2":
      case "subheading":
        return (
          <h3 key={block.id} className="text-xl md:text-2xl font-heading font-semibold text-foreground mt-8 mb-3">
            {block.content}
          </h3>
        );

      case "heading3":
        return (
          <h4 key={block.id} className="text-lg md:text-xl font-heading font-medium text-foreground mt-6 mb-2">
            {block.content}
          </h4>
        );

      case "spacer":
        return <div key={block.id} className="h-8" />;

      case "image": {
        const url = block.imageUrl
          ? block.imageUrl.startsWith("http")
            ? block.imageUrl
            : getPublicImageUrl(block.imageUrl)
          : null;
        if (!url) return null;
        return (
          <figure key={block.id} className="my-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={url} alt={block.imageCaption || ""} className="w-full h-auto" loading="lazy" />
            </div>
            {block.imageCaption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                {block.imageCaption}
              </figcaption>
            )}
          </figure>
        );
      }

      case "quote":
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-accent pl-6 py-2 my-6 text-lg italic text-foreground/80"
          >
            {block.content}
          </blockquote>
        );

      case "list":
        return (
          <ul key={block.id} className="list-disc list-inside space-y-1.5 mb-5 text-foreground/90 pl-2">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case "ordered-list":
        return (
          <ol key={block.id} className="list-decimal list-inside space-y-1.5 mb-5 text-foreground/90 pl-2">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );

      case "divider":
        return <hr key={block.id} className="border-border my-8" />;

      case "code":
        return (
          <pre key={block.id} className="bg-muted rounded-xl p-5 my-6 overflow-x-auto">
            <code className="text-sm font-mono text-foreground/90">{block.content}</code>
          </pre>
        );

      default:
        return null;
    }
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

  const blocks = parseContent(post.content);

  return (
    <main className="pt-24">
      {/* Hero cover */}
      {post.cover_image && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
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
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:underline mb-6">
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
          <div className="text-base md:text-lg">
            {blocks ? renderBlocks(blocks) : renderPlainText(post.content)}
          </div>

          {/* Footer */}
          <div className="border-t border-border mt-12 pt-8 pb-16 text-center">
            <p className="text-muted-foreground mb-4">Gostou do conteúdo?</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-accent font-medium hover:underline">
              <ArrowLeft className="h-4 w-4" /> Veja mais posts
            </Link>
          </div>
        </motion.div>
      </article>
    </main>
  );
};

export default BlogPost;
