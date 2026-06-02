import { Helmet } from "react-helmet-async";
import { Wrench, Instagram, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { Link } from "react-router-dom";

interface MaintenancePageProps {
  config?: {
    title?: string;
    message?: string;
    image_url?: string;
    bg_color?: string;
    text_color?: string;
    show_whatsapp?: boolean;
    show_instagram?: boolean;
    whatsapp_number?: string;
    instagram_url?: string;
    expected_return?: string;
  };
}

const MaintenancePage = ({ config: configProp }: MaintenancePageProps) => {
  const { data: settings } = useSiteSettings();
  const config = configProp ?? settings?.maintenance ?? {};

  const title = config.title || "Página em Manutenção";
  const message =
    config.message ||
    "Estamos trabalhando para deixar tudo ainda mais saboroso. Voltamos em breve!";
  const bgColor = config.bg_color || "#f7f5e2";
  const textColor = config.text_color || "#936037";
  const expectedReturn = config.expected_return;
  const whatsappNumber = config.whatsapp_number;
  const instagramUrl = config.instagram_url;

  return (
    <>
      <Helmet>
        <title>{title} | Caseirinhos</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main
        className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="max-w-xl w-full text-center space-y-6">
          {config.image_url ? (
            <img
              src={config.image_url}
              alt={title}
              className="w-48 h-48 mx-auto object-cover rounded-full shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${textColor}15` }}
            >
              <Wrench size={40} style={{ color: textColor }} />
            </div>
          )}

          <h1 className="font-serif text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-lg opacity-90 leading-relaxed whitespace-pre-line">
            {message}
          </p>

          {expectedReturn && (
            <p
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${textColor}15` }}
            >
              Previsão de retorno: {expectedReturn}
            </p>
          )}

          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              style={{ borderColor: textColor, color: textColor }}
            >
              <Link to="/">
                <Home size={18} className="mr-2" />
                Voltar ao início
              </Link>
            </Button>
          </div>

          {(config.show_whatsapp || config.show_instagram) && (
            <div className="flex items-center justify-center gap-3 pt-4">
              {config.show_whatsapp && whatsappNumber && (
                <Button
                  asChild
                  variant="outline"
                  style={{ borderColor: textColor, color: textColor }}
                >
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    WhatsApp
                  </a>
                </Button>
              )}
              {config.show_instagram && instagramUrl && (
                <Button
                  asChild
                  variant="outline"
                  style={{ borderColor: textColor, color: textColor }}
                >
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram size={18} className="mr-2" />
                    Instagram
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MaintenancePage;
