import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-script text-3xl mb-2">Caseirinhos</h3>
            <p className="text-xs tracking-[0.3em] uppercase opacity-70 mb-4">a confeitaria</p>
            <p className="text-sm opacity-80 leading-relaxed">
              Mais do que doces, criamos memórias. Cada bolo é feito com amor, dedicação e ingredientes selecionados.
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="font-heading text-lg mb-4 tracking-wide">Navegação</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/nossa-historia", label: "Nossa História" },
                { to: "/cardapio", label: "Cardápio" },
                { to: "/encomendas", label: "Encomendas" },
                { to: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="text-center md:text-right">
            <h4 className="font-heading text-lg mb-4 tracking-wide">Informações</h4>
            <div className="space-y-3 text-sm opacity-80">
              <p className="flex items-center justify-center md:justify-end gap-2">
                <Clock size={14} /> Ter a Sáb: 11h – 18h
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <Phone size={14} /> Delivery a partir das 13h
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <MapPin size={14} /> Confira nossa localização
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 pt-2">
                <a
                  href="https://instagram.com/caseirinhos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Caseirinhos a Confeitaria. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
