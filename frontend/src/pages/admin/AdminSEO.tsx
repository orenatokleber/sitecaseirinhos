import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useBlog";
import { useSiteSections, useSiteSettings } from "@/hooks/useSiteContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";

interface SEOCheck {
  label: string;
  status: "good" | "warning" | "error";
  detail: string;
}

function analyzeBlogPost(post: any): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const title = post.title || "";
  const excerpt = post.excerpt || "";
  const content = post.content || "";
  const slug = post.slug || "";

  // Title length
  if (title.length === 0) checks.push({ label: "Título", status: "error", detail: "Sem título" });
  else if (title.length < 30) checks.push({ label: "Título", status: "warning", detail: `Muito curto (${title.length} chars). Ideal: 30-60` });
  else if (title.length > 60) checks.push({ label: "Título", status: "warning", detail: `Muito longo (${title.length} chars). Ideal: 30-60` });
  else checks.push({ label: "Título", status: "good", detail: `${title.length} caracteres — ótimo` });

  // Meta description (excerpt)
  if (!excerpt) checks.push({ label: "Meta Descrição", status: "error", detail: "Sem resumo/excerpt" });
  else if (excerpt.length < 70) checks.push({ label: "Meta Descrição", status: "warning", detail: `Curta (${excerpt.length} chars). Ideal: 70-160` });
  else if (excerpt.length > 160) checks.push({ label: "Meta Descrição", status: "warning", detail: `Longa (${excerpt.length} chars). Ideal: 70-160` });
  else checks.push({ label: "Meta Descrição", status: "good", detail: `${excerpt.length} caracteres — ótimo` });

  // Slug
  if (!slug) checks.push({ label: "URL Slug", status: "error", detail: "Sem slug" });
  else if (slug.includes(" ")) checks.push({ label: "URL Slug", status: "error", detail: "Slug com espaços" });
  else checks.push({ label: "URL Slug", status: "good", detail: `/${slug}` });

  // Cover image
  if (post.cover_image) checks.push({ label: "Imagem de Capa", status: "good", detail: "Presente" });
  else checks.push({ label: "Imagem de Capa", status: "warning", detail: "Sem imagem — prejudica compartilhamento social" });

  // Content length
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount < 100) checks.push({ label: "Conteúdo", status: "error", detail: `Muito curto (${wordCount} palavras). Ideal: 300+` });
  else if (wordCount < 300) checks.push({ label: "Conteúdo", status: "warning", detail: `Curto (${wordCount} palavras). Ideal: 300+` });
  else checks.push({ label: "Conteúdo", status: "good", detail: `${wordCount} palavras` });

  // Tags
  if (post.tags && post.tags.length > 0) checks.push({ label: "Tags", status: "good", detail: `${post.tags.length} tags` });
  else checks.push({ label: "Tags", status: "warning", detail: "Sem tags" });

  // Category
  if (post.category) checks.push({ label: "Categoria", status: "good", detail: post.category });
  else checks.push({ label: "Categoria", status: "warning", detail: "Sem categoria" });

  return checks;
}

function analyzeSite(sections: any, settings: any): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // Hero section
  const hero = sections?.hero;
  if (hero?.title) checks.push({ label: "H1 Principal", status: "good", detail: hero.title });
  else checks.push({ label: "H1 Principal", status: "error", detail: "Sem título principal no hero" });

  if (hero?.subtitle) checks.push({ label: "Subtítulo Hero", status: "good", detail: "Presente" });
  else checks.push({ label: "Subtítulo Hero", status: "warning", detail: "Sem subtítulo" });

  if (hero?.image_url) checks.push({ label: "Imagem Hero", status: "good", detail: "Presente" });
  else checks.push({ label: "Imagem Hero", status: "warning", detail: "Sem imagem hero" });

  // Contact info
  const contact = settings?.contact as any;
  if (contact?.whatsapp) checks.push({ label: "WhatsApp", status: "good", detail: "Configurado" });
  else checks.push({ label: "WhatsApp", status: "error", detail: "Não configurado" });

  if (contact?.address) checks.push({ label: "Endereço", status: "good", detail: "Configurado" });
  else checks.push({ label: "Endereço", status: "warning", detail: "Sem endereço — importante para SEO local" });

  // About section
  const about = sections?.about_preview;
  if (about?.content && about.content.length > 50) checks.push({ label: "Seção Sobre", status: "good", detail: "Conteúdo adequado" });
  else checks.push({ label: "Seção Sobre", status: "warning", detail: "Conteúdo curto ou ausente" });

  // CTA
  const cta = sections?.cta;
  if (cta?.cta_text && cta?.cta_link) checks.push({ label: "Call-to-Action", status: "good", detail: "Configurado" });
  else checks.push({ label: "Call-to-Action", status: "warning", detail: "CTA incompleto" });

  return checks;
}

function getScore(checks: SEOCheck[]): number {
  if (checks.length === 0) return 0;
  const points = checks.reduce((acc, c) => acc + (c.status === "good" ? 1 : c.status === "warning" ? 0.5 : 0), 0);
  return Math.round((points / checks.length) * 100);
}

const StatusIcon = ({ status }: { status: SEOCheck["status"] }) => {
  if (status === "good") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
};

const ScoreBadge = ({ score }: { score: number }) => {
  const variant = score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive";
  return <Badge variant={variant} className="text-base px-3 py-1">{score}%</Badge>;
};

const AdminSEO = () => {
  const { data: posts, isLoading: postsLoading } = useBlogPosts(false);
  const { data: sections } = useSiteSections();
  const { data: settings } = useSiteSettings();

  const siteChecks = useMemo(() => analyzeSite(sections, settings), [sections, settings]);
  const siteScore = useMemo(() => getScore(siteChecks), [siteChecks]);

  const postAnalyses = useMemo(() => {
    if (!posts) return [];
    return posts.map((post: any) => {
      const checks = analyzeBlogPost(post);
      return { post, checks, score: getScore(checks) };
    });
  }, [posts]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
          <Search className="h-8 w-8" /> Análise SEO
        </h1>
        <p className="text-muted-foreground">Verificação de SEO do site e dos posts do blog</p>
      </div>

      <Tabs defaultValue="site">
        <TabsList className="mb-6">
          <TabsTrigger value="site">Site Geral</TabsTrigger>
          <TabsTrigger value="posts">Posts do Blog ({posts?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>SEO do Site</CardTitle>
                <CardDescription>Verificação geral das páginas principais</CardDescription>
              </div>
              <ScoreBadge score={siteScore} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {siteChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <StatusIcon status={check.status} />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{check.label}</span>
                      <p className="text-xs text-muted-foreground">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <div className="space-y-4">
            {postsLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : postAnalyses.length === 0 ? (
              <p className="text-muted-foreground">Nenhum post encontrado</p>
            ) : (
              postAnalyses.map(({ post, checks, score }) => (
                <Card key={post.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-base">{post.title}</CardTitle>
                      <CardDescription className="text-xs">
                        /blog/{post.slug}
                        {!post.is_published && (
                          <Badge variant="outline" className="ml-2 text-xs">Rascunho</Badge>
                        )}
                      </CardDescription>
                    </div>
                    <ScoreBadge score={score} />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <StatusIcon status={check.status} />
                          <span className="font-medium">{check.label}:</span>
                          <span className="text-muted-foreground text-xs">{check.detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEO;
