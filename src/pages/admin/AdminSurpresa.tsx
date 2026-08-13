import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Trophy, Share2, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { useCampaigns, useCampaignAnalytics, useCampaignParticipations } from "@/hooks/useSurpresaAdmin";
import { Button } from "@/components/ui/button";

const AdminSurpresa = () => {
  const { data: campaigns, isLoading } = useCampaigns();
  const activeCampaign = campaigns?.find((c) => c.status === "active");
  const { data: analytics } = useCampaignAnalytics(activeCampaign?.id);
  const { data: participations } = useCampaignParticipations(activeCampaign?.id);

  const stats = [
    {
      icon: Users,
      label: "Participações",
      value: analytics?.totalParticipations || 0,
      color: "text-blue-500",
    },
    {
      icon: Trophy,
      label: "Prêmios Distribuídos",
      value: analytics?.totalParticipations || 0,
      color: "text-yellow-500",
    },
    {
      icon: Share2,
      label: "Stories Compartilhados",
      value: analytics?.events?.story_shared || 0,
      color: "text-pink-500",
    },
    {
      icon: CheckCircle,
      label: "Stories Validados",
      value: analytics?.events?.story_validated || 0,
      color: "text-green-500",
    },
    {
      icon: Gift,
      label: "Prêmios Resgatados",
      value: analytics?.rewards?.redeemed || 0,
      color: "text-purple-500",
    },
    {
      icon: XCircle,
      label: "Expirados",
      value: analytics?.rewards?.expired || 0,
      color: "text-red-500",
    },
    {
      icon: Clock,
      label: "Aguardando Validação",
      value: (analytics?.rewards?.pending_validation || 0) + (analytics?.rewards?.pending_share || 0),
      color: "text-orange-500",
    },
    {
      icon: TrendingUp,
      label: "QR Codes Escaneados",
      value: analytics?.events?.page_opened || 0,
      color: "text-teal-500",
    },
  ];

  const funnelSteps = [
    { label: "Página Aberta", value: analytics?.events?.page_opened || 0 },
    { label: "Formulário Iniciado", value: analytics?.events?.form_started || 0 },
    { label: "Prêmio Ganho", value: analytics?.events?.prize_awarded || 0 },
    { label: "Story Compartilhado", value: analytics?.events?.story_shared || 0 },
    { label: "Story Validado", value: analytics?.events?.story_validated || 0 },
    { label: "Prêmio Resgatado", value: analytics?.events?.reward_redeemed || 0 },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            🎁 Surpresa da Caseirinhos
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeCampaign
              ? `Campanha ativa: ${activeCampaign.name}`
              : "Nenhuma campanha ativa"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/painel-admin/surpresa/campanhas">
            <Button variant="outline" size="sm">
              Campanhas
            </Button>
          </Link>
          <Link to="/painel-admin/surpresa/validar">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Validar Prêmio
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Carregando...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funnel */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelSteps.map((step, i) => {
                  const maxValue = Math.max(...funnelSteps.map((s) => s.value), 1);
                  const width = Math.max((step.value / maxValue) * 100, 2);
                  return (
                    <div key={step.label} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-36 flex-shrink-0 text-right">
                        {step.label}
                      </span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${width}%`,
                            background: `hsl(${34 + i * 20} 47% ${60 - i * 5}%)`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-8">{step.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Participations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm md:text-base">Participações Recentes</CardTitle>
              {activeCampaign && (
                <Link to={`/painel-admin/surpresa/campanhas/${activeCampaign.id}`}>
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {participations && participations.length > 0 ? (
                <div className="space-y-2">
                  {participations.slice(0, 10).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg">{(p.prize as any)?.emoji || "🎁"}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{p.participant_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(p.prize as any)?.name || "—"} •{" "}
                            {new Date(p.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.reward && (
                          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                            {(p.reward as any).reward_code}
                          </span>
                        )}
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma participação ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    completed: "bg-blue-100 text-blue-700",
    shared: "bg-pink-100 text-pink-700",
    validated: "bg-green-100 text-green-700",
    redeemed: "bg-purple-100 text-purple-700",
    expired: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const labels: Record<string, string> = {
    completed: "Participou",
    shared: "Compartilhou",
    validated: "Validado",
    redeemed: "Resgatado",
    expired: "Expirado",
    cancelled: "Cancelado",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.completed}`}>
      {labels[status] || status}
    </span>
  );
};

export default AdminSurpresa;
