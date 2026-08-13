import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { checkRewardCode, validateRewardCode, redeemRewardCode } from "@/hooks/useSurpresaAdmin";
import { toast } from "sonner";

type CheckResult = {
  valid: boolean;
  reward: {
    code: string;
    status: string;
    expires_at: string;
    validated_at: string | null;
    redeemed_at: string | null;
    is_expired: boolean;
  };
  prize: {
    name: string;
    description: string;
    emoji: string;
    prize_type: string;
    value: number;
    product_name: string | null;
    min_purchase: number;
  };
  participant: {
    name: string;
  };
  campaign: {
    name: string;
  };
} | null;

const AdminSurpresaValidate = () => {
  const { session } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCheck = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await checkRewardCode(code.trim());
      if (data.error) {
        setError(data.message || "Código não encontrado.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!session?.access_token || !result) return;
    setActionLoading(true);
    try {
      const data = await validateRewardCode(result.reward.code, session.access_token);
      if (data.success) {
        toast.success("Compartilhamento validado!");
        // Refresh
        handleCheck();
      } else {
        toast.error(data.message || "Erro ao validar.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!session?.access_token || !result) return;
    setActionLoading(true);
    try {
      const data = await redeemRewardCode(result.reward.code, session.access_token);
      if (data.success) {
        toast.success("Prêmio resgatado com sucesso!");
        handleCheck();
      } else {
        toast.error(data.message || "Erro ao resgatar.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!result) return null;
    const { status, is_expired } = result.reward;

    if (is_expired || status === "expired") {
      return { icon: "🔴", label: "PRÊMIO EXPIRADO", color: "bg-red-50 border-red-200 text-red-700" };
    }
    if (status === "redeemed") {
      return { icon: "🔴", label: "PRÊMIO JÁ RESGATADO", color: "bg-red-50 border-red-200 text-red-700" };
    }
    if (status === "cancelled") {
      return { icon: "🔴", label: "PRÊMIO CANCELADO", color: "bg-gray-50 border-gray-200 text-gray-700" };
    }
    if (status === "validated") {
      return { icon: "🟢", label: "PRÊMIO VÁLIDO", color: "bg-green-50 border-green-200 text-green-700" };
    }
    if (status === "pending_validation") {
      return { icon: "🟡", label: "AGUARDANDO VALIDAÇÃO DO STORY", color: "bg-yellow-50 border-yellow-200 text-yellow-700" };
    }
    if (status === "pending_share") {
      return { icon: "🟡", label: "AGUARDANDO COMPARTILHAMENTO", color: "bg-yellow-50 border-yellow-200 text-yellow-700" };
    }
    return { icon: "ℹ️", label: status.toUpperCase(), color: "bg-blue-50 border-blue-200 text-blue-700" };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          🎁 Validar Prêmio
        </h1>
        <p className="text-sm text-muted-foreground">
          Digite o código do cliente para verificar e resgatar o prêmio
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CASE-XXXXXX"
              className="font-mono text-lg tracking-wider"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              id="admin-validate-code-input"
            />
            <Button
              onClick={handleCheck}
              disabled={loading || !code.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-6"
            >
              {loading ? "..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4 text-center text-red-600 font-medium">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && statusInfo && (
        <div className="space-y-4">
          {/* Status */}
          <Card className={`border ${statusInfo.color}`}>
            <CardContent className="p-6 text-center">
              <span className="text-3xl">{statusInfo.icon}</span>
              <h2 className="font-heading text-xl font-bold mt-2">{statusInfo.label}</h2>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Detalhes do Prêmio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="text-sm font-medium">{result.participant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Prêmio</span>
                <span className="text-sm font-medium">
                  {result.prize.emoji} {result.prize.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Campanha</span>
                <span className="text-sm font-medium">{result.campaign.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Validade</span>
                <span className="text-sm font-medium">
                  {new Date(result.reward.expires_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium capitalize">{result.reward.status.replace(/_/g, " ")}</span>
              </div>
              {result.prize.min_purchase > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Compra Mínima</span>
                  <span className="text-sm font-medium">
                    R$ {Number(result.prize.min_purchase).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}
              {result.reward.validated_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Validado em</span>
                  <span className="text-sm font-medium">
                    {new Date(result.reward.validated_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              {result.reward.redeemed_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resgatado em</span>
                  <span className="text-sm font-medium">
                    {new Date(result.reward.redeemed_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Código</span>
                <span className="text-sm font-mono font-bold">{result.reward.code}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {(result.reward.status === "pending_share" || result.reward.status === "pending_validation") && (
              <Button
                onClick={handleValidate}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                id="admin-validate-btn"
              >
                {actionLoading ? "Processando..." : "✅ VALIDAR COMPARTILHAMENTO"}
              </Button>
            )}

            {(result.reward.status === "validated" || result.reward.status === "pending_share" || result.reward.status === "pending_validation") &&
              !result.reward.is_expired && (
              <Button
                onClick={handleRedeem}
                disabled={actionLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                id="admin-redeem-btn"
              >
                {actionLoading ? "Processando..." : "🎁 RESGATAR PRÊMIO"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSurpresaValidate;
