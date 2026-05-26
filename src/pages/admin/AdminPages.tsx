import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Heart,
  UtensilsCrossed,
  Image as ImageIcon,
  BookOpen,
  Mail,
  ChevronRight,
} from "lucide-react";

const pages = [
  {
    title: "Página Inicial",
    description: "Edite as seções da home (hero, sobre, delivery, etc).",
    to: "/painel-admin/secoes",
    icon: Home,
  },
  {
    title: "Nossa História",
    description: "Edite textos, imagens e valores da página Nossa História.",
    to: "/painel-admin/paginas/nossa-historia",
    icon: Heart,
  },
  {
    title: "Cardápio",
    description: "Gerencie o cardápio de encomendas.",
    to: "/painel-admin/cardapio",
    icon: UtensilsCrossed,
  },
  {
    title: "Galeria",
    description: "Adicione e organize as fotos da galeria.",
    to: "/painel-admin/galeria",
    icon: ImageIcon,
  },
  {
    title: "Blog",
    description: "Gerencie os posts do blog.",
    to: "/painel-admin/blog",
    icon: BookOpen,
  },
  {
    title: "Contato",
    description: "Edite as informações de contato (via Configurações).",
    to: "/painel-admin/config",
    icon: Mail,
  },
];

const AdminPages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Páginas</h1>
        <p className="text-muted-foreground mt-1">
          Escolha uma página do site para administrar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.to} to={page.to} className="group">
              <Card className="h-full transition-colors hover:border-accent">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <CardTitle className="mt-3 text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPages;
