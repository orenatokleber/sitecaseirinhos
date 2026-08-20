import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSurpresa } from "@/hooks/useSurpresa";
import { supabase } from "@/lib/supabase";
import SurpresaLanding from "@/components/surpresa/SurpresaLanding";
import SurpresaForm from "@/components/surpresa/SurpresaForm";
import SurpresaWheel from "@/components/surpresa/SurpresaWheel";
import SurpresaResult from "@/components/surpresa/SurpresaResult";
import SurpresaShare from "@/components/surpresa/SurpresaShare";
import SurpresaCode from "@/components/surpresa/SurpresaCode";
import { Lock, AlertCircle, RefreshCw } from "lucide-react";

// Default campaign slug — can be overridden via query param
const DEFAULT_CAMPAIGN = "surpresa-de-agosto";

const Surpresa = () => {
  const [searchParams] = useSearchParams();
  const campaignSlug = searchParams.get("campanha") || searchParams.get("c") || DEFAULT_CAMPAIGN;
  const source = searchParams.get("source") || searchParams.get("s") || "package";
  const token = searchParams.get("token") || searchParams.get("t") || "";

  const {
    step,
    setStep,
    loading,
    error,
    setError,
    result,
    alreadyParticipated,
    prizes,
    campaign,
    shareCompleted,
    fetchPrizes,
    participate,
    markShareCompleted,
    logEvent,
  } = useSurpresa();

  const [tokenValidating, setTokenValidating] = useState(false);
  const [tokenError, setTokenError] = useState<"no_token" | "invalid_token" | "used_token" | null>(null);

  // Load prizes and validate access token when page opens
  useEffect(() => {
    const initPage = async () => {
      const camp = await fetchPrizes(campaignSlug);
      if (camp) {
        if ((camp as any).require_access_token) {
          if (!token) {
            setTokenError("no_token");
            return;
          }
          setTokenValidating(true);
          try {
            const { data, error: tokenErr } = await (supabase
              .from("campaign_access_tokens" as any)
              .select("used_at")
              .eq("campaign_id", (camp as any).id)
              .eq("token", token)
              .maybeSingle() as any);

            if (tokenErr || !data) {
              setTokenError("invalid_token");
            } else if (data.used_at) {
              setTokenError("used_token");
            } else {
              setTokenError(null);
            }
          } catch {
            setTokenError("invalid_token");
          } finally {
            setTokenValidating(false);
          }
        } else {
          setTokenError(null);
        }
      }
    };
    initPage();
    logEvent("page_opened");
  }, [campaignSlug, fetchPrizes, logEvent, token]);

  // Handle start
  const handleStart = useCallback(() => {
    logEvent("form_started");
    setStep("form");
  }, [logEvent, setStep]);

  // Handle form submit
  const handleFormSubmit = useCallback(
    async (name: string, whatsapp: string) => {
      setError(null);
      await participate(campaignSlug, name, whatsapp, source, token);
    },
    [campaignSlug, source, token, participate, setError]
  );

  // Handle spin complete
  const handleSpinComplete = useCallback(() => {
    setStep("result");
  }, [setStep]);

  // Handle continue from result → share or code
  const handleResultContinue = useCallback(() => {
    if (result?.require_story_share) {
      setStep("share");
    } else {
      setStep("code");
    }
  }, [result, setStep]);

  // Handle share completed
  const handleShareCompleted = useCallback(() => {
    if (result?.participation_id) {
      markShareCompleted(result.participation_id);
    }
  }, [result, markShareCompleted]);

  // Handle skip share
  const handleSkipShare = useCallback(() => {
    setStep("code");
  }, [setStep]);

  return (
    <>
      <Helmet>
        <title>🎁 Surpresa da Caseirinhos</title>
        <meta
          name="description"
          content="Escaneie o QR Code da sua embalagem Caseirinhos e descubra seu presente!"
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="min-h-[100dvh] relative"
        style={{
          background: "linear-gradient(180deg, #FFF8F0 0%, #FFEBD6 40%, #FFF0E6 100%)",
        }}
      >
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B6F47' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* State machine */}
        <div className="relative z-10">
          {tokenValidating ? (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center">
              <RefreshCw className="h-10 w-10 animate-spin text-gold mb-4" />
              <p className="font-body text-chocolate-light">Verificando seu link de acesso...</p>
            </div>
          ) : tokenError ? (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6">
              <div
                className="w-full max-w-md rounded-2xl p-8 text-center shadow-xl bg-white border border-gold/20"
                style={{
                  background: "linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)",
                }}
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-peach/20 flex items-center justify-center mb-6">
                  {tokenError === "used_token" ? (
                    <AlertCircle className="h-8 w-8 text-chocolate-deep" />
                  ) : (
                    <Lock className="h-8 w-8 text-chocolate-deep" />
                  )}
                </div>

                <h2 className="font-heading text-2xl font-bold text-chocolate-deep mb-3">
                  {tokenError === "no_token" && "Acesso Restrito 🔒"}
                  {tokenError === "invalid_token" && "Link Inválido ⚠️"}
                  {tokenError === "used_token" && "Link Já Utilizado ⏰"}
                </h2>

                <p className="font-body text-sm text-chocolate-light mb-6">
                  {tokenError === "no_token" && "Esta campanha de sorteios é exclusiva para clientes que efetuaram compras. Por favor, utilize o link de acesso enviado junto ao seu pedido."}
                  {tokenError === "invalid_token" && "O link de acesso utilizado é inválido ou expirou. Por favor, verifique o link enviado no seu comprovante."}
                  {tokenError === "used_token" && "Este link de acesso já foi utilizado para girar a roleta. Cada link de compra dá direito a apenas um sorteio."}
                </p>

                <div className="text-xs text-chocolate-light/50 font-body">
                  Se você acredita que isso é um erro, entre em contato com nosso suporte.
                </div>
              </div>
            </div>
          ) : (
            <>
              {step === "landing" && (
                <SurpresaLanding onStart={handleStart} />
              )}

              {step === "form" && (
                <SurpresaForm
                  onSubmit={handleFormSubmit}
                  loading={loading}
                  error={error}
                />
              )}

              {step === "spinning" && result && (
                <SurpresaWheel
                  prizes={prizes}
                  wonPrize={result.prize}
                  onSpinComplete={handleSpinComplete}
                />
              )}

              {step === "result" && result && (
                <SurpresaResult
                  prize={result.prize}
                  rewardCode={result.reward_code}
                  expiresAt={result.expires_at}
                  onContinue={handleResultContinue}
                />
              )}

              {step === "share" && result && (
                <SurpresaShare
                  prize={result.prize}
                  rewardCode={result.reward_code}
                  onShareCompleted={handleShareCompleted}
                  onSkip={handleSkipShare}
                />
              )}

              {step === "code" && result && (
                <SurpresaCode
                  prize={result.prize}
                  rewardCode={result.reward_code}
                  expiresAt={result.expires_at}
                  participantName=""
                  requireShare={result.require_story_share}
                  shareCompleted={shareCompleted}
                  rewardStatus={shareCompleted ? "pending_validation" : "pending_share"}
                  externalMenuUrl={campaign?.external_menu_url}
                />
              )}

              {/* Already participated fallback */}
              {step === "code" && !result && alreadyParticipated && (
                <SurpresaCode
                  prize={{
                    id: "",
                    name: alreadyParticipated.prize_name,
                    description: "",
                    emoji: alreadyParticipated.prize_emoji,
                    prize_type: "",
                    value: 0,
                    product_name: null,
                    min_purchase: 0,
                    color: "#E8A87C",
                  }}
                  rewardCode={alreadyParticipated.reward_code}
                  expiresAt={alreadyParticipated.expires_at}
                  participantName=""
                  requireShare={false}
                  shareCompleted={true}
                  rewardStatus={alreadyParticipated.reward_status}
                  externalMenuUrl={campaign?.external_menu_url}
                />
              )}
            </>
          )}
        </div>

        {/* Caseirinhos watermark */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
          <span className="font-script text-sm text-chocolate-light/30">
            Caseirinhos a Confeitaria
          </span>
        </div>
      </div>
    </>
  );
};

export default Surpresa;
