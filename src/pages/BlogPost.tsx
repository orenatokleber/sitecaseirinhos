import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogPost } from "@/hooks/useBlog";
import { Loader2, ArrowLeft, Clock, User, Calendar, Tag, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPublicImageUrl } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

interface Block {
  id: string;
  type: "paragraph" | "heading" | "heading2" | "heading3" | "subheading" | "image" | "quote" | "list" | "ordered-list" | "divider" | "code" | "spacer";
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

/** Render inline formatting: **bold**, *italic*, <mark>, <small>, <big> */
function renderInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

function renderPlainText(raw: string) {
  const paragraphs = raw.split(/\n\s*\n/).filter(Boolean);
  return paragraphs.map((p, i) => {
    const html = renderInlineFormatting(p);
    return (
      <p key={i} className="mb-6 leading-[1.8] text-foreground/85 text-lg" dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
}

function renderBlocks(blocks: Block[]) {
  return blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        if (!block.content) return null;
        return (
          <p
            key={block.id}
            className="mb-6 leading-[1.8] text-foreground/85 text-lg"
            dangerouslySetInnerHTML={{ __html: renderInlineFormatting(block.content) }}
          />
        );

      case "heading":
        return (
          <h2 key={block.id} className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-12 mb-5 pb-2 border-b border-border/50">
            {block.content}
          </h2>
        );

      case "heading2":
      case "subheading":
        return (
          <h3 key={block.id} className="text-xl md:text-2xl font-heading font-semibold text-foreground mt-10 mb-4">
            {block.content}
          </h3>
        );

      case "heading3":
        return (
          <h4 key={block.id} className="text-lg md:text-xl font-heading font-medium text-foreground mt-8 mb-3">
            {block.content}
          </h4>
        );

      case "spacer":
        return <div key={block.id} className="h-10" />;

      case "image": {
        const url = block.imageUrl
          ? block.imageUrl.startsWith("http")
            ? block.imageUrl
            : getPublicImageUrl(block.imageUrl)
          : null;
        if (!url) return null;
        return (
          <figure key={block.id} className="my-10 -mx-4 md:-mx-8">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={url} alt={block.imageCaption || ""} className="w-full h-auto" loading="lazy" />
            </div>
            {block.imageCaption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-4 italic px-4">
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
            className="relative border-l-4 border-accent pl-6 py-4 my-8 bg-accent/5 rounded-r-lg"
          >
            <p className="text-lg italic text-foreground/80 leading-relaxed">{block.content}</p>
          </blockquote>
        );

      case "list":
        return (
          <ul key={block.id} className="space-y-2 mb-6 text-foreground/85 text-lg pl-6">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent">
                {item}
              </li>
            ))}
          </ul>
        );

      case "ordered-list":
        return (
          <ol key={block.id} className="list-decimal list-inside space-y-2 mb-6 text-foreground/85 text-lg pl-4">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i} className="pl-2">{item}</li>
            ))}
          </ol>
        );

      case "divider":
        return (
          <div key={block.id} className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>
        );

      case "code":
        return (
          <pre key={block.id} className="bg-muted/80 rounded-2xl p-6 my-8 overflow-x-auto border border-border/50">
            <code className="text-sm font-mono text-foreground/90 leading-relaxed">{block.content}</code>
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
  const tags = post.tags || [];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${post.title} - Caseirinhos`;

  return (
    <main className="pt-24">
      {/* Hero cover - full bleed */}
      {post.cover_image && (
        <div className="w-full h-72 md:h-[28rem] relative overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      <article className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={post.cover_image ? "-mt-28 relative z-10" : "pt-12"}
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:underline mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao blog
          </Link>

          {/* Category & Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-accent bg-accent/10 px-3.5 py-1.5 rounded-full">
                {post.category}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-light">
              {post.excerpt}
            </p>
          )}

          {/* Author / meta bar */}
          <div className="flex items-center justify-between py-5 border-y border-border/60 mb-10">
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-4 w-4 text-accent" /> {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.reading_time_min} min de leitura
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Compartilhar no WhatsApp"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="prose-custom">
            {blocks ? renderBlocks(blocks) : renderPlainText(post.content)}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border/50">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border mt-10 pt-10 pb-16">
            <div className="bg-muted/50 rounded-2xl p-8 text-center">
              <p className="text-muted-foreground mb-2 text-sm">Gostou do conteúdo?</p>
              <p className="font-heading text-xl font-semibold text-foreground mb-4">Explore mais receitas e dicas</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
              >
                <ArrowLeft className="h-4 w-4" /> Ver todos os posts
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
};

export default BlogPost;
