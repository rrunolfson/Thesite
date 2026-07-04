import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  markdownPath?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SEO({
  title,
  description,
  keywords = 'Last Mile, operational intelligence, operational workflows, automation, industrial operations, accountable action, enterprise workflow',
  ogImage = 'https://lastmileinc.ai/logo.png',
  ogType = 'website',
  canonicalPath = '',
  markdownPath,
  jsonLd,
}: SEOProps) {
  const baseUrl = 'https://lastmileinc.ai';
  const fullTitle = title.includes('Last Mile') ? title : `${title} | Last Mile Inc.`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const jsonLdEntries = Array.isArray(jsonLd)
    ? jsonLd
    : jsonLd
      ? [jsonLd]
      : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      {markdownPath ? <link rel="alternate" type="text/markdown" href={`${baseUrl}${markdownPath}`} /> : null}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Last Mile operational intelligence platform" />
      <meta property="og:site_name" content="Last Mile Inc." />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content="Last Mile operational intelligence platform" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Last Mile Inc." />
      {jsonLdEntries.map((entry, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
