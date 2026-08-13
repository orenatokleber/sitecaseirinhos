import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export type SurpresaStep = "landing" | "form" | "spinning" | "result" | "share" | "code";

export type PrizeData = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  prize_type: string;
  value: number;
  product_name: string | null;
  min_purchase: number;
  color: string;
};

export type ParticipationResult = {
  success: boolean;
  participation_id: string;
  prize: PrizeData;
  reward_code: string;
  expires_at: string;
  require_story_share: boolean;
};

export type AlreadyParticipatedResult = {
  error: "already_participated";
  message: string;
  participation_id: string;
  reward_code: string;
  prize_name: string;
  prize_emoji: string;
  expires_at: string;
  reward_status: string;
};

export type CampaignPrize = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  probability_pct: number;
  sort_order: number;
};

export function useSurpresa() {
  const [step, setStep] = useState<SurpresaStep>("landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParticipationResult | null>(null);
  const [alreadyParticipated, setAlreadyParticipated] = useState<AlreadyParticipatedResult | null>(null);
  const [prizes, setPrizes] = useState<CampaignPrize[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [shareCompleted, setShareCompleted] = useState(false);

  // Fetch campaign prizes for the wheel display
  const fetchPrizes = useCallback(async (campaignSlug: string) => {
    try {
      // First get campaign
      const { data: campaign, error: cErr } = await supabase
        .from("campaigns" as any)
        .select("id, slug, status, starts_at, ends_at, require_story_share, instagram")
        .eq("slug", campaignSlug)
        .eq("status", "active")
        .single();

      if (cErr || !campaign) {
        setError("Campanha não encontrada ou inativa.");
        return null;
      }

      setCampaignId((campaign as any).id);

      // Fetch prizes
      const { data: prizesData, error: pErr } = await supabase
        .from("campaign_prizes" as any)
        .select("id, name, emoji, color, probability_pct, sort_order")
        .eq("campaign_id", (campaign as any).id)
        .eq("is_active", true)
        .order("sort_order");

      if (pErr) {
        setError("Erro ao carregar prêmios.");
        return null;
      }

      const mapped = ((prizesData as any[]) || []).map((p) => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
        probability_pct: p.probability_pct,
        sort_order: p.sort_order,
      }));
      setPrizes(mapped);
      return campaign;
    } catch {
      setError("Erro de conexão.");
      return null;
    }
  }, []);

  // Participate in the campaign
  const participate = useCallback(async (
    campaignSlug: string,
    name: string,
    whatsapp: string,
    source = "package"
  ) => {
    setLoading(true);
    setError(null);
    setAlreadyParticipated(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/surpresa-participate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          campaign_slug: campaignSlug,
          name: name.trim(),
          whatsapp: whatsapp.replace(/\D/g, ""),
          source,
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data.error === "already_participated") {
        setAlreadyParticipated(data as AlreadyParticipatedResult);
        setStep("code");
        return data;
      }

      if (!response.ok) {
        setError(data.message || "Erro ao participar.");
        return null;
      }

      setResult(data as ParticipationResult);
      setStep("spinning");
      return data;
    } catch {
      setError("Erro de conexão. Verifique sua internet.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark share as completed
  const markShareCompleted = useCallback(async (participationId: string) => {
    try {
      // Update participation status to 'shared'
      await supabase
        .from("campaign_participations" as any)
        .update({ status: "shared" })
        .eq("id", participationId);

      // Update reward status to 'pending_validation'
      await supabase
        .from("campaign_rewards" as any)
        .update({ status: "pending_validation" })
        .eq("participation_id", participationId);

      // Log event
      if (campaignId) {
        await supabase.from("campaign_events" as any).insert({
          campaign_id: campaignId,
          participation_id: participationId,
          event_type: "story_shared",
        });
      }

      setShareCompleted(true);
      setStep("code");
    } catch {
      setError("Erro ao registrar compartilhamento.");
    }
  }, [campaignId]);

  // Log analytics event
  const logEvent = useCallback(async (
    eventType: string,
    participationId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!campaignId) return;
    try {
      await supabase.from("campaign_events" as any).insert({
        campaign_id: campaignId,
        participation_id: participationId || null,
        event_type: eventType,
        metadata: metadata || {},
      });
    } catch {
      // Silent fail for analytics
    }
  }, [campaignId]);

  // Reset state
  const reset = useCallback(() => {
    setStep("landing");
    setLoading(false);
    setError(null);
    setResult(null);
    setAlreadyParticipated(null);
    setShareCompleted(false);
  }, []);

  return {
    step,
    setStep,
    loading,
    error,
    setError,
    result,
    alreadyParticipated,
    prizes,
    campaignId,
    shareCompleted,
    fetchPrizes,
    participate,
    markShareCompleted,
    logEvent,
    reset,
  };
}
