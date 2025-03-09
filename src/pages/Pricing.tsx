import React from 'react';
import { Helmet } from 'react-helmet-async';
import Pricing from '@/components/Pricing';

const PricingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - Ad Astra</title>
        <meta name="description" content="Explore our flexible pricing plans for process automation and optimization solutions." />
      </Helmet>
      <Pricing />
    </>
  );
};

export default PricingPage;
