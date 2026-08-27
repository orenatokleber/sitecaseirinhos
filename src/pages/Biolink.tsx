import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useBioLinks } from "@/hooks/useBioLinks";
import { getPublicImageUrl } from "@/lib/supabase";
import logoUrl from "@/assets/logo.png";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";


export interface BiolinkSettings {
  title?: string;
  subtitle?: string;
  avatar_url?: string;
  bg_image_url?: string;
  bg_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  button_style?: "solid" | "outline" | "glass";
  overlay_opacity?: number;
  footer_text?: string;
  map_enabled?: boolean;
  map_address?: string;
}

const Biolink = () => {
  const { data: settings } = useSiteSettings();
  const { data: links, isLoading } = useBioLinks(true);

  const cfg: BiolinkSettings = settings?.biolink || {};
  const bgImage = cfg.bg_image_url ? getPublicImageUrl(cfg.bg_image_url) : "";
  const storedAvatar = cfg.avatar_url ? getPublicImageUrl(cfg.avatar_url) : "";
  const avatar = storedAvatar || logoUrl;
  const overlay = typeof cfg.overlay_opacity === "number" ? cfg.overlay_opacity : 0.45;
  const style = cfg.button_style || "solid";

  const siteBg = cfg.bg_color || "#f7f5e2";
  const siteText = cfg.text_color || "#5a3e2b";
  const primaryBtn = cfg.button_color || "#40e0d0";

  const buttonStyle: React.CSSProperties =
    style === "outline"
      ? {
          backgroundColor: "transparent",
          border: `2px solid ${primaryBtn}`,
          color: cfg.button_text_color || primaryBtn,
        }
      : style === "glass"
      ? {
          backgroundColor: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: cfg.button_text_color || siteText,
        }
      : {
          backgroundColor: primaryBtn,
          color: cfg.button_text_color || "#ffffff",
        };

  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor: siteBg }}
    >
      <Helmet>
        <title>{cfg.title ? `${cfg.title} | Links` : "Links | Caseirinhos a Confeitaria"}</title>
        <meta
          name="description"
          content={cfg.subtitle || "Todos os links da Caseirinhos a Confeitaria em um só lugar."}
        />
      </Helmet>

      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlay})` }}
            aria-hidden="true"
          />
        </>
      )}

      <main
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 py-12"
        style={{ color: siteText }}
      >
        {avatar && (
          <img
            src={avatar}
            alt={cfg.title || "Logo"}
            className="mb-5 h-28 w-28 rounded-full object-cover shadow-xl ring-4 ring-white/40"
            loading="eager"
          />
        )}

        <h1 className="font-display text-center text-3xl leading-tight">
          {cfg.title || "Caseirinhos a Confeitaria"}
        </h1>
        {cfg.subtitle && (
          <p className="mt-2 text-center text-sm opacity-90">{cfg.subtitle}</p>
        )}

        <div className="mt-8 w-full space-y-3">
          {isLoading && <p className="text-center text-sm opacity-80">Carregando...</p>}
          {!isLoading && !links?.length && (
            <p className="text-center text-sm opacity-80">Nenhum link disponível ainda.</p>
          )}
          {links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
              style={buttonStyle}
            >
              {link.image_url ? (
                <img
                  src={getPublicImageUrl(link.image_url)}
                  alt=""
                  className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-black/10">
                  <ExternalLink size={18} />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{link.title}</span>
                {link.description && (
                  <span className="block truncate text-xs opacity-80">{link.description}</span>
                )}
              </span>
            </a>
          ))}
        </div>

        {cfg.map_enabled !== false && (cfg.map_address || "Rua Manucaia, 114") && (
          <div className="mt-6 w-full">
            <p className="mb-2 flex items-center gap-1 text-sm opacity-90">
              <MapPin size={14} />
              {cfg.map_address || "Rua Manucaia, 114"}
            </p>
            <div className="overflow-hidden rounded-2xl shadow-md">
              <iframe
                title="Nossa localização no mapa"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  cfg.map_address || "Rua Manucaia, 114"
                )}&output=embed`}
                className="h-52 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-10 text-center text-xs opacity-80">
          {cfg.footer_text && <p className="mb-3">{cfg.footer_text}</p>}
          <Link to="/" className="inline-flex items-center gap-1 hover:underline">
            <ArrowLeft size={14} />
            Voltar ao site
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Biolink;
