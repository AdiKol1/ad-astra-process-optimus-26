import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  meta?: Array<{ name: string; content: string }>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Ad Astra Process Optimus',
  description = 'Optimize your business processes with our intelligent assessment tool',
  canonical,
  meta = [],
}) => {
  const fullTitle = title === 'Ad Astra Process Optimus' ? title : `${title} | Ad Astra Process Optimus`;

  return (
    <Helmet
      title={fullTitle}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: fullTitle,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: fullTitle,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        ...meta,
      ]}
      link={
        canonical
          ? [
              {
                rel: 'canonical',
                href: canonical,
              },
            ]
          : []
      }
    />
  );
};

export default SEO;