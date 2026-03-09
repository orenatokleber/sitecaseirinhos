import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts, useTestimonials, useSiteSettings } from "@/hooks/useSiteContent";
import { useAnalyticsSummary } from "@/hooks/useAnalytics";
import { useBlogPosts } from "@/hooks/useBlog";
import { ShoppingBag, MessageSquare, Eye, TrendingUp, BookOpen, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const { data: products } = useProducts(false);
  const { data: testimonials } = useTestimonials(false);
  const { data: settings } = useSiteSettings();
  const { data: posts } = useBlogPosts(false);
  const { summary, isLoading: analyticsLoading } = useAnalyticsSummary();

  const stats = [
    {
      icon: Eye,
      label: "Visitas Hoje",
      value: summary?.todayViews || 0,
      description: "Visualizações",
    },
    {
      icon: TrendingUp,
      label: "Última Semana",
      value: summary?.weekViews || 0,
      description: "Últimos 7 dias",
    },
    {
      icon: BarChart3,
      label: "Último Mês",
      value: summary?.monthViews || 0,
      description: "Últimos 30 dias",
    },
    {
      icon: Eye,
      label: "Total",
      value: summary?.totalViews || 0,
      description: "Todas as visitas",
    },
  ];

  const quickStats = [
    { icon: ShoppingBag, label: "Produtos", value: products?.length || 0 },
    { icon: MessageSquare, label: "Depoimentos", value: testimonials?.length || 0 },
    { icon: BookOpen, label: "Posts", value: posts?.length || 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Estatísticas e visão geral do site</p>
      </div>

      {/* Visit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsLoading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visitas - Últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.dailyViews ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={summary.dailyViews}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                {analyticsLoading ? "Carregando..." : "Sem dados"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
            <CardDescription>Resumo do site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{s.label}</span>
                </div>
                <span className="text-lg font-bold">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas Mais Visitadas</CardTitle>
          <CardDescription>Top 10 páginas por visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          {summary?.topPages && summary.topPages.length > 0 ? (
            <div className="space-y-3">
              {summary.topPages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{page.title || page.path}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{page.count} visitas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {analyticsLoading ? "Carregando..." : "Nenhuma visita registrada ainda"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
