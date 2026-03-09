import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  Image,
  BookOpen,
  LogOut,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/painel-admin" },
  { icon: FileText, label: "Seções do Site", path: "/painel-admin/secoes" },
  { icon: ShoppingBag, label: "Produtos", path: "/painel-admin/produtos" },
  { icon: MessageSquare, label: "Depoimentos", path: "/painel-admin/depoimentos" },
  { icon: Image, label: "Galeria", path: "/painel-admin/galeria" },
  { icon: Settings, label: "Configurações", path: "/painel-admin/config" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex flex-col items-center">
          <span className="font-script text-2xl text-accent">Caseirinhos</span>
          <span className="text-xs tracking-wider uppercase text-muted-foreground">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                    isActive 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink size={16} />
          Ver Site
        </Link>
        
        <div className="px-4 py-2 text-xs text-muted-foreground truncate">
          {user?.email}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={signOut}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
