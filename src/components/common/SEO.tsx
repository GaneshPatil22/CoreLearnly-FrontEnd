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
}

const SEO = ({ title, description, path = '', noIndex = false, image, type }: SEOProps) => {
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

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

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
