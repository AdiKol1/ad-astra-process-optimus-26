import React from 'react';
import { Helmet } from 'react-helmet-async';
import Services from '../components/Services';

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Process Automation</title>
        <meta name="description" content="Explore our range of process automation services" />
      </Helmet>
      <Services />
    </>
  );
};

export default ServicesPage;