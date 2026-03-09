import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useBlogPosts } from "@/hooks/useBlog";
import { Loader2, Clock, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!posts) return [];
    const cats = new Set<string>();
    posts.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!activeCategory) return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  if (isLoading) {
    return (
      <main className="pt-24">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24">
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionTitle title="Blog" subtitle="Novidades, receitas e dicas do mundo da confeitaria" />

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeCategory
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <div className="space-y-8">
              {/* Featured / first post — large card */}
              {filteredPosts.length > 0 && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    to={`/blog/${filteredPosts[0].slug}`}
                    className="group block overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="grid md:grid-cols-2">
                      {filteredPosts[0].cover_image && (
                        <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                          <img
                            src={filteredPosts[0].cover_image}
                            alt={filteredPosts[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6 md:p-10 flex flex-col justify-center">
                        {filteredPosts[0].category && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                            {filteredPosts[0].category}
                          </span>
                        )}
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                          {filteredPosts[0].title}
                        </h2>
                        {filteredPosts[0].excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                            {filteredPosts[0].excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" /> {filteredPosts[0].author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {filteredPosts[0].reading_time_min} min
                          </span>
                          {filteredPosts[0].published_at && (
                            <span>{format(new Date(filteredPosts[0].published_at), "dd MMM yyyy", { locale: ptBR })}</span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                          Ler mais <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )}

              {/* Remaining posts — grid */}
              {filteredPosts.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.slice(1).map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="group block h-full overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow"
                      >
                        {post.cover_image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                                {post.category}
                              </span>
                            )}
                            {post.published_at && (
                              <span className="text-xs text-muted-foreground">
                                · {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {post.reading_time_min} min
                            </span>
                            <span className="inline-flex items-center gap-1 text-accent font-medium group-hover:gap-2 transition-all">
                              Ler <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum post publicado ainda. Volte em breve!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
