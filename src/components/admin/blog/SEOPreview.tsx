import React from "react";
import { Globe } from "lucide-react";

interface SEOPreviewProps {
  title: string;
  excerpt: string;
  slug: string;
}

const SEOPreview: React.FC<SEOPreviewProps> = ({ title, excerpt, slug }) => {
  const siteUrl = "caseirinhos.lovable.app";
  const displayTitle = title || "Título do Post";
  const displayExcerpt = excerpt || "Adicione um resumo para melhorar o SEO e a exibição em buscadores e redes sociais.";

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Globe className="h-3 w-3" /> Prévia no Google
      </p>
      <div className="p-3 rounded-lg bg-background border border-border space-y-1">
        <p className="text-xs text-green-700 dark:text-green-400 truncate">
          {siteUrl}/blog/{slug || "url-do-post"}
        </p>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 line-clamp-1">
          {displayTitle.length > 60 ? displayTitle.substring(0, 57) + "..." : displayTitle}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {displayExcerpt.length > 155 ? displayExcerpt.substring(0, 152) + "..." : displayExcerpt}
        </p>
      </div>
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        <span>Título: {title.length}/60 {title.length > 60 && "⚠️"}</span>
        <span>Resumo: {excerpt.length}/155 {excerpt.length > 155 && "⚠️"}</span>
      </div>
    </div>
  );
};

export default SEOPreview;
