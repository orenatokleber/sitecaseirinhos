import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

interface InstagramFeedProps {
  profileUrl?: string;
  postUrls?: string[];
}

// Extrai o shortcode de uma URL do Instagram (post ou reel)
const extractShortcode = (url: string): string | null => {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

const extractHandle = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/([A-Za-z0-9_.]+)/);
  return match ? match[1].replace(/\/$/, "") : null;
};

const InstagramFeed = ({ profileUrl, postUrls = [] }: InstagramFeedProps) => {
  const handle = extractHandle(profileUrl || "");
  const validPosts = postUrls
    .map((u) => ({ url: u, code: extractShortcode(u) }))
    .filter((p) => p.code);

  if (!profileUrl && validPosts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12"
    >
      {/* Header elegante */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <Instagram className="w-5 h-5 text-accent" />
          <span className="font-script text-2xl text-primary">No Instagram</span>
        </div>
        <div className="w-12 h-0.5 bg-accent/40 mx-auto" />
        {handle && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            @{handle}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {validPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {validPosts.slice(0, 6).map((post, i) => (
            <motion.a
              key={post.code}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative block aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm hover:shadow-lg transition-all"
            >
              <iframe
                src={`https://www.instagram.com/p/${post.code}/embed/captioned/`}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                loading="lazy"
                scrolling="no"
                title={`Post Instagram ${post.code}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                <span className="text-background text-xs font-body uppercase tracking-wider flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" /> Ver no Instagram
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        // Fallback: card único com link para o perfil
        <div className="max-w-md mx-auto">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-8 rounded-2xl border border-border/60 bg-gradient-to-br from-accent/5 via-card to-primary/5 text-center hover:shadow-lg transition-all group"
          >
            <Instagram className="w-10 h-10 mx-auto text-accent mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-lg text-foreground">Siga-nos no Instagram</p>
            <p className="text-sm text-muted-foreground mt-1">
              Veja nossas criações e novidades diárias
            </p>
            {handle && (
              <span className="inline-block mt-3 text-accent font-body text-sm">@{handle}</span>
            )}
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default InstagramFeed;
