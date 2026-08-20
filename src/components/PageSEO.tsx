import { Helmet } from "react-helmet-async";

const SITE_URL = "https://caseirinhos.com";
const SITE_NAME = "Caseirinhos";

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const PageSEO = ({ title, description, path, image, type = "website", noindex }: PageSEOProps) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default PageSEO;
