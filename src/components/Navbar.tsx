import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteContent";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/nossa-historia", label: "Nossa História" },
  { to: "/galeria", label: "Galeria" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  const menuItems = (settings?.menu_items as unknown as { to: string; label: string }[]) || null;
  const links = menuItems || navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Caseirinhos a Confeitaria" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-5">
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

        {/* 2 CTA buttons + Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Bolos & Encomendas */}
          <Link
            to="/cardapio"
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-300 shadow-sm border ${
              location.pathname === "/cardapio"
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
            }`}
          >
            <Cake size={16} />
            Bolos & Encomendas
          </Link>

          <button
            className="lg:hidden text-foreground p-2 rounded-full hover:bg-muted transition-colors"
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
            className="lg:hidden bg-background border-t border-border overflow-hidden"
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
              {/* Mobile CTAs */}
              <li className="flex flex-col gap-3 mt-2 w-full px-8">
                <Link
                  to="/cardapio"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold font-body"
                >
                  <Cake size={16} />
                  Bolos & Encomendas
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
