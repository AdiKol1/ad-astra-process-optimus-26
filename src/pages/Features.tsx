import React from 'react';
import { Helmet } from 'react-helmet-async';
import Features from '@/components/Features';

const FeaturesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Product Features - Ad Astra</title>
        <meta name="description" content="Discover the powerful features of our process automation platform that help businesses optimize their workflows." />
      </Helmet>
      <Features />
    </>
  );
};

export default FeaturesPage;
