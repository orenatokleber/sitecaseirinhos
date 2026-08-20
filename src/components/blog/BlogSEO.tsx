import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f4b9bd0c-67f3-4be7-b37a-cf26608a078c/id-preview-3c9411c2--ba1e3e9a-4806-45c6-a081-0a92c3e59f32.lovable.app-1771618737259.png";
const SITE_NAME = "Caseirinhos";
const SITE_URL = "https://caseirinhos.com";

interface BlogSEOProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  slug?: string;
}

const BlogSEO = ({ title, description, image, url, author, publishedAt, tags, slug }: BlogSEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const metaDescription = description || "Confira este artigo no blog Caseirinhos – confeitaria artesanal";
  const ogImage = image || DEFAULT_OG_IMAGE;
  const canonicalUrl = slug ? `${SITE_URL}/blog/${slug}` : url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: metaDescription,
    image: ogImage,
    url: canonicalUrl,
    datePublished: publishedAt || undefined,
    author: {
      "@type": "Person",
      name: author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
    keywords: tags?.join(", ") || undefined,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {author && <meta property="article:author" content={author} />}
      {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default BlogSEO;
