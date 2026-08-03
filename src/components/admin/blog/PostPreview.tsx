import React from "react";
import { Block } from "@/components/admin/BlockEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";

interface PostPreviewProps {
  title: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  readingTime: number;
  category: string;
  tags: string[];
  blocks: Block[];
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "paragraph":
      return <div key={index} className="text-base leading-7 text-foreground" dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "heading":
      return <h2 key={index} className="text-3xl font-heading font-bold text-foreground mt-8 mb-4">{block.content}</h2>;
    case "heading2":
      return <h3 key={index} className="text-2xl font-heading font-semibold text-foreground mt-6 mb-3">{block.content}</h3>;
    case "heading3":
      return <h4 key={index} className="text-xl font-heading font-medium text-foreground mt-4 mb-2">{block.content}</h4>;
    case "image":
      return block.imageUrl ? (
        <figure key={index} className="my-6">
          <img src={block.imageUrl} alt={block.imageCaption || ""} className="w-full rounded-lg" />
          {block.imageCaption && <figcaption className="text-sm text-center text-muted-foreground mt-2">{block.imageCaption}</figcaption>}
        </figure>
      ) : null;
    case "quote":
      return <blockquote key={index} className="border-l-4 border-accent pl-4 my-4 italic text-lg text-muted-foreground">{block.content}</blockquote>;
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 my-4 space-y-1">
          {block.content.split("\n").filter(Boolean).map((item, i) => <li key={i} className="text-base">{item}</li>)}
        </ul>
      );
    case "ordered-list":
      return (
        <ol key={index} className="list-decimal pl-6 my-4 space-y-1">
          {block.content.split("\n").filter(Boolean).map((item, i) => <li key={i} className="text-base">{item}</li>)}
        </ol>
      );
    case "divider":
      return <hr key={index} className="my-8 border-border" />;
    case "code":
      return <pre key={index} className="bg-muted rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto"><code>{block.content}</code></pre>;
    case "callout": {
      const styles: Record<string, string> = {
        info: "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
        warning: "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
        success: "border-green-400 bg-green-50 dark:bg-green-950/30",
        tip: "border-purple-400 bg-purple-50 dark:bg-purple-950/30",
      };
      return (
        <div key={index} className={`border-l-4 rounded-r-lg p-4 my-4 text-sm ${styles[block.calloutType || "info"]}`}>
          {block.content}
        </div>
      );
    }
    case "embed":
      return block.embedUrl ? (
        <div key={index} className="my-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe src={block.embedUrl} className="w-full h-full" allowFullScreen />
          </div>
          {block.content && <p className="text-sm text-center text-muted-foreground mt-2">{block.content}</p>}
        </div>
      ) : null;
    case "columns":
      return (
        <div key={index} className="grid grid-cols-2 gap-6 my-4">
          <div className="text-base leading-7">{block.content}</div>
          <div className="text-base leading-7">{block.columnContent}</div>
        </div>
      );
    case "spacer":
      return <div key={index} className="h-8" />;
    default:
      return null;
  }
}

const PostPreview: React.FC<PostPreviewProps> = ({
  title, excerpt, coverImage, authorName, readingTime, category, tags, blocks,
}) => {
  return (
    <ScrollArea className="h-full">
      <article className="max-w-3xl mx-auto py-8 px-4">
        {coverImage && (
          <img src={coverImage} alt={title} className="w-full rounded-xl mb-6 aspect-video object-cover" />
        )}
        {category && <Badge variant="secondary" className="mb-3">{category}</Badge>}
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          {title || "Sem título"}
        </h1>
        {excerpt && <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {authorName}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date().toLocaleDateString("pt-BR")}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {readingTime} min</span>
        </div>
        <div className="prose-caseirinhos space-y-4">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
            {tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}
          </div>
        )}
      </article>
    </ScrollArea>
  );
};

export default PostPreview;
