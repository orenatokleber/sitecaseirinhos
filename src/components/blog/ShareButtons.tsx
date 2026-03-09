import { Facebook, MessageCircle, Link2, Check, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  // Ensure we have a valid URL
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
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
        shareLink = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
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
        title="Compartilhar no Twitter/X"
        aria-label="Compartilhar no Twitter/X"
      >
        <Twitter className="h-4 w-4" />
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
