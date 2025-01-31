import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ad Astra Process Optimus - Home</title>
        <meta name="description" content="Welcome to Ad Astra Process Optimus - Your Process Automation Partner" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Ad Astra</h1>
        <p className="text-lg mb-4">
          Transforming business processes through intelligent automation solutions.
        </p>
      </div>
    </>
  );
};

export default Home; 