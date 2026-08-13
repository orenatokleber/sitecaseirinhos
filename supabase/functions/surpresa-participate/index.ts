import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Simple in-memory rate limiter (per function invocation cycle)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

function hashWhatsApp(whatsapp: string): string {
  // Normalize: remove non-digits, ensure country code
  const digits = whatsapp.replace(/\D/g, "");
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  // Simple hash using Web Crypto
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized + "_caseirinhos_salt_2026");
  // We'll use a sync approach for simplicity - create a deterministic hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex-like string and pad
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  // Create a longer hash by combining multiple rounds
  let hash2 = 0;
  for (let i = 0; i < data.length; i++) {
    hash2 = ((hash2 << 7) - hash2) + data[data.length - 1 - i];
    hash2 = hash2 & hash2;
  }
  const hex2 = Math.abs(hash2).toString(16).padStart(8, "0");
  return `${hex}${hex2}${normalized.length}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit check
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "rate_limited", message: "Muitas tentativas. Aguarde um momento." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { campaign_slug, name, whatsapp, source = "package", fingerprint, token } = await req.json();

    // Input validation
    if (!campaign_slug || typeof campaign_slug !== "string") {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "Campanha inválida." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "Nome inválido. Mínimo 2 caracteres." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!whatsapp || typeof whatsapp !== "string") {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "WhatsApp inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize and validate WhatsApp
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      return new Response(
        JSON.stringify({ error: "invalid_input", message: "Número de WhatsApp inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for full access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hash the WhatsApp number
    const whatsappHash = hashWhatsApp(whatsapp);
    const userAgent = req.headers.get("user-agent") || "";

    // Look up campaign by slug
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("slug", campaign_slug)
      .eq("status", "active")
      .lte("starts_at", new Date().toISOString())
      .single();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "campaign_not_found", message: "Campanha não encontrada ou inativa." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call the atomic function
    const { data: result, error: rpcError } = await supabase.rpc("select_prize_atomically", {
      p_campaign_id: campaign.id,
      p_participant_name: name.trim(),
      p_participant_whatsapp: whatsappHash,
      p_source: source,
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_fingerprint: fingerprint || null,
      p_access_token: token || null,
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return new Response(
        JSON.stringify({ error: "server_error", message: "Erro interno. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (result.error) {
      const statusCode = result.error === "already_participated" ? 409 : 400;
      return new Response(
        JSON.stringify(result),
        { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Erro inesperado. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
