const SITE_NAME = 'CoreLearnly';
const BASE_URL = 'https://corelearnly.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
  type?: string;
  keywords?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SEO = ({
  title,
  description,
  path = '',
  noIndex = false,
  image,
  type,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOProps) => {
  const fullTitle = path === '/' || path === ''
    ? title
    : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;
  const ogType = type || 'website';

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="title" content={fullTitle} />
      <link rel="canonical" href={canonicalUrl} />

      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Article-specific OG tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
};

export default SEO;
