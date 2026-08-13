import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reward_code } = await req.json();

    if (!reward_code || typeof reward_code !== "string") {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "Código inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const code = reward_code.trim().toUpperCase();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch reward with participation and prize data
    const { data: reward, error } = await supabase
      .from("campaign_rewards")
      .select(`
        *,
        participation:campaign_participations!inner(
          *,
          prize:campaign_prizes(*),
          campaign:campaigns(*)
        )
      `)
      .eq("reward_code", code)
      .single();

    if (error || !reward) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Código não encontrado.", valid: false }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    const isExpired = new Date(reward.expires_at) < new Date();
    if (isExpired && reward.status !== "expired") {
      // Auto-update status to expired
      await supabase
        .from("campaign_rewards")
        .update({ status: "expired" })
        .eq("id", reward.id);
      reward.status = "expired";
    }

    const participation = reward.participation;
    const prize = participation.prize;
    const campaign = participation.campaign;

    return new Response(
      JSON.stringify({
        valid: reward.status === "validated",
        reward: {
          code: reward.reward_code,
          status: reward.status,
          expires_at: reward.expires_at,
          validated_at: reward.validated_at,
          redeemed_at: reward.redeemed_at,
          is_expired: isExpired,
        },
        prize: {
          name: prize.name,
          description: prize.description,
          emoji: prize.emoji,
          prize_type: prize.prize_type,
          value: prize.value,
          product_name: prize.product_name,
          min_purchase: prize.min_purchase,
        },
        participant: {
          name: participation.participant_name,
        },
        campaign: {
          name: campaign.name,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Erro inesperado." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
