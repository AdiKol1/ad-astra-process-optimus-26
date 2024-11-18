import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Ad Astra Process Optimus',
  description = 'Optimize your business processes with AI-powered solutions',
  keywords = ['process optimization', 'AI', 'business efficiency'],
  ogImage = '/og-image.jpg',
  ogUrl = 'https://your-domain.com',
  twitterCard = 'summary_large_image',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;