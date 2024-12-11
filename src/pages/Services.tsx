import React from 'react';
import { Helmet } from 'react-helmet-async';
import Services from '../components/Services';
import MainLayout from '../components/layout/MainLayout';

const ServicesPage: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Our Services - Process Automation</title>
        <meta name="description" content="Explore our range of process automation services" />
      </Helmet>
      <Services />
    </MainLayout>
  );
};

export default ServicesPage;