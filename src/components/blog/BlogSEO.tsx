import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
}

const BlogSEO = ({ title, description, image, url, author, publishedAt, tags }: BlogSEOProps) => {
  const siteName = "Caseirinhos";
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {author && <meta property="article:author" content={author} />}
      {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default BlogSEO;
