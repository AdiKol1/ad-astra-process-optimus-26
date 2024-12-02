import React from 'react';
import { Helmet } from 'react-helmet-async';
import Services from '../components/Services';

interface ServicePageProps {
  title?: string;
}

const ServicesPage: React.FC<ServicePageProps> = ({ title = "Our Services" }) => {
  return (
    <>
      <Helmet>
        <title>{title} - Process Automation</title>
        <meta name="description" content="Explore our range of process automation services" />
      </Helmet>
      <Services />
    </>
  );
};

export default ServicesPage;