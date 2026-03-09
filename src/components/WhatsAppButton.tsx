import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteContent";

const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();
  const whatsapp = (settings?.contact as any)?.whatsapp || "5500000000000";

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,40%)] text-[hsl(0,0%,100%)] shadow-lg hover:scale-110 transition-transform"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  );
};

export default WhatsAppButton;
