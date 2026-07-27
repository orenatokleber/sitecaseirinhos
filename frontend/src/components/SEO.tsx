import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://caseirinhos.com/assets/logo.png"; // Fallback logo URL
const SITE_NAME = "Caseirinhos";
const DEFAULT_DESC = "Confeitaria artesanal com amor em cada detalhe. Bolos decorados, doces gourmet, fatias irresistíveis e muito mais.";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "restaurant" | "bakery";
}

export default function SEO({ title, description, image, path = "", type = "website" }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const metaDescription = description || DEFAULT_DESC;
  const canonicalUrl = `https://caseirinhos.com${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "bakery" ? "Bakery" : "WebSite",
    "name": SITE_NAME,
    "url": "https://caseirinhos.com",
    "logo": DEFAULT_OG_IMAGE,
    "description": DEFAULT_DESC,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sua Cidade",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "sameAs": [
      "https://instagram.com/caseirinhos"
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type === "bakery" ? "restaurant.restaurant" : "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
