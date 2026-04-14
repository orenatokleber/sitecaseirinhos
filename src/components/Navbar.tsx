import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteContent";

const defaultLinks = [
  { to: "/", label: "Home" },
  { to: "/nossa-historia", label: "Nossa História" },
  { to: "/cardapio", label: "Cardápio" },
  { to: "/encomendas", label: "Encomendas" },
  { to: "/contato", label: "Contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  const links = (settings?.menu_items as unknown as { to: string; label: string }[]) || defaultLinks;
  const whatsapp = (settings?.contact as any)?.whatsapp || "5500000000000";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-script text-xl text-primary">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-script text-xl md:text-2xl text-chocolate">Caseirinhos</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-body">confeitaria artesanal</span>
          </div>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm font-medium font-body transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary font-bold" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold font-body hover:opacity-90 transition-opacity shadow-md"
          >
            <ShoppingBag size={16} />
            Pedir Agora
          </a>
          <button
            className="md:hidden text-foreground p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium font-body transition-colors hover:text-primary ${
                      location.pathname === link.to ? "text-primary font-bold" : "text-foreground/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold font-body"
                >
                  <ShoppingBag size={16} />
                  Pedir Agora
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
