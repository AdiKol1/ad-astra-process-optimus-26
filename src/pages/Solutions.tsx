import React from 'react';
import { Helmet } from 'react-helmet-async';
import Solutions from '@/components/Solutions';

const SolutionsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Process Automation Solutions - Ad Astra</title>
        <meta name="description" content="Explore our range of process automation solutions to increase productivity and revenue while reducing errors and bottlenecks." />
      </Helmet>
      <Solutions />
    </>
  );
};

export default SolutionsPage;
