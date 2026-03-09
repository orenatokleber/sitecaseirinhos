import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlogPost } from "@/hooks/useBlog";
import { Loader2, ArrowLeft, Clock, User, Calendar, Tag, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPublicImageUrl } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ShareButtons from "@/components/blog/ShareButtons";
import BlogSEO from "@/components/blog/BlogSEO";
import { useState } from "react";
import { toast } from "sonner";
import { useApprovedComments, useSubmitComment } from "@/hooks/useComments";

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
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em class='italic'>$1</em>")
    .replace(/<mark[^>]*>(.+?)<\/mark>/g, "<mark class='bg-yellow-200/80 dark:bg-yellow-500/30 px-1 rounded'>$1</mark>")
    .replace(/<small>(.+?)<\/small>/g, "<span class='text-sm'>$1</span>")
    .replace(/<big>(.+?)<\/big>/g, "<span class='text-xl'>$1</span>")
    .replace(/\n/g, "<br />");
}

/**
 * Render plain text that may contain markdown-style formatting.
 * Handles: # headings, **bold**, *italic*, - lists, 1. ordered lists, > quotes, ---
 */
function renderPlainText(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={key++} className="text-lg md:text-xl font-heading font-medium text-foreground mt-8 mb-3">
          {trimmed.slice(4)}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-xl md:text-2xl font-heading font-semibold text-foreground mt-10 mb-4">
          {trimmed.slice(3)}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-12 mb-5 pb-2 border-b border-border/50">
          {trimmed.slice(2)}
        </h2>
      );
      i++;
      continue;
    }

    // Divider
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(
        <div key={key++} className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} className="relative border-l-4 border-accent pl-6 py-4 my-8 bg-accent/5 rounded-r-lg">
          <p className="text-lg italic text-foreground/80 leading-relaxed">{quoteLines.join(" ")}</p>
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*•]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-2 mb-6 text-foreground/85 text-lg pl-6">
          {items.map((item, j) => (
            <li key={j} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent"
              dangerouslySetInnerHTML={{ __html: renderInlineFormatting(item) }}
            />
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+[.)]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-2 mb-6 text-foreground/85 text-lg pl-4">
          {items.map((item, j) => (
            <li key={j} className="pl-2" dangerouslySetInnerHTML={{ __html: renderInlineFormatting(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph — collect consecutive non-empty lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("#") && !lines[i].trim().startsWith("> ") && !/^[-*•]\s/.test(lines[i].trim()) && !/^\d+[.)]\s/.test(lines[i].trim()) && !/^[-*_]{3,}$/.test(lines[i].trim())) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const html = renderInlineFormatting(paraLines.join(" "));
      elements.push(
        <p key={key++} className="mb-6 leading-relaxed text-foreground/85 text-[1.125rem] font-body first-letter:text-2xl first-letter:font-semibold first-letter:text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
  }

  return elements;
}

// Comments Section Component
interface CommentsSectionProps {
  postId: string;
  allowComments: boolean;
}

const CommentsSection = ({ postId, allowComments }: CommentsSectionProps) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const { data: approvedComments } = useApprovedComments(postId);
  const submitComment = useSubmitComment();

  if (!allowComments) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    submitComment.mutate(
      { post_id: postId, author_name: name.trim(), content: comment.trim() },
      {
        onSuccess: () => {
          toast.success("Comentário enviado! Aguarde aprovação.");
          setName("");
          setComment("");
        },
        onError: () => toast.error("Erro ao enviar comentário."),
      }
    );
  };

  return (
    <section className="mt-16 pt-10 border-t border-border/40">
      <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-accent" />
        Comentários {approvedComments && approvedComments.length > 0 && `(${approvedComments.length})`}
      </h3>

      {/* Approved comments */}
      {approvedComments && approvedComments.length > 0 && (
        <div className="space-y-4 mb-8">
          {approvedComments.map((c: any) => (
            <div key={c.id} className="bg-muted/30 rounded-xl p-4 border border-border/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-semibold text-accent">
                  {c.author_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-foreground">{c.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-foreground/80 pl-10">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 rounded-2xl p-6 border border-border/30">
        <p className="text-sm text-muted-foreground">Deixe seu comentário — ele será publicado após aprovação.</p>
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="bg-background"
          />
        </div>
        <div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escreva seu comentário..."
            rows={4}
            className="bg-background resize-none"
          />
        </div>
        <Button type="submit" disabled={submitComment.isPending} className="gap-2">
          {submitComment.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Enviar comentário
        </Button>
      </form>
    </section>
  );
};

function renderBlocks(blocks: Block[]) {
  return blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        if (!block.content) return null;
        return (
          <p
            key={block.id}
            className="mb-6 leading-relaxed text-foreground/85 text-[1.125rem] font-body"
            dangerouslySetInnerHTML={{ __html: renderInlineFormatting(block.content) }}
          />
        );

      case "heading":
        return (
          <h2 key={block.id} className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-14 mb-5 pb-3 border-b border-accent/20">
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
          <figure key={block.id} className="my-12 -mx-4 md:-mx-8">
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/10">
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
            className="relative border-l-4 border-accent pl-6 py-4 my-10 bg-accent/5 rounded-r-xl"
          >
            <p className="text-lg italic text-foreground/75 leading-relaxed font-body">{block.content}</p>
          </blockquote>
        );

      case "list":
        return (
          <ul key={block.id} className="space-y-3 mb-8 text-foreground/80 text-lg pl-6">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:rounded-full before:bg-accent/60"
                dangerouslySetInnerHTML={{ __html: renderInlineFormatting(item) }}
              />
            ))}
          </ul>
        );

      case "ordered-list":
        return (
          <ol key={block.id} className="list-decimal list-inside space-y-3 mb-8 text-foreground/80 text-lg pl-4 marker:text-accent marker:font-semibold">
            {block.content.split("\n").filter(Boolean).map((item, i) => (
              <li key={i} className="pl-2" dangerouslySetInnerHTML={{ __html: renderInlineFormatting(item) }} />
            ))}
          </ol>
        );

      case "divider":
        return (
          <div key={block.id} className="my-12 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>
        );

      case "code":
        return (
          <pre key={block.id} className="bg-muted/60 rounded-2xl p-6 my-10 overflow-x-auto border border-border/30">
            <code className="text-sm font-mono text-foreground/85 leading-relaxed">{block.content}</code>
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
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className="pt-24 bg-background">
      <BlogSEO
        title={post.title}
        description={post.excerpt || undefined}
        image={post.cover_image || undefined}
        url={currentUrl}
        author={post.author_name}
        publishedAt={post.published_at || undefined}
        tags={tags}
      />

      {/* Hero cover - full bleed with parallax effect */}
      {post.cover_image && (
        <div className="w-full h-72 md:h-[32rem] relative overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <article className="container mx-auto px-4 max-w-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={post.cover_image ? "-mt-32 relative z-10" : "pt-12"}
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:underline mb-10 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao blog
          </Link>

          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.category && (
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent bg-accent/10 px-4 py-1.5 rounded-full">
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
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-bold text-foreground mb-6 leading-[1.12] tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 font-light border-l-2 border-accent/30 pl-5">
              {post.excerpt}
            </p>
          )}

          {/* Author / meta bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-y border-border/40 mb-12 gap-4">
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                  <User className="h-4 w-4 text-accent" />
                </div>
                {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.reading_time_min} min de leitura
              </span>
            </div>
            <ShareButtons url={currentUrl} title={post.title} />
          </div>

          {/* Content */}
          <div className="prose-custom">
            {blocks ? renderBlocks(blocks) : renderPlainText(post.content)}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border/40">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share bar at bottom */}
          <div className="flex items-center justify-center gap-4 mt-10 py-6 border-y border-border/30">
            <span className="text-sm text-muted-foreground">Gostou? Compartilhe:</span>
            <ShareButtons url={currentUrl} title={post.title} />
          </div>

          {/* Comments Section */}
          <CommentsSection postId={post.id} allowComments={post.allow_comments} />

          {/* Footer CTA */}
          <div className="mt-12 pb-20">
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl p-10 text-center border border-accent/10">
              <p className="font-script text-2xl text-accent mb-2">Caseirinhos</p>
              <p className="font-heading text-xl font-semibold text-foreground mb-5">Explore mais receitas e dicas</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3 rounded-full font-medium hover:opacity-90 transition-opacity text-sm shadow-lg shadow-accent/20"
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
