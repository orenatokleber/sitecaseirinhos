import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ============ TYPES ============
export type Campaign = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  mechanic_type: string;
  starts_at: string;
  ends_at: string | null;
  status: string;
  rules: Record<string, any>;
  instagram: Record<string, any>;
  require_story_share: boolean;
  created_at: string;
  updated_at: string;
};

export type CampaignPrize = {
  id: string;
  campaign_id: string;
  name: string;
  description: string | null;
  emoji: string;
  prize_type: string;
  value: number | null;
  product_name: string | null;
  min_purchase: number;
  validity_days: number;
  probability_pct: number;
  stock_total: number | null;
  stock_used: number;
  sort_order: number;
  is_active: boolean;
  color: string;
};

export type CampaignParticipation = {
  id: string;
  campaign_id: string;
  prize_id: string | null;
  participant_name: string;
  participant_whatsapp: string;
  source: string;
  status: string;
  created_at: string;
  prize?: CampaignPrize;
  reward?: CampaignReward;
};

export type CampaignReward = {
  id: string;
  participation_id: string;
  reward_code: string;
  status: string;
  validated_at: string | null;
  redeemed_at: string | null;
  expires_at: string;
  created_at: string;
};

export type CampaignEvent = {
  id: string;
  campaign_id: string;
  participation_id: string | null;
  event_type: string;
  metadata: Record<string, any>;
  created_at: string;
};

// ============ CAMPAIGNS ============
export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Campaign[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("campaigns" as any)
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as Campaign;
    },
    enabled: !!id,
  });
}

export function useUpsertCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaign: Partial<Campaign> & { name: string; slug: string }) => {
      const { id, created_at, updated_at, ...rest } = campaign as any;
      if (id) {
        const { error } = await supabase.from("campaigns" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("campaigns" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaign"] });
      toast.success("Campanha salva!");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha excluída!");
    },
  });
}

// ============ PRIZES ============
export function useCampaignPrizes(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["campaign-prizes", campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from("campaign_prizes" as any)
        .select("*")
        .eq("campaign_id", campaignId)
        .order("sort_order");
      if (error) throw error;
      return (data || []) as unknown as CampaignPrize[];
    },
    enabled: !!campaignId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useUpsertCampaignPrize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prize: Partial<CampaignPrize> & { campaign_id: string; name: string }) => {
      const { id, ...rest } = prize;
      if (id) {
        const { error } = await supabase.from("campaign_prizes" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("campaign_prizes" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["campaign-prizes", vars.campaign_id] });
      toast.success("Prêmio salvo!");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCampaignPrize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, campaignId }: { id: string; campaignId: string }) => {
      const { error } = await supabase.from("campaign_prizes" as any).delete().eq("id", id);
      if (error) throw error;
      return campaignId;
    },
    onSuccess: (campaignId) => {
      qc.invalidateQueries({ queryKey: ["campaign-prizes", campaignId] });
      toast.success("Prêmio removido!");
    },
  });
}

// ============ PARTICIPATIONS ============
export function useCampaignParticipations(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["campaign-participations", campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from("campaign_participations" as any)
        .select("*, prize:campaign_prizes(*)")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch rewards for each participation
      const participationIds = (data || []).map((p: any) => p.id);
      const { data: rewards } = await supabase
        .from("campaign_rewards" as any)
        .select("*")
        .in("participation_id", participationIds);

      const rewardMap = new Map();
      (rewards || []).forEach((r: any) => rewardMap.set(r.participation_id, r));

      return ((data || []) as any[]).map((p) => ({
        ...p,
        reward: rewardMap.get(p.id) || null,
      })) as CampaignParticipation[];
    },
    enabled: !!campaignId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// ============ ANALYTICS ============
export function useCampaignAnalytics(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["campaign-analytics", campaignId],
    queryFn: async () => {
      if (!campaignId) return null;

      // Get event counts by type
      const { data: events, error } = await supabase
        .from("campaign_events" as any)
        .select("event_type, created_at")
        .eq("campaign_id", campaignId);

      if (error) throw error;

      const counts: Record<string, number> = {};
      (events || []).forEach((e: any) => {
        counts[e.event_type] = (counts[e.event_type] || 0) + 1;
      });

      // Get participation stats
      const { data: participations } = await supabase
        .from("campaign_participations" as any)
        .select("status")
        .eq("campaign_id", campaignId);

      const statusCounts: Record<string, number> = {};
      (participations || []).forEach((p: any) => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      });

      // Get reward stats
      const { data: rewards } = await supabase
        .from("campaign_rewards" as any)
        .select("status, participation:campaign_participations!inner(campaign_id)")
        .eq("participation.campaign_id", campaignId);

      const rewardCounts: Record<string, number> = {};
      (rewards || []).forEach((r: any) => {
        rewardCounts[r.status] = (rewardCounts[r.status] || 0) + 1;
      });

      return {
        events: counts,
        participations: statusCounts,
        rewards: rewardCounts,
        totalParticipations: (participations || []).length,
        totalEvents: (events || []).length,
      };
    },
    enabled: !!campaignId,
    staleTime: 30_000,
  });
}

// ============ VALIDATE & REDEEM (via Edge Functions) ============
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function validateRewardCode(rewardCode: string, token: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/surpresa-validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ reward_code: rewardCode }),
  });
  return response.json();
}

export async function redeemRewardCode(rewardCode: string, token: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/surpresa-redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ reward_code: rewardCode }),
  });
  return response.json();
}

export async function checkRewardCode(rewardCode: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/surpresa-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ reward_code: rewardCode }),
  });
  return response.json();
}
