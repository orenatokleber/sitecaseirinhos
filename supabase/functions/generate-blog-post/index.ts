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

FORMATO DE RESPOSTA (JSON válido):
Retorne APENAS um objeto JSON com esta estrutura exata, sem markdown:
{
  "title": "Título SEO otimizado",
  "slug": "url-amigavel-seo",
  "excerpt": "Meta description otimizada entre 140-155 chars com CTA",
  "category": "Categoria relevante",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "blocks": [
    {"type": "heading2", "content": "Subtítulo H2 com keyword"},
    {"type": "paragraph", "content": "Parágrafo com conteúdo rico..."},
    {"type": "list", "content": "Item 1\\nItem 2\\nItem 3"},
    {"type": "quote", "content": "Citação relevante"},
    {"type": "heading3", "content": "Subtítulo H3"},
    {"type": "paragraph", "content": "Mais conteúdo..."},
    {"type": "callout", "content": "Dica importante", "calloutType": "tip"}
  ],
  "seo_score_tips": ["Dica SEO 1", "Dica SEO 2"],
  "suggested_internal_links": ["Sugestão de link interno 1"],
  "image_prompt": "Prompt descritivo em inglês para gerar imagem de destaque"
}

Tipos de bloco permitidos: paragraph, heading2, heading3, list, ordered-list, quote, code, callout, divider
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
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", rawContent);
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
        // Continue without image
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
