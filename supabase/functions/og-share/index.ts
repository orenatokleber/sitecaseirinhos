import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_image, author_name, published_at, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !post) {
    return new Response("Post not found", { status: 404, headers: corsHeaders });
  }

  // Resolve cover image URL
  let imageUrl = "";
  if (post.cover_image) {
    if (post.cover_image.startsWith("http")) {
      imageUrl = post.cover_image;
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(post.cover_image);
      imageUrl = data.publicUrl;
    }
  }

  const siteUrl = url.searchParams.get("site_url") || "https://caseirinhos.lovable.app";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const description = post.excerpt || "Confira este artigo no blog Caseirinhos";
  const siteName = "Caseirinhos";

  // Check user agent to determine if it's a crawler
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedinbot|telegrambot|slackbot|discordbot|googlebot/i.test(userAgent);

  // Always serve static HTML with OG tags (works for all crawlers including WhatsApp)
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${escapeHtml(postUrl)}" />
  <title>${escapeHtml(post.title)} | ${siteName}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}" />` : ""}
  ${imageUrl ? `<meta property="og:image:width" content="1200" />` : ""}
  ${imageUrl ? `<meta property="og:image:height" content="630" />` : ""}
  <meta property="og:url" content="${escapeHtml(postUrl)}" />
  <meta property="og:site_name" content="${siteName}" />
  ${post.published_at ? `<meta property="article:published_time" content="${post.published_at}" />` : ""}
  <meta property="article:author" content="${escapeHtml(post.author_name)}" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(post.title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />` : ""}
  
  <link rel="canonical" href="${escapeHtml(postUrl)}" />
</head>
<body>
  <p>Redirecionando para <a href="${escapeHtml(postUrl)}">${escapeHtml(post.title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 
      ...corsHeaders, 
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    },
  });

  // For regular users, redirect to the actual post
  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: postUrl },
  });
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
