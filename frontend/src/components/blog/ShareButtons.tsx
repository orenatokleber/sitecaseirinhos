import { Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
}

const ShareButtons = ({ url, title, slug, description, imageUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const ogShareUrl = shareUrl;

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
      case "whatsapp": {
        // WhatsApp: image URL first (auto-preview), then bold title, excerpt, link
        const parts: string[] = [];
        if (imageUrl) {
          parts.push(imageUrl); // WhatsApp auto-renders image URLs as previews
        }
        parts.push(`*${title}*`);
        if (description) {
          parts.push(description);
        }
        parts.push(`🔗 ${shareUrl}`);
        const whatsappText = encodeURIComponent(parts.join("\n\n"));
        shareLink = `https://api.whatsapp.com/send?text=${whatsappText}`;
        break;
      }
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogShareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(ogShareUrl)}`;
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
