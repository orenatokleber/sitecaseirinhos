import { Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  slug?: string;
}

const ShareButtons = ({ url, title, slug }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  
  // Build OG share URL for crawlers (so social platforms see the image)
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://caseirinhos.lovable.app";
  const ogShareUrl = slug
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-share?slug=${encodeURIComponent(slug)}&site_url=${encodeURIComponent(siteUrl)}`
    : shareUrl;

  const encodedOgUrl = encodeURIComponent(ogShareUrl);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  const handleShare = (platform: string) => {
    let shareLink = "";
    
    switch (platform) {
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedOgUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedOgUrl}&quote=${encodedTitle}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedOgUrl}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=400");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleShare("whatsapp")}
        className="p-2 rounded-full hover:bg-green-500/10 transition-colors text-muted-foreground hover:text-green-600"
        title="Compartilhar no WhatsApp"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-full hover:bg-blue-500/10 transition-colors text-muted-foreground hover:text-blue-600"
        title="Compartilhar no Facebook"
        aria-label="Compartilhar no Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-full hover:bg-sky-500/10 transition-colors text-muted-foreground hover:text-sky-500"
        title="Compartilhar no X"
        aria-label="Compartilhar no X"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={handleCopy}
        className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
        title="Copiar link"
        aria-label="Copiar link"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default ShareButtons;
