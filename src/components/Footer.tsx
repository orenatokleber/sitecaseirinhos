import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, Clock, Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { normalizeInstagramUrl } from "@/lib/utils";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const contact = settings?.contact as any;
  const hours = settings?.hours as any;

  return (
    <footer className="relative overflow-hidden">
      {/* Wave top — sits on the previous (delivery/chocolate) section, wave shape is the deeper footer color */}
      <div className="w-full overflow-hidden leading-[0] bg-chocolate -mb-px">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="hsl(var(--chocolate-deep))" />
        </svg>
      </div>

      <div className="bg-chocolate-deep text-primary-foreground">

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <img src={logo} alt="Caseirinhos a Confeitaria" className="h-14 w-auto mb-4 brightness-0 invert" loading="lazy" decoding="async" />
              <p className="text-sm opacity-70 leading-relaxed">
                Mais do que doces, criamos memórias. Cada bolo é feito com amor, dedicação e ingredientes selecionados.
              </p>
            </div>

            {/* Nav */}
            <div className="text-center">
              <h4 className="font-heading text-lg mb-4 text-accent">Navegação</h4>
              <ul className="space-y-2">
                {((settings?.menu_items as unknown as { to: string; label: string }[]) || [
                  { to: "/", label: "Home" },
                  { to: "/nossa-historia", label: "Nossa História" },
                  { to: "/cardapio", label: "Cardápio" },
                  { to: "/encomendas", label: "Encomendas" },
                  { to: "/contato", label: "Contato" },
                ]).map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm opacity-60 hover:opacity-100 hover:text-accent transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <h4 className="font-heading text-lg mb-4 text-accent">Informações</h4>
              <div className="space-y-3 text-sm opacity-70">
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <Clock size={14} /> {hours?.weekdays || "Ter a Sáb: 11h – 18h"}
                </p>
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <Phone size={14} /> {hours?.delivery || "Delivery a partir das 13h"}
                </p>
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <MapPin size={14} /> {contact?.address || "Confira nossa localização"}
                </p>
                <div className="flex items-center justify-center md:justify-end gap-4 pt-2">
                  <a
                    href={contact?.instagram || "https://instagram.com/caseirinhos"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 mt-10 pt-5 text-center text-xs opacity-40 flex items-center justify-center gap-1">
            Feito com <Heart size={12} className="text-primary fill-primary" /> © {new Date().getFullYear()} Caseirinhos
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
