import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteTitle = 'AmpuMe';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || "The all-in-one platform for life after limb loss. Find products, resources, providers, and support in one place.";
  const metaImage = image || 'https://ampume.com/og-image.png';
  const metaUrl = url || 'https://ampume.com/';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;



