import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, keywords, tone, language, length, generateImage } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!topic) throw new Error("Topic is required");

    const wordTarget = length === "short" ? "600-800" : length === "long" ? "1800-2500" : "1000-1500";
    const toneDesc = tone === "formal" ? "formal e profissional" : tone === "casual" ? "casual e descontraído" : "informativo e acessível";
    const lang = language === "en" ? "English" : "Português brasileiro";

    const systemPrompt = `Você é um redator SEO especialista em confeitaria, doces e culinária artesanal. Gere conteúdo altamente otimizado para SEO em ${lang}.

REGRAS DE SEO OBRIGATÓRIAS:
- Título com keyword principal no início, entre 50-60 caracteres
- Meta description (excerpt) entre 140-155 caracteres com call-to-action
- Use a keyword principal naturalmente no primeiro parágrafo
- Densidade de keywords: 1-2% do conteúdo total
- Inclua variações semânticas e LSI keywords
- Use heading hierarchy correta (H2 > H3)
- Parágrafos curtos (2-3 frases) para melhor legibilidade
- Inclua listas para featured snippets do Google
- Conteúdo entre ${wordTarget} palavras
- Tom: ${toneDesc}
- LIMITE: máximo 12 blocos de conteúdo para manter o post conciso e focado

Tipos de bloco permitidos: paragraph, heading2, heading3, list, ordered-list, quote, callout, divider
Para callout use calloutType: info, warning, success, tip`;

    const userPrompt = `Gere um post completo sobre: "${topic}"${keywords ? `\n\nKeywords para incluir: ${keywords}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_blog_post",
              description: "Create a complete SEO-optimized blog post with all metadata and content blocks.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "SEO title, 50-60 chars, keyword at start" },
                  slug: { type: "string", description: "URL-friendly slug" },
                  excerpt: { type: "string", description: "Meta description, 140-155 chars with CTA" },
                  category: { type: "string", description: "Post category" },
                  tags: { type: "array", items: { type: "string" }, description: "5 SEO tags" },
                  blocks: {
                    type: "array",
                    description: "Content blocks (max 12)",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["paragraph", "heading2", "heading3", "list", "ordered-list", "quote", "callout", "divider"] },
                        content: { type: "string" },
                        calloutType: { type: "string", enum: ["info", "warning", "success", "tip"] },
                      },
                      required: ["type", "content"],
                      additionalProperties: false,
                    },
                  },
                  image_prompt: { type: "string", description: "English prompt for cover image generation" },
                },
                required: ["title", "slug", "excerpt", "category", "tags", "blocks", "image_prompt"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_blog_post" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA insuficientes. Adicione créditos nas configurações." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();

    // Extract structured output from tool call
    let parsed;
    try {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) {
        // Fallback: try parsing from content
        const rawContent = data.choices?.[0]?.message?.content || "";
        const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsed = JSON.parse(jsonStr);
      } else {
        const args = typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
        parsed = args;
      }
    } catch (e) {
      console.error("Failed to parse AI response:", JSON.stringify(data.choices?.[0]?.message).substring(0, 500));
      throw new Error("Falha ao processar resposta da IA");
    }

    // Generate cover image if requested
    let generatedImageBase64 = null;
    if (generateImage && parsed.image_prompt) {
      try {
        const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `Create a professional, appetizing food photography style image: ${parsed.image_prompt}. The image should be high quality, well-lit, with a clean background suitable for a blog cover. Aspect ratio 16:9.`,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          const imageUrl = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            generatedImageBase64 = imageUrl;
          }
        }
      } catch (e) {
        console.error("Image generation failed:", e);
      }
    }

    return new Response(
      JSON.stringify({
        ...parsed,
        generated_image: generatedImageBase64,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("generate-blog-post error:", e);
    const errorMessage = e instanceof Error ? e.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
