import { Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(`${title}`);
  const shareUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Compartilhar:</span>
      <a
        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-green-600"
        title="WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-blue-600"
        title="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
        title="Copiar link"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default ShareButtons;
