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
    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Não autorizado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Token inválido." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "forbidden", message: "Acesso negado." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { reward_code } = await req.json();
    const code = (reward_code || "").trim().toUpperCase();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "Código inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the reward
    const { data: reward, error: rewardError } = await supabase
      .from("campaign_rewards")
      .select("*, participation:campaign_participations!inner(*)")
      .eq("reward_code", code)
      .single();

    if (rewardError || !reward) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Código não encontrado." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already validated or beyond
    if (reward.status !== "pending_share" && reward.status !== "pending_validation") {
      return new Response(
        JSON.stringify({
          error: "invalid_status",
          message: `Este prêmio já está com status: ${reward.status}`,
          current_status: reward.status,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (new Date(reward.expires_at) < new Date()) {
      await supabase
        .from("campaign_rewards")
        .update({ status: "expired" })
        .eq("id", reward.id);

      return new Response(
        JSON.stringify({ error: "expired", message: "Este prêmio expirou." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the share
    const { error: updateError } = await supabase
      .from("campaign_rewards")
      .update({
        status: "validated",
        validated_at: new Date().toISOString(),
        validated_by: user.id,
      })
      .eq("id", reward.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "update_failed", message: "Erro ao validar." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update participation status
    await supabase
      .from("campaign_participations")
      .update({ status: "validated" })
      .eq("id", reward.participation.id);

    // Log event
    await supabase.from("campaign_events").insert({
      campaign_id: reward.participation.campaign_id,
      participation_id: reward.participation.id,
      event_type: "story_validated",
      metadata: { validated_by: user.id, reward_code: code },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Compartilhamento validado com sucesso!" }),
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
