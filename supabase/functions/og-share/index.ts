import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f4b9bd0c-67f3-4be7-b37a-cf26608a078c/id-preview-3c9411c2--ba1e3e9a-4806-45c6-a081-0a92c3e59f32.lovable.app-1771618737259.png";
const SITE_NAME = "Caseirinhos";
const SITE_URL = "https://caseirinhos.lovable.app";

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
    .select("title, excerpt, cover_image, author_name, published_at, slug, tags, category, reading_time_min")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !post) {
    return new Response("Post not found", { status: 404, headers: corsHeaders });
  }

  // Resolve cover image URL
  let imageUrl = DEFAULT_OG_IMAGE;
  if (post.cover_image) {
    if (post.cover_image.startsWith("http")) {
      imageUrl = post.cover_image;
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(post.cover_image);
      imageUrl = data.publicUrl;
    }
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const description = post.excerpt || "Confira este artigo no blog Caseirinhos – confeitaria artesanal";
  const tags = (post.tags || []) as string[];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: imageUrl,
    url: postUrl,
    datePublished: post.published_at || undefined,
    author: { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: tags.join(", ") || undefined,
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="refresh" content="0;url=${esc(postUrl)}"/>
<title>${esc(post.title)} | ${SITE_NAME}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${esc(postUrl)}"/>

<!-- Open Graph -->
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(post.title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(imageUrl)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="${esc(postUrl)}"/>
<meta property="og:site_name" content="${SITE_NAME}"/>
<meta property="og:locale" content="pt_BR"/>
${post.published_at ? `<meta property="article:published_time" content="${post.published_at}"/>` : ""}
<meta property="article:author" content="${esc(post.author_name)}"/>
${post.category ? `<meta property="article:section" content="${esc(post.category)}"/>` : ""}
${tags.map(t => `<meta property="article:tag" content="${esc(t)}"/>`).join("\n")}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(post.title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(imageUrl)}"/>

<!-- JSON-LD -->
<script type="application/ld+json">${esc(jsonLd)}</script>
</head>
<body>
<p>Redirecionando para <a href="${esc(postUrl)}">${esc(post.title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
