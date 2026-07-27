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
    { icon: Eye, label: "Hoje", value: summary?.todayViews || 0, description: "Visualizações" },
    { icon: TrendingUp, label: "Semana", value: summary?.weekViews || 0, description: "Últimos 7 dias" },
    { icon: BarChart3, label: "Mês", value: summary?.monthViews || 0, description: "Últimos 30 dias" },
    { icon: Eye, label: "Total", value: summary?.totalViews || 0, description: "Todas as visitas" },
  ];

  const quickStats = [
    { icon: ShoppingBag, label: "Produtos", value: products?.length || 0 },
    { icon: MessageSquare, label: "Depoimentos", value: testimonials?.length || 0 },
    { icon: BookOpen, label: "Posts", value: posts?.length || 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Estatísticas e visão geral</p>
      </div>

      {/* Visit Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-6 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{analyticsLoading ? "..." : stat.value}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Visitas - Últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            {summary?.dailyViews ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summary.dailyViews}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                {analyticsLoading ? "Carregando..." : "Sem dados"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Conteúdo</CardTitle>
            <CardDescription className="text-xs">Resumo do site</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0 space-y-3">
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
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Páginas Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          {summary?.topPages && summary.topPages.length > 0 ? (
            <div className="space-y-2">
              {summary.topPages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground w-4 flex-shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{page.title || page.path}</p>
                      <p className="text-xs text-muted-foreground truncate">{page.path}</p>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-semibold flex-shrink-0">{page.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {analyticsLoading ? "Carregando..." : "Nenhuma visita registrada"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
