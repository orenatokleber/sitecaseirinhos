import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-script text-2xl md:text-3xl text-primary">Caseirinhos</span>
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">a confeitaria</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm tracking-wide uppercase font-body transition-colors hover:text-accent ${
                  location.pathname === link.to ? "text-accent font-bold" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm tracking-wide uppercase font-body transition-colors hover:text-accent ${
                      location.pathname === link.to ? "text-accent font-bold" : "text-foreground/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
