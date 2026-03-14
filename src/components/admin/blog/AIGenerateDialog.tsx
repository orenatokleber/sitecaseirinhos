import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Wand2, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Block } from "@/components/admin/BlockEditor";

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (data: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    blocks: Block[];
    coverImageBase64?: string;
    seoTips?: string[];
  }) => void;
}

type Tone = "neutral" | "formal" | "casual";
type Length = "short" | "medium" | "long";

const TONE_OPTIONS: { value: Tone; label: string; desc: string }[] = [
  { value: "neutral", label: "Neutro", desc: "Informativo e acessível" },
  { value: "formal", label: "Formal", desc: "Profissional e técnico" },
  { value: "casual", label: "Casual", desc: "Descontraído e amigável" },
];

const LENGTH_OPTIONS: { value: Length; label: string; desc: string }[] = [
  { value: "short", label: "Curto", desc: "600-800 palavras" },
  { value: "medium", label: "Médio", desc: "1000-1500 palavras" },
  { value: "long", label: "Longo", desc: "1800-2500 palavras" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function AIGenerateDialog({ open, onOpenChange, onGenerated }: AIGenerateDialogProps) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<Tone>("neutral");
  const [length, setLength] = useState<Length>("medium");
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [seoTips, setSeoTips] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Digite o tema do post");
      return;
    }

    setIsGenerating(true);
    setProgress("Gerando conteúdo otimizado para SEO...");
    setSeoTips([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-post", {
        body: { topic, keywords, tone, language: "pt", length, generateImage },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setProgress(generateImage ? "Processando imagem gerada..." : "Finalizando...");

      // Transform blocks with IDs
      const blocks: Block[] = (data.blocks || []).map((b: any) => ({
        id: generateId(),
        type: b.type || "paragraph",
        content: b.content || "",
        calloutType: b.calloutType,
      }));

      if (data.seo_score_tips) {
        setSeoTips(data.seo_score_tips);
      }

      onGenerated({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        category: data.category || "",
        tags: data.tags || [],
        blocks,
        coverImageBase64: data.generated_image || undefined,
        seoTips: data.seo_score_tips,
      });

      toast.success("Post gerado com sucesso! Revise e ajuste antes de publicar.");
      onOpenChange(false);
    } catch (err: any) {
      console.error("AI generation error:", err);
      toast.error(err.message || "Erro ao gerar post com IA");
    } finally {
      setIsGenerating(false);
      setProgress("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Gerar Post com IA
          </DialogTitle>
          <DialogDescription>
            Crie um post completo e otimizado para SEO automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Topic */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Tema do post *</Label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Como fazer brigadeiro gourmet perfeito em casa"
              rows={2}
              className="resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <Label className="text-sm">Keywords SEO (opcional)</Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="brigadeiro gourmet, receita, chocolate"
              disabled={isGenerating}
            />
            <p className="text-[10px] text-muted-foreground">
              Separadas por vírgula. A IA incluirá naturalmente no conteúdo
            </p>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <Label className="text-sm">Tom de escrita</Label>
            <div className="flex gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  disabled={isGenerating}
                  className={`flex-1 text-center px-3 py-2 rounded-lg border text-xs transition-colors ${
                    tone === t.value
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  <span className="font-medium block">{t.label}</span>
                  <span className="text-[10px] opacity-70">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="space-y-1.5">
            <Label className="text-sm">Tamanho</Label>
            <div className="flex gap-2">
              {LENGTH_OPTIONS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLength(l.value)}
                  disabled={isGenerating}
                  className={`flex-1 text-center px-3 py-2 rounded-lg border text-xs transition-colors ${
                    length === l.value
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  <span className="font-medium block">{l.label}</span>
                  <span className="text-[10px] opacity-70">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image generation toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-accent" />
              <div>
                <p className="text-sm font-medium">Gerar imagem de destaque</p>
                <p className="text-[10px] text-muted-foreground">IA cria uma imagem para o post</p>
              </div>
            </div>
            <Switch checked={generateImage} onCheckedChange={setGenerateImage} disabled={isGenerating} />
          </div>
          {!generateImage && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Você poderá inserir a imagem manualmente no painel lateral
            </p>
          )}

          {/* SEO Tips from last generation */}
          {seoTips.length > 0 && (
            <div className="p-3 bg-accent/10 rounded-lg space-y-1">
              <p className="text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                Dicas de SEO do post gerado:
              </p>
              {seoTips.map((tip, i) => (
                <p key={i} className="text-[11px] text-muted-foreground pl-5">• {tip}</p>
              ))}
            </div>
          )}

          {/* Progress */}
          {isGenerating && (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancelar
            </Button>
            <Button className="flex-1 gap-2" onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {isGenerating ? "Gerando..." : "Gerar Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
