import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts, useTestimonials, useSiteSettings } from "@/hooks/useSiteContent";
import { ShoppingBag, MessageSquare, Settings, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { data: products } = useProducts(false);
  const { data: testimonials } = useTestimonials(false);
  const { data: settings } = useSiteSettings();

  const stats = [
    {
      icon: ShoppingBag,
      label: "Produtos",
      value: products?.length || 0,
      description: "No cardápio"
    },
    {
      icon: MessageSquare,
      label: "Depoimentos",
      value: testimonials?.length || 0,
      description: "De clientes"
    },
    {
      icon: Settings,
      label: "Configurações",
      value: Object.keys(settings || {}).length,
      description: "Definidas"
    },
    {
      icon: TrendingUp,
      label: "WhatsApp",
      value: settings?.contact?.whatsapp ? "Ativo" : "Pendente",
      description: "Configurado"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel de administração da Caseirinhos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guia Rápido</CardTitle>
            <CardDescription>Aprenda a usar o painel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Seções do Site</p>
                <p className="text-sm text-muted-foreground">Edite textos do hero, sobre nós e CTA</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Produtos</p>
                <p className="text-sm text-muted-foreground">Adicione e edite itens do cardápio</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Configurações</p>
                <p className="text-sm text-muted-foreground">Atualize WhatsApp, endereço e redes sociais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Tarefas mais comuns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/painel-admin/config"
              className="block p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium">Atualizar WhatsApp</p>
              <p className="text-sm text-muted-foreground">Mude o número de contato</p>
            </a>
            <a
              href="/painel-admin/produtos"
              className="block p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium">Adicionar Produto</p>
              <p className="text-sm text-muted-foreground">Novo item no cardápio</p>
            </a>
            <a
              href="/painel-admin/secoes"
              className="block p-3 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium">Editar Textos</p>
              <p className="text-sm text-muted-foreground">Atualize o conteúdo do site</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
